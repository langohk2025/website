import { draftLeadReply } from './draft-lead-reply'
import type { LeadToVerify } from './verify-lead'
import { verifyDemoRequestLead } from './verify-lead'

export async function processDemoRequestLead(env: Env, lead: LeadToVerify) {
  await verifyDemoRequestLead(env, lead)

  const row = await env.DB.prepare(
    `SELECT verification_risk, verification_summary
     FROM demo_requests
     WHERE id = ?`
  )
    .bind(lead.id)
    .first<{ verification_risk: string | null; verification_summary: string | null }>()

  await draftLeadReply(env, lead, {
    risk:
      row?.verification_risk === 'likely_real' ||
      row?.verification_risk === 'uncertain' ||
      row?.verification_risk === 'suspicious'
        ? row.verification_risk
        : null,
    summary: row?.verification_summary ?? null,
  })
}
