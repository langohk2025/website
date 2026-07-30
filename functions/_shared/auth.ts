export function unauthorized() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function isAuthorized(request: Request, adminPassword: string | undefined) {
  const configuredPassword = adminPassword?.trim()
  if (!configuredPassword) return false

  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return false

  return authHeader.slice(7).trim() === configuredPassword
}
