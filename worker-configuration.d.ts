interface Env {
  DB: D1Database
  RESEND_API_KEY?: string
  ADMIN_PASSWORD?: string
  CONTACT_EMAIL_TO?: string
  CONTACT_EMAIL_FROM?: string
}

type PagesFunction<Bindings = unknown> = import('@cloudflare/workers-types').PagesFunction<Bindings>
