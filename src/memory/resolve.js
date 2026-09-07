import { MAX_NOTES, clipFact, isExpired, normalizeFact } from './schema.js'

function similarText(a, b) {
  const x = clipFact(a).toLowerCase()
  const y = clipFact(b).toLowerCase()
  if (!x || !y) return false
  if (x === y) return true
  if (x.includes(y) || y.includes(x)) return true
  return false
}

export function pruneExpired(notes, now = Date.now()) {
  const kept = []
  const expired = []
  for (const n of notes || []) {
    const fact = normalizeFact(n, now)
    if (!fact) continue
    if (isExpired(fact, now)) expired.push(fact)
    else kept.push(fact)
  }
  return { kept, expired }
}

function dropByNeedle(notes, needle) {
  const q = clipFact(needle).toLowerCase()
  if (!q || q.length < 3) return { kept: notes, gone: [] }
  const kept = []
  const gone = []
  for (const n of notes) {
    const hay = `${n.fact || ''} ${n.text || ''} ${n.key || ''}`.toLowerCase()
    if (hay.includes(q) || q.includes(String(n.fact || n.text || '').toLowerCase().slice(0, 40))) gone.push(n)
    else kept.push(n)
  }
  return { kept, gone }
}

/**
 * Merge extracted drafts into the profile. Same `key` replaces the previous fact.
 * Temporal drafts set expiresAt. dropOnly / replacesText invalidate stale rows.
 */
export function mergeFacts(profile, drafts, now = Date.now()) {
  const added = []
  const forgotten = []
  const updated = []
  let notes = [...(profile.notes || [])].map((n) => normalizeFact(n, now)).filter(Boolean)
  const pruned = pruneExpired(notes, now)
  forgotten.push(...pruned.expired)
  notes = pruned.kept

  for (const raw of drafts || []) {
    if (!raw) continue
    if (raw.dropOnly && raw.replacesText) {
      const r = dropByNeedle(notes, raw.replacesText)
      notes = r.kept
      forgotten.push(...r.gone)
      continue
    }
    if (raw.replacesText) {
      const r = dropByNeedle(notes, raw.replacesText)
      notes = r.kept
      forgotten.push(...r.gone)
    }
    const incoming = normalizeFact({
      ...raw,
      text: raw.fact || raw.text,
      fact: raw.fact || raw.text,
      timestamp: now,
      at: now,
      source: raw.source || 'implicit'
    }, now)
    if (!incoming) continue
    if (isExpired(incoming, now)) {
      forgotten.push(incoming)
      continue
    }

    const idx = notes.findIndex((n) => n.key === incoming.key || similarText(n.fact, incoming.fact))
    if (idx >= 0) {
      const prev = notes[idx]
      if (similarText(prev.fact, incoming.fact) && prev.key === incoming.key && prev.expiresAt === incoming.expiresAt) continue
      forgotten.push(prev)
      notes[idx] = { ...incoming, id: prev.id }
      updated.push(notes[idx])
    } else {
      notes.push(incoming)
      added.push(incoming)
    }
  }

  notes.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
  profile.notes = notes.slice(-MAX_NOTES)
  return { profile, added, forgotten, updated }
}

export function forgetMatching(profile, query) {
  const r = dropByNeedle(profile.notes || [], query)
  profile.notes = r.kept
  return r.gone
}
