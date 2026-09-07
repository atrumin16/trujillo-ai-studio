import type { Chat } from './store'

export type Chip = { label: string; prompt: string }

const STOP = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'y', 'o', 'que', 'para', 'con', 'por',
  'the', 'a', 'an', 'of', 'to', 'and', 'or', 'is', 'it', 'this', 'that', 'hola', 'hey', 'ok', 'si',
  'me', 'mi', 'tu', 'su', 'al', 'lo', 'se', 'es', 'you', 'we', 'i', 'my', 'your', 'how', 'what',
])

function tokens(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/https?:\/\/\S+/g, ' ')
    .split(/[^a-z0-9$]+/)
    .filter((w) => w.length > 2 && !STOP.has(w))
}

function firstUser(chat: Chat) {
  const m = chat.messages.find((x) => x.role === 'user' && x.content)
  return (m?.content || '').replace(/\s+/g, ' ').trim()
}

function genericTitle(title: string) {
  const s = title.trim().toLowerCase()
  if (!s || s.length < 3) return true
  return /^(conversaci[oó]n|nueva conversaci[oó]n|new chat|chat|untitled|sin t[ií]tulo|nova conversa)$/i.test(s)
}

export function recommendChips(chats: Chat[], generic: Chip[], skipId = ''): Chip[] {
  const recent = chats
    .filter((c) => c && !c.ephemeral && !c.archived && c.messages?.length && c.id !== skipId)
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, 5)
  if (!recent.length) return generic.slice(0, 4)
  const recs: Chip[] = []
  const seen: Record<string, 1> = {}
  for (const c of recent) {
    const first = firstUser(c)
    const title = (c.title || '').replace(/\s+/g, ' ').trim()
    const label = (!genericTitle(title) ? title : first).slice(0, 48)
    if (!label) continue
    const sig = tokens(label).slice(0, 4).join(' ')
    if (!sig || seen[sig]) continue
    seen[sig] = 1
    recs.push({ label, prompt: first && first.length <= 220 ? first : first || label })
  }
  for (const g of generic) {
    if (recs.length >= 4) break
    recs.push(g)
  }
  return recs.slice(0, 4)
}
