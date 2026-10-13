interface Env {
  DB: D1Database
  RESEND_API_KEY?: string
  ADMIN_PASSWORD?: string
  CONTACT_EMAIL_TO?: string
  CONTACT_EMAIL_FROM?: string
  OPENROUTER_API_KEY?: string
  OPENROUTER_MODEL?: string
}

type PagesFunction<Bindings = unknown> = import('@cloudflare/workers-types').PagesFunction<Bindings>
