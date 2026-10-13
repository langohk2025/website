import { isAuthorized, unauthorized } from '../../_shared/auth'
import { draftLeadReply } from '../../_shared/draft-lead-reply'
import { handleOptions, jsonResponse } from '../../_shared/cors'
import { verifyDemoRequestLead } from '../../_shared/verify-lead'

type DemoRequestRow = {
  id: number
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role: string
  organization: string
  inquiry_type: 'demo' | 'partnership'
  status: 'new' | 'contacted' | 'closed'
  details: string | null
  notes: string | null
  created_at: string
  updated_at: string
  verification_status?: 'pending' | 'checking' | 'ready' | 'skipped' | 'error'
  verification_risk?: 'likely_real' | 'uncertain' | 'suspicious' | null
  verification_summary?: string | null
  verification_findings?: string | null
  verification_sources?: string | null
  verification_checked_at?: string | null
  reply_draft_status?: 'pending' | 'drafting' | 'ready' | 'skipped' | 'error'
  reply_email_subject?: string | null
  reply_email_body?: string | null
  reply_whatsapp_body?: string | null
  reply_drafted_at?: string | null
}

function toLead(row: DemoRequestRow) {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    organization: row.organization,
    details: row.details,
    inquiryType: row.inquiry_type,
  }
}

export const onRequestOptions: PagesFunction = async () => handleOptions()

export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (!isAuthorized(context.request, context.env.ADMIN_PASSWORD)) {
    return unauthorized()
  }

  const url = new URL(context.request.url)
  const status = url.searchParams.get('status')
  const inquiryType = url.searchParams.get('inquiryType')

  let query = 'SELECT * FROM demo_requests WHERE 1=1'
  const bindings: string[] = []

  if (status) {
    query += ' AND status = ?'
    bindings.push(status)
  }

  if (inquiryType) {
    query += ' AND inquiry_type = ?'
    bindings.push(inquiryType)
  }

  query += ' ORDER BY created_at DESC LIMIT 200'

  const statement = context.env.DB.prepare(query)
  const result = await (bindings.length
    ? statement.bind(...bindings).all<DemoRequestRow>()
    : statement.all<DemoRequestRow>())

  return jsonResponse({ items: result.results ?? [] })
}

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  if (!isAuthorized(context.request, context.env.ADMIN_PASSWORD)) {
    return unauthorized()
  }

  const body = (await context.request.json()) as {
    id?: number
    status?: 'new' | 'contacted' | 'closed'
    notes?: string
  }

  if (!body.id) {
    return jsonResponse({ error: 'Missing request id' }, 400)
  }

  if (body.status && !['new', 'contacted', 'closed'].includes(body.status)) {
    return jsonResponse({ error: 'Invalid status' }, 400)
  }

  const existing = await context.env.DB.prepare('SELECT * FROM demo_requests WHERE id = ?')
    .bind(body.id)
    .first<DemoRequestRow>()

  if (!existing) {
    return jsonResponse({ error: 'Request not found' }, 404)
  }

  const nextStatus = body.status ?? existing.status
  const nextNotes = body.notes !== undefined ? body.notes : existing.notes

  await context.env.DB.prepare(
    `UPDATE demo_requests
     SET status = ?, notes = ?, updated_at = datetime('now')
     WHERE id = ?`
  )
    .bind(nextStatus, nextNotes, body.id)
    .run()

  const updated = await context.env.DB.prepare('SELECT * FROM demo_requests WHERE id = ?')
    .bind(body.id)
    .first<DemoRequestRow>()

  return jsonResponse({ item: updated })
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!isAuthorized(context.request, context.env.ADMIN_PASSWORD)) {
    return unauthorized()
  }

  const body = (await context.request.json()) as { id?: number; action?: string }

  if (!body.id || (body.action !== 'verify' && body.action !== 'draft')) {
    return jsonResponse({ error: 'Expected { id, action: "verify" | "draft" }' }, 400)
  }

  const existing = await context.env.DB.prepare('SELECT * FROM demo_requests WHERE id = ?')
    .bind(body.id)
    .first<DemoRequestRow>()

  if (!existing) {
    return jsonResponse({ error: 'Request not found' }, 404)
  }

  if (body.action === 'verify') {
    await verifyDemoRequestLead(context.env, toLead(existing))
    const checked = await context.env.DB.prepare(
      `SELECT verification_risk, verification_summary
       FROM demo_requests
       WHERE id = ?`
    )
      .bind(existing.id)
      .first<{ verification_risk: string | null; verification_summary: string | null }>()

    context.waitUntil(
      draftLeadReply(context.env, toLead(existing), {
        risk:
          checked?.verification_risk === 'likely_real' ||
          checked?.verification_risk === 'uncertain' ||
          checked?.verification_risk === 'suspicious'
            ? checked.verification_risk
            : null,
        summary: checked?.verification_summary ?? null,
      })
    )
  } else {
    const outcome = await draftLeadReply(context.env, toLead(existing), {
      risk: existing.verification_risk ?? null,
      summary: existing.verification_summary ?? null,
    })
    if (outcome === 'locked') {
      return jsonResponse({ error: 'Draft is already in progress. Refresh in a moment.' }, 409)
    }
  }

  const updated = await context.env.DB.prepare('SELECT * FROM demo_requests WHERE id = ?')
    .bind(body.id)
    .first<DemoRequestRow>()

  return jsonResponse({ item: updated })
}
