import { isLang, type Lang } from './i18n'
import { LANGS, normalizeLang } from './lang-catalog'

export type ThemeId = 'light' | 'paper' | 'gray' | 'dimmed' | 'navy' | 'midnight'
export const THEME_IDS: ThemeId[] = ['light', 'paper', 'gray', 'dimmed', 'navy', 'midnight']
export type Density = 'comfortable' | 'compact'
export type Mode = 'concise' | 'balanced' | 'deep'
export type FontId = 'sans' | 'serif' | 'mono'
export type ToneId = 'auto' | 'direct' | 'technical' | 'concise'
export const SETTINGS_TABS = [
  'general',
  'account',
  'appearance',
  'behavior',
  'customize',
  'plan',
  'usage',
  'data',
] as const
export type SettingsTab = (typeof SETTINGS_TABS)[number]

export const SETTINGS_NAV: { group: 'navApp' | 'navBilling' | 'navData'; tabs: SettingsTab[] }[] = [
  { group: 'navApp', tabs: ['general', 'account', 'appearance', 'behavior', 'customize'] },
  { group: 'navBilling', tabs: ['plan', 'usage'] },
  { group: 'navData', tabs: ['data'] },
]

export type Prefs = {
  lang: Lang
  theme: ThemeId
  accent: string
  density: Density
  font: FontId
  name: string
  email: string
  directives: string
  temperature: number
  edgeCache: boolean
  inferenceKey: string
  mode: Mode
  tone: ToneId
  sidebarOpen: boolean
  sendOnEnter: boolean
  showTimestamps: boolean
  wideLayout: boolean
  settingsTab: SettingsTab
  notifyProduct: boolean
  notifySecurity: boolean
  notifyDigest: boolean
  confirmDelete: boolean
}

const KEY = 'ta_edge_prefs_v1'

function allBrowserLangs(): string[] {
  try {
    const list = typeof navigator !== 'undefined' ? navigator.languages || [navigator.language] : []
    const out: string[] = []
    for (const item of list) {
      const n = normalizeLang(item)
      if (n && isLang(n) && !out.includes(n)) out.push(n)
    }
    return out
  } catch {
    return []
  }
}

function storedLang(): Lang | '' {
  try {
    const raw = localStorage.getItem('ta_lang')
    const n = raw ? normalizeLang(raw) : ''
    if (n && isLang(n)) return n
  } catch {
    /* ignore */
  }
  try {
    const m = document.cookie.match(/(?:^|;\s*)ta_lang=([A-Za-z-]{2,8})/)
    const n = m ? normalizeLang(m[1]) : ''
    if (n && isLang(n)) return n
  } catch {
    /* ignore */
  }
  return ''
}

function geoLang(): Lang | '' {
  try {
    const g = (window as unknown as { TA_GEO?: { lang?: string } }).TA_GEO
    const n = g?.lang ? normalizeLang(g.lang) : ''
    if (n && isLang(n)) return n
  } catch {
    /* ignore */
  }
  return ''
}

function preferRegional(regional: string, navs: string[]) {
  if (!regional) return false
  if (navs.includes(regional)) return true
  if (regional === 'ca' && (navs.includes('es') || !navs.length)) return true
  if (regional === 'zh-TW' && navs.some((x) => x === 'zh' || x === 'zh-TW')) return true
  return false
}

export function detectLang(): Lang {
  const stored = storedLang()
  if (stored) return stored
  const navs = allBrowserLangs()
  const geo = geoLang()
  if (geo && preferRegional(geo, navs) && isLang(geo)) return geo
  if (navs[0] && isLang(navs[0])) return navs[0]
  return 'es'
}

function browserLang(): Lang {
  return detectLang()
}

const defaults: Prefs = {
  lang: 'es',
  theme: 'midnight',
  accent: '#38bdf8',
  density: 'comfortable',
  font: 'sans',
  name: '',
  email: '',
  directives: '',
  temperature: 0.35,
  edgeCache: true,
  inferenceKey: '',
  mode: 'balanced',
  tone: 'auto',
  sidebarOpen: true,
  sendOnEnter: true,
  showTimestamps: false,
  wideLayout: false,
  settingsTab: 'general',
  notifyProduct: true,
  notifySecurity: true,
  notifyDigest: false,
  confirmDelete: true,
}

const FONTS: FontId[] = ['sans', 'serif', 'mono']
const TONES: ToneId[] = ['auto', 'direct', 'technical', 'concise']

export function loadPrefs(): Prefs {
  const fallback = { ...defaults, lang: browserLang() }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return fallback
    const merged = { ...fallback, ...JSON.parse(raw) } as Prefs
    if (!SETTINGS_TABS.includes(merged.settingsTab)) merged.settingsTab = 'general'
    if (!FONTS.includes(merged.font)) merged.font = 'sans'
    if (!TONES.includes(merged.tone)) merged.tone = 'auto'
    if (!THEME_IDS.includes(merged.theme)) merged.theme = 'midnight'
    merged.lang = detectLang()
    return merged
  } catch {
    return fallback
  }
}

export function savePrefs(prefs: Prefs) {
  localStorage.setItem(KEY, JSON.stringify(prefs))
}

export function applyChrome(prefs: Prefs) {
  const root = document.documentElement
  root.setAttribute('data-theme', prefs.theme)
  root.setAttribute('data-density', prefs.density)
  root.setAttribute('data-font', prefs.font)
  root.setAttribute('data-wide', prefs.wideLayout ? 'on' : 'off')
  root.setAttribute('lang', prefs.lang === 'zh-TW' ? 'zh-Hant' : prefs.lang)
  const metaLang = LANGS.find((l) => l.id === prefs.lang)
  root.setAttribute('dir', metaLang?.rtl ? 'rtl' : 'ltr')
  root.style.setProperty('--accent-color', prefs.accent)
  const meta = document.querySelector('meta[name="theme-color"]')
  const colors: Record<ThemeId, string> = {
    light: '#ffffff',
    paper: '#f4efe6',
    gray: '#18181b',
    dimmed: '#0d1117',
    navy: '#0b1220',
    midnight: '#000000',
  }
  if (meta) meta.setAttribute('content', colors[prefs.theme])
}

export const APPEARANCE_DEFAULTS: Pick<Prefs, 'theme' | 'accent' | 'density' | 'font' | 'wideLayout' | 'showTimestamps'> = {
  theme: 'midnight',
  accent: '#38bdf8',
  density: 'comfortable',
  font: 'sans',
  wideLayout: false,
  showTimestamps: false,
}

export const ENGINE_DEFAULTS: Pick<Prefs, 'temperature' | 'directives' | 'mode' | 'tone'> = {
  temperature: 0.35,
  directives: '',
  mode: 'balanced',
  tone: 'auto',
}
