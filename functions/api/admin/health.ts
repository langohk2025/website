import { handleOptions, jsonResponse } from '../../_shared/cors'

export const onRequestOptions: PagesFunction = async () => handleOptions()

export const onRequestGet: PagesFunction<Env> = async (context) => {
  return jsonResponse({
    adminPasswordConfigured: Boolean(context.env.ADMIN_PASSWORD),
    resendConfigured: Boolean(context.env.RESEND_API_KEY),
    contactEmailToConfigured: Boolean(context.env.CONTACT_EMAIL_TO),
    contactEmailFromConfigured: Boolean(context.env.CONTACT_EMAIL_FROM),
  })
}
