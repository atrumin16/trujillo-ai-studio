import { isExpired, tokenize } from './schema.js'

const CATEGORY_HINTS = {
  stack: ['codigo', 'code', 'linux', 'debian', 'python', 'typescript', 'javascript', 'rust', 'error', 'compile', 'npm', 'docker', 'worker', 'os', 'kernel', 'terminal'],
  work: ['trabajo', 'empresa', 'job', 'oficina', 'cliente', 'proyecto', 'exam', 'examen', 'estudio', 'universidad'],
  schedule: ['viernes', 'lunes', 'examen', 'entrega', 'deadline', 'cita', 'cuando', 'fecha', 'mañana', 'hoy'],
  preference: ['tono', 'corto', 'largo', 'estilo', 'responde', 'prefiero'],
  location: ['ciudad', 'pais', 'país', 'zona', 'horario', 'timezone'],
  identity: ['nombre', 'llamo', 'quien', 'quién']
}

function scoreFact(fact, queryTokens, query, now) {
  const blob = `${fact.fact || ''} ${fact.text || ''} ${fact.key || ''} ${fact.category || ''}`
  const tokens = tokenize(blob)
  if (!tokens.length) return 0
  let overlap = 0
  for (const t of queryTokens) {
    if (tokens.includes(t)) overlap += 1
    else if (blob.toLowerCase().includes(t)) overlap += 0.45
  }
  let score = queryTokens.length ? overlap / queryTokens.length : 0

  const hints = CATEGORY_HINTS[fact.category] || []
  for (const h of hints) {
    if (query.includes(h)) score += 0.35
  }

  if (fact.source === 'user') score += 0.12
  if (fact.category === 'identity') score += 0.08

  const ageDays = Math.max(0, (now - (fact.timestamp || now)) / 86400000)
  score += Math.max(0, 0.2 - ageDays * 0.01)

  if (fact.category === 'schedule' && fact.expiresAt && fact.expiresAt - now < 8 * 86400000) score += 0.55
  return score
}

function isSmallTalk(query) {
  return /^(hola|hey|buenas|buenos dias|qué tal|que tal|gracias|ok|vale|hi|hello|thanks)\b/i.test(query.trim()) && query.trim().length < 48
}

/**
 * Pick 3–5 facts relevant to `query`. Expired rows are dropped.
 * Upcoming schedule facts are biased in. Small-talk queries only keep identity/preference.
 */
export function selectRelevantFacts(notes, query, { limit = 5, now = Date.now() } = {}) {
  const live = (notes || []).filter((n) => n && !isExpired(n, now))
  if (!live.length) return []
  const q = String(query || '')
  const qTokens = tokenize(q)
  const cap = Math.min(5, Math.max(3, limit))

  if (isSmallTalk(q)) {
    return live
      .filter((n) => n.category === 'identity' || n.category === 'preference')
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 2)
  }

  const ranked = live
    .map((n) => ({ n, s: scoreFact(n, qTokens, q.toLowerCase(), now) }))
    .sort((a, b) => b.s - a.s)

  const picked = []
  const seen = new Set()
  for (const { n, s } of ranked) {
    if (picked.length >= cap) break
    if (s < 0.12 && picked.length >= 2) continue
    if (seen.has(n.key)) continue
    seen.add(n.key)
    picked.push(n)
  }

  if (!picked.length) {
    return live
      .filter((n) => n.category === 'identity' || n.source === 'user')
      .slice(-2)
  }
  return picked
}
