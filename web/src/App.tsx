import { useEffect, useMemo, useRef, useState } from 'react'
import { Paperclip, Send, Square, PanelLeft, Plus, Search, Copy, Trash2, Pencil, RefreshCw, ThumbsUp, ThumbsDown, Archive, Pin, Image, Link2, Eye } from 'lucide-react'
import { t } from './lib/i18n'
import { applyChrome, detectLang, loadPrefs, savePrefs, type Prefs, type SettingsTab } from './lib/prefs'
import {
  chatsFromExport,
  clearChats,
  loadActiveId,
  loadChats,
  mergeImported,
  persistChats,
  newChat,
  saveActiveId,
  titleFrom,
  type Chat,
  type ChatMessage,
} from './lib/store'
import { streamChat } from './lib/engine'
import { uid } from './lib/utils'
import { recommendChips } from './lib/suggest'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { ScrollArea } from './components/ui/scroll-area'
import { SettingsDialog } from './components/SettingsDialog'
import { AccountMenu } from './components/AccountMenu'
import { ArtifactList } from './components/ArtifactList'

export default function App() {
  const [prefs, setPrefs] = useState<Prefs>(() => loadPrefs())
  const [chats, setChats] = useState<Chat[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cacheBadge, setCacheBadge] = useState<'HIT' | 'MISS' | ''>('')
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState(false)
  const [toast, setToast] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQ, setPaletteQ] = useState('')
  const [showArtifacts, setShowArtifacts] = useState(false)
  const paletteRef = useRef<HTMLInputElement | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const scroller = useRef<HTMLDivElement | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)
  const composerRef = useRef<HTMLTextAreaElement | null>(null)
  const prefsRef = useRef(prefs)
  prefsRef.current = prefs

  const L = (k: string) => t(prefs.lang, k)
  const active = chats.find((c) => c.id === activeId) || chats[0]
  const col = prefs.wideLayout ? 'max-w-4xl' : 'max-w-3xl'

  useEffect(() => {
    applyChrome(prefs)
    savePrefs(prefs)
  }, [prefs])

  useEffect(() => {
    const w = window as unknown as { TA_GEO?: { lang?: string } }
    if (w.TA_GEO?.lang) return
    fetch('/api/geo')
      .then((r) => r.json())
      .then((g: { lang?: string }) => {
        w.TA_GEO = g
        try {
          if (localStorage.getItem('ta_lang')) return
        } catch {
          /* ignore */
        }
        const next = detectLang()
        setPrefs((p) => (p.lang === next ? p : { ...p, lang: next }))
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    void (async () => {
      const stored = await loadChats()
      if (stored.length) {
        setChats(stored)
        const last = loadActiveId()
        setActiveId(stored.some((c) => c.id === last) ? last : stored[0].id)
      } else {
        const c = newChat(t(prefsRef.current.lang, 'newChat'))
        setChats([c])
        setActiveId(c.id)
      }
    })()
  }, [])

  useEffect(() => {
    if (chats.length) void persistChats(chats)
  }, [chats])

  useEffect(() => {
    if (activeId) saveActiveId(activeId)
  }, [activeId])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  }, [active?.messages, busy])

  useEffect(() => {
    const base = L('app')
    const title = active?.title && active.messages.length ? `${active.title} | ${base}` : `${base} | Workspace de inteligencia empresarial`
    document.title = title
  }, [active?.title, active?.messages.length, prefs.lang])

  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(''), 1600)
    return () => window.clearTimeout(id)
  }, [toast])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey
      const el = e.target as HTMLElement | null
      const typing = !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
      if (mod && e.key === ',') {
        e.preventDefault()
        setSettingsOpen(true)
        return
      }
      if (mod && e.key.toLowerCase() === 'p') {
        e.preventDefault()
        setPaletteQ('')
        setPaletteOpen(true)
        window.setTimeout(() => paletteRef.current?.focus(), 0)
        return
      }
      if (mod && e.shiftKey && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        const c = newChat(t(prefsRef.current.lang, 'tempChat'), { ephemeral: true })
        setChats((prev) => [c, ...prev])
        setActiveId(c.id)
        setDraft('')
        return
      }
      if (mod && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPrefs((p) => ({ ...p, sidebarOpen: true }))
        window.setTimeout(() => searchRef.current?.focus(), 0)
        return
      }
      if (mod && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        setPrefs((p) => ({ ...p, sidebarOpen: !p.sidebarOpen }))
        return
      }
      if (mod && e.key.toLowerCase() === 'n' && !e.shiftKey && !typing) {
        e.preventDefault()
        const c = newChat(t(prefsRef.current.lang, 'newChat'))
        setChats((prev) => [c, ...prev])
        setActiveId(c.id)
        setDraft('')
        window.setTimeout(() => composerRef.current?.focus(), 0)
        return
      }
      if (e.key === 'Escape') {
        abortRef.current?.abort()
        setRenamingId(null)
        setEditingTitle(false)
        setPaletteOpen(false)
        return
      }
      if (!typing && e.key === '?') {
        e.preventDefault()
        setPrefs((p) => ({ ...p, settingsTab: 'general' }))
        setSettingsOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = chats.filter((c) => {
      if (!!c.archived !== showArchived) return false
      if (!q) return true
      return c.title.toLowerCase().includes(q) || c.messages.some((m) => m.content.toLowerCase().includes(q))
    })
    return [...list].sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || b.updatedAt - a.updatedAt)
  }, [chats, query, showArchived])

  const stats = useMemo(
    () => ({
      chats: chats.filter((c) => c.messages.length).length,
      messages: chats.reduce((n, c) => n + c.messages.length, 0),
    }),
    [chats],
  )

  function patchChat(id: string, fn: (c: Chat) => Chat) {
    setChats((prev) => prev.map((c) => (c.id === id ? fn(c) : c)))
  }

  function blank() {
    return newChat(L('newChat'))
  }

  function startChat() {
    const c = blank()
    setChats((prev) => [c, ...prev])
    setActiveId(c.id)
    setDraft('')
    setEditingTitle(false)
    window.setTimeout(() => composerRef.current?.focus(), 0)
  }

  function startTempChat() {
    const c = newChat(L('tempChat'), { ephemeral: true })
    setChats((prev) => [c, ...prev])
    setActiveId(c.id)
    setDraft('')
    setEditingTitle(false)
    window.setTimeout(() => composerRef.current?.focus(), 0)
  }

  function regenerateLast() {
    if (!active || busy) return
    const msgs = active.messages
    if (msgs.length < 2) return
    const last = msgs[msgs.length - 1]
    const user = last.role === 'assistant' ? msgs[msgs.length - 2] : last
    if (!user || user.role !== 'user') return
    const kept = last.role === 'assistant' ? msgs.slice(0, -2) : msgs.slice(0, -1)
    patchChat(active.id, (c) => ({ ...c, messages: kept, updatedAt: Date.now() }))
    void runSend(user.content, kept)
  }

  function editUserAt(index: number) {
    if (!active || busy) return
    const user = active.messages[index]
    if (!user || user.role !== 'user') return
    const kept = active.messages.slice(0, index)
    patchChat(active.id, (c) => ({ ...c, messages: kept, updatedAt: Date.now() }))
    setDraft(user.content)
    window.setTimeout(() => {
      const el = composerRef.current
      if (el) {
        el.focus()
        grow(el)
      }
    }, 0)
  }

  function setFeedback(id: string, value: 'up' | 'down') {
    if (!active) return
    patchChat(active.id, (c) => ({
      ...c,
      messages: c.messages.map((m) => (m.id === id ? { ...m, feedback: m.feedback === value ? '' : value } : m)),
    }))
  }

  function openSettings(tab?: SettingsTab) {
    if (tab) setPrefs((p) => ({ ...p, settingsTab: tab }))
    setSettingsOpen(true)
  }

  function grow(el: HTMLTextAreaElement) {
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  async function onSend() {
    const text = draft.trim()
    if (!text || !active) return
    setDraft('')
    if (composerRef.current) composerRef.current.style.height = '44px'
    await runSend(text, active.messages)
  }

  async function runSend(text: string, historyBase: ChatMessage[]) {
    if (!active || busy) return
    const userMsg: ChatMessage = { id: uid('m'), role: 'user', content: text, createdAt: Date.now() }
    const asst: ChatMessage = { id: uid('m'), role: 'assistant', content: '', createdAt: Date.now() }
    patchChat(active.id, (c) => ({
      ...c,
      title: historyBase.length ? c.title : titleFrom(text, c.ephemeral ? L('tempChat') : L('newChat')),
      updatedAt: Date.now(),
      messages: [...historyBase, userMsg, asst],
    }))
    setBusy(true)
    setCacheBadge('')
    const ctl = new AbortController()
    abortRef.current = ctl
    try {
      const history = [...historyBase, userMsg]
      const { cache } = await streamChat({
        message: text,
        history,
        prefs: prefsRef.current,
        signal: ctl.signal,
        onToken: (tok) => {
          patchChat(active.id, (c) => {
            const msgs = c.messages.map((m) => (m.id === asst.id ? { ...m, content: m.content + tok } : m))
            return { ...c, messages: msgs, updatedAt: Date.now() }
          })
        },
      })
      if (cache === 'HIT') setCacheBadge('HIT')
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        patchChat(active.id, (c) => ({
          ...c,
          messages: c.messages.map((m) => (m.id === asst.id && !m.content ? { ...m, content: 'No se pudo completar la inferencia.' } : m)),
        }))
      }
    } finally {
      setBusy(false)
      abortRef.current = null
    }
  }

  async function onAttach(file: File) {
    const raw = await file.text()
    const clip = raw.slice(0, 12000)
    setDraft((d) => `${d ? d + '\n\n' : ''}[${file.name}]\n${clip}`)
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), chats }, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'trujillo-ai-conversations.json'
    a.click()
  }

  async function importJson(file: File) {
    try {
      const incoming = chatsFromExport(JSON.parse(await file.text()))
      if (!incoming?.length) {
        setToast(L('importFail'))
        return
      }
      setChats((prev) => mergeImported(prev, incoming))
      setToast(L('importOk'))
    } catch {
      setToast(L('importFail'))
    }
  }

  async function wipe() {
    if (!confirm(L('clearLocal'))) return
    await clearChats()
    const c = blank()
    setChats([c])
    setActiveId(c.id)
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      setToast(L('copied'))
    } catch {
      setToast(L('copied'))
    }
  }

  function fmtTime(ts: number) {
    try {
      return new Date(ts).toLocaleTimeString(prefs.lang, { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  function commitTitle(id: string, value: string, fallback: string) {
    const title = value.trim() || fallback
    patchChat(id, (c) => ({ ...c, title, updatedAt: Date.now() }))
    setRenamingId(null)
    setEditingTitle(false)
  }

  return (
    <div className="flex h-full min-h-0 bg-[var(--bg)] text-[var(--text)] relative overflow-hidden">
      {/* Mobile Backdrop */}
      {prefs.sidebarOpen && (
        <div
          className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setPrefs((p) => ({ ...p, sidebarOpen: false }))}
        />
      )}

      <aside
        className={`absolute inset-y-0 left-0 z-50 flex h-full shrink-0 flex-col border-r border-[var(--border)] bg-[var(--bg-2)] transition-all duration-300 md:relative ${
          prefs.sidebarOpen 
            ? 'translate-x-0 w-[280px] shadow-2xl md:shadow-none md:w-[260px]' 
            : '-translate-x-full w-[280px] md:translate-x-0 md:w-0'
        }`}
        style={{ overflow: prefs.sidebarOpen ? 'visible' : 'hidden' }}
      >
        <div className="flex items-center gap-2 px-3 py-3">
          <img src="/mark.svg" alt="" className="h-7 w-7 rounded-lg" />
          <div className="text-sm font-semibold tracking-tight">{L('app')}</div>
          </div>
        )}
        <div className="px-3 pb-2">
          <Button className="w-full justify-start" onClick={startChat}>
            <Plus className="h-4 w-4" /> {L('newChat')}
          </Button>
          <Button variant="outline" className="mt-2 w-full justify-start" onClick={startTempChat}>
            {L('tempChat')}
          </Button>
        </div>
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[var(--dim)]" />
            <Input
              ref={searchRef}
              className="pl-8"
              placeholder={L('search')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1 px-2">
          <button
            type="button"
            className="mb-1 px-2 text-[11px] text-[var(--dim)] hover:text-[var(--text)]"
            onClick={() => setShowArchived((v) => !v)}
          >
            {showArchived ? L('unarchive') : `${L('archived')} (${chats.filter((c) => c.archived).length})`}
          </button>
          {filtered.length === 0 && <p className="px-2 py-6 text-xs text-[var(--dim)]">{L('noChats')}</p>}
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`group mb-0.5 flex items-center rounded-xl px-2 py-2 text-sm ${c.id === activeId ? 'bg-[var(--surface-2)]' : 'hover:bg-[var(--surface)]'}`}
            >
              {renamingId === c.id ? (
                <input
                  autoFocus
                  defaultValue={c.title}
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  onBlur={(e) => commitTitle(c.id, e.target.value, c.title)}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                    if (e.key === 'Escape') setRenamingId(null)
                  }}
                />
              ) : (
                <button
                  type="button"
                  className="min-w-0 flex-1 truncate text-left"
                  onClick={() => setActiveId(c.id)}
                  onDoubleClick={() => setRenamingId(c.id)}
                >
                  {(c.pinned ? '• ' : '') + c.title}
                </button>
              )}
              <button
                type="button"
                className="hidden pr-1 text-[var(--dim)] group-hover:block"
                title={c.pinned ? L('unpin') : L('pin')}
                onClick={() => patchChat(c.id, (x) => ({ ...x, pinned: !x.pinned }))}
              >
                <Pin className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="hidden pr-1 text-[var(--dim)] group-hover:block"
                title={c.archived ? L('unarchive') : L('archive')}
                onClick={() => patchChat(c.id, (x) => ({ ...x, archived: !x.archived }))}
              >
                <Archive className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="hidden pr-1 text-[var(--dim)] group-hover:block"
                title={L('rename')}
                onClick={() => setRenamingId(c.id)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                className="hidden text-[var(--dim)] group-hover:block"
                title={L('delete')}
                onClick={() => {
                  setChats((prev) => {
                    const next = prev.filter((x) => x.id !== c.id)
                    if (c.id === activeId) setActiveId(next[0]?.id || '')
                    return next.length ? next : [blank()]
                  })
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </ScrollArea>
        <div className="border-t border-[var(--border)] p-2">
          <AccountMenu
            variant="sidebar"
            L={L}
            prefs={prefs}
            onChange={setPrefs}
            onOpenSettings={openSettings}
            onExport={exportJson}
          />
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center justify-between gap-2 border-b border-[var(--border)] px-3">
          <Button
            variant="ghost"
            size="icon"
            title={prefs.sidebarOpen ? L('collapse') : L('expand')}
            onClick={() => setPrefs((p) => ({ ...p, sidebarOpen: !p.sidebarOpen }))}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          {editingTitle && active ? (
            <input
              autoFocus
              defaultValue={active.title}
              className="w-56 bg-transparent text-center text-sm font-medium outline-none"
              onBlur={(e) => commitTitle(active.id, e.target.value, active.title)}
              onKeyDown={(e) => {
                e.stopPropagation()
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                if (e.key === 'Escape') setEditingTitle(false)
              }}
            />
          ) : (
            <button
              type="button"
              className="max-w-[46%] truncate text-sm font-medium"
              title={L('rename')}
              onDoubleClick={() => setEditingTitle(true)}
            >
              {active?.title || L('app')}
            </button>
          )}
          <div className="flex items-center gap-2">
            {active?.ephemeral && (
              <span className="rounded-full border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-400">
                {L('tempOn')}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={() => setShowArtifacts(!showArtifacts)}>
              {showArtifacts ? 'Volver al Chat' : 'Ver página pública'}
            </Button>
            <AccountMenu
              variant="header"
              L={L}
              prefs={prefs}
              onChange={setPrefs}
              onOpenSettings={openSettings}
              onExport={exportJson}
            />
          </div>
        </header>

        {showArtifacts ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="mx-auto w-full max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Artifacts & Guías</h2>
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500">
                  <Plus className="mr-2 h-4 w-4" /> Nuevo artifact
                </Button>
              </div>
              <ArtifactList 
                items={[
                  { id: '1', title: 'Arquitectura de Correo Empresarial a Coste 0 €', type: 'GUIDES', handle: 'enterprise-email' },
                  { id: '2', title: 'Telemetría Host y Detección de Intrusión (Open-Sentinel)', type: 'GUIDES', handle: 'open-sentinel' },
                  { id: '3', title: 'Inferencia multimodal sub-100ms en Groq LPU y Cloudflare', type: 'GUIDES', handle: 'edge-ai' },
                  { id: '4', title: 'Documentación Técnica API v2', type: 'LIBRARY', handle: 'api-docs-v2' },
                ]} 
              />
            </div>
          </div>
        ) : (
          <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
          <div className={`mx-auto flex min-h-full w-full ${col} flex-col px-2 py-4 md:px-4 md:py-8`}>
            {!active?.messages.length ? (
              <div className="m-auto text-center">
                <img src="/mark.svg" alt="" className="mx-auto mb-4 h-12 w-12 rounded-2xl" />
                <h1 className="text-3xl font-semibold tracking-tight">{L('empty')}</h1>
                <p className="mt-2 text-sm text-[var(--muted)]">{L('emptyHint')}</p>
                <div className="mt-8 rounded-xl bg-[var(--surface-2)] p-4 text-left text-sm leading-relaxed border border-[var(--border)] max-w-xl mx-auto shadow-sm">
                  <h3 className="font-semibold mb-3 flex items-center gap-2 text-[var(--text)]">
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-color)]"></div>
                    🚀 ¿Sabías que Trujillo AI vive en tu Discord?
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-[var(--muted)]">
                    <li>Invócalo con <code className="text-[11px] font-mono font-bold px-1 py-0.5 rounded border border-[var(--border)] bg-black/10 dark:bg-white/10">@Trujillo AI</code> en cualquier canal.</li>
                    <li>Escríbele por <strong className="text-[var(--text)]">Mensaje Directo</strong> para asistencia privada 24/7.</li>
                    <li className="pt-2 text-[var(--text)] text-xs opacity-90 leading-relaxed">
                      <strong className="text-[var(--accent-color)] font-semibold">Lo que nos diferencia:</strong> Memoria persistente multicanal, velocidad ultra-rápida y respuestas avanzadas, funciones que la competencia no ofrece en sus bots básicos.
                    </li>
                  </ul>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {recommendChips(
                    chats,
                    [
                      { label: L('sug1'), prompt: L('sug1') },
                      { label: L('sug2'), prompt: L('sug2') },
                      { label: L('sug3'), prompt: L('sug3') },
                    ],
                    activeId,
                  ).map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => {
                        setDraft(s.prompt)
                        window.setTimeout(() => {
                          const el = composerRef.current
                          if (el) {
                            el.focus()
                            grow(el)
                          }
                        }, 0)
                      }}
                      className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--accent-color)] hover:text-[var(--text)]"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 pb-8">
                {active.messages.map((m, i) => (
                  <article key={m.id} className={m.role === 'user' ? 'ml-auto max-w-[92%] md:max-w-[78%]' : 'w-full'}>
                    {m.role === 'user' ? (
                      <div>
                        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap">
                          {m.content}
                        </div>
                        <div className="mt-1 flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => void copyText(m.content)}>
                            <Copy className="h-3.5 w-3.5" /> {L('copy')}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => editUserAt(i)} disabled={busy}>
                            <Pencil className="h-3.5 w-3.5" /> {L('edit')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[15px] leading-7 whitespace-pre-wrap">
                        {m.content || (busy ? '…' : '')}
                        {m.content && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            <Button variant="ghost" size="sm" onClick={() => void copyText(m.content)}>
                              <Copy className="h-3.5 w-3.5" /> {L('copy')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={regenerateLast} disabled={busy || i !== active.messages.length - 1}>
                              <RefreshCw className="h-3.5 w-3.5" /> {L('regenerate')}
                            </Button>
                            <Button variant="ghost" size="sm" className={m.feedback === 'up' ? 'text-[var(--accent-color)]' : ''} onClick={() => setFeedback(m.id, 'up')}>
                              <ThumbsUp className="h-3.5 w-3.5" /> {L('useful')}
                            </Button>
                            <Button variant="ghost" size="sm" className={m.feedback === 'down' ? 'text-[var(--accent-color)]' : ''} onClick={() => setFeedback(m.id, 'down')}>
                              <ThumbsDown className="h-3.5 w-3.5" /> {L('notUseful')}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    {prefs.showTimestamps && (
                      <div className={`mt-1 text-[10px] text-[var(--dim)] ${m.role === 'user' ? 'text-right' : ''}`}>
                        {fmtTime(m.createdAt)}
                      </div>
                    )}
                  </article>
                ))}
                {cacheBadge === 'HIT' && (
                  <div className="text-center text-[11px] font-semibold uppercase tracking-wide text-[var(--dim)]">{L('cacheHit')}</div>
                )}
              </div>
            )}
          </div>
        )}

        {!showArtifacts && (
          <div className="px-2 pb-2 md:px-4 md:pb-5">
          <div className={`mx-auto w-full ${col} rounded-xl md:rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg`}>
            <textarea
              ref={composerRef}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                grow(e.target)
              }}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing) return
                if (prefs.sendOnEnter || e.metaKey || e.ctrlKey) {
                  e.preventDefault()
                  void onSend()
                }
              }}
              rows={1}
              placeholder={L('ask')}
              className="max-h-40 min-h-11 w-full resize-none bg-transparent px-2 py-2 text-sm outline-none"
            />
            <div className="flex items-center justify-between gap-2 px-1 pb-1">
              <div className="flex items-center gap-1">
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept=".txt,.md,.json,.csv,.log,.js,.ts"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) void onAttach(f)
                    e.target.value = ''
                  }}
                />
                <Button variant="ghost" size="icon" title={L('attach')} onClick={() => fileRef.current?.click()}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--text)]" onClick={(e) => { e.preventDefault(); setToast('Buscando en la web...'); }}>
                  <Search className="mr-1.5 h-3 w-3" /> Buscar
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--text)]" onClick={(e) => { e.preventDefault(); setToast('Generación de imágenes pronto...'); }}>
                  <Image className="mr-1.5 h-3 w-3" /> Imagen
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] font-semibold text-[var(--muted)] hover:text-[var(--text)]" onClick={(e) => { e.preventDefault(); setToast('Conectores empresariales...'); }}>
                  <Link2 className="mr-1.5 h-3 w-3" /> Conectores
                </Button>
              </div>
              {busy ? (
                <Button size="icon" onClick={() => abortRef.current?.abort()} title={L('stop')}>
                  <Square className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button size="icon" onClick={() => void onSend()} disabled={!draft.trim()} title={L('send')}>
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <p className={`mx-auto mt-2 w-full ${col} text-center text-[11px] text-[var(--dim)]`}>
            {prefs.sendOnEnter ? `${L('enterHint')} · ${L('shiftEnterHint')}` : `${L('ctrlEnterHint')} · ${L('shiftEnterHint')}`}
          </p>
        </div>
      </main>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        prefs={prefs}
        onChange={setPrefs}
        onClear={() => void wipe()}
        onExport={exportJson}
        onImport={(file) => void importJson(file)}
        onLogout={() => {
          setPrefs((p) => ({
            ...p,
            name: '',
            email: '',
            inferenceKey: '',
            settingsTab: 'account',
          }))
          setSettingsOpen(false)
          setToast(t(prefs.lang, 'logoutOk'))
        }}
        stats={stats}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-[var(--invert)] px-3 py-1.5 text-xs font-semibold text-[var(--invert-fg)] shadow-lg">
          {toast}
        </div>
      )}

      {paletteOpen && (
        <div
          className="fixed inset-0 z-[90] flex justify-center bg-black/55 pt-[12vh]"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="ta-pop h-fit w-[min(520px,92vw)] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={paletteRef}
              value={paletteQ}
              onChange={(e) => setPaletteQ(e.target.value)}
              placeholder={L('palettePh')}
              className="w-full border-b border-[var(--border)] bg-transparent px-4 py-3 text-sm outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Escape') setPaletteOpen(false)
                if (e.key === 'Enter') {
                  const first = document.querySelector<HTMLButtonElement>('[data-cmd-item]')
                  first?.click()
                }
              }}
            />
            <div className="max-h-72 overflow-y-auto p-1">
              {[
                { id: 'new', label: L('newChat'), run: startChat },
                { id: 'temp', label: L('tempChat'), run: startTempChat },
                { id: 'settings', label: L('settings'), run: () => openSettings('general') },
                { id: 'export', label: L('exportJson'), run: exportJson },
                { id: 'copyMd', label: L('copyMd'), run: () => {
                  if (!active) return
                  const md = `# ${active.title}\n\n` + active.messages.map((m) => `## ${m.role === 'user' ? 'User' : 'Trujillo AI'}\n\n${m.content}\n`).join('\n')
                  void copyText(md)
                } },
              ]
                .filter((c) => !paletteQ.trim() || c.label.toLowerCase().includes(paletteQ.trim().toLowerCase()))
                .map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    data-cmd-item
                    className="flex w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[var(--surface-2)]"
                    onClick={() => {
                      setPaletteOpen(false)
                      c.run()
                    }}
                  >
                    {c.label}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
