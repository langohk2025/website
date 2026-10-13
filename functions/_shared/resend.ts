type ContactEmailPayload = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  organization: string
  inquiryType: 'demo' | 'partnership'
  details?: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendContactEmail(
  env: {
    RESEND_API_KEY?: string
    CONTACT_EMAIL_TO?: string
    CONTACT_EMAIL_FROM?: string
  },
  payload: ContactEmailPayload
): Promise<{ sent: true } | { sent: false; error: string }> {
  const apiKey = env.RESEND_API_KEY?.trim()
  if (!apiKey) {
    return { sent: false, error: 'RESEND_API_KEY is not configured' }
  }

  const to = env.CONTACT_EMAIL_TO?.trim() ?? 'info@lango.ai'
  const from = env.CONTACT_EMAIL_FROM?.trim() ?? 'Lango Website <noreply@lango.ai>'
  const inquiryLabel = payload.inquiryType === 'demo' ? 'School demo' : 'Partnership inquiry'

  const detailsHtml = payload.details
    ? `<p><strong>Details:</strong></p><p>${escapeHtml(payload.details).replace(/\n/g, '<br>')}</p>`
    : ''

  const html = `
    <h2>New contact inquiry</h2>
    <p><strong>Type:</strong> ${inquiryLabel}</p>
    <p><strong>Name:</strong> ${escapeHtml(payload.firstName)} ${escapeHtml(payload.lastName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
    <p><strong>Phone:</strong> ${payload.phone ? escapeHtml(payload.phone) : '—'}</p>
    <p><strong>Role:</strong> ${escapeHtml(payload.role)}</p>
    <p><strong>Organization:</strong> ${escapeHtml(payload.organization)}</p>
    ${detailsHtml}
  `

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `New ${inquiryLabel} — ${payload.organization}`,
      html,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    return { sent: false, error: `Resend API error (${response.status}): ${body}` }
  }

  return { sent: true }
}
