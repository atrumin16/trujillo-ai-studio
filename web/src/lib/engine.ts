import type { ChatMessage } from './store'
import type { Prefs } from './prefs'
import { REPLY_LANG } from './lang-catalog'

export async function streamChat(opts: {
  message: string
  history: ChatMessage[]
  prefs: Prefs
  signal?: AbortSignal
  onToken: (t: string) => void
}): Promise<{ cache: 'HIT' | 'MISS' | 'NONE' }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (opts.prefs.inferenceKey) headers['x-inference-key'] = opts.prefs.inferenceKey
  if (!opts.prefs.edgeCache) headers['x-edge-cache'] = 'off'

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers,
    signal: opts.signal,
    body: JSON.stringify({
      message: opts.message,
      messages: opts.history.map((m) => ({ role: m.role, content: m.content })),
      directives: [REPLY_LANG[opts.prefs.lang] || REPLY_LANG.en, opts.prefs.directives].filter(Boolean).join('\n\n'),
      temperature: opts.prefs.temperature,
      useCache: opts.prefs.edgeCache,
      model: 'trujillo-core',
      mode: opts.prefs.mode,
    }),
  })

  if (!res.ok || !res.body) {
    const err = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(err.error || `http_${res.status}`)
  }

  const cache = (res.headers.get('X-Cache') as 'HIT' | 'MISS') || 'NONE'
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buf = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    const parts = buf.split('\n')
    buf = parts.pop() || ''
    for (const line of parts) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const data = trimmed.slice(5).trim()
      if (data === '[DONE]') continue
      try {
        const parsed = JSON.parse(data) as { t?: string }
        if (parsed.t) opts.onToken(parsed.t)
      } catch {
        /* ignore */
      }
    }
  }
  return { cache }
}
