type ContactEmailPayload = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: string
  organization: string
  inquiryType: 'demo' | 'partnership'
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

  const html = `
    <h2>New contact inquiry</h2>
    <p><strong>Type:</strong> ${inquiryLabel}</p>
    <p><strong>Name:</strong> ${payload.firstName} ${payload.lastName}</p>
    <p><strong>Email:</strong> ${payload.email}</p>
    <p><strong>Phone:</strong> ${payload.phone || '—'}</p>
    <p><strong>Role:</strong> ${payload.role}</p>
    <p><strong>Organization:</strong> ${payload.organization}</p>
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
