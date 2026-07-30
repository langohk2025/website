import { isAuthorized, unauthorized } from '../../_shared/auth'
import { handleOptions, jsonResponse } from '../../_shared/cors'

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
  notes: string | null
  created_at: string
  updated_at: string
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
