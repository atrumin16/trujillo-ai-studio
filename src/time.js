// Real-time system clock and temporal context helper for Trujillo AI
// Provides accurate date, time, timezone, and explicit temporal directives to LLMs

export function resolveTimezone(tz) {
  const candidate = String(tz || '').trim()
  if (!candidate || candidate === 'auto') return 'Europe/Madrid'
  try {
    Intl.DateTimeFormat(undefined, { timeZone: candidate })
    return candidate
  } catch {
    return 'Europe/Madrid'
  }
}

export function getTimeOfDay(hour) {
  if (hour >= 5 && hour < 12) return 'Mañana'
  if (hour >= 12 && hour < 15) return 'Mediodía'
  if (hour >= 15 && hour < 21) return 'Tarde'
  if (hour >= 21 && hour <= 23) return 'Noche'
  return 'Madrugada'
}

export function getUtcOffsetString(date, timeZone) {
  try {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'longOffset',
      hour: 'numeric'
    })
    const parts = dtf.formatToParts(date)
    const tzPart = parts.find((p) => p.type === 'timeZoneName')
    if (tzPart && tzPart.value) {
      return tzPart.value.replace('GMT', 'UTC')
    }
  } catch {}
  return 'UTC+02:00'
}


export function formatSpanishDateHuman(date, tz = 'Europe/Madrid') {
  const d = date instanceof Date && !isNaN(date.getTime()) ? date : new Date(date);
  try {
    const raw = new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: tz
    }).format(d);
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

export function formatSpanishShortDate(date, tz = 'Europe/Madrid') {
  const d = date instanceof Date && !isNaN(date.getTime()) ? date : new Date(date);
  try {
    const weekday = new Intl.DateTimeFormat('es-ES', { weekday: 'short', timeZone: tz }).format(d);
    const day = new Intl.DateTimeFormat('es-ES', { day: 'numeric', timeZone: tz }).format(d);
    const month = new Intl.DateTimeFormat('es-ES', { month: 'short', timeZone: tz }).format(d);
    const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1).replace('.', '') : '');
    return `${cap(weekday)} ${day} ${cap(month)}`;
  } catch {
    return d.toISOString().slice(5, 10);
  }
}

export function formatMadridTime(date, tz = 'Europe/Madrid', includeSeconds = false) {
  const d = date instanceof Date && !isNaN(date.getTime()) ? date : new Date(date);
  try {
    const t = new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      ...(includeSeconds ? { second: '2-digit' } : {}),
      hour12: false,
      timeZone: tz
    }).format(d);
    return `${t} h`;
  } catch {
    return d.toISOString().slice(11, 16) + ' h';
  }
}

export function formatRelativeHuman(date, tz = 'Europe/Madrid', baseDate = new Date()) {
  const d = date instanceof Date && !isNaN(date.getTime()) ? date : new Date(date);
  const now = baseDate instanceof Date && !isNaN(baseDate.getTime()) ? baseDate : new Date();

  try {
    const dDay = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(d);
    const nowDay = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(now);
    const yDate = new Date(now.getTime() - 24 * 3600 * 1000);
    const yDay = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(yDate);
    const timeStr = formatMadridTime(d, tz, false);

    if (dDay === nowDay) {
      return `Hoy a las ${timeStr}`;
    } else if (dDay === yDay) {
      return `Ayer a las ${timeStr}`;
    } else {
      return `${formatSpanishShortDate(d, tz)}, ${timeStr}`;
    }
  } catch {
    return d.toISOString().slice(0, 16).replace('T', ' ');
  }
}

export function getRealtimeSystemTimeContext({ timezone, locale = 'es', now = new Date() } = {}) {
  const tz = resolveTimezone(timezone);
  const d = now instanceof Date && !isNaN(now.getTime()) ? now : new Date();
  const dateLocale = locale && String(locale).startsWith('en') ? 'en-US' : 'es-ES';

  let formattedDate = '';
  let formattedTime = '';
  let hour = d.getUTCHours();

  try {
    formattedDate = new Intl.DateTimeFormat(dateLocale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: tz
    }).format(d);

    formattedTime = new Intl.DateTimeFormat(dateLocale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: tz
    }).format(d);

    const hourPart = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: tz
    }).format(d);
    hour = parseInt(hourPart, 10) || 0;
  } catch {
    formattedDate = d.toISOString().slice(0, 10);
    formattedTime = d.toISOString().slice(11, 19);
  }

  const offsetStr = getUtcOffsetString(d, tz);
  const timeOfDay = getTimeOfDay(hour);
  const isoString = d.toISOString();
  const currentYear = d.getUTCFullYear();
  const humanFullDate = formatSpanishDateHuman(d, tz);

  const systemPromptBlock = `=== CONTEXTO TEMPORAL Y HORA EXACTA DEL SISTEMA EN TIEMPO REAL ===
- Fecha actual: ${humanFullDate} (${currentYear})
- Hora exacta actual: ${formattedTime} (Formato 24h)
- Zona horaria de referencia: ${tz} (${offsetStr})
- Franja horaria / Momento del día: ${timeOfDay}
- Timestamp ISO 8601 UTC: ${isoString}

DIRECTIVAS TEMPORALES OBLIGATORIAS:
1. ACCESO DIRECTO Y TOTAL: Tienes acceso pleno y verificado al reloj del sistema en tiempo real. NUNCA digas que no sabes la hora o que tu corte de conocimiento te impide saber la fecha actual.
2. COMUNICACIÓN HUMANA Y NATURAL (FUNDAMENTAL): Cuando el usuario te pregunte qué fecha es hoy, qué hora es o cualquier duda temporal, responde SIEMPRE en lenguaje humano, natural, elegante y perfectamente comprensible en español.
   Ejemplo obligatorio de respuesta:
   "Hoy es ${humanFullDate}, y son las ${formattedTime.slice(0, 5)} h (hora peninsular española / Madrid)."
3. PROHIBIDO volcados crudos de bases de datos: NO respondas con cadenas como "2026-09-06" o "2026-09-06 13:01:12 (UTC+02:00)" a secas. Menciona con claridad el día de la semana (Lunes, Domingo...), el día del mes, el nombre del mes y la hora en formato 24h amigable.
4. Si el usuario pide cálculos (ej. cuántos días quedan para fin de mes o para cierta fecha), calcúlalos a partir de la fecha exacta actual: ${humanFullDate}.`;

  return {
    now: d,
    timezone: tz,
    offsetStr,
    formattedDate,
    formattedTime,
    timeOfDay,
    isoString,
    currentYear,
    humanFullDate,
    systemPromptBlock
  };
}
