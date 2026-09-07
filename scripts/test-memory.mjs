import { extractFactDrafts } from '../src/memory/extract.js'
import { mergeFacts } from '../src/memory/resolve.js'
import { selectRelevantFacts } from '../src/memory/select.js'
import { applyTurn, emptyProfile, formatProfileBlock } from '../src/profile.js'

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

const friday = new Date('2026-09-09T12:00:00Z').getTime() // Wednesday
const debian = extractFactDrafts('estoy usando Debian 12 para el servidor', friday)
assert(debian.drafts.some((d) => d.key === 'stack.os' && /debian 12/i.test(d.fact)), 'implicit OS')

const exam = extractFactDrafts('tengo un examen el viernes', friday)
const ex = exam.drafts.find((d) => d.key === 'schedule.examen')
assert(ex && ex.expiresAt && ex.expiresAt > friday, 'exam expiry')

const swap = extractFactDrafts('ahora uso Python en vez de TypeScript', friday)
assert(swap.drafts.some((d) => d.replacesText && /python/i.test(d.fact)), 'replacement')

let p = emptyProfile()
p = applyTurn(p, { prompt: 'estoy usando TypeScript en el frontend', now: friday }).profile
p = applyTurn(p, { prompt: 'ahora uso Python en vez de TypeScript', now: friday + 1000 }).profile
assert(p.notes.some((n) => /python/i.test(n.fact || n.text)), 'python kept')
assert(!p.notes.some((n) => /typescript/i.test(n.fact || n.text) && !/python/i.test(n.fact || n.text)), 'ts dropped')

p = applyTurn(p, { prompt: 'tengo un examen el viernes', now: friday }).profile
const block = formatProfileBlock(p, '¿cómo preparo el examen de mates?')
assert(/examen/i.test(block), 'schedule selected for exam query')
const codeBlock = formatProfileBlock(p, 'falla el import en python')
assert(/python/i.test(codeBlock), 'lang selected for code query')
const factsInCode = (codeBlock.match(/^- /gm) || []).length
assert(factsInCode <= 5, 'cap 5 facts')

const stale = mergeFacts(emptyProfile(), [{
  fact: 'Examen ayer',
  category: 'schedule',
  key: 'schedule.examen',
  expiresAt: friday - 86400000,
  source: 'implicit'
}], friday)
assert(stale.profile.notes.length === 0, 'expired pruned on merge')

const ranked = selectRelevantFacts(p.notes, 'python typing error', { now: friday + 2000, limit: 5 })
assert(ranked.length >= 1 && ranked.length <= 5, 'rank size')

// Test adaptive personalization: Stack, Tone, Expertise, Timezone
let adaptiveProf = emptyProfile()
adaptiveProf = applyTurn(adaptiveProf, {
  prompt: 'Soy desarrollador senior, trabajo con React, TypeScript y Tailwind. Sé directo al grano.',
  timezone: 'Europe/Madrid',
  now: friday + 3000
}).profile

assert(adaptiveProf.timezone === 'Europe/Madrid', 'timezone saved')
assert(adaptiveProf.expertiseLevel === 'senior', 'expertise senior detected')
assert(adaptiveProf.tonePreference === 'direct', 'tone direct detected')
assert(adaptiveProf.preferredStack.includes('TypeScript'), 'TypeScript in preferredStack')
assert(adaptiveProf.preferredStack.includes('React'), 'React in preferredStack')
assert(adaptiveProf.preferredStack.includes('Tailwind'), 'Tailwind in preferredStack')

const adaptiveBlock = formatProfileBlock(adaptiveProf, 'cómo estructurar componentes')
assert(adaptiveBlock.includes('Senior / Avanzado'), 'block contains senior directive')
assert(adaptiveBlock.includes('Directo'), 'block contains direct directive')
assert(adaptiveBlock.includes('React'), 'block mentions user stack')

console.log('memory and adaptive tests ok', {
  notes: p.notes.map((n) => n.key + ':' + (n.fact || n.text)),
  adaptive: {
    stack: adaptiveProf.preferredStack,
    expertise: adaptiveProf.expertiseLevel,
    tone: adaptiveProf.tonePreference,
    timezone: adaptiveProf.timezone
  }
})
