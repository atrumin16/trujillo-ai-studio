/** UI languages: Grok app locales + Catalan. No filler codes. */
export const LANGS = [
  { id: 'es', native: 'Español', rtl: false, reply: 'Responde siempre en español. No cambies de idioma salvo que el usuario lo pida.' },
  { id: 'en', native: 'English', rtl: false, reply: 'Always reply in English unless the user asks otherwise.' },
  { id: 'zh', native: '中文（简体）', rtl: false, reply: '始终用简体中文回答。除非用户明确要求，否则不要换语言。' },
  { id: 'zh-TW', native: '中文（繁體）', rtl: false, reply: '請一律使用繁體中文回答。除非使用者要求，否則不要更換語言。' },
  { id: 'hi', native: 'हिन्दी', rtl: false, reply: 'हमेशा हिन्दी में उत्तर दें। जब तक उपयोगकर्ता न कहे, भाषा न बदलें।' },
  { id: 'ar', native: 'العربية', rtl: true, reply: 'أجب دائمًا بالعربية الفصحى الواضحة. لا تغيّر اللغة إلا إذا طلب المستخدم ذلك.' },
  { id: 'bn', native: 'বাংলা', rtl: false, reply: 'সবসময় বাংলায় উত্তর দিন। ব্যবহারকারী না চাইলে ভাষা বদলাবেন না।' },
  { id: 'pt', native: 'Português', rtl: false, reply: 'Responde sempre em português. Não mudes de idioma salvo se o utilizador o pedir.' },
  { id: 'ru', native: 'Русский', rtl: false, reply: 'Всегда отвечай по-русски. Не меняй язык, пока пользователь не попросит.' },
  { id: 'ur', native: 'اردو', rtl: true, reply: 'ہمیشہ اردو میں جواب دیں۔ جب تک صارف نہ کہے زبان نہ بدلیں۔' },
  { id: 'id', native: 'Bahasa Indonesia', rtl: false, reply: 'Selalu jawab dalam bahasa Indonesia. Jangan ganti bahasa kecuali diminta.' },
  { id: 'de', native: 'Deutsch', rtl: false, reply: 'Antworte immer auf Deutsch. Wechsle die Sprache nur auf Wunsch.' },
  { id: 'ja', native: '日本語', rtl: false, reply: '常に日本語で答えてください。ユーザーが求めない限り言語を変えないでください。' },
  { id: 'mr', native: 'मराठी', rtl: false, reply: 'नेहमी मराठीत उत्तर द्या. वापरकर्ता सांगितल्याशिवाय भाषा बदलू नका.' },
  { id: 'vi', native: 'Tiếng Việt', rtl: false, reply: 'Luôn trả lời bằng tiếng Việt. Không đổi ngôn ngữ trừ khi người dùng yêu cầu.' },
  { id: 'te', native: 'తెలుగు', rtl: false, reply: 'ఎల్లప్పుడూ తెలుగులో సమాధానం ఇవ్వండి. వినియోగదారు కోరినప్పుడు తప్ప భాష మార్చవద్దు.' },
  { id: 'tr', native: 'Türkçe', rtl: false, reply: 'Her zaman Türkçe yanıt ver. Kullanıcı istemedikçe dil değiştirme.' },
  { id: 'ta', native: 'தமிழ்', rtl: false, reply: 'எப்போதும் தமிழில் பதிலளிக்கவும். பயனர் கேட்டாலன்றி மொழியை மாற்ற வேண்டாம்.' },
  { id: 'ko', native: '한국어', rtl: false, reply: '항상 한국어로 답하세요. 사용자가 요청하지 않으면 언어를 바꾸지 마세요.' },
  { id: 'fa', native: 'فارسی', rtl: true, reply: 'همیشه به فارسی پاسخ بده. زبان را عوض نکن مگر اینکه کاربر بخواهد.' },
  { id: 'fil', native: 'Filipino', rtl: false, reply: 'Laging sumagot sa Filipino. Huwag palitan ang wika maliban kung hilingin.' },
  { id: 'it', native: 'Italiano', rtl: false, reply: 'Rispondi sempre in italiano. Non cambiare lingua se non te lo chiedono.' },
  { id: 'th', native: 'ไทย', rtl: false, reply: 'ตอบเป็นภาษาไทยเสมอ อย่าเปลี่ยนภาษาจนกว่าผู้ใช้จะขอ' },
  { id: 'pl', native: 'Polski', rtl: false, reply: 'Zawsze odpowiadaj po polsku. Nie zmieniaj języka, chyba że użytkownik o to poprosi.' },
  { id: 'uk', native: 'Українська', rtl: false, reply: 'Завжди відповідай українською. Не змінюй мову, доки користувач не попросить.' },
  { id: 'ms', native: 'Bahasa Melayu', rtl: false, reply: 'Sentiasa jawab dalam bahasa Melayu. Jangan tukar bahasa kecuali diminta.' },
  { id: 'nl', native: 'Nederlands', rtl: false, reply: 'Antwoord altijd in het Nederlands. Wissel niet van taal tenzij daarom wordt gevraagd.' },
  { id: 'ro', native: 'Română', rtl: false, reply: 'Răspunde întotdeauna în română. Nu schimba limba decât la cerere.' },
  { id: 'el', native: 'Ελληνικά', rtl: false, reply: 'Απάντα πάντα στα ελληνικά. Μην αλλάζεις γλώσσα εκτός αν το ζητήσει ο χρήστης.' },
  { id: 'hu', native: 'Magyar', rtl: false, reply: 'Mindig magyarul válaszolj. Ne válts nyelvet, hacsak a felhasználó nem kéri.' },
  { id: 'cs', native: 'Čeština', rtl: false, reply: 'Vždy odpovídej česky. Jazyk neměň, dokud o to uživatel nepožádá.' },
  { id: 'sv', native: 'Svenska', rtl: false, reply: 'Svara alltid på svenska. Byt inte språk om inte användaren ber om det.' },
  { id: 'bg', native: 'Български', rtl: false, reply: 'Винаги отговаряй на български. Не сменяй езика, освен ако потребителят не поиска.' },
  { id: 'da', native: 'Dansk', rtl: false, reply: 'Svar altid på dansk. Skift ikke sprog, medmindre brugeren beder om det.' },
  { id: 'fi', native: 'Suomi', rtl: false, reply: 'Vastaa aina suomeksi. Älä vaihda kieltä, ellei käyttäjä pyydä.' },
  { id: 'nb', native: 'Norsk', rtl: false, reply: 'Svar alltid på norsk. Ikke bytt språk med mindre brukeren ber om det.' },
  { id: 'hr', native: 'Hrvatski', rtl: false, reply: 'Uvijek odgovaraj na hrvatskom. Ne mijenjaj jezik osim ako korisnik to ne zatraži.' },
  { id: 'he', native: 'עברית', rtl: true, reply: 'תמיד ענה בעברית. אל תחליף שפה אלא אם המשתמש מבקש.' },
  { id: 'fr', native: 'Français', rtl: false, reply: 'Réponds toujours en français. Ne change pas de langue sauf si on te le demande.' },
  { id: 'ca', native: 'Català', rtl: false, reply: 'Respon sempre en català. No canviïs d’idioma si no t’ho demanen.' },
]

export const LANG_IDS = LANGS.map((l) => l.id)
const BY_ID = Object.fromEntries(LANGS.map((l) => [l.id, l]))

export function normalizeLang(raw) {
  const s = String(raw || '').trim()
  if (!s) return ''
  if (BY_ID[s]) return s
  const lower = s.toLowerCase().replace('_', '-')
  if (BY_ID[lower]) return lower
  if (lower.startsWith('zh-hant') || lower.startsWith('zh-tw') || lower.startsWith('zh-hk') || lower === 'zh-mo') return 'zh-TW'
  if (lower.startsWith('zh')) return 'zh'
  if (lower === 'tl' || lower.startsWith('fil')) return 'fil'
  if (lower === 'no' || lower === 'nn' || lower.startsWith('nb')) return 'nb'
  if (lower === 'iw' || lower.startsWith('he')) return 'he'
  if (lower === 'in' || lower.startsWith('id')) return 'id'
  if (lower.startsWith('pt')) return 'pt'
  if (lower.startsWith('en')) return 'en'
  if (lower.startsWith('es')) return 'es'
  if (lower.startsWith('fr')) return 'fr'
  if (lower.startsWith('de')) return 'de'
  if (lower.startsWith('it')) return 'it'
  if (lower.startsWith('ar')) return 'ar'
  if (lower.startsWith('fa')) return 'fa'
  if (lower.startsWith('ur')) return 'ur'
  if (lower.startsWith('ms')) return 'ms'
  const two = lower.slice(0, 2)
  if (BY_ID[two]) return two
  return ''
}

function foldGeo(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

const CA_CITIES = new Set([
  'barcelona', 'badalona', 'sabadell', 'terrassa', 'tarrasa', 'lleida', 'lerida',
  'girona', 'gerona', 'tarragona', 'reus', 'mataro', 'manresa', 'figueres', 'figueras',
  'hospitalet', 'lhospitalet', 'lhospitaletdellobregat', 'cornella', 'cornelladellobregat',
  'santcugat', 'santcugatdelvalles', 'granollers', 'igualada', 'vic', 'sitges',
  'palma', 'palmademallorca', 'manacor', 'ibiza', 'eivissa', 'mahon', 'mao',
  'andorra', 'andorralavella', 'escaldes', 'encamp', 'santacolomadegramanet',
  'rubi', 'viladecans', 'castelldefels', 'elprat', 'elpratdellobregat',
  'santboi', 'santboidellobregat', 'casteydefels', 'mollet', 'molletdelvalles',
].map(foldGeo))

const CA_REGIONS = new Set([
  'catalonia', 'catalunya', 'cataluna', 'andorra',
  'balearicislands', 'baleares', 'illesbalears', 'islasbaleares',
].map(foldGeo))

const CA_PROVINCES = new Set(['CT', 'IB', 'B', 'GI', 'L', 'T', 'PM'])

const COUNTRY_LANG = {
  AD: 'ca', TW: 'zh-TW', HK: 'zh-TW', MO: 'zh-TW',
  JP: 'ja', KR: 'ko', DE: 'de', AT: 'de', IT: 'it', NL: 'nl',
  PL: 'pl', TR: 'tr', VN: 'vi', TH: 'th', ID: 'id', MY: 'ms', PH: 'fil',
  UA: 'uk', CZ: 'cs', HU: 'hu', RO: 'ro', GR: 'el', SE: 'sv',
  NO: 'nb', DK: 'da', FI: 'fi', BG: 'bg', HR: 'hr', IL: 'he',
  IR: 'fa', BR: 'pt', PT: 'pt',
}

export function geoFromRequest(request) {
  const cf = request && request.cf ? request.cf : {}
  return {
    country: cf.country || '',
    region: cf.region || '',
    regionCode: cf.regionCode || '',
    city: cf.city || '',
    tz: cf.timezone || '',
  }
}

export function regionalLang(geo) {
  if (!geo) return ''
  const country = String(geo.country || '').toUpperCase()
  const regionCode = String(geo.regionCode || '').toUpperCase()
  const region = foldGeo(geo.region)
  const city = foldGeo(geo.city)
  const tz = String(geo.tz || geo.timezone || '')
  if (country === 'AD' || tz === 'Europe/Andorra') return 'ca'
  if (country === 'ES' && (CA_PROVINCES.has(regionCode) || CA_REGIONS.has(region) || CA_CITIES.has(city))) return 'ca'
  return COUNTRY_LANG[country] || ''
}

export function preferRegional(regional, navLangs) {
  if (!regional) return false
  const navs = Array.isArray(navLangs) ? navLangs : []
  if (navs.includes(regional)) return true
  if (regional === 'ca' && (navs.includes('es') || navs.length === 0)) return true
  if (regional === 'zh-TW' && navs.some((x) => x === 'zh' || x === 'zh-TW')) return true
  return false
}

export function acceptLangs(request) {
  const al = (request.headers.get('Accept-Language') || '').toLowerCase()
  const parts = al.split(',').map((p) => p.split(';')[0].trim()).filter(Boolean)
  const out = []
  for (const p of parts) {
    const n = normalizeLang(p)
    if (n && out.indexOf(n) < 0) out.push(n)
  }
  return out
}

export function publicGeo(request) {
  const g = geoFromRequest(request)
  return { ...g, lang: regionalLang(g) || '' }
}

export function pickLang(request) {
  const cookie = request.headers.get('Cookie') || ''
  const cm = cookie.match(/(?:^|;\s*)ta_lang=([A-Za-z-]{2,8})/)
  if (cm) {
    const fromCookie = normalizeLang(cm[1])
    if (fromCookie) return fromCookie
  }
  const navs = acceptLangs(request)
  const regional = regionalLang(geoFromRequest(request))
  if (preferRegional(regional, navs)) return regional
  if (navs[0]) return navs[0]
  return 'es'
}

export function langMeta(id) {
  return BY_ID[id] || BY_ID.es
}
