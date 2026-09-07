import { CATEGORIES, clipFact, nextWeekdayUtc, endOfUtcDay } from './schema.js'

const WEEKDAYS = {
  domingo: 0, sunday: 0,
  lunes: 1, monday: 1,
  martes: 2, tuesday: 2,
  miercoles: 3, miércoles: 3, wednesday: 3,
  jueves: 4, thursday: 4,
  viernes: 5, friday: 5,
  sabado: 6, sábado: 6, saturday: 6
}

const OS = 'debian|ubuntu|fedora|arch(?: linux)?|nixos|linux mint|windows(?:\\s*1[01]|\\s*server)?|macos|mac os x?|ios|android'
const LANGS = 'python|typescript|javascript|rust|golang|\\bgo\\b|java|c\\+\\+|c#|php|ruby|kotlin|swift|scala|r\\b|sql|bash|html|css'
const FRAMEWORKS = 'react|vue|svelte|next\\.js|nuxt|django|flask|fastapi|express|laravel|spring|cloudflare workers|workers|docker|kubernetes|k8s'
const EDITORS = 'vscode|vs code|neovim|vim|intellij|webstorm|cursor'
const FIRST_PERSON = /\b(estoy|tengo|uso|utilizo|trabajo|estudio|vivo|soy|me llamo|mi nombre|prefiero|programo|escribo|corro|llevo|i(?:['’]m| am| use| have| work| live| study| prefer| code))\b/i

function draft({ fact, category, key, expiresAt = null, source = 'implicit', replacesKey = '', replacesText = '' }) {
  const text = clipFact(fact)
  if (text.length < 8) return null
  return { fact: text, text, category, key, expiresAt, source, replacesKey, replacesText }
}

function parseRelativeDay(raw, now) {
  const s = String(raw || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
  if (!s) return null
  if (s === 'hoy' || s === 'today') return endOfUtcDay(now)
  if (s === 'manana' || s === 'mañana' || s === 'tomorrow') {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() + 1)
    return endOfUtcDay(d.getTime())
  }
  if (s === 'pasado manana' || s === 'pasado mañana') {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() + 2)
    return endOfUtcDay(d.getTime())
  }
  if (WEEKDAYS[s] != null) return nextWeekdayUtc(now, WEEKDAYS[s])
  const inDays = s.match(/^en (\d{1,2}) dias?$/)
  if (inDays) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() + parseInt(inDays[1], 10))
    return endOfUtcDay(d.getTime())
  }
  return null
}

function extractSchedule(p, now) {
  const out = []
  const re = /\b(?:tengo|hay|me toca)\s+(?:un\s+|una\s+)?(examen|entrega|deadline|reunion|reunión|entrevista|cita|viaje)(?:\s+de\s+([\wáéíóúñ.+-]{2,40}))?\s+(?:el\s+|este\s+|this\s+)?(hoy|mañana|manana|pasado mañana|lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday|en \d{1,2} d[ií]as?)\b/ig
  let m
  while ((m = re.exec(p))) {
    const kind = m[1].toLowerCase()
    const subject = m[2] ? clipFact(m[2]) : ''
    const when = parseRelativeDay(m[3], now)
    const label = subject ? `${kind} de ${subject}` : kind
    const fact = when
      ? `Tiene ${label} el ${m[3].toLowerCase()}`
      : `Tiene ${label}`
    out.push(draft({
      fact,
      category: CATEGORIES.schedule,
      key: `schedule.${kind}`,
      expiresAt: when,
      source: 'implicit'
    }))
  }
  return out.filter(Boolean)
}

function extractStack(p) {
  const out = []
  const osRe = new RegExp(`\\b(?:estoy usando|uso|utilizo|corro|i(?:['’]m| am) using|i use)\\s+(${OS})(?:\\s+(\\d+(?:\\.\\d+)?))?\\b`, 'ig')
  let m
  while ((m = osRe.exec(p))) {
    const name = (m[1] + (m[2] ? ' ' + m[2] : '')).replace(/\s+/g, ' ').trim()
    out.push(draft({
      fact: `Usa ${name}`,
      category: CATEGORIES.stack,
      key: 'stack.os',
      source: 'implicit'
    }))
  }

  const langRe = new RegExp(`\\b(?:estoy (?:programando|codeando|usando)(?: en)?|programo en|escribo en|codeo en|usando|uso|i (?:use|code in|write in)|i['’]m (?:using|writing))\\s+(${LANGS})\\b`, 'ig')
  while ((m = langRe.exec(p))) {
    const lang = m[1].replace(/\\b/g, '').trim()
    out.push(draft({
      fact: `Programa en ${lang}`,
      category: CATEGORIES.stack,
      key: 'stack.lang',
      source: 'implicit'
    }))
  }

  const fwRe = new RegExp(`\\b(?:uso|trabajo con|estoy con|i use|i(?:['’]m| am) using)\\s+(${FRAMEWORKS})\\b`, 'ig')
  while ((m = fwRe.exec(p))) {
    const fw = m[1].trim()
    out.push(draft({
      fact: `Trabaja con ${fw}`,
      category: CATEGORIES.stack,
      key: 'stack.tool.' + fw.toLowerCase().replace(/[^a-z0-9]+/g, ''),
      source: 'implicit'
    }))
  }

  const edRe = new RegExp(`\\b(?:uso|en|i use)\\s+(${EDITORS})\\b`, 'ig')
  while ((m = edRe.exec(p))) {
    out.push(draft({
      fact: `Editor: ${m[1]}`,
      category: CATEGORIES.stack,
      key: 'stack.editor',
      source: 'implicit'
    }))
  }
  return out.filter(Boolean)
}

function extractIdentityWorkLocation(p) {
  const out = []
  const name = p.match(/\b(?:me llamo|mi nombre es|llámame|llamame|my name is|call me)\s+([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ'’.-]{1,40}(?:\s+[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ'’.-]{1,40}){0,2})/i)
  if (name) {
    out.push(draft({
      fact: `Se llama ${clipFact(name[1])}`,
      category: CATEGORIES.identity,
      key: 'identity.name',
      source: 'user'
    }))
  }

  const job = p.match(/\b(?:trabajo (?:en|como|de)|me dedico a|soy|i work (?:at|as|in)|i['’]m a)\s+(.{3,80}?)(?:[.!,\n]|$)/i)
  if (job && !/usando|programando/i.test(job[1])) {
    out.push(draft({
      fact: clipFact(job[0]),
      category: CATEGORIES.work,
      key: 'work.role',
      source: 'implicit'
    }))
  }

  const study = p.match(/\b(?:estudio|estoy estudiando|i study|i['’]m studying)\s+(.{3,80}?)(?:[.!,\n]|$)/i)
  if (study) {
    out.push(draft({
      fact: clipFact(study[0]),
      category: CATEGORIES.work,
      key: 'work.study',
      source: 'implicit'
    }))
  }

  const loc = p.match(/\b(?:vivo en|soy de|estoy en|i live in|i['’]m from|i['’]m in)\s+(.{3,60}?)(?:[.!,\n]|$)/i)
  if (loc) {
    out.push(draft({
      fact: clipFact(loc[0]),
      category: CATEGORIES.location,
      key: 'location.place',
      source: 'implicit'
    }))
  }

  const pref = p.match(/\b(?:prefiero|quiero que (?:me )?respondas|i prefer)\s+(.{4,140}?)(?:[.!,\n]|$)/i)
  if (pref) {
    out.push(draft({
      fact: clipFact(pref[0]),
      category: CATEGORIES.preference,
      key: 'preference.style',
      source: 'user'
    }))
  }
  return out.filter(Boolean)
}

function extractReplacements(p) {
  const out = []
  const re = /\b(?:ahora uso|pas[eé] a|cambi[eé] (?:a|de)|me pas[eé] a|i(?:['’]m| am) (?:now )?using|i switched to)\s+(\w[\w.+#-]{1,40})\s+(?:en vez de|en lugar de|instead of|ya no|and not)\s+(\w[\w.+#-]{1,40})/ig
  let m
  while ((m = re.exec(p))) {
    const neu = m[1]
    const old = m[2]
    out.push(draft({
      fact: `Usa ${neu} (antes ${old})`,
      category: CATEGORIES.stack,
      key: 'stack.lang',
      source: 'user',
      replacesText: old
    }))
  }
  const drop = /\b(?:ya no uso|no uso más|dej[eé] de usar|i (?:no longer|don't) use)\s+(\w[\w.+#-]{1,40})/ig
  while ((m = drop.exec(p))) {
    out.push({
      fact: '',
      text: '',
      category: CATEGORIES.stack,
      key: '',
      expiresAt: null,
      source: 'user',
      replacesKey: '',
      replacesText: m[1],
      dropOnly: true
    })
  }
  return out.filter((d) => d && (d.dropOnly || d.fact))
}

function extractExplicit(p) {
  const out = []
  const re = /(?:recuerda(?:me)? que|no olvides que|ten en cuenta que|from now on remember that)\s+(.{8,220}?)(?:[.!\n]|$)/ig
  let m
  while ((m = re.exec(p))) {
    out.push(draft({
      fact: clipFact(m[1]),
      category: CATEGORIES.other,
      key: 'other.explicit.' + clipFact(m[1]).toLowerCase().slice(0, 32),
      source: 'user'
    }))
  }
  return out.filter(Boolean)
}

export function looksFirstPerson(prompt) {
  return FIRST_PERSON.test(prompt || '')
}

export function looksLikeQuestionOnly(prompt) {
  const p = String(prompt || '').trim()
  if (!p) return true
  if (looksFirstPerson(p) && p.length > 24) return false
  return /^(qué|que|cómo|como|cuál|cual|dónde|donde|por qué|why|how|what|who|when|where)\b/i.test(p) || /\?$/.test(p)
}

/**
 * Zero-cost extractor. Returns structured drafts + forget ops.
 * @param {string} prompt
 * @param {number} [now]
 */
export function extractFactDrafts(prompt, now = Date.now()) {
  const p = String(prompt || '').trim()
  const result = { drafts: [], forget: [], forgetAll: false, name: '' }
  if (!p) return result

  if (/\b(olvida(te)? todo|borra (toda )?tu memoria|no me recuerdes nada|reset(?:ea)? (mi )?perfil)\b/i.test(p)) {
    result.forgetAll = true
    return result
  }

  const forgetM = p.match(/\b(?:olvida(?:te)?(?: que| lo de| esto)?|borra el recuerdo(?: de)?)\s+(.{4,160})/i)
  if (forgetM) result.forget.push(clipFact(forgetM[1]))

  const nameM = p.match(/\b(?:me llamo|mi nombre es|llámame|llamame|my name is|call me)\s+([A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ'’.-]{1,40}(?:\s+[A-ZÁÉÍÓÚÑ][\wÁÉÍÓÚÑáéíóúñ'’.-]{1,40}){0,2})/i)
  if (nameM) result.name = clipFact(nameM[1]).slice(0, 60)

  result.drafts.push(...extractExplicit(p))
  result.drafts.push(...extractReplacements(p))
  if (looksFirstPerson(p)) {
    result.drafts.push(...extractIdentityWorkLocation(p))
    result.drafts.push(...extractStack(p))
    result.drafts.push(...extractSchedule(p, now))
  }

  const seen = new Set()
  result.drafts = result.drafts.filter((d) => {
    if (!d) return false
    if (d.dropOnly) return true
    const k = (d.key + '|' + String(d.fact || '').toLowerCase())
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
  return result
}

/** Whether a background LLM pass is worth the Groq call. */
export function shouldLlmExtract(prompt, profile, learned) {
  const p = String(prompt || '').trim()
  if (p.length < 28 || p.length > 900) return false
  if (!looksFirstPerson(p)) return false
  if (looksLikeQuestionOnly(p) && p.length < 80) return false
  if (learned?.added?.length) return false
  const turns = profile?.turns || 0
  const last = profile?.lastExtractAt || 0
  if (turns - last < 3) return false
  return true
}

export { FIRST_PERSON }
