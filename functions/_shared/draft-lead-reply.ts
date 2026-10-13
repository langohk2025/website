import { openRouterChat, parseJsonObject } from './openrouter'
import type { LeadRisk } from './verify-lead'
import type { LeadToVerify } from './verify-lead'

export type ReplyDraftStatus = 'pending' | 'drafting' | 'ready' | 'skipped' | 'error'

export type LeadReplyDraft = {
  status: ReplyDraftStatus
  emailSubject: string | null
  emailBody: string | null
  whatsappBody: string | null
}

const STALE_DRAFTING_MINUTES = 2

type VerificationContext = {
  risk: LeadRisk | null
  summary: string | null
}

async function askForDrafts(env: Env, lead: LeadToVerify, verification: VerificationContext) {
  const inquiryLabel = lead.inquiryType === 'partnership' ? 'partnership' : 'school demo'
  const riskNote =
    verification.risk === 'suspicious'
      ? 'Internal web check flagged this lead as suspicious. Draft a polite, cautious reply that asks for more verification before scheduling anything.'
      : verification.risk === 'uncertain'
        ? 'Internal web check could not fully verify this lead. Draft a warm reply that asks one clarifying question about their school or organisation.'
        : 'Internal web check suggests this lead is likely genuine. Draft a warm, confident reply.'

  const prompt = `You help the Lango sales team reply to inbound ${inquiryLabel} requests.

Lango is an AI-powered language learning platform for schools, classes, and families across Asia.

${riskNote}

Lead:
- Name: ${lead.firstName} ${lead.lastName}
- Role: ${lead.role}
- Organisation: ${lead.organization}
- Email: ${lead.email}
- Phone: ${lead.phone || '(not provided)'}
- Inquiry type: ${lead.inquiryType}
- Details from form: ${lead.details || '(none)'}
- Web check summary (internal only, do not quote verbatim): ${verification.summary || '(none)'}

Write customer-facing reply drafts in English. Be professional, warm, and specific to their organisation and request. Do not mention the internal web check or risk score.

Return JSON only:
{
  "email_subject": "short subject line",
  "email_body": "multi-paragraph email with greeting and sign-off from the Lango team",
  "whatsapp_body": "shorter WhatsApp message, still complete but more conversational"
}

Rules:
- Reference their organisation and what they asked for.
- For demo inquiries: offer to schedule a short walkthrough and ask for preferred times.
- For partnership inquiries: express interest and suggest a short call to explore fit.
- WhatsApp message should be under 900 characters.
- Sign off as "The Lango Team" or similar.
- Do not invent product features not implied by the context.`

  const response = await openRouterChat(env, {
    prompt,
    timeoutMs: 45_000,
    responseFormat: 'json_object',
  })
  if (!response.ok) {
    return {
      status: 'error' as const,
      emailSubject: null,
      emailBody: null,
      whatsappBody: null,
      summary: response.message,
    }
  }

  const parsed = parseJsonObject(response.text)
  if (!parsed) {
    return {
      status: 'error' as const,
      emailSubject: null,
      emailBody: null,
      whatsappBody: null,
      summary: 'Draft generation did not return usable JSON.',
    }
  }

  const emailSubject =
    typeof parsed.email_subject === 'string' ? parsed.email_subject.trim().slice(0, 200) : ''
  const emailBody =
    typeof parsed.email_body === 'string' ? parsed.email_body.trim().slice(0, 4000) : ''
  const whatsappBody =
    typeof parsed.whatsapp_body === 'string' ? parsed.whatsapp_body.trim().slice(0, 2000) : ''

  if (!emailSubject || !emailBody || !whatsappBody) {
    return {
      status: 'error' as const,
      emailSubject: emailSubject || null,
      emailBody: emailBody || null,
      whatsappBody: whatsappBody || null,
      summary: 'Draft generation returned incomplete content.',
    }
  }

  return {
    status: 'ready' as const,
    emailSubject,
    emailBody,
    whatsappBody,
    summary: null,
  }
}

async function saveDraft(env: Env, id: number, draft: LeadReplyDraft) {
  await env.DB.prepare(
    `UPDATE demo_requests
     SET reply_draft_status = ?,
         reply_email_subject = ?,
         reply_email_body = ?,
         reply_whatsapp_body = ?,
         reply_drafted_at = datetime('now'),
         updated_at = datetime('now')
     WHERE id = ?`
  )
    .bind(
      draft.status,
      draft.emailSubject,
      draft.emailBody,
      draft.whatsappBody,
      id
    )
    .run()
}

export async function draftLeadReply(
  env: Env,
  lead: LeadToVerify,
  verification: VerificationContext = { risk: null, summary: null }
): Promise<'locked' | 'done'> {
  try {
    const lock = await env.DB.prepare(
      `UPDATE demo_requests
       SET reply_draft_status = 'drafting', updated_at = datetime('now')
       WHERE id = ?
         AND (
           reply_draft_status IS NULL
           OR reply_draft_status IN ('pending', 'ready', 'skipped', 'error')
           OR (
             reply_draft_status = 'drafting'
             AND updated_at < datetime('now', '-${STALE_DRAFTING_MINUTES} minutes')
           )
         )`
    )
      .bind(lead.id)
      .run()

    if (!lock.meta.changes) return 'locked'

    if (!env.OPENROUTER_API_KEY?.trim()) {
      await saveDraft(env, lead.id, {
        status: 'skipped',
        emailSubject: null,
        emailBody: null,
        whatsappBody: null,
      })
      return 'done'
    }

    const result = await askForDrafts(env, lead, verification)
    if (result.status === 'error') {
      await saveDraft(env, lead.id, {
        status: 'error',
        emailSubject: result.emailSubject,
        emailBody: result.summary || result.emailBody,
        whatsappBody: result.whatsappBody,
      })
      return 'done'
    }

    await saveDraft(env, lead.id, {
      status: 'ready',
      emailSubject: result.emailSubject,
      emailBody: result.emailBody,
      whatsappBody: result.whatsappBody,
    })
    return 'done'
  } catch (error) {
    console.error('Lead reply draft failed:', error)
    let message = error instanceof Error ? error.message : 'Unknown draft error'
    if (/reply_draft_|no such column/i.test(message)) {
      message = 'Reply draft columns are missing. Run: npm run db:migrate:remote'
    }
    await saveDraft(env, lead.id, {
      status: 'error',
      emailSubject: null,
      emailBody: message.slice(0, 500),
      whatsappBody: null,
    })
    return 'done'
  }
}
