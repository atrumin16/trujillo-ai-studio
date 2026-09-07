/** Fact tuples stored on the user profile (KV-compatible, backward compatible with {text,at,source}). */

export const MAX_NOTES = 24
export const NOTE_MAX = 240

export const CATEGORIES = Object.freeze({
  identity: 'identity',
  work: 'work',
  stack: 'stack',
  preference: 'preference',
  location: 'location',
  schedule: 'schedule',
  other: 'other'
})

export function clipFact(s) {
  return String(s || '')
    .replace(/\s+/g, ' ')
    .replace(/[“”«»]/g, '')
    .trim()
    .slice(0, NOTE_MAX)
}

export function newFactId() {
  return 'n_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10)
}

export function tokenize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9+#.]/g)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOP.has(t))
}

const STOP = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'de', 'del', 'al', 'en', 'con', 'por', 'para', 'que', 'se', 'es', 'y', 'o', 'a',
  'mi', 'me', 'mis', 'tu', 'te', 'su', 'lo', 'le', 'les', 'ya', 'si', 'no', 'como', 'mas', 'muy', 'esto', 'esta', 'este',
  'the', 'a', 'an', 'of', 'in', 'on', 'to', 'for', 'and', 'or', 'is', 'are', 'be', 'i', 'im', 'my', 'me', 'we', 'it', 'this',
  'that', 'with', 'from', 'at', 'as', 'do', 'does', 'have', 'has', 'using', 'use', 'uso', 'estoy', 'tengo', 'ahora'
])

export function endOfUtcDay(ts) {
  const d = new Date(ts)
  d.setUTCHours(23, 59, 59, 0)
  return d.getTime()
}

/** Next occurrence of weekday (0=Sun). If today is that weekday, returns today. */
export function nextWeekdayUtc(from, weekday) {
  const d = new Date(from)
  const diff = (weekday - d.getUTCDay() + 7) % 7
  d.setUTCDate(d.getUTCDate() + diff)
  return endOfUtcDay(d.getTime())
}

export function isExpired(fact, now = Date.now()) {
  const exp = fact?.expiresAt
  if (!exp) return false
  const n = typeof exp === 'number' ? exp : Date.parse(exp)
  return Number.isFinite(n) && n < now
}

export function normalizeFact(n, now = Date.now()) {
  const text = clipFact(n?.text || n?.fact || '')
  if (!text) return null
  const ts = parseInt(n.timestamp || n.at, 10) || now
  let expiresAt = n.expiresAt == null || n.expiresAt === '' ? null : n.expiresAt
  if (typeof expiresAt === 'string') {
    const p = Date.parse(expiresAt)
    expiresAt = Number.isFinite(p) ? p : null
  }
  const category = CATEGORIES[n.category] || inferCategoryFromKey(n.key) || CATEGORIES.other
  return {
    id: n.id || newFactId(),
    text,
    fact: clipFact(n.fact || text),
    key: String(n.key || '').trim().slice(0, 64) || ('other.' + text.toLowerCase().slice(0, 40)),
    category,
    timestamp: ts,
    at: ts,
    expiresAt,
    source: n.source === 'auto' || n.source === 'implicit' ? n.source : 'user'
  }
}

function inferCategoryFromKey(key) {
  const k = String(key || '')
  if (k.startsWith('identity')) return CATEGORIES.identity
  if (k.startsWith('work')) return CATEGORIES.work
  if (k.startsWith('stack')) return CATEGORIES.stack
  if (k.startsWith('preference')) return CATEGORIES.preference
  if (k.startsWith('location')) return CATEGORIES.location
  if (k.startsWith('schedule')) return CATEGORIES.schedule
  return ''
}
