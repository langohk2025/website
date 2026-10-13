const DEFAULT_TIMEOUT_MS = 25_000
export const DEFAULT_OPENROUTER_MODEL = 'x-ai/grok-4.20'

export function getOpenRouterModel(env: Env) {
  return env.OPENROUTER_MODEL?.trim() || DEFAULT_OPENROUTER_MODEL
}

export async function openRouterChat(
  env: Env,
  options: {
    prompt: string
    timeoutMs?: number
    tools?: unknown[]
    responseFormat?: 'json_object'
  }
): Promise<{ ok: true; text: string } | { ok: false; message: string }> {
  const apiKey = env.OPENROUTER_API_KEY?.trim()
  if (!apiKey) {
    return {
      ok: false,
      message:
        'OpenRouter is not configured. Add OPENROUTER_API_KEY in Cloudflare Pages environment variables.',
    }
  }

  const model = getOpenRouterModel(env)
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lango.ai',
        'X-Title': 'Lango Website',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: options.prompt }],
        ...(options.responseFormat
          ? { response_format: { type: options.responseFormat } }
          : {}),
        ...(options.tools ? { tools: options.tools } : {}),
      }),
    })

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
      return { ok: false, message }
    }

    const text = readOutputText(payload)
    if (!text.trim()) {
      return { ok: false, message: 'OpenRouter returned an empty response.' }
    }

    return { ok: true, text }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return { ok: false, message: `Request timed out after ${Math.round(timeoutMs / 1000)}s` }
    }
    const message = error instanceof Error ? error.message : 'OpenRouter request failed'
    return { ok: false, message }
  } finally {
    clearTimeout(timer)
  }
}

function readOutputText(payload: unknown) {
  const message = (payload as {
    choices?: Array<{
      message?: {
        content?: unknown
        reasoning?: unknown
        reasoning_content?: unknown
      }
    }>
  }).choices?.[0]?.message

  const candidates = [message?.content, message?.reasoning, message?.reasoning_content]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate
    if (Array.isArray(candidate)) {
      const parts = candidate
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
  }

  const direct = (payload as { output_text?: unknown }).output_text
  if (typeof direct === 'string' && direct.trim()) return direct

  return ''
}

export function parseJsonObject(text: string): Record<string, unknown> | null {
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
