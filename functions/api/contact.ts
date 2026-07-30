import { handleOptions, jsonResponse } from '../_shared/cors'
import { sendContactEmail } from '../_shared/resend'

type ContactBody = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  role?: string
  organization?: string
  inquiryType?: 'demo' | 'partnership'
  website?: string
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const onRequestOptions: PagesFunction = async () => handleOptions()

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as ContactBody

    if (body.website) {
      return jsonResponse({ ok: true })
    }

    const firstName = body.firstName?.trim()
    const lastName = body.lastName?.trim()
    const email = body.email?.trim()
    const role = body.role?.trim()
    const organization = body.organization?.trim()
    const phone = body.phone?.trim() || null
    const inquiryType = body.inquiryType

    if (!firstName || !lastName || !email || !role || !organization) {
      return jsonResponse({ error: 'Missing required fields' }, 400)
    }

    if (!isValidEmail(email)) {
      return jsonResponse({ error: 'Invalid email address' }, 400)
    }

    if (inquiryType !== 'demo' && inquiryType !== 'partnership') {
      return jsonResponse({ error: 'Invalid inquiry type' }, 400)
    }

    const result = await context.env.DB.prepare(
      `INSERT INTO demo_requests (
        first_name, last_name, email, phone, role, organization, inquiry_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING id, created_at`
    )
      .bind(firstName, lastName, email, phone, role, organization, inquiryType)
      .first<{ id: number; created_at: string }>()

    let emailSent = false
    let emailError: string | undefined

    try {
      const emailResult = await sendContactEmail(context.env, {
        firstName,
        lastName,
        email,
        phone: phone ?? undefined,
        role,
        organization,
        inquiryType,
      })
      emailSent = emailResult.sent
      if (!emailResult.sent) {
        emailError = emailResult.error
        console.error('Failed to send contact email:', emailResult.error)
      }
    } catch (emailError_) {
      emailError = emailError_ instanceof Error ? emailError_.message : 'Unknown email error'
      console.error('Failed to send contact email:', emailError_)
    }

    return jsonResponse({
      ok: true,
      id: result?.id,
      createdAt: result?.created_at,
      emailSent,
      emailError,
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return jsonResponse({ error: 'Failed to submit inquiry' }, 500)
  }
}
