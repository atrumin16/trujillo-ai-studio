/** Prompts + parser for the optional background extractor (llama-3.1-8b-instant). */

export function enrichExtractMessages(prompt, locale = 'es') {
  const lang = locale || 'es'
  return [
    {
      role: 'system',
      content: `Extrae como máximo 3 hechos PERSONALES estables del usuario. JSON estricto, sin markdown.
Formato: {"facts":[{"fact":"string corto","category":"identity|work|stack|preference|location|schedule|other","key":"slot.unico","expiresAt":null|"ISO-8601"}]}
Reglas:
- Solo primera persona o datos que el usuario afirma sobre sí.
- No extraigas preguntas, código, ni hechos del mundo.
- Si hay caducidad (examen el viernes), pon expiresAt al final de ese día en ISO.
- key estable para contradicciones (stack.os, stack.lang, work.role, location.place, schedule.examen).
- Idioma de "fact": ${lang}.
- Si no hay hechos, {"facts":[]}.`
    },
    { role: 'user', content: String(prompt || '').slice(0, 800) }
  ]
}

export function parseEnrichJson(text) {
  const raw = String(text || '').trim()
  if (!raw) return { facts: [] }
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start < 0 || end <= start) return { facts: [] }
  try {
    const parsed = JSON.parse(raw.slice(start, end + 1))
    const facts = Array.isArray(parsed.facts) ? parsed.facts : []
    return {
      facts: facts.slice(0, 3).map((f) => ({
        fact: String(f.fact || f.text || '').trim(),
        category: String(f.category || 'other'),
        key: String(f.key || '').trim(),
        expiresAt: f.expiresAt || null,
        source: 'implicit'
      })).filter((f) => f.fact.length >= 8)
    }
  } catch {
    return { facts: [] }
  }
}
