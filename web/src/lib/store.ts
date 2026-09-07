import { get, set, del } from 'idb-keyval'
import { uid } from './utils'

export type Role = 'user' | 'assistant'
export type ChatMessage = {
  id: string
  role: Role
  content: string
  createdAt: number
  feedback?: 'up' | 'down' | ''
}
export type Chat = {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  messages: ChatMessage[]
  pinned?: boolean
  archived?: boolean
  ephemeral?: boolean
}

const CHATS_KEY = 'ta_edge_chats_v1'
const ACTIVE_KEY = 'ta_edge_active_v1'

export async function loadChats(): Promise<Chat[]> {
  const data = await get(CHATS_KEY)
  return Array.isArray(data) ? data : []
}

export async function persistChats(chats: Chat[]) {
  await set(CHATS_KEY, chats.filter((c) => !c.ephemeral))
}

export async function clearChats() {
  await del(CHATS_KEY)
}

export function loadActiveId() {
  try {
    return localStorage.getItem(ACTIVE_KEY) || ''
  } catch {
    return ''
  }
}

export function saveActiveId(id: string) {
  try {
    localStorage.setItem(ACTIVE_KEY, id)
  } catch {
    /* ignore */
  }
}

export function newChat(title = 'Nueva conversación', extra: Partial<Chat> = {}): Chat {
  const now = Date.now()
  return { id: uid('chat'), title, createdAt: now, updatedAt: now, messages: [], ...extra }
}

export function titleFrom(text: string, fallback = 'Nueva conversación') {
  const t = text.replace(/\s+/g, ' ').trim()
  return t.slice(0, 42) || fallback
}

export function chatsFromExport(raw: unknown): Chat[] | null {
  const list = Array.isArray(raw)
    ? raw
    : raw && typeof raw === 'object' && Array.isArray((raw as { chats?: unknown }).chats)
      ? (raw as { chats: unknown[] }).chats
      : null
  if (!list) return null
  const out: Chat[] = []
  for (const item of list) {
    if (!item || typeof item !== 'object') continue
    const c = item as Partial<Chat>
    if (typeof c.id !== 'string' || typeof c.title !== 'string' || !Array.isArray(c.messages)) continue
    const messages: ChatMessage[] = []
    for (const m of c.messages) {
      if (!m || typeof m !== 'object') continue
      const msg = m as Partial<ChatMessage>
      if (msg.role !== 'user' && msg.role !== 'assistant') continue
      if (typeof msg.content !== 'string') continue
      messages.push({
        id: typeof msg.id === 'string' ? msg.id : uid('m'),
        role: msg.role,
        content: msg.content,
        createdAt: typeof msg.createdAt === 'number' ? msg.createdAt : Date.now(),
      })
    }
    out.push({
      id: c.id,
      title: c.title.slice(0, 120),
      createdAt: typeof c.createdAt === 'number' ? c.createdAt : Date.now(),
      updatedAt: typeof c.updatedAt === 'number' ? c.updatedAt : Date.now(),
      messages,
    })
  }
  return out
}

export function mergeImported(current: Chat[], incoming: Chat[]) {
  const ids = new Set(current.map((c) => c.id))
  const extra = incoming.filter((c) => !ids.has(c.id))
  return extra.length ? [...extra, ...current] : current
}
