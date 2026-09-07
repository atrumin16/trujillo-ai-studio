import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const core = JSON.parse(fs.readFileSync(path.join(root, 'scripts', '_i18n_core.json'), 'utf8'))
const extraMod = await import(pathToFileURL(path.join(root, 'scripts', 'i18n-extra.mjs')).href)
const extra = extraMod.default || extraMod.extra
const heroMod = await import(pathToFileURL(path.join(root, 'scripts', 'i18n-hero.mjs')).href)
const hero = heroMod.default || {}
const themeMod = await import(pathToFileURL(path.join(root, 'scripts', 'i18n-theme.mjs')).href)
const themeI18n = themeMod.default || {}
const studioMod = await import(pathToFileURL(path.join(root, 'scripts', 'i18n-studio.mjs')).href)
const studioI18n = studioMod.default || {}

const TOP10 = ['en', 'zh', 'hi', 'es', 'ar', 'fr', 'bn', 'pt', 'ru', 'ur']
const LANGS = [
  { id: 'es', native: 'Español', rtl: false, top: true },
  { id: 'en', native: 'English', rtl: false, top: true },
  { id: 'zh', native: '中文（简体）', rtl: false, top: true },
  { id: 'zh-TW', native: '中文（繁體）', rtl: false, top: false },
  { id: 'hi', native: 'हिन्दी', rtl: false, top: true },
  { id: 'ar', native: 'العربية', rtl: true, top: true },
  { id: 'bn', native: 'বাংলা', rtl: false, top: true },
  { id: 'pt', native: 'Português', rtl: false, top: true },
  { id: 'ru', native: 'Русский', rtl: false, top: true },
  { id: 'ur', native: 'اردو', rtl: true, top: true },
  { id: 'id', native: 'Bahasa Indonesia', rtl: false, top: false },
  { id: 'de', native: 'Deutsch', rtl: false, top: false },
  { id: 'ja', native: '日本語', rtl: false, top: false },
  { id: 'mr', native: 'मराठी', rtl: false, top: false },
  { id: 'vi', native: 'Tiếng Việt', rtl: false, top: false },
  { id: 'te', native: 'తెలుగు', rtl: false, top: false },
  { id: 'tr', native: 'Türkçe', rtl: false, top: false },
  { id: 'ta', native: 'தமிழ்', rtl: false, top: false },
  { id: 'ko', native: '한국어', rtl: false, top: false },
  { id: 'fa', native: 'فارسی', rtl: true, top: false },
  { id: 'fil', native: 'Filipino', rtl: false, top: false },
  { id: 'it', native: 'Italiano', rtl: false, top: false },
  { id: 'th', native: 'ไทย', rtl: false, top: false },
  { id: 'pl', native: 'Polski', rtl: false, top: false },
  { id: 'uk', native: 'Українська', rtl: false, top: false },
  { id: 'ms', native: 'Bahasa Melayu', rtl: false, top: false },
  { id: 'nl', native: 'Nederlands', rtl: false, top: false },
  { id: 'ro', native: 'Română', rtl: false, top: false },
  { id: 'el', native: 'Ελληνικά', rtl: false, top: false },
  { id: 'hu', native: 'Magyar', rtl: false, top: false },
  { id: 'cs', native: 'Čeština', rtl: false, top: false },
  { id: 'sv', native: 'Svenska', rtl: false, top: false },
  { id: 'bg', native: 'Български', rtl: false, top: false },
  { id: 'da', native: 'Dansk', rtl: false, top: false },
  { id: 'fi', native: 'Suomi', rtl: false, top: false },
  { id: 'nb', native: 'Norsk', rtl: false, top: false },
  { id: 'hr', native: 'Hrvatski', rtl: false, top: false },
  { id: 'he', native: 'עברית', rtl: true, top: false },
  { id: 'fr', native: 'Français', rtl: false, top: true },
  { id: 'ca', native: 'Català', rtl: false, top: false },
]

const REPLY = {
  es: 'Responde siempre en español. No cambies de idioma salvo que el usuario lo pida.',
  en: 'Always reply in English unless the user asks otherwise.',
  zh: '始终用简体中文回答。除非用户明确要求，否则不要换语言。',
  'zh-TW': '請一律使用繁體中文回答。除非使用者要求，否則不要更換語言。',
  hi: 'हमेशा हिन्दी में उत्तर दें। जब तक उपयोगकर्ता न कहे, भाषा न बदलें।',
  ar: 'أجب دائمًا بالعربية. لا تغيّر اللغة إلا إذا طلب المستخدم ذلك.',
  bn: 'সবসময় বাংলায় উত্তর দিন। ব্যবহারকারী না চাইলে ভাষা বদলাবেন না।',
  pt: 'Responde sempre em português. Não mudes de idioma salvo se o utilizador o pedir.',
  ru: 'Всегда отвечай по-русски. Не меняй язык, пока пользователь не попросит.',
  ur: 'ہمیشہ اردو میں جواب دیں۔ جب تک صارف نہ کہے زبان نہ بدلیں۔',
  id: 'Selalu jawab dalam bahasa Indonesia. Jangan ganti bahasa kecuali diminta.',
  de: 'Antworte immer auf Deutsch. Wechsle die Sprache nur auf Wunsch.',
  ja: '常に日本語で答えてください。ユーザーが求めない限り言語を変えないでください。',
  mr: 'नेहमी मराठीत उत्तर द्या. वापरकर्ता सांगितल्याशिवाय भाषा बदलू नका.',
  vi: 'Luôn trả lời bằng tiếng Việt. Không đổi ngôn ngữ trừ khi người dùng yêu cầu.',
  te: 'ఎల్లప్పుడూ తెలుగులో సమాధానం ఇవ్వండి.',
  tr: 'Her zaman Türkçe yanıt ver. Kullanıcı istemedikçe dil değiştirme.',
  ta: 'எப்போதும் தமிழில் பதிலளிக்கவும்.',
  ko: '항상 한국어로 답하세요. 사용자가 요청하지 않으면 언어를 바꾸지 마세요.',
  fa: 'همیشه به فارسی پاسخ بده. زبان را عوض نکن مگر اینکه کاربر بخواهد.',
  fil: 'Laging sumagot sa Filipino. Huwag palitan ang wika maliban kung hilingin.',
  it: 'Rispondi sempre in italiano. Non cambiare lingua se non te lo chiedono.',
  th: 'ตอบเป็นภาษาไทยเสมอ อย่าเปลี่ยนภาษาจนกว่าผู้ใช้จะขอ',
  pl: 'Zawsze odpowiadaj po polsku. Nie zmieniaj języka, chyba że użytkownik o to poprosi.',
  uk: 'Завжди відповідай українською. Не змінюй мову, доки користувач не попросить.',
  ms: 'Sentiasa jawab dalam bahasa Melayu. Jangan tukar bahasa kecuali diminta.',
  nl: 'Antwoord altijd in het Nederlands. Wissel niet van taal tenzij daarom wordt gevraagd.',
  ro: 'Răspunde întotdeauna în română. Nu schimba limba decât la cerere.',
  el: 'Απάντα πάντα στα ελληνικά. Μην αλλάζεις γλώσσα εκτός αν το ζητήσει ο χρήστης.',
  hu: 'Mindig magyarul válaszolj. Ne válts nyelvet, hacsak a felhasználó nem kéri.',
  cs: 'Vždy odpovídej česky. Jazyk neměň, dokud o to uživatel nepožádá.',
  sv: 'Svara alltid på svenska. Byt inte språk om inte användaren ber om det.',
  bg: 'Винаги отговаряй на български. Не сменяй езика, освен ако потребителят не поиска.',
  da: 'Svar altid på dansk. Skift ikke sprog, medmindre brugeren beder om det.',
  fi: 'Vastaa aina suomeksi. Älä vaihda kieltä, ellei käyttäjä pyydä.',
  nb: 'Svar alltid på norsk. Ikke bytt språk med mindre brukeren ber om det.',
  hr: 'Uvijek odgovaraj na hrvatskom. Ne mijenjaj jezik osim ako korisnik to ne zatraži.',
  he: 'תמיד ענה בעברית. אל תחליף שפה אלא אם המשתמש מבקש.',
  fr: 'Réponds toujours en français. Ne change pas de langue sauf si on te le demande.',
  ca: 'Respon sempre en català. No canviïs d’idioma si no t’ho demanen.',
}

const DOCS_LANG = {
  es: 'El menú de idioma está en la barra lateral. La interfaz y las respuestas siguen ese idioma. Hay 40 idiomas: los de Grok más el catalán.',
  en: 'The language menu is in the sidebar. The interface and model replies follow that language. There are 40 languages: Grok’s set plus Catalan.',
}

const MORE = {
  es: ['Mostrar más', 'Mostrar menos'],
  en: ['Show more', 'Show less'],
  zh: ['显示更多', '显示更少'],
  'zh-TW': ['顯示更多', '顯示較少'],
  hi: ['और दिखाएँ', 'कम दिखाएँ'],
  ar: ['إظهار المزيد', 'إظهار أقل'],
  bn: ['আরও দেখান', 'কম দেখান'],
  pt: ['Mostrar mais', 'Mostrar menos'],
  ru: ['Показать ещё', 'Скрыть'],
  ur: ['مزید دکھائیں', 'کم دکھائیں'],
  id: ['Tampilkan lebih banyak', 'Tampilkan lebih sedikit'],
  de: ['Mehr anzeigen', 'Weniger anzeigen'],
  ja: ['さらに表示', '少なく表示'],
  mr: ['अधिक दाखवा', 'कमी दाखवा'],
  vi: ['Hiện thêm', 'Ẩn bớt'],
  te: ['మరిన్ని చూపించు', 'తక్కువ చూపించు'],
  tr: ['Daha fazla', 'Daha az'],
  ta: ['மேலும் காட்டு', 'குறைவாக காட்டு'],
  ko: ['더 보기', '접기'],
  fa: ['نمایش بیشتر', 'نمایش کمتر'],
  fil: ['Magpakita pa', 'Magpakita ng mas kaunti'],
  it: ['Mostra altro', 'Mostra meno'],
  th: ['แสดงเพิ่ม', 'แสดงน้อยลง'],
  pl: ['Pokaż więcej', 'Pokaż mniej'],
  uk: ['Показати більше', 'Показати менше'],
  ms: ['Tunjuk lagi', 'Tunjuk kurang'],
  nl: ['Meer tonen', 'Minder tonen'],
  ro: ['Arată mai mult', 'Arată mai puțin'],
  el: ['Εμφάνιση περισσότερων', 'Εμφάνιση λιγότερων'],
  hu: ['Több', 'Kevesebb'],
  cs: ['Zobrazit více', 'Zobrazit méně'],
  sv: ['Visa mer', 'Visa mindre'],
  bg: ['Покажи още', 'Покажи по-малко'],
  da: ['Vis flere', 'Vis færre'],
  fi: ['Näytä lisää', 'Näytä vähemmän'],
  nb: ['Vis mer', 'Vis mindre'],
  hr: ['Prikaži više', 'Prikaži manje'],
  he: ['הצג עוד', 'הצג פחות'],
  fr: ['Afficher plus', 'Afficher moins'],
  ca: ['Mostra’n més', 'Mostra’n menys'],
}

const keys = Object.keys(core.packs.en)
const en = core.packs.en
const packs = {}
const missingChrome = []
function isLongCopy(k) {
  return k === 'replyLang' || /^(docs|aboutLede|aboutProductP|aboutStackP|featLede|modLede|planHint|linkedGoogle|linkedX)/.test(k)
}

for (const lang of LANGS) {
  const id = lang.id
  const overlay = extra[id] || {}
  const base = core.packs[id] || {}
  const pack = {}
  for (const k of keys) {
    const v = overlay[k] ?? base[k]
    if (v != null && v !== '') pack[k] = v
    else if (isLongCopy(k)) pack[k] = en[k]
    else if (en[k] != null) {
      if (!base[k] && !overlay[k]) missingChrome.push(id + '.' + k)
      pack[k] = en[k]
    } else missingChrome.push(id + '.' + k)
  }
  pack.replyLang = REPLY[id] || REPLY.en
  pack.showMore = MORE[id] ? MORE[id][0] : MORE.en[0]
  pack.showLess = MORE[id] ? MORE[id][1] : MORE.en[1]
  const h = hero[id] || hero.en
  if (h.heroSub) pack.heroSub = h.heroSub
  if (h.chipArch) pack.chipArch = h.chipArch
  if (h.chipBtc) pack.chipBtc = h.chipBtc
  pack.chipContinue = h.chipContinue || hero.en.chipContinue
  const th = Object.assign({}, themeI18n.en, themeI18n[id] || {})
  Object.keys(th).forEach(function (k) { pack[k] = th[k] })
  const st = Object.assign({}, studioI18n.en, studioI18n[id] || {})
  Object.keys(st).forEach(function (k) { pack[k] = st[k] })
  if (DOCS_LANG[id]) pack.docsLangP = DOCS_LANG[id]
  else if (overlay.docsLangP) pack.docsLangP = overlay.docsLangP
  packs[id] = pack
}

if (missingChrome.length) {
  console.error('Missing chrome translations:', missingChrome.slice(0, 60).join('\n'))
  console.error('…', missingChrome.length, 'total')
  process.exit(1)
}

const runtime = `(function () {
  var LANGS = ${JSON.stringify(LANGS)};
  var TOP = ${JSON.stringify(TOP10)};
  var PACK = window.TA_PACK || {};
  var IDS = LANGS.map(function (l) { return l.id; });
  var BY = {};
  LANGS.forEach(function (l) { BY[l.id] = l; });

  function normalize(raw) {
    var s = String(raw || '').trim();
    if (!s) return '';
    if (BY[s]) return s;
    var lower = s.toLowerCase().replace('_', '-');
    if (BY[lower]) return lower;
    if (lower.indexOf('zh-hant') === 0 || lower.indexOf('zh-tw') === 0 || lower.indexOf('zh-hk') === 0) return 'zh-TW';
    if (lower.indexOf('zh') === 0) return 'zh';
    if (lower === 'tl' || lower.indexOf('fil') === 0) return 'fil';
    if (lower === 'no' || lower === 'nn' || lower.indexOf('nb') === 0) return 'nb';
    if (lower === 'iw' || lower.indexOf('he') === 0) return 'he';
    if (lower === 'in' || lower.indexOf('id') === 0) return 'id';
    if (lower.indexOf('pt') === 0) return 'pt';
    if (lower.indexOf('en') === 0) return 'en';
    if (lower.indexOf('es') === 0) return 'es';
    if (lower.indexOf('fr') === 0) return 'fr';
    if (lower.indexOf('de') === 0) return 'de';
    if (lower.indexOf('it') === 0) return 'it';
    if (lower.indexOf('ar') === 0) return 'ar';
    if (lower.indexOf('fa') === 0) return 'fa';
    if (lower.indexOf('ur') === 0) return 'ur';
    if (lower.indexOf('ms') === 0) return 'ms';
    var two = lower.slice(0, 2);
    return BY[two] ? two : '';
  }

  function allNav() {
    var list = [];
    try {
      if (navigator.languages && navigator.languages.length) list = navigator.languages;
      else if (navigator.language) list = [navigator.language];
      else if (navigator.userLanguage) list = [navigator.userLanguage];
    } catch (e) {}
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var n = normalize(list[i]);
      if (n && out.indexOf(n) < 0) out.push(n);
    }
    return out;
  }

  function geoLang() {
    try {
      var g = window.TA_GEO || {};
      return normalize(g.lang || '');
    } catch (e) { return ''; }
  }

  function preferRegional(regional, navs) {
    if (!regional) return false;
    if (navs.indexOf(regional) >= 0) return true;
    if (regional === 'ca' && (navs.indexOf('es') >= 0 || !navs.length)) return true;
    if (regional === 'zh-TW') {
      for (var i = 0; i < navs.length; i++) if (navs[i] === 'zh' || navs[i] === 'zh-TW') return true;
    }
    return false;
  }

  function detect() {
    try {
      var stored = localStorage.getItem('ta_lang');
      if (stored) {
        var fromStore = normalize(stored);
        if (fromStore) return fromStore;
      }
    } catch (e) {}
    var navs = allNav();
    var geo = geoLang();
    if (preferRegional(geo, navs)) return geo;
    if (navs[0]) return navs[0];
    var htmlLang = document.documentElement.getAttribute('lang') || '';
    var fromHtml = normalize(htmlLang);
    if (fromHtml) return fromHtml;
    return 'es';
  }

  function nameOf(id) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].id === id) return LANGS[i].native;
    return id;
  }
  function topIds(cur) {
    var out = TOP.slice();
    function pin(id) {
      id = normalize(id);
      if (!id || out.indexOf(id) >= 0) return;
      out.unshift(id);
    }
    pin(cur);
    pin(geoLang());
    return out;
  }
  function restIds(cur) {
    var top = topIds(cur);
    return IDS.filter(function (id) { return top.indexOf(id) < 0; });
  }

  function mountPicker(el) {
    if (!el || !el.getAttribute) return;
    if (!el._taPicker) {
      el.classList.add('lang-picker');
      el.innerHTML = '<button type="button" class="lang-picker-btn" aria-haspopup="listbox" aria-expanded="false"></button><div class="lang-menu" role="listbox"></div>';
      var btn = el.querySelector('.lang-picker-btn');
      var menu = el.querySelector('.lang-menu');
      var expanded = false;
      function close() {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
      function optionHtml(id) {
        var cur = IDS[idx];
        return '<button type="button" class="lang-opt' + (id === cur ? ' active' : '') + '" data-lang="' + id + '" role="option">' +
          '<span class="lang-opt-name">' + nameOf(id) + '</span></button>';
      }
      function paint() {
        var cur = IDS[idx];
        btn.innerHTML = '<span class="lang-opt-name">' + nameOf(cur) + '</span>';
        var html = topIds(cur).map(optionHtml).join('');
        if (expanded) {
          html += '<div class="lang-sep"></div>' + restIds(cur).map(optionHtml).join('');
          html += '<button type="button" class="lang-more" data-more="less">' + t('showLess') + '</button>';
        } else {
          html += '<button type="button" class="lang-more" data-more="more">' + t('showMore') + '</button>';
        }
        menu.innerHTML = html;
      }
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var open = !menu.classList.contains('open');
        document.querySelectorAll('.lang-menu.open').forEach(function (m) { if (m !== menu) m.classList.remove('open'); });
        menu.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) paint();
      });
      menu.addEventListener('click', function (e) {
        e.stopPropagation();
        var more = e.target.closest('[data-more]');
        if (more) {
          expanded = more.getAttribute('data-more') === 'more';
          paint();
          return;
        }
        var opt = e.target.closest('[data-lang]');
        if (!opt) return;
        setLang(opt.getAttribute('data-lang'));
        expanded = false;
        close();
        paint();
      });
      document.addEventListener('click', function (e) {
        if (!el.contains(e.target)) close();
      });
      el._taPicker = { paint: paint, close: close };
    }
    el._taPicker.paint();
  }

  var idx = 0;
  function t(k) {
    if (PACK[k] != null && PACK[k] !== '') return PACK[k];
    return k;
  }

  function setLang(code) {
    var n = normalize(code) || code;
    var i = IDS.indexOf(n);
    if (i < 0 || n === IDS[idx]) return;
    try { localStorage.setItem('ta_lang', n); } catch (e) {}
    document.cookie = 'ta_lang=' + n + ';path=/;max-age=31536000;SameSite=Lax';
    
    var path = window.location.pathname;
    var parts = path.split('/');
    if (parts[1]) {
      var currentPrefix = normalize(parts[1]);
      if (currentPrefix && IDS.indexOf(currentPrefix) >= 0) {
        parts[1] = n;
        window.location.href = parts.join('/') + window.location.search + window.location.hash;
        return;
      }
    }
    window.location.reload();
  }

  var lang = detect();
  idx = IDS.indexOf(lang);
  if (idx < 0) { lang = 'es'; idx = 0; }
  document.documentElement.lang = lang === 'zh-TW' ? 'zh-Hant' : lang;
  document.documentElement.dir = LANGS[idx].rtl ? 'rtl' : 'ltr';

  window.TA = {
    CODES: IDS,
    NAMES: LANGS.map(function (l) { return l.native; }),
    LANGS: LANGS,
    TOP: ${JSON.stringify(TOP10)},
    lang: function () { return IDS[idx]; },
    t: t,
    setLang: setLang,
    mountPicker: mountPicker,
    PACK: PACK
  };
})();
`
fs.mkdirSync(path.join(root, 'public', 'assets', 'i18n'), { recursive: true })
for (const id of Object.keys(packs)) {
  fs.writeFileSync(path.join(root, 'public', 'assets', 'i18n', id + '.js'), 'window.TA_PACK=' + JSON.stringify(packs[id]) + ';')
}
fs.writeFileSync(path.join(root, 'public', 'assets', 'i18n.js'), runtime)
const catalog = `export const LANGS = ${JSON.stringify(LANGS, null, 2)} as const
export type Lang = (typeof LANGS)[number]['id']
export const LANG_IDS = LANGS.map((l) => l.id)
export const TOP_LANGS = ${JSON.stringify(TOP10)} as const
export const REPLY_LANG: Record<string, string> = ${JSON.stringify(REPLY, null, 2)}
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
`
fs.writeFileSync(path.join(root, 'web', 'src', 'lib', 'lang-catalog.ts'), catalog)
console.log('Wrote public/assets/i18n.js (' + runtime.length + ' chars, ' + LANGS.length + ' langs, ' + keys.length + ' keys)')
console.log('Wrote web/src/lib/lang-catalog.ts')
