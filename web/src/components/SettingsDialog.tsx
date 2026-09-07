import { useRef, useState, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { Eye, EyeOff, X } from 'lucide-react'
import { t } from '@/lib/i18n'
import { LanguagePicker } from './LanguagePicker'
import {
  APPEARANCE_DEFAULTS,
  ENGINE_DEFAULTS,
  SETTINGS_NAV,
  SETTINGS_TABS,
  type FontId,
  type Prefs,
  type SettingsTab,
  type ThemeId,
  type ToneId,
} from '@/lib/prefs'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Switch } from './ui/switch'
import { Slider } from './ui/slider'
import { Textarea } from './ui/textarea'
import { UserAvatar } from './UserAvatar'

const ACCENTS = ['#38bdf8', '#a1a1aa', '#34d399', '#2dd4bf', '#818cf8', '#a78bfa', '#f59e0b', '#fb7185']

const THEME_PREVIEW: Record<ThemeId, { bg: string; bar: string; side: string; border: string; text: string }> = {
  light: { bg: '#ffffff', bar: '#f8fafc', side: '#f1f5f9', border: '#e5e7eb', text: '#111827' },
  paper: { bg: '#f4efe6', bar: '#fffaf1', side: '#ebe4d6', border: '#e7dcc8', text: '#1c1917' },
  gray: { bg: '#18181b', bar: '#27272a', side: '#1f1f23', border: '#3f3f46', text: '#f4f4f5' },
  dimmed: { bg: '#0d1117', bar: '#161b22', side: '#010409', border: '#30363d', text: '#e6edf3' },
  navy: { bg: '#0b1220', bar: '#152036', side: '#0e1729', border: '#243552', text: '#e8eef8' },
  midnight: { bg: '#000000', bar: '#09090b', side: '#050505', border: '#27272a', text: '#fafafa' },
}

export function SettingsDialog({
  open,
  onOpenChange,
  prefs,
  onChange,
  onClear,
  onExport,
  onImport,
  onLogout,
  stats,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  prefs: Prefs
  onChange: (p: Prefs) => void
  onClear: () => void
  onExport: () => void
  onImport: (file: File) => void
  onLogout: () => void
  stats: { chats: number; messages: number }
}) {
  const L = (k: string) => t(prefs.lang, k)
  const set = (patch: Partial<Prefs>) => onChange({ ...prefs, ...patch })
  const [showKey, setShowKey] = useState(false)
  const importRef = useRef<HTMLInputElement>(null)
  const tab = SETTINGS_TABS.includes(prefs.settingsTab) ? prefs.settingsTab : 'general'
  const signed = Boolean(prefs.name.trim() || prefs.email.trim())

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex h-[min(720px,92vh)] w-[min(920px,96vw)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl outline-none">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3">
            <div>
              <Dialog.Title className="text-sm font-semibold">{L('settings')}</Dialog.Title>
              <Dialog.Description className="text-[11px] text-[var(--dim)]">{L('version')}</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label={L('close')} className="h-8 w-8 text-[var(--muted)]">
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>
          <Tabs.Root
            value={tab}
            onValueChange={(v) => set({ settingsTab: v as SettingsTab })}
            className="grid min-h-0 flex-1 grid-cols-[220px_1fr]"
          >
            <Tabs.List className="flex flex-col gap-0.5 overflow-y-auto border-r border-[var(--border)] p-3">
              {SETTINGS_NAV.map((group) => (
                <div key={group.group} className="mb-2">
                  <div className="px-3 pb-1 pt-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--dim)]">
                    {L(group.group)}
                  </div>
                  {group.tabs.map((k) => (
                    <Tabs.Trigger
                      key={k}
                      value={k}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-[var(--muted)] data-[state=active]:bg-[var(--surface-2)] data-[state=active]:text-[var(--text)]"
                    >
                      {L(k)}
                    </Tabs.Trigger>
                  ))}
                </div>
              ))}
            </Tabs.List>
            <div className="min-h-0 overflow-y-auto p-6">
              <Tabs.Content value="general" className="space-y-5">
                <Head title={L('general')} desc={L('generalHint')} />
                <Card>
                  <Row label={L('language')} hint={L('languageHint')}>
                    <LanguagePicker value={prefs.lang} lang={prefs.lang} onChange={(id) => set({ lang: id })} />
                  </Row>
                  <Row label={L('defaultMode')}>
                    <div className="flex flex-wrap justify-end gap-2">
                      {(['concise', 'balanced', 'deep'] as const).map((m) => (
                        <Button key={m} variant={prefs.mode === m ? 'default' : 'outline'} size="sm" onClick={() => set({ mode: m })}>
                          {L(m === 'concise' ? 'modeConcise' : m === 'deep' ? 'modeDeep' : 'modeBalanced')}
                        </Button>
                      ))}
                    </div>
                  </Row>
                </Card>
                <p className="text-xs text-[var(--dim)]">{L('version')}</p>
              </Tabs.Content>

              <Tabs.Content value="account" className="space-y-5">
                <Head title={L('account')} desc={L('accountDesc')} />
                <div className="flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                  <UserAvatar name={prefs.name} size="lg" />
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold">{prefs.name.trim() || L('guest')}</div>
                    <div className="truncate text-xs text-[var(--dim)]">{prefs.email.trim() || L('profileLocal')}</div>
                  </div>
                  <span className="ml-auto rounded-md border border-[var(--border)] px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-amber-400">
                    {signed ? L('localPlan') : L('localBadge')}
                  </span>
                </div>
                <Card>
                  <Row label={L('name')} hint={L('nameHint')}>
                    <Input
                      value={prefs.name}
                      onChange={(e) => set({ name: e.target.value.slice(0, 80) })}
                      placeholder={L('guest')}
                      maxLength={80}
                    />
                  </Row>
                  <Row label={L('emailLabel')}>
                    <Input
                      type="email"
                      value={prefs.email}
                      onChange={(e) => set({ email: e.target.value.slice(0, 120) })}
                      placeholder={L('emailPh')}
                    />
                  </Row>
                  <Row label={L('plan')}>
                    <span className="rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[11px] font-extrabold tracking-wide text-amber-400">
                      {L('localPlan')}
                    </span>
                  </Row>
                </Card>

                <Block title={L('emailPrefs')} hint={L('emailsHint')} />
                <Card>
                  <Toggle label={L('notifyProduct')} checked={prefs.notifyProduct} onChange={(v) => set({ notifyProduct: v })} />
                  <Toggle label={L('notifySecurity')} checked={prefs.notifySecurity} onChange={(v) => set({ notifySecurity: v })} />
                  <Toggle label={L('notifyDigest')} checked={prefs.notifyDigest} onChange={(v) => set({ notifyDigest: v })} />
                  <div className="flex justify-end px-3 py-3">
                    <Button variant="outline" size="sm" onClick={() => alert(L('testEmailLocal'))}>
                      {L('testEmail')}
                    </Button>
                  </div>
                </Card>

                <Block title={L('passwordSection')} />
                <Card>
                  <div className="px-4 py-3 text-sm text-[var(--muted)]">{L('passwordLocal')}</div>
                </Card>

                <Block title={L('sessionTitle')} />
                <Card>
                  <div className="flex items-center justify-between gap-4 px-4 py-3">
                    <div>
                      <div className="text-sm font-semibold">{L('logout')}</div>
                      <p className="text-xs text-[var(--dim)]">{L('sessionHint')}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-400/40 text-red-400 hover:bg-red-500/10"
                      onClick={() => {
                        if (!confirm(L('logoutConfirm'))) return
                        onLogout()
                      }}
                    >
                      {L('logout')}
                    </Button>
                  </div>
                </Card>
              </Tabs.Content>

              <Tabs.Content value="appearance" className="space-y-5">
                <Head title={L('appearance')} desc={L('densityHint')} />
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'paper', 'gray', 'dimmed', 'navy', 'midnight'] as const).map((id) => {
                    const pal = THEME_PREVIEW[id]
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => set({ theme: id })}
                        className={`rounded-xl border p-2.5 text-left text-xs font-semibold ${prefs.theme === id ? 'border-[var(--accent-color)]' : 'border-[var(--border)]'}`}
                      >
                        <div className="mb-2 h-16 overflow-hidden rounded-lg border" style={{ background: pal.bg, borderColor: pal.border }}>
                          <div className="flex h-full">
                            <div className="w-7" style={{ background: pal.side, borderRight: `1px solid ${pal.border}` }} />
                            <div className="flex-1">
                              <div className="h-3.5" style={{ background: pal.bar, borderBottom: `1px solid ${pal.border}` }} />
                            </div>
                          </div>
                        </div>
                        {L(id)}
                      </button>
                    )
                  })}
                </div>
                <Card>
                  <Row label={L('accent')} hint={L('accentHint')}>
                    <div className="flex flex-wrap justify-end gap-2">
                      {ACCENTS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => set({ accent: c })}
                          className="h-7 w-7 rounded-full border border-[var(--border)]"
                          style={{ background: c, outline: prefs.accent === c ? `2px solid ${c}` : undefined, outlineOffset: 2 }}
                        />
                      ))}
                    </div>
                  </Row>
                  <Row label={L('font')}>
                    <div className="flex justify-end gap-2">
                      {(['sans', 'serif', 'mono'] as const).map((id) => (
                        <Button key={id} variant={prefs.font === id ? 'default' : 'outline'} size="sm" onClick={() => set({ font: id as FontId })}>
                          {L(id === 'sans' ? 'fontSans' : id === 'serif' ? 'fontSerif' : 'fontMono')}
                        </Button>
                      ))}
                    </div>
                  </Row>
                  <Row label={L('density')}>
                    <div className="flex justify-end gap-2">
                      {(['comfortable', 'compact'] as const).map((d) => (
                        <Button key={d} variant={prefs.density === d ? 'default' : 'outline'} size="sm" onClick={() => set({ density: d })}>
                          {L(d)}
                        </Button>
                      ))}
                    </div>
                  </Row>
                  <Toggle label={L('wideLayout')} hint={L('wideLayoutHint')} checked={prefs.wideLayout} onChange={(v) => set({ wideLayout: v })} />
                  <Toggle label={L('showTimestamps')} hint={L('showTimestampsHint')} checked={prefs.showTimestamps} onChange={(v) => set({ showTimestamps: v })} />
                </Card>
                <Button variant="outline" size="sm" onClick={() => set(APPEARANCE_DEFAULTS)}>
                  {L('resetAppearance')}
                </Button>
              </Tabs.Content>

              <Tabs.Content value="behavior" className="space-y-5">
                <Head title={L('behavior')} desc={L('behaviorHint')} />
                <Card>
                  <Toggle label={L('sendOnEnter')} hint={L('sendOnEnterHint')} checked={prefs.sendOnEnter} onChange={(v) => set({ sendOnEnter: v })} />
                  <Toggle label={L('showTimestamps')} checked={prefs.showTimestamps} onChange={(v) => set({ showTimestamps: v })} />
                </Card>
              </Tabs.Content>

              <Tabs.Content value="customize" className="space-y-5">
                <Head title={L('customize')} desc={L('customizeDesc')} />
                <Row label={L('toneLabel')}>
                  <div className="flex flex-wrap gap-2">
                    {(['auto', 'direct', 'technical', 'concise'] as const).map((id) => (
                      <Button key={id} variant={prefs.tone === id ? 'default' : 'outline'} size="sm" onClick={() => set({ tone: id as ToneId })}>
                        {L(id === 'auto' ? 'toneAuto' : id === 'direct' ? 'toneDirect' : id === 'technical' ? 'toneTechnical' : 'toneConcise')}
                      </Button>
                    ))}
                  </div>
                </Row>
                <div className="space-y-2">
                  <div className="text-sm font-semibold">{L('directives')}</div>
                  <Textarea
                    value={prefs.directives}
                    onChange={(e) => set({ directives: e.target.value.slice(0, 2000) })}
                    placeholder={L('directivesPh')}
                  />
                  <p className="text-xs text-[var(--dim)]">{L('directivesHint')}</p>
                </div>
                <Field label={`${L('creativity')} · ${prefs.temperature.toFixed(2)}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[var(--dim)]">{L('precise')}</span>
                    <Slider min={0} max={1.2} step={0.05} value={[prefs.temperature]} onValueChange={(v) => set({ temperature: v[0] ?? 0.35 })} />
                    <span className="text-xs text-[var(--dim)]">{L('creative')}</span>
                  </div>
                </Field>
                <Button variant="outline" size="sm" onClick={() => set(ENGINE_DEFAULTS)}>
                  {L('resetEngine')}
                </Button>
              </Tabs.Content>

              <Tabs.Content value="plan" className="space-y-5">
                <Head title={L('plan')} desc={L('planDesc')} />
                <Card>
                  <Row label={L('currentPlan')}>
                    <span className="rounded-md border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[11px] font-extrabold tracking-wide text-amber-400">
                      {L('localPlan')}
                    </span>
                  </Row>
                </Card>
                <p className="text-xs text-[var(--dim)]">{L('planHint')}</p>
                <a className="inline-flex h-9 items-center rounded-xl border border-[var(--border)] px-3 text-sm font-semibold" href="mailto:alberto@trujillomingorance.com?subject=Trujillo%20AI%20Enterprise">
                  {L('planContact')}
                </a>
              </Tabs.Content>

              <Tabs.Content value="usage" className="space-y-5">
                <Head title={L('usage')} desc={L('usageDesc')} />
                <div className="grid grid-cols-2 gap-2">
                  <Stat label={L('chatsCount')} value={String(stats.chats)} />
                  <Stat label={L('messagesCount')} value={String(stats.messages)} />
                  <Stat label={L('engineName')} value={L('engineId')} />
                  <Stat label={L('edgeCache')} value={prefs.edgeCache ? L('cacheOn') : L('cacheOff')} />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-semibold">{L('inferenceKey')}</div>
                  <div className="relative">
                    <Input
                      type={showKey ? 'text' : 'password'}
                      autoComplete="off"
                      spellCheck={false}
                      value={prefs.inferenceKey}
                      onChange={(e) => set({ inferenceKey: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1.5 text-[var(--dim)] hover:text-[var(--text)]"
                      onClick={() => setShowKey((v) => !v)}
                      aria-label={showKey ? L('hideKey') : L('showKey')}
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-[var(--dim)]">{prefs.inferenceKey ? L('keySet') : L('keyEmpty')}</p>
                </div>
              </Tabs.Content>

              <Tabs.Content value="data" className="space-y-5">
                <Head title={L('data')} desc={L('dataDesc')} />
                <Card>
                  <Toggle label={L('edgeCache')} hint={L('edgeCacheHint')} checked={prefs.edgeCache} onChange={(v) => set({ edgeCache: v })} />
                </Card>
                <p className="text-xs text-[var(--dim)]">{L('dataHint')}</p>
                <input
                  ref={importRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) onImport(f)
                    e.target.value = ''
                  }}
                />
                <Card>
                  <div className="flex flex-wrap gap-2 px-3 py-3">
                    <Button variant="outline" onClick={onExport}>{L('exportJson')}</Button>
                    <Button variant="outline" onClick={() => importRef.current?.click()}>{L('importJson')}</Button>
                    <Button variant="outline" onClick={onClear}>{L('clearLocal')}</Button>
                  </div>
                </Card>
                <p className="text-xs text-[var(--dim)]">{L('exportHint')}</p>
                <p className="text-xs text-[var(--dim)]">{L('clearHint')}</p>
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Head({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h2 className="text-[1.05rem] font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-[var(--muted)]">{desc}</p>
    </div>
  )
}

function Block({ title, hint }: { title: string; hint?: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--dim)]">{title}</div>
      {hint && <p className="mt-1 text-xs text-[var(--dim)]">{hint}</p>}
    </div>
  )
}

function Card({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]">{children}</div>
}

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3 last:border-b-0">
      <div className="min-w-0">
        <div className="text-sm font-semibold">{label}</div>
        {hint && <p className="text-xs text-[var(--dim)]">{hint}</p>}
      </div>
      <div className="w-[min(280px,48%)] shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-4 py-3 last:border-b-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <p className="text-xs text-[var(--dim)]">{hint}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-[var(--muted)]">{label}</div>
      {children}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] px-3 py-2">
      <div className="text-[11px] text-[var(--dim)]">{label}</div>
      <div className="mt-0.5 text-sm font-semibold">{value}</div>
    </div>
  )
}
