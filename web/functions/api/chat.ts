/// <reference types="@cloudflare/workers-types" />

interface Env {
  TRUJILLO_CACHE: KVNamespace
  INFERENCE_API_KEY: string
  INFERENCE_BASE_URL: string
  INFERENCE_MODEL?: string
}

const SYSTEM_PREFIX = `You are Trujillo AI. You operate as a precise technical assistant for engineering, analysis and writing. Answer in complete sentences. Do not invent live market prices. Do not use emojis.`

const encoder = new TextEncoder()

function sseChunk(payload: string): Uint8Array {
  return encoder.encode(`data: ${payload}\n\n`)
}

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', encoder.encode(input))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function json(data: unknown, status = 200, extra: HeadersInit = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extra },
  })
}

function pruneMessages(messages: Array<{ role?: string; content?: string }>, current: { role: string; content: string }) {
  const cleaned = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: String(m.content).slice(0, 4000) }))
  const last = cleaned[cleaned.length - 1]
  const seq =
    last?.role === 'user' && last.content === current.content
      ? cleaned
      : [...cleaned, { role: current.role, content: current.content.slice(0, 8000) }]
  return seq.slice(-5)
}

export const onRequestOptions: PagesFunction<Env> = async () =>
  new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-inference-key, x-edge-cache',
    },
  })

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context

  let body: {
    message?: string
    messages?: Array<{ role?: string; content?: string }>
    model?: string
    directives?: string
    temperature?: number
    useCache?: boolean
    mode?: string
  }
  try {
    body = await request.json()
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }

  const lastUserMessage = String(body.message || '').trim()
  if (!lastUserMessage) return json({ error: 'empty_message' }, 400)

  const model = String(body.model || env.INFERENCE_MODEL || 'trujillo-core').slice(0, 80)
  const directives = typeof body.directives === 'string' ? body.directives.trim().slice(0, 2000) : ''
  const systemPrompt = directives ? `${SYSTEM_PREFIX}\n\n${directives}` : SYSTEM_PREFIX
  const temperature = typeof body.temperature === 'number' ? Math.min(1.4, Math.max(0, body.temperature)) : 0.4
  const cacheEnabled = request.headers.get('x-edge-cache') !== 'off' && body.useCache !== false
  const userKey = request.headers.get('x-inference-key')?.trim() || ''
  const apiKey = userKey || env.INFERENCE_API_KEY
  const base = (env.INFERENCE_BASE_URL || '').replace(/\/$/, '')

  if (!apiKey || !base) return json({ error: 'engine_unconfigured' }, 503)

  const hashHex = await sha256Hex(`${model}:${systemPrompt}:${lastUserMessage.toLowerCase()}`)
  const cacheKey = `inf:${hashHex}`

  if (cacheEnabled && env.TRUJILLO_CACHE) {
    const hit = await env.TRUJILLO_CACHE.get(cacheKey)
    if (hit) {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(sseChunk(JSON.stringify({ t: hit })))
          controller.enqueue(sseChunk('[DONE]'))
          controller.close()
        },
      })
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-store',
          'X-Cache': 'HIT',
        },
      })
    }
  }

  const history = Array.isArray(body.messages) ? body.messages : []
  const windowed = pruneMessages(history, { role: 'user', content: lastUserMessage })
  const payload = {
    model,
    temperature,
    stream: true,
    max_tokens: body.mode === 'concise' ? 400 : body.mode === 'deep' ? 1600 : 1024,
    messages: [{ role: 'system', content: systemPrompt }, ...windowed],
  }

  const upstream = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!upstream.ok || !upstream.body) {
    const errText = await upstream.text().catch(() => '')
    return json({ error: 'engine_unavailable', detail: errText.slice(0, 240) }, 502)
  }

  let full = ''
  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      const text = new TextDecoder().decode(chunk)
      const lines = text.split('\n')
      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') {
          controller.enqueue(sseChunk('[DONE]'))
          continue
        }
        try {
          const parsed = JSON.parse(data) as { choices?: Array<{ delta?: { content?: string } }> }
          const piece = parsed.choices?.[0]?.delta?.content || ''
          if (piece) {
            full += piece
            controller.enqueue(sseChunk(JSON.stringify({ t: piece })))
          }
        } catch {
          /* ignore malformed upstream frames */
        }
      }
    },
    flush() {
      if (cacheEnabled && env.TRUJILLO_CACHE && full.trim()) {
        context.waitUntil(
          env.TRUJILLO_CACHE.put(cacheKey, full, { expirationTtl: 86400 * 3 }),
        )
      }
    },
  })

  return new Response(upstream.body.pipeThrough(transform), {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Cache': 'MISS',
    },
  })
}
