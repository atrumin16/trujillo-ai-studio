import {
  formatSpanishDateHuman,
  formatSpanishShortDate,
  formatMadridTime,
  formatRelativeHuman
} from './time.js';

const OWNER_INBOX = 'alberto@trujillomingorance.com'
const OPS_TTL = 14 * 24 * 3600
const IDEA_MAX = 4000
const IDEA_MIN = 8
const VISION_MODELS = [
  'qwen/qwen3.6-27b',
  'qwen/qwen3.8-27b'
]
const FAST_TEXT_MODEL = 'openai/gpt-oss-20b'
const WHISPER_MODEL = 'whisper-large-v3-turbo'

export { OWNER_INBOX, VISION_MODELS, FAST_TEXT_MODEL, WHISPER_MODEL }

export function utcDay(offset = 0) {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + offset)
  return d.toISOString().slice(0, 10)
}

function emptyOps() {
  return {
    chats: 0,
    images: 0,
    vision: 0,
    transcribe: 0,
    ideas: 0,
    errors: 0,
    groqCalls: 0,
    groqFail: 0
  }
}

export async function readOps(env, day = utcDay()) {
  if (!env?.BOT_MEMORY) return emptyOps()
  try {
    const raw = await env.BOT_MEMORY.get(`ops_${day}`)
    if (!raw) return emptyOps()
    const parsed = JSON.parse(raw)
    return { ...emptyOps(), ...parsed }
  } catch {
    return emptyOps()
  }
}

export async function bumpOps(env, field, n = 1) {
  if (!env?.BOT_MEMORY || !field) return
  const day = utcDay()
  const key = `ops_${day}`
  const cur = await readOps(env, day)
  cur[field] = (Number(cur[field]) || 0) + n
  cur.updatedAt = Date.now()
  await env.BOT_MEMORY.put(key, JSON.stringify(cur), { expirationTtl: OPS_TTL })
}

export function normalizeModel(model) {
  if (!model) return 'openai/gpt-oss-120b';
  const m = String(model).trim();
  if (m === 'llama-3.2-11b-vision-preview' || m === 'llama-3.2-90b-vision-preview' || m.includes('vision-preview')) {
    return 'qwen/qwen3.6-27b';
  }
  if (m === 'llama-3.1-70b-versatile' || m === 'llama-3.3-70b-versatile') {
    return 'openai/gpt-oss-120b';
  }
  if (m.startsWith('llama-3.2-') && m.includes('preview')) {
    return 'openai/gpt-oss-20b';
  }
  return m;
}

export function groqLadder(requested, { vision = false, skipFallback = false } = {}) {
  if (vision) return VISION_MODELS.slice()
  const req = normalizeModel(requested)
  if (skipFallback) return [req]
  const mid = req === 'openai/gpt-oss-20b' ? 'openai/gpt-oss-120b' : 'openai/gpt-oss-20b'
  return [req, mid, FAST_TEXT_MODEL].filter((m, i, arr) => m && arr.indexOf(m) === i)
}

export function shouldRetryGroq(status) {
  return status === 429 || status === 404 || status === 400 || status >= 500
}

export function parseDataImage(image) {
  if (!image || typeof image !== 'object') return null
  let mime = String(image.mime || image.type || '').toLowerCase()
  let data = String(image.data || image.b64 || '')
  const url = String(image.url || image.dataUrl || '')
  if (url.startsWith('data:')) {
    const m = url.match(/^data:(image\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/i)
    if (!m) return null
    mime = m[1].toLowerCase()
    data = m[2].replace(/\s/g, '')
  }
  if (!data) return null
  if (!/^image\/(jpeg|jpg|png|webp|gif)$/.test(mime)) mime = 'image/jpeg'
  if (data.length > 4_000_000) return null
  return { mime, data, dataUrl: `data:${mime};base64,${data}` }
}

export async function readIdeas(env, day = utcDay()) {
  if (!env?.BOT_MEMORY) return []
  try {
    const raw = await env.BOT_MEMORY.get(`ideas_${day}`)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

async function writeIdeas(env, day, list) {
  await env.BOT_MEMORY.put(`ideas_${day}`, JSON.stringify(list.slice(-200)), { expirationTtl: OPS_TTL })
}

export function ideaRateKey(ip) {
  return `idea_rate_${String(ip || 'anon').replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 64)}_${utcDay()}`
}

export async function handleIdeaPost({ body, ip, env, sendEmail }) {
  const text = String(body?.idea || body?.text || '').trim().slice(0, IDEA_MAX)
  const email = String(body?.email || '').trim().slice(0, 120)
  const name = String(body?.name || '').trim().slice(0, 80)
  const cat = ['feat', 'fix', 'other'].includes(body?.cat) ? body.cat : 'feat'
  if (text.length < IDEA_MIN) {
    return { status: 400, payload: { error: 'too_short', message: 'Escribe al menos 8 caracteres.' } }
  }

  if (env.BOT_MEMORY) {
    const rk = ideaRateKey(ip)
    const n = parseInt(await env.BOT_MEMORY.get(rk), 10) || 0
    if (n >= 8) {
      return { status: 429, payload: { error: 'rate_limited', message: 'Límite de 8 ideas por día. Gracias.' } }
    }
    await env.BOT_MEMORY.put(rk, String(n + 1), { expirationTtl: 86400 })
  }

  const day = utcDay()
  const item = {
    id: 'idea_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12),
    text,
    email,
    name,
    cat,
    ip: String(ip || '').slice(0, 64),
    at: Date.now()
  }
  if (env.BOT_MEMORY) {
    const list = await readIdeas(env, day)
    list.push(item)
    await writeIdeas(env, day, list)
  }
  await bumpOps(env, 'ideas', 1)

  const catLabel = cat === 'fix' ? 'Corrección' : cat === 'other' ? 'Propuesta' : 'Nueva Función'
  const isFix = cat === 'fix'
  const isFeat = cat === 'feat'
  const catTag = isFix ? 'CORRECCIÓN' : isFeat ? 'FUNCIÓN' : 'PROPUESTA'
  const relativeTime = formatRelativeHuman(item.at, 'Europe/Madrid')

  const fromLine = [name, email].filter(Boolean).join(' · ') || 'Anónimo'
  const whoDisplay = name && email
    ? `<span style="color:#ffffff;font-weight:600;">${esc(name)}</span> <span style="color:#71717a;font-size:12px;">(${esc(email)})</span>`
    : `<span style="color:#ffffff;font-weight:600;">${esc(name || email || 'Usuario Anónimo')}</span>`

  const html = `
<div style="background:#09090b;border:1px solid #1f1f23;border-radius:8px;padding:22px 24px;margin-bottom:18px;">
  <div style="margin-bottom:14px;border-bottom:1px solid #18181b;padding-bottom:12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td valign="middle">
          <span style="display:inline-block;padding:3px 8px;background:#18181b;border:1px solid #27272a;border-radius:9999px;color:#e4e4e7;font-family:ui-monospace,monospace;font-size:10px;font-weight:700;letter-spacing:0.06em;">${esc(catTag)}</span>
          <span style="margin-left:10px;font-size:13px;">${whoDisplay}</span>
        </td>
        <td align="right" valign="middle" style="font-family:ui-monospace,monospace;font-size:11px;color:#71717a;">
          ${esc(relativeTime)}
        </td>
      </tr>
    </table>
  </div>
  <div style="font-size:14px;line-height:1.7;color:#f4f4f5;white-space:pre-wrap;">${esc(text)}</div>
  <div style="margin-top:16px;padding-top:12px;border-top:1px solid #141416;font-family:ui-monospace,monospace;font-size:11px;color:#52525b;">
    Ticket ID: ${esc(item.id)}
  </div>
</div>`

  if (typeof sendEmail === 'function') {
    await sendEmail({
      to: OWNER_INBOX,
      subject: `[Trujillo AI] Idea (${catLabel}): ${text.slice(0, 60)}`,
      heading: 'Nueva Idea de Usuario',
      text: `${catLabel}\n${fromLine}\n${relativeTime}\n\n${text}\n\nID: ${item.id}`,
      html,
      tag: 'idea'
    })
  }

  return { status: 200, payload: { ok: true, id: item.id } }
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function handleTranscribePost({ request, env, groqApiKey, locale }) {
  if (!groqApiKey) return { status: 503, payload: { error: 'engine_unconfigured' } }
  const ct = request.headers.get('content-type') || ''
  let blob
  let filename = 'voice.webm'
  if (ct.includes('multipart/form-data')) {
    const form = await request.formData()
    const file = form.get('file') || form.get('audio')
    if (!file || typeof file.arrayBuffer !== 'function') {
      return { status: 400, payload: { error: 'missing_audio' } }
    }
    blob = file
    filename = file.name || filename
  } else {
    const body = await request.json().catch(() => ({}))
    const b64 = String(body.audio || body.data || '')
    if (!b64) return { status: 400, payload: { error: 'missing_audio' } }
    const raw = Uint8Array.from(atob(b64.replace(/^data:[^;]+;base64,/, '')), (c) => c.charCodeAt(0))
    if (raw.byteLength > 4_000_000) return { status: 413, payload: { error: 'too_large' } }
    blob = new Blob([raw], { type: body.mime || 'audio/webm' })
  }

  const fd = new FormData()
  fd.append('file', blob, filename)
  fd.append('model', WHISPER_MODEL)
  fd.append('response_format', 'json')
  const lang = String(locale || '').slice(0, 2)
  if (lang && lang !== 'zh') fd.append('language', lang === 'nb' ? 'no' : lang)

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${groqApiKey}` },
    body: fd
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    await bumpOps(env, 'errors', 1)
    return { status: res.status === 429 ? 429 : 502, payload: { error: data?.error?.message || 'transcribe_failed' } }
  }
  await bumpOps(env, 'transcribe', 1)
  await bumpOps(env, 'groqCalls', 1)
  return { status: 200, payload: { ok: true, text: String(data.text || '').trim() } }
}

export async function collectReport(env) {
  const today = utcDay(0)
  const yesterday = utcDay(-1)
  const [tStats, yStats, tIdeas, yIdeas] = await Promise.all([
    readOps(env, today),
    readOps(env, yesterday),
    readIdeas(env, today),
    readIdeas(env, yesterday)
  ])
  const ideas = [...yIdeas, ...tIdeas].slice(-20)
  return { today, yesterday, tStats, yStats, ideas }
}

export function formatOpsReport({ today, yesterday, tStats, yStats, ideas }) {
  const isHealthy = (tStats.errors === 0 && tStats.groqFail === 0)
  const healthBadge = isHealthy
    ? `<span style="display:inline-block;padding:3px 8px;background:#000000;border:1px solid #22c55e;border-radius:4px;color:#22c55e;font-family:ui-monospace,monospace;font-size:10px;font-weight:700;letter-spacing:0.06em;">[ 100% OPERATIVO ]</span>`
    : `<span style="display:inline-block;padding:3px 8px;background:#000000;border:1px solid #f59e0b;border-radius:4px;color:#f59e0b;font-family:ui-monospace,monospace;font-size:10px;font-weight:700;letter-spacing:0.06em;">[ ALERTA EN TELEMETRÍA ]</span>`

  const yDate = new Date(`${yesterday}T12:00:00Z`)
  const tDate = new Date(`${today}T12:00:00Z`)
  const yFull = formatSpanishDateHuman(yDate, 'Europe/Madrid')
  const tFull = formatSpanishDateHuman(tDate, 'Europe/Madrid')
  const yShort = formatSpanishShortDate(yDate, 'Europe/Madrid')
  const tShort = formatSpanishShortDate(tDate, 'Europe/Madrid')

  const kpiCard = (title, mainVal, subVal, accentColor = '#ffffff') => `
    <td width="50%" valign="top" style="padding:4px;">
      <div style="background:#050505;border:1px solid #1f1f1f;border-radius:6px;padding:14px 16px;">
        <div style="font-family:ui-monospace,monospace;font-size:10px;font-weight:700;color:#71717a;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:6px;">${esc(title)}</div>
        <div style="font-family:ui-monospace,monospace;font-size:26px;font-weight:700;color:#ffffff;line-height:1;margin-bottom:4px;letter-spacing:-0.03em;">
          ${mainVal}
        </div>
        <div style="font-size:11px;font-family:ui-monospace,monospace;color:${accentColor};">${subVal}</div>
      </div>
    </td>`

  const row = (label, y, t) => {
    const isErrorRow = label.includes('Errores') || label.includes('Fallos')
    const isZeroErrors = isErrorRow && t === 0
    const statusPill = isZeroErrors
      ? `<span style="color:#22c55e;font-family:ui-monospace,monospace;font-size:11px;font-weight:700;">[ 0 OK ]</span>`
      : (t > 0 && isErrorRow)
      ? `<span style="color:#ef4444;font-family:ui-monospace,monospace;font-size:11px;font-weight:700;">[ ${t} ALERTA ]</span>`
      : `<span style="color:#71717a;font-family:ui-monospace,monospace;font-size:11px;">${t}</span>`

    return `<tr style="border-bottom:1px solid #141414;">
      <td style="padding:10px 14px;color:#d4d4d8;font-size:12px;font-weight:500;">${label}</td>
      <td style="padding:10px 14px;color:#a1a1aa;font-family:ui-monospace,monospace;font-size:12px;text-align:right;">${y}</td>
      <td style="padding:10px 14px;color:#ffffff;font-family:ui-monospace,monospace;font-size:12px;font-weight:600;text-align:right;">${t}</td>
      <td style="padding:10px 14px;text-align:right;">${statusPill}</td>
    </tr>`
  }

  const ideaCards = ideas.length
    ? ideas.map((i) => {
        const who = [i.name, i.email].filter(Boolean).join(' · ') || 'Anónimo'
        const isFix = i.cat === 'fix'
        const isFeat = i.cat === 'feat'
        const badgeLabel = isFix ? 'CORRECCIÓN' : isFeat ? 'NUEVA FUNCIÓN' : 'PROPUESTA'
        const relativeTime = formatRelativeHuman(i.at, 'Europe/Madrid')

        return `
        <div style="margin-bottom:10px;background:#050505;border:1px solid #1f1f1f;border-radius:6px;padding:14px 16px;">
          <div style="margin-bottom:8px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td valign="middle">
                  <span style="display:inline-block;padding:2px 6px;background:#000000;border:1px solid #333333;border-radius:4px;color:#ffffff;font-family:ui-monospace,monospace;font-size:10px;font-weight:700;letter-spacing:0.04em;">[ ${badgeLabel} ]</span>
                  <span style="margin-left:8px;font-size:12px;font-weight:600;color:#ffffff;">${esc(who)}</span>
                </td>
                <td align="right" valign="middle" style="font-family:ui-monospace,monospace;font-size:11px;color:#71717a;">
                  ${esc(relativeTime)}
                </td>
              </tr>
            </table>
          </div>
          <div style="font-family:ui-monospace,monospace;font-size:13px;line-height:1.6;color:#e4e4e7;white-space:pre-wrap;background:#000000;border:1px solid #141414;border-radius:4px;padding:12px 14px;margin-top:6px;">${esc(i.text)}</div>
        </div>`
      }).join('')
    : `<div style="background:#050505;border:1px dashed #222222;border-radius:6px;padding:20px;text-align:center;font-family:ui-monospace,monospace;color:#71717a;font-size:12px;">Sin sugerencias recibidas en las últimas 48 horas.</div>`

  const html = `
<div style="margin-bottom:20px;border-bottom:1px solid #1f1f1f;padding-bottom:14px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td valign="middle">
        <div style="font-family:ui-monospace,monospace;font-size:10px;font-weight:700;color:#71717a;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:3px;">TELEMETRÍA Y OPERACIONES</div>
        <div style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.03em;">${yFull}</div>
      </td>
      <td align="right" valign="middle">
        ${healthBadge}
      </td>
    </tr>
  </table>
</div>

<!-- Quota Banner -->
<div style="margin-bottom:16px;padding:10px 14px;background:#050505;border:1px solid #1f1f1f;border-radius:6px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td valign="middle">
        <div style="font-family:ui-monospace,monospace;font-size:11px;font-weight:600;color:#e4e4e7;">CAPACIDAD OPERATIVA DEL SISTEMA</div>
        <div style="font-size:11px;color:#71717a;margin-top:2px;">Capacidad asignada: <strong>100.000 peticiones/día</strong> (reinicio a las 00:00 UTC)</div>
      </td>
      <td align="right" valign="middle">
        <span style="display:inline-block;padding:2px 8px;background:#000000;border:1px solid #22c55e;border-radius:4px;color:#22c55e;font-family:ui-monospace,monospace;font-size:10px;font-weight:700;">CONSUMO ÓPTIMO</span>
      </td>
    </tr>
  </table>
</div>

<!-- KPI Cards -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
  <tr>
    ${kpiCard('Conversaciones (Chats)', tStats.chats, `Ayer: ${yStats.chats} chats`, '#a1a1aa')}
    ${kpiCard('Inferencia Groq (LPU)', tStats.groqCalls, `Ayer: ${yStats.groqCalls} · Fallos: ${tStats.groqFail}`, tStats.groqFail > 0 ? '#ef4444' : '#22c55e')}
  </tr>
  <tr>
    ${kpiCard('Ideas y Feedback', tStats.ideas, `Ayer: ${yStats.ideas} registradas`, '#a1a1aa')}
    ${kpiCard('Multimedia & Audio', (tStats.images + tStats.vision + tStats.transcribe), `Fotos: ${tStats.images} · Visión: ${tStats.vision} · Voz: ${tStats.transcribe}`, '#a1a1aa')}
  </tr>
</table>

<!-- Tabla Comparativa -->
<div style="margin-bottom:24px;">
  <div style="font-family:ui-monospace,monospace;font-size:11px;font-weight:700;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Desglose Comparativo de Actividad</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#050505;border:1px solid #1f1f1f;border-radius:6px;overflow:hidden;">
    <tr style="background:#0a0a0a;border-bottom:1px solid #1f1f1f;">
      <th align="left" style="padding:10px 14px;color:#71717a;font-family:ui-monospace,monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Métrica</th>
      <th align="right" style="padding:10px 14px;color:#a1a1aa;font-family:ui-monospace,monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Ayer (${esc(yShort)})</th>
      <th align="right" style="padding:10px 14px;color:#ffffff;font-family:ui-monospace,monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Hoy (${esc(tShort)} · parcial)</th>
      <th align="right" style="padding:10px 14px;color:#71717a;font-family:ui-monospace,monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Estado</th>
    </tr>
    ${row('Chats procesados', yStats.chats, tStats.chats)}
    ${row('Imágenes generadas', yStats.images, tStats.images)}
    ${row('Visión (análisis de imagen)', yStats.vision, tStats.vision)}
    ${row('Transcripciones de voz', yStats.transcribe, tStats.transcribe)}
    ${row('Ideas y propuestas de usuario', yStats.ideas, tStats.ideas)}
    ${row('Llamadas al motor Groq', yStats.groqCalls, tStats.groqCalls)}
    ${row('Fallos motor Groq', yStats.groqFail, tStats.groqFail)}
    ${row('Errores generales API', yStats.errors, tStats.errors)}
  </table>
</div>

<!-- Sección de Ideas -->
<div style="margin-bottom:18px;">
  <div style="margin-bottom:10px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td valign="middle">
          <div style="font-family:ui-monospace,monospace;font-size:11px;font-weight:700;color:#71717a;text-transform:uppercase;letter-spacing:0.06em;">Feedback y Sugerencias Recientes</div>
        </td>
        <td align="right" valign="middle">
          <span style="display:inline-block;padding:2px 8px;background:#0a0a0a;border:1px solid #1f1f1f;border-radius:4px;color:#a1a1aa;font-family:ui-monospace,monospace;font-size:10px;font-weight:600;">${ideas.length} registradas</span>
        </td>
      </tr>
    </table>
  </div>
  ${ideaCards}
</div>

<div style="padding-top:12px;border-top:1px solid #1f1f1f;font-family:ui-monospace,monospace;font-size:11px;color:#71717a;text-align:center;">
  ai.trujillomingorance.com &middot; Reporte operativo diario generado a las 07:00 UTC
</div>`

  const text = [
    `Trujillo AI · Informe Operativo (${yFull})`,
    `Estado: ${isHealthy ? '100% Operativo' : 'Atención requerida'}`,
    `Ayer (${yShort}): ${yStats.chats} chats | Hoy (${tShort}): ${tStats.chats} chats`,
    `Llamadas Groq: ${yStats.groqCalls} (ayer) / ${tStats.groqCalls} (hoy parcial) - Fallos: ${tStats.groqFail}`,
    `Imágenes: ${yStats.images} / ${tStats.images}`,
    `Visión: ${yStats.vision} / ${tStats.vision}`,
    `Voz: ${yStats.transcribe} / ${tStats.transcribe}`,
    `Ideas: ${yStats.ideas} / ${tStats.ideas}`,
    `Errores: ${yStats.errors} / ${tStats.errors}`,
    '',
    '--- Ideas Recientes ---',
    ideas.map((i) => `[${i.cat.toUpperCase()}] ${i.name || i.email || 'Anónimo'} (${formatRelativeHuman(i.at, 'Europe/Madrid')}): ${i.text}`).join('\n\n') || 'Sin ideas registradas.'
  ].join('\n')

  return {
    subject: `Trujillo AI · Informe Diario (${yFull})`,
    html,
    text
  }
}

export async function sendDailyOpsReport(env, sendEmail) {
  const data = await collectReport(env)
  const mail = formatOpsReport(data)
  if (typeof sendEmail !== 'function') return { ok: false, error: 'no_mailer' }
  return sendEmail({
    to: OWNER_INBOX,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    tag: 'ops-report'
  })
}
