export const LANGS = [
  {
    "id": "es",
    "native": "Español",
    "rtl": false,
    "top": true
  },
  {
    "id": "en",
    "native": "English",
    "rtl": false,
    "top": true
  },
  {
    "id": "zh",
    "native": "中文（简体）",
    "rtl": false,
    "top": true
  },
  {
    "id": "zh-TW",
    "native": "中文（繁體）",
    "rtl": false,
    "top": false
  },
  {
    "id": "hi",
    "native": "हिन्दी",
    "rtl": false,
    "top": true
  },
  {
    "id": "ar",
    "native": "العربية",
    "rtl": true,
    "top": true
  },
  {
    "id": "bn",
    "native": "বাংলা",
    "rtl": false,
    "top": true
  },
  {
    "id": "pt",
    "native": "Português",
    "rtl": false,
    "top": true
  },
  {
    "id": "ru",
    "native": "Русский",
    "rtl": false,
    "top": true
  },
  {
    "id": "ur",
    "native": "اردو",
    "rtl": true,
    "top": true
  },
  {
    "id": "id",
    "native": "Bahasa Indonesia",
    "rtl": false,
    "top": false
  },
  {
    "id": "de",
    "native": "Deutsch",
    "rtl": false,
    "top": false
  },
  {
    "id": "ja",
    "native": "日本語",
    "rtl": false,
    "top": false
  },
  {
    "id": "mr",
    "native": "मराठी",
    "rtl": false,
    "top": false
  },
  {
    "id": "vi",
    "native": "Tiếng Việt",
    "rtl": false,
    "top": false
  },
  {
    "id": "te",
    "native": "తెలుగు",
    "rtl": false,
    "top": false
  },
  {
    "id": "tr",
    "native": "Türkçe",
    "rtl": false,
    "top": false
  },
  {
    "id": "ta",
    "native": "தமிழ்",
    "rtl": false,
    "top": false
  },
  {
    "id": "ko",
    "native": "한국어",
    "rtl": false,
    "top": false
  },
  {
    "id": "fa",
    "native": "فارسی",
    "rtl": true,
    "top": false
  },
  {
    "id": "fil",
    "native": "Filipino",
    "rtl": false,
    "top": false
  },
  {
    "id": "it",
    "native": "Italiano",
    "rtl": false,
    "top": false
  },
  {
    "id": "th",
    "native": "ไทย",
    "rtl": false,
    "top": false
  },
  {
    "id": "pl",
    "native": "Polski",
    "rtl": false,
    "top": false
  },
  {
    "id": "uk",
    "native": "Українська",
    "rtl": false,
    "top": false
  },
  {
    "id": "ms",
    "native": "Bahasa Melayu",
    "rtl": false,
    "top": false
  },
  {
    "id": "nl",
    "native": "Nederlands",
    "rtl": false,
    "top": false
  },
  {
    "id": "ro",
    "native": "Română",
    "rtl": false,
    "top": false
  },
  {
    "id": "el",
    "native": "Ελληνικά",
    "rtl": false,
    "top": false
  },
  {
    "id": "hu",
    "native": "Magyar",
    "rtl": false,
    "top": false
  },
  {
    "id": "cs",
    "native": "Čeština",
    "rtl": false,
    "top": false
  },
  {
    "id": "sv",
    "native": "Svenska",
    "rtl": false,
    "top": false
  },
  {
    "id": "bg",
    "native": "Български",
    "rtl": false,
    "top": false
  },
  {
    "id": "da",
    "native": "Dansk",
    "rtl": false,
    "top": false
  },
  {
    "id": "fi",
    "native": "Suomi",
    "rtl": false,
    "top": false
  },
  {
    "id": "nb",
    "native": "Norsk",
    "rtl": false,
    "top": false
  },
  {
    "id": "hr",
    "native": "Hrvatski",
    "rtl": false,
    "top": false
  },
  {
    "id": "he",
    "native": "עברית",
    "rtl": true,
    "top": false
  },
  {
    "id": "fr",
    "native": "Français",
    "rtl": false,
    "top": true
  },
  {
    "id": "ca",
    "native": "Català",
    "rtl": false,
    "top": false
  }
] as const
export type Lang = (typeof LANGS)[number]['id']
export const LANG_IDS = LANGS.map((l) => l.id)
export const TOP_LANGS = ["en","zh","hi","es","ar","fr","bn","pt","ru","ur"] as const
export const REPLY_LANG: Record<string, string> = {
  "es": "Responde siempre en español. No cambies de idioma salvo que el usuario lo pida.",
  "en": "Always reply in English unless the user asks otherwise.",
  "zh": "始终用简体中文回答。除非用户明确要求，否则不要换语言。",
  "zh-TW": "請一律使用繁體中文回答。除非使用者要求，否則不要更換語言。",
  "hi": "हमेशा हिन्दी में उत्तर दें। जब तक उपयोगकर्ता न कहे, भाषा न बदलें।",
  "ar": "أجب دائمًا بالعربية. لا تغيّر اللغة إلا إذا طلب المستخدم ذلك.",
  "bn": "সবসময় বাংলায় উত্তর দিন। ব্যবহারকারী না চাইলে ভাষা বদলাবেন না।",
  "pt": "Responde sempre em português. Não mudes de idioma salvo se o utilizador o pedir.",
  "ru": "Всегда отвечай по-русски. Не меняй язык, пока пользователь не попросит.",
  "ur": "ہمیشہ اردو میں جواب دیں۔ جب تک صارف نہ کہے زبان نہ بدلیں۔",
  "id": "Selalu jawab dalam bahasa Indonesia. Jangan ganti bahasa kecuali diminta.",
  "de": "Antworte immer auf Deutsch. Wechsle die Sprache nur auf Wunsch.",
  "ja": "常に日本語で答えてください。ユーザーが求めない限り言語を変えないでください。",
  "mr": "नेहमी मराठीत उत्तर द्या. वापरकर्ता सांगितल्याशिवाय भाषा बदलू नका.",
  "vi": "Luôn trả lời bằng tiếng Việt. Không đổi ngôn ngữ trừ khi người dùng yêu cầu.",
  "te": "ఎల్లప్పుడూ తెలుగులో సమాధానం ఇవ్వండి.",
  "tr": "Her zaman Türkçe yanıt ver. Kullanıcı istemedikçe dil değiştirme.",
  "ta": "எப்போதும் தமிழில் பதிலளிக்கவும்.",
  "ko": "항상 한국어로 답하세요. 사용자가 요청하지 않으면 언어를 바꾸지 마세요.",
  "fa": "همیشه به فارسی پاسخ بده. زبان را عوض نکن مگر اینکه کاربر بخواهد.",
  "fil": "Laging sumagot sa Filipino. Huwag palitan ang wika maliban kung hilingin.",
  "it": "Rispondi sempre in italiano. Non cambiare lingua se non te lo chiedono.",
  "th": "ตอบเป็นภาษาไทยเสมอ อย่าเปลี่ยนภาษาจนกว่าผู้ใช้จะขอ",
  "pl": "Zawsze odpowiadaj po polsku. Nie zmieniaj języka, chyba że użytkownik o to poprosi.",
  "uk": "Завжди відповідай українською. Не змінюй мову, доки користувач не попросить.",
  "ms": "Sentiasa jawab dalam bahasa Melayu. Jangan tukar bahasa kecuali diminta.",
  "nl": "Antwoord altijd in het Nederlands. Wissel niet van taal tenzij daarom wordt gevraagd.",
  "ro": "Răspunde întotdeauna în română. Nu schimba limba decât la cerere.",
  "el": "Απάντα πάντα στα ελληνικά. Μην αλλάζεις γλώσσα εκτός αν το ζητήσει ο χρήστης.",
  "hu": "Mindig magyarul válaszolj. Ne válts nyelvet, hacsak a felhasználó nem kéri.",
  "cs": "Vždy odpovídej česky. Jazyk neměň, dokud o to uživatel nepožádá.",
  "sv": "Svara alltid på svenska. Byt inte språk om inte användaren ber om det.",
  "bg": "Винаги отговаряй на български. Не сменяй езика, освен ако потребителят не поиска.",
  "da": "Svar altid på dansk. Skift ikke sprog, medmindre brugeren beder om det.",
  "fi": "Vastaa aina suomeksi. Älä vaihda kieltä, ellei käyttäjä pyydä.",
  "nb": "Svar alltid på norsk. Ikke bytt språk med mindre brukeren ber om det.",
  "hr": "Uvijek odgovaraj na hrvatskom. Ne mijenjaj jezik osim ako korisnik to ne zatraži.",
  "he": "תמיד ענה בעברית. אל תחליף שפה אלא אם המשתמש מבקש.",
  "fr": "Réponds toujours en français. Ne change pas de langue sauf si on te le demande.",
  "ca": "Respon sempre en català. No canviïs d’idioma si no t’ho demanen."
}
export function isLang(v: string): v is Lang {
  return (LANG_IDS as string[]).includes(v)
}
export function normalizeLang(raw: string) {
  const s = String(raw || '').trim()
  if (!s) return ''
  if ((LANG_IDS as string[]).includes(s)) return s
  const lower = s.toLowerCase().replace('_', '-')
  if (lower.startsWith('zh-hant') || lower.startsWith('zh-tw') || lower.startsWith('zh-hk')) return 'zh-TW'
  if (lower.startsWith('zh')) return 'zh'
  if (lower === 'tl' || lower.startsWith('fil')) return 'fil'
  if (lower === 'no' || lower === 'nn' || lower.startsWith('nb')) return 'nb'
  if (lower === 'iw' || lower.startsWith('he')) return 'he'
  const two = lower.slice(0, 2)
  return (LANG_IDS as string[]).includes(two) ? two : ''
}
