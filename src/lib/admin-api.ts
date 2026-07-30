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
  notes: string | null
  created_at: string
  updated_at: string
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
