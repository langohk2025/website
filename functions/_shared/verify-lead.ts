import { getOpenRouterModel } from './openrouter'

export type LeadRisk = 'likely_real' | 'uncertain' | 'suspicious'
export type LeadVerificationStatus = 'pending' | 'checking' | 'ready' | 'skipped' | 'error'

export type LeadToVerify = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  role: string
  organization: string
  details?: string | null
  inquiryType: 'demo' | 'partnership'
}

type LeadSource = { title: string; url: string }

type LeadCheckResult = {
  status: LeadVerificationStatus
  risk: LeadRisk | null
  summary: string
  findings: string[]
  sources: LeadSource[]
}

const GENERIC_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.com.hk',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'icloud.com',
  'me.com',
  'qq.com',
  '163.com',
  '126.com',
  'proton.me',
  'protonmail.com',
])

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'mailinator.com',
  'guerrillamail.com',
  '10minutemail.com',
  'tempmail.com',
  'trashmail.com',
  'yopmail.com',
  'sharklasers.com',
])

function emailDomain(email: string) {
  return email.split('@')[1]?.trim().toLowerCase() ?? ''
}

function parseJsonObject(text: string): Record<string, unknown> | null {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = (fenced?.[1] ?? text).trim()
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end <= start) return null
  try {
    return JSON.parse(raw.slice(start, end + 1)) as Record<string, unknown>
  } catch {
    return null
  }
}

function asRisk(value: unknown): LeadRisk | null {
  if (value === 'likely_real' || value === 'uncertain' || value === 'suspicious') return value
  return null
}

function asStringArray(value: unknown, limit: number) {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)
    .slice(0, limit)
}

function asSources(value: unknown, extra: LeadSource[]) {
  const fromModel: LeadSource[] = []
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!item || typeof item !== 'object') continue
      const row = item as { title?: unknown; url?: unknown }
      const url = typeof row.url === 'string' ? row.url.trim() : ''
      if (!/^https?:\/\//i.test(url)) continue
      fromModel.push({
        title: typeof row.title === 'string' && row.title.trim() ? row.title.trim() : url,
        url,
      })
    }
  }
  const seen = new Set<string>()
  const merged: LeadSource[] = []
  for (const source of [...fromModel, ...extra]) {
    if (seen.has(source.url)) continue
    seen.add(source.url)
    merged.push(source)
    if (merged.length >= 8) break
  }
  return merged
}

function collectCitationSources(payload: unknown): LeadSource[] {
  const sources: LeadSource[] = []

  const push = (url: unknown, title: unknown) => {
    if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return
    sources.push({
      title: typeof title === 'string' && title.trim() ? title.trim() : url,
      url,
    })
  }

  const walkAnnotations = (annotations: unknown) => {
    if (!Array.isArray(annotations)) return
    for (const annotation of annotations) {
      if (!annotation || typeof annotation !== 'object') continue
      const row = annotation as {
        url?: unknown
        title?: unknown
        url_citation?: { url?: unknown; title?: unknown }
      }
      if (row.url_citation) {
        push(row.url_citation.url, row.url_citation.title)
        continue
      }
      push(row.url, row.title)
    }
  }

  const message = (payload as { choices?: Array<{ message?: { annotations?: unknown; content?: unknown } }> })
    .choices?.[0]?.message
  if (message) walkAnnotations(message.annotations)

  const output = (payload as { output?: unknown }).output
  if (Array.isArray(output)) {
    for (const item of output) {
      if (!item || typeof item !== 'object') continue
      const content = (item as { content?: unknown }).content
      if (!Array.isArray(content)) continue
      for (const block of content) {
        if (!block || typeof block !== 'object') continue
        walkAnnotations((block as { annotations?: unknown }).annotations)
      }
    }
  }

  return sources
}

function readOutputText(payload: unknown) {
  const message = (payload as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]?.message
  const chatContent = message?.content
  if (typeof chatContent === 'string' && chatContent.trim()) return chatContent
  if (Array.isArray(chatContent)) {
    const parts = chatContent
      .map((part) => {
        if (typeof part === 'string') return part
        if (part && typeof part === 'object' && typeof (part as { text?: unknown }).text === 'string') {
          return (part as { text: string }).text
        }
        return ''
      })
      .filter(Boolean)
    if (parts.length) return parts.join('\n')
  }

  const direct = (payload as { output_text?: unknown }).output_text
  if (typeof direct === 'string' && direct.trim()) return direct

  const chunks: string[] = []
  const output = (payload as { output?: unknown }).output
  if (Array.isArray(output)) {
    for (const item of output) {
      if (!item || typeof item !== 'object') continue
      const content = (item as { content?: unknown }).content
      if (!Array.isArray(content)) continue
      for (const block of content) {
        if (!block || typeof block !== 'object') continue
        const text = (block as { text?: unknown }).text
        if (typeof text === 'string') chunks.push(text)
      }
    }
  }
  return chunks.join('\n')
}

const CHECK_TIMEOUT_MS = 25_000
const STALE_CHECKING_MINUTES = 2

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Web check timed out after ${Math.round(timeoutMs / 1000)}s`)
    }
    throw error
  } finally {
    clearTimeout(timer)
  }
}

function localSignals(lead: LeadToVerify) {
  const domain = emailDomain(lead.email)
  const notes: string[] = []
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    notes.push(`Email domain ${domain} is a known disposable/temporary mailbox.`)
  }
  if (GENERIC_EMAIL_DOMAINS.has(domain)) {
    notes.push(`Email is a personal/generic provider (${domain}), not a school domain.`)
  }
  const orgTokens = lead.organization.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
  if (domain && !GENERIC_EMAIL_DOMAINS.has(domain) && !DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    const domainName = domain.split('.')[0] ?? ''
    if (domainName.length >= 4 && orgTokens.includes(domainName)) {
      notes.push(`Email domain appears related to the organisation name.`)
    }
  }
  return { domain, notes }
}

async function askOpenRouter(env: Env, lead: LeadToVerify): Promise<LeadCheckResult> {
  const apiKey = env.OPENROUTER_API_KEY?.trim()
  if (!apiKey) {
    return {
      status: 'skipped',
      risk: null,
      summary:
        'Web check is not configured. Add OPENROUTER_API_KEY in Cloudflare Pages environment variables.',
      findings: [],
      sources: [],
    }
  }

  const { domain, notes } = localSignals(lead)
  const model = getOpenRouterModel(env)
  const prompt = `You are screening an inbound school/partnership demo request for Lango, an education company.

Search the public web for this person and organisation. Check school websites, staff directories, LinkedIn, news, and the email domain. Do not invent sources.

Local signals:
${notes.length ? notes.map((note) => `- ${note}`).join('\n') : '- None'}

Lead:
- Name: ${lead.firstName} ${lead.lastName}
- Role: ${lead.role}
- Organisation: ${lead.organization}
- Email: ${lead.email}
- Email domain: ${domain || 'unknown'}
- Inquiry type: ${lead.inquiryType}
- Details: ${lead.details || '(none)'}

Return JSON only:
{
  "risk": "likely_real" | "uncertain" | "suspicious",
  "summary": "2-4 sentences for an internal sales team",
  "findings": ["short bullet", "..."],
  "sources": [{"title": "page title", "url": "https://..."}]
}

Rules:
- likely_real: organisation clearly exists and the person or role is plausibly associated, or the school/domain is a clear match.
- suspicious: disposable email, fake-looking school, mismatched identity, or classic scam patterns.
- uncertain: not enough public information. Prefer uncertain over a guess.
- Never claim criminal activity. This is a heuristic screen only.`

  const response = await fetchWithTimeout(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lango.ai',
        'X-Title': 'Lango Website',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        tools: [
          {
            type: 'openrouter:web_search',
            parameters: {
              engine: 'exa',
              mode: 'fast',
              max_results: 3,
            },
          },
        ],
      }),
    },
    CHECK_TIMEOUT_MS
  )

  const rawText = await response.text()
  let payload: unknown = {}
  try {
    payload = JSON.parse(rawText) as unknown
  } catch {
    payload = { error: rawText.slice(0, 500) }
  }

  if (!response.ok) {
    const message =
      (payload as { error?: { message?: string } }).error?.message ||
      `OpenRouter error (${response.status})`
    return {
      status: 'error',
      risk: null,
      summary: message,
      findings: [],
      sources: [],
    }
  }

  const parsed = parseJsonObject(readOutputText(payload))
  if (!parsed) {
    return {
      status: 'error',
      risk: null,
      summary: 'The web check ran but did not return usable JSON.',
      findings: [],
      sources: collectCitationSources(payload),
    }
  }

  const risk = asRisk(parsed.risk) ?? 'uncertain'
  const summary =
    typeof parsed.summary === 'string' && parsed.summary.trim()
      ? parsed.summary.trim().slice(0, 2000)
      : 'No summary returned.'

  return {
    status: 'ready',
    risk,
    summary,
    findings: asStringArray(parsed.findings, 8),
    sources: asSources(parsed.sources, collectCitationSources(payload)),
  }
}

async function saveResult(env: Env, id: number, result: LeadCheckResult) {
  await env.DB.prepare(
    `UPDATE demo_requests
     SET verification_status = ?,
         verification_risk = ?,
         verification_summary = ?,
         verification_findings = ?,
         verification_sources = ?,
         verification_checked_at = datetime('now'),
         updated_at = datetime('now')
     WHERE id = ?`
  )
    .bind(
      result.status,
      result.risk,
      result.summary,
      JSON.stringify(result.findings),
      JSON.stringify(result.sources),
      id
    )
    .run()
}

export async function verifyDemoRequestLead(env: Env, lead: LeadToVerify) {
  try {
    const lock = await env.DB.prepare(
      `UPDATE demo_requests
       SET verification_status = 'checking', updated_at = datetime('now')
       WHERE id = ?
         AND (
           verification_status IN ('pending', 'ready', 'skipped', 'error')
           OR (
             verification_status = 'checking'
             AND updated_at < datetime('now', '-${STALE_CHECKING_MINUTES} minutes')
           )
         )`
    )
      .bind(lead.id)
      .run()

    if (!lock.meta.changes) return

    const result = await askOpenRouter(env, lead)
    await saveResult(env, lead.id, result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown verification error'
    console.error('Lead verification failed:', error)
    await saveResult(env, lead.id, {
      status: 'error',
      risk: null,
      summary: message,
      findings: [],
      sources: [],
    })
  }
}
