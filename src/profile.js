import { MAX_NOTES, clipFact, isExpired, normalizeFact } from './memory/schema.js'
import { extractFactDrafts, shouldLlmExtract } from './memory/extract.js'
import { forgetMatching, mergeFacts, pruneExpired } from './memory/resolve.js'
import { selectRelevantFacts } from './memory/select.js'
import { enrichExtractMessages, parseEnrichJson } from './memory/llm.js'

const PROFILE_TTL_ANON = 30 * 24 * 3600

export { shouldLlmExtract, enrichExtractMessages, parseEnrichJson, selectRelevantFacts }

export function emptyProfile() {
  return {
    enabled: true,
    name: '',
    notes: [],
    topics: {},
    preferredStack: [],
    expertiseLevel: '',
    tonePreference: '',
    timezone: '',
    locale: '',
    length: '',
    turns: 0,
    lastSynthAt: 0,
    lastExtractAt: 0,
    summary: '',
    updatedAt: Date.now()
  }
}

export function profileIdent(userIdentifier) {
  return String(userIdentifier || 'anon').toLowerCase().replace(/[^a-z0-9_.@-]/g, '_').slice(0, 80)
}

export function profileKey(ident) {
  return `u_profile_${profileIdent(ident)}`
}

function isEmailIdent(ident) {
  return String(ident || '').includes('@')
}

export async function loadProfile(env, ident) {
  const base = emptyProfile()
  if (!env?.BOT_MEMORY || !ident) return base
  try {
    const raw = await env.BOT_MEMORY.get(profileKey(ident))
    if (!raw) return base
    const parsed = JSON.parse(raw)
    return sanitizeProfile({ ...base, ...parsed })
  } catch {
    return base
  }
}

export async function saveProfile(env, ident, profile) {
  if (!env?.BOT_MEMORY || !ident) return
  const clean = sanitizeProfile(profile)
  const ttl = isEmailIdent(ident) ? undefined : PROFILE_TTL_ANON
  await env.BOT_MEMORY.put(profileKey(ident), JSON.stringify(clean), ttl ? { expirationTtl: ttl } : undefined)
}

export function sanitizeProfile(p) {
  const now = Date.now()
  const out = { ...emptyProfile(), ...(p || {}) }
  out.enabled = p?.enabled !== false
  out.name = String(out.name || '').trim().slice(0, 60)
  out.summary = String(out.summary || '').trim().slice(0, 500)
  out.locale = String(out.locale || '').slice(0, 8)
  out.length = ['corto', 'normal', 'extendido'].includes(out.length) ? out.length : ''
  out.timezone = String(out.timezone || '').trim().slice(0, 64)
  out.expertiseLevel = ['beginner', 'intermediate', 'senior', 'expert'].includes(out.expertiseLevel) ? out.expertiseLevel : ''
  out.tonePreference = ['direct', 'technical', 'detailed', 'conversational'].includes(out.tonePreference) ? out.tonePreference : ''
  out.preferredStack = Array.isArray(out.preferredStack)
    ? [...new Set(out.preferredStack.map((s) => String(s || '').trim()).filter((s) => s.length >= 2 && s.length <= 40))].slice(0, 15)
    : []
  out.turns = Math.max(0, parseInt(out.turns, 10) || 0)
  out.lastSynthAt = parseInt(out.lastSynthAt, 10) || 0
  out.lastExtractAt = parseInt(out.lastExtractAt, 10) || 0
  out.topics = out.topics && typeof out.topics === 'object' ? out.topics : {}
  const normalized = (Array.isArray(out.notes) ? out.notes : [])
    .map((n) => normalizeFact(n, now))
    .filter(Boolean)
  const { kept } = pruneExpired(normalized, now)
  out.notes = kept.slice(-MAX_NOTES)
  out.updatedAt = now
  return out
}

/** @deprecated use extractFactDrafts — kept for callers that still pass raw strings. */
export function extractFromPrompt(prompt) {
  const r = extractFactDrafts(prompt)
  return {
    name: r.name,
    notes: r.drafts.filter((d) => d && !d.dropOnly).map((d) => d.fact),
    forget: r.forget,
    forgetAll: r.forgetAll
  }
}

const STACK_CANDIDATES = [
  'TypeScript', 'JavaScript', 'Python', 'Rust', 'Go', 'Golang', 'C++', 'C#', 'Java', 'Kotlin', 'Swift', 'PHP', 'Ruby',
  'React', 'Next.js', 'Vue', 'Nuxt', 'Svelte', 'Tailwind', 'Node.js', 'Bun', 'Cloudflare Workers', 'Docker',
  'Kubernetes', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'ClickHouse', 'MongoDB', 'GraphQL', 'Linux'
]

export function detectStackInText(text) {
  if (!text) return []
  const found = []
  for (const s of STACK_CANDIDATES) {
    const escaped = s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`\\b${escaped}\\b`, 'i')
    if (re.test(text)) found.push(s === 'Golang' ? 'Go' : s)
  }
  return found
}

export function applyTurn(profile, { prompt, topic, locale, lengthMode, accountName, timezone, tonePreference, expertiseLevel, now = Date.now() }) {
  const next = sanitizeProfile(profile)
  next.turns = (next.turns || 0) + 1
  if (locale) next.locale = String(locale).slice(0, 8)
  if (lengthMode && ['corto', 'normal', 'extendido'].includes(lengthMode)) next.length = lengthMode
  if (accountName && !next.name) next.name = String(accountName).trim().slice(0, 60)
  if (timezone) next.timezone = String(timezone).trim().slice(0, 64)
  if (topic && topic !== 'general') {
    next.topics[topic] = (next.topics[topic] || 0) + 1
  }

  // Detección adaptativa de tono
  if (tonePreference && ['direct', 'technical', 'detailed', 'conversational'].includes(tonePreference)) {
    next.tonePreference = tonePreference
  } else if (/\b(?:sé directo|se directo|sin rodeos|al grano|respuestas cortas|conciso)\b/i.test(prompt)) {
    next.tonePreference = 'direct'
  } else if (/\b(?:técnico|tecnico|código primero|codigo primero|código tipado|riguroso)\b/i.test(prompt)) {
    next.tonePreference = 'technical'
  } else if (/\b(?:explícame a fondo|explicame a fondo|en detalle|paso a paso|exhaustivo|en profundidad)\b/i.test(prompt)) {
    next.tonePreference = 'detailed'
  }

  // Detección adaptativa de nivel técnico
  if (expertiseLevel && ['beginner', 'intermediate', 'senior', 'expert'].includes(expertiseLevel)) {
    next.expertiseLevel = expertiseLevel
  } else if (/\b(?:senior|tech lead|arquitecto de software|lead engineer|ingeniero principal|staff engineer)\b|\b(?:soy|trabajo como)\s+(?:dev|desarrollador|ingeniero|programador)?\s*senior\b|\bllevo años programando\b/i.test(prompt)) {
    next.expertiseLevel = 'senior'
  } else if (/\b(?:junior|novato|principiante|aprendiz)\b|\b(?:estoy aprendiendo|empezando a programar|apenas comienzo)\b/i.test(prompt)) {
    next.expertiseLevel = 'beginner'
  }

  // Detección adaptativa de stack
  const detectedStack = detectStackInText(prompt)
  if (detectedStack.length) {
    next.preferredStack = [...new Set([...(next.preferredStack || []), ...detectedStack])].slice(0, 15)
  }

  const extracted = extractFactDrafts(prompt, now)
  if (extracted.forgetAll) {
    const forgotten = [...(next.notes || [])]
    next.notes = []
    next.summary = ''
    next.topics = {}
    next.preferredStack = []
    next.updatedAt = now
    return { profile: sanitizeProfile(next), added: [], forgotten, updated: [], forgetAll: true }
  }

  const forgotten = []
  for (const q of extracted.forget) forgotten.push(...forgetMatching(next, q))
  if (extracted.name) next.name = extracted.name

  const merged = mergeFacts(next, extracted.drafts, now)
  forgotten.push(...merged.forgotten)
  merged.profile.updatedAt = now
  return {
    profile: sanitizeProfile(merged.profile),
    added: merged.added,
    forgotten,
    updated: merged.updated,
    forgetAll: false
  }
}

export function applyEnrichment(profile, parsed, now = Date.now()) {
  const facts = (parsed?.facts || []).map((f) => ({
    ...f,
    source: 'implicit',
    expiresAt: f.expiresAt ? (typeof f.expiresAt === 'number' ? f.expiresAt : Date.parse(f.expiresAt) || null) : null
  }))
  const merged = mergeFacts(sanitizeProfile(profile), facts, now)
  merged.profile.lastExtractAt = merged.profile.turns
  return {
    profile: sanitizeProfile(merged.profile),
    added: merged.added,
    forgotten: merged.forgotten,
    updated: merged.updated
  }
}

const TOPIC_LABEL = {
  finops: 'finanzas y mercados',
  security: 'seguridad',
  crypto_logic: 'criptografía',
  devops: 'devops e infraestructura',
  ai_agents: 'IA y agentes',
  databases: 'bases de datos',
  compliance: 'legal y cumplimiento',
  growth_tech: 'producto y growth',
  architecture: 'arquitectura y código',
  research: 'investigación'
}

/**
 * Compact system-prompt block. If `query` is set, only 3–5 relevant facts are injected.
 */
export function formatProfileBlock(profile, query = '') {
  const p = sanitizeProfile(profile)
  if (!p.enabled) return ''
  const now = Date.now()
  const live = (p.notes || []).filter((n) => !isExpired(n, now))
  const selected = query
    ? selectRelevantFacts(live, query, { limit: 5, now })
    : live.slice(-5)

  const topicList = Object.entries(p.topics || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([k]) => TOPIC_LABEL[k] || k)

  if (!p.name && !selected.length && !p.summary && !topicList.length && !p.expertiseLevel && !p.tonePreference && !p.preferredStack?.length) return ''

  const lines = ['=== PERFIL ADAPTATIVO DEL USUARIO (personalización avanzada continua) ===']
  lines.push('Adapta tu tono, nivel de abstracción y código a este usuario. No recites el perfil.')
  lines.push('Si un hecho no aplica a esta consulta, ignóralo.')
  if (p.name) lines.push(`- Trato o nombre: ${p.name}. Úsalo con naturalidad, no en cada frase.`)

  if (p.expertiseLevel === 'senior' || p.expertiseLevel === 'expert') {
    lines.push('- Nivel técnico: Senior / Avanzado. Asume sólida formación técnica. Ve directo a la arquitectura, mejores prácticas, trade-offs y código de producción sin explicaciones introductorias elementales.')
  } else if (p.expertiseLevel === 'beginner') {
    lines.push('- Nivel técnico: Principiante / Aprendiz. Sé pedagógico, paciente y explica conceptos con claridad paso a paso acompañados de ejemplos didácticos.')
  }

  if (p.tonePreference === 'direct' || p.length === 'corto') {
    lines.push('- Estilo preferido: Directo, pragmático y sintético, sin preámbulos vacíos.')
  } else if (p.tonePreference === 'technical') {
    lines.push('- Estilo preferido: Rigor técnico, contratos de tipos precisos y firmas de APIs.')
  } else if (p.tonePreference === 'detailed' || p.length === 'extendido') {
    lines.push('- Estilo preferido: Explicaciones profundas, estructuradas y con ejemplos exhaustivos.')
  }

  if (Array.isArray(p.preferredStack) && p.preferredStack.length > 0) {
    lines.push(`- Stack habitual: ${p.preferredStack.join(', ')}. Prioriza este ecosistema en ejemplos y recomendaciones de código.`)
  }

  if (p.timezone) {
    lines.push(`- Zona horaria habitual: ${p.timezone}.`)
  }

  if (topicList.length && !query) lines.push(`- Temas frecuentes: ${topicList.join(', ')}.`)
  if (p.summary && (!query || !selected.length)) lines.push(`- Resumen cognitivo: ${clipFact(p.summary).slice(0, 280)}`)
  if (selected.length) {
    lines.push('Hechos relevantes a este turno:')
    for (const n of selected) {
      const tag = n.category && n.category !== 'other' ? n.category : ''
      const exp = n.expiresAt ? ` (caduca ${new Date(n.expiresAt).toISOString().slice(0, 10)})` : ''
      lines.push(`- ${n.fact || n.text}${tag ? ` [${tag}]` : ''}${exp}`)
    }
  }
  return lines.join('\n')
}

export function publicProfile(profile) {
  const p = sanitizeProfile(profile)
  return {
    enabled: p.enabled,
    name: p.name,
    notes: p.notes,
    topics: p.topics,
    preferredStack: p.preferredStack,
    expertiseLevel: p.expertiseLevel,
    tonePreference: p.tonePreference,
    timezone: p.timezone,
    locale: p.locale,
    length: p.length,
    turns: p.turns,
    summary: p.summary,
    updatedAt: p.updatedAt
  }
}

export function shouldSynthesize(profile) {
  const p = profile || emptyProfile()
  if (!p.enabled) return false
  if (p.turns < 6) return false
  if ((p.notes || []).length < 1 && Object.keys(p.topics || {}).length < 2) return false
  return p.turns - (p.lastSynthAt || 0) >= 8
}

export function synthMessages(profile, locale) {
  const p = sanitizeProfile(profile)
  const lang = locale || p.locale || 'es'
  const facts = (p.notes || []).filter((n) => !isExpired(n)).map((n) => n.fact || n.text).join(' | ')
  const topics = Object.entries(p.topics || {}).sort((a, b) => b[1] - a[1]).map(([k]) => k).join(', ')
  return [
    {
      role: 'system',
      content: 'Resume el perfil de un usuario en 3 frases cortas. Sin viñetas, sin preámbulo, sin inventar. Idioma: ' + lang + '.'
    },
    {
      role: 'user',
      content: `Nombre: ${p.name || '—'}\nTemas: ${topics || '—'}\nHechos: ${facts || '—'}\nEstilo: ${p.length || 'normal'}`
    }
  ]
}
