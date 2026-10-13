const ADMIN_TOKEN_KEY = 'lango-admin-token'

export function getAdminToken() {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken()
  if (!token) {
    throw new Error('Not authenticated')
  }

  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  })

  if (response.status === 401) {
    clearAdminToken()
    throw new Error('Unauthorized')
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string }
    throw new Error(payload.error ?? 'Request failed')
  }

  return response.json() as Promise<T>
}

export type LeadRisk = 'likely_real' | 'uncertain' | 'suspicious'
export type LeadVerificationStatus = 'pending' | 'checking' | 'ready' | 'skipped' | 'error'
export type ReplyDraftStatus = 'pending' | 'drafting' | 'ready' | 'skipped' | 'error'

export type LeadSource = { title: string; url: string }

export type DemoRequest = {
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
  verification_status?: LeadVerificationStatus
  verification_risk?: LeadRisk | null
  verification_summary?: string | null
  verification_findings?: string | null
  verification_sources?: string | null
  verification_checked_at?: string | null
  reply_draft_status?: ReplyDraftStatus
  reply_email_subject?: string | null
  reply_email_body?: string | null
  reply_whatsapp_body?: string | null
  reply_drafted_at?: string | null
}

export async function fetchDemoRequests(params?: {
  status?: string
  inquiryType?: string
}) {
  const search = new URLSearchParams()
  if (params?.status) search.set('status', params.status)
  if (params?.inquiryType) search.set('inquiryType', params.inquiryType)

  const query = search.toString()
  const path = query ? `/api/admin/demo-requests?${query}` : '/api/admin/demo-requests'

  const data = await adminFetch<{ items: DemoRequest[] }>(path)
  return data.items
}

export async function updateDemoRequest(input: {
  id: number
  status?: DemoRequest['status']
  notes?: string
}) {
  const data = await adminFetch<{ item: DemoRequest }>('/api/admin/demo-requests', {
    method: 'PATCH',
    body: JSON.stringify(input),
  })
  return data.item
}

export function isStaleLeadCheck(
  status: LeadVerificationStatus | undefined,
  updatedAt: string | undefined,
  staleMs = 2 * 60 * 1000
) {
  if (status !== 'checking' || !updatedAt) return false
  return Date.now() - new Date(updatedAt).getTime() > staleMs
}

export function isStaleReplyDraft(
  status: ReplyDraftStatus | undefined,
  updatedAt: string | undefined,
  staleMs = 2 * 60 * 1000
) {
  if (status !== 'drafting' || !updatedAt) return false
  return Date.now() - new Date(updatedAt).getTime() > staleMs
}

export async function verifyDemoRequest(id: number) {
  const data = await adminFetch<{ item: DemoRequest }>('/api/admin/demo-requests', {
    method: 'POST',
    body: JSON.stringify({ id, action: 'verify' }),
  })
  return data.item
}

export async function draftDemoRequestReply(id: number) {
  const data = await adminFetch<{ item: DemoRequest }>('/api/admin/demo-requests', {
    method: 'POST',
    body: JSON.stringify({ id, action: 'draft' }),
  })
  return data.item
}

export async function verifyAdminPassword(password: string) {
  const response = await fetch('/api/admin/demo-requests', {
    headers: {
      Authorization: `Bearer ${password}`,
    },
  })

  if (response.status === 401) {
    return false
  }

  if (!response.ok) {
    throw new Error('Unable to verify admin password')
  }

  setAdminToken(password)
  return true
}
