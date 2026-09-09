const TICKET_TTL = 900;
const MAIL_PER_HOUR = 5;

function ipKey(ip) {
  return String(ip || 'anon').replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 64);
}

export function honeypotFilled(body) {
  if (!body || typeof body !== 'object') return false;
  const trap = body.website || body.company_url || body.hp || body.url_hp;
  return !!(trap && String(trap).trim());
}

export async function rateMail(env, ip, max = MAIL_PER_HOUR) {
  if (!env?.BOT_MEMORY) return { ok: true, remaining: max };
  const hour = new Date().toISOString().slice(0, 13);
  const key = 'mail_rate_' + ipKey(ip) + '_' + hour;
  const n = parseInt(await env.BOT_MEMORY.get(key), 10) || 0;
  if (n >= max) return { ok: false, remaining: 0 };
  await env.BOT_MEMORY.put(key, String(n + 1), { expirationTtl: 3600 });
  return { ok: true, remaining: max - n - 1 };
}

export async function issueMailTicket(env, payload, ip) {
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 22);
  const rec = {
    id,
    ip: ipKey(ip),
    createdAt: Date.now(),
    payload
  };
  if (env?.BOT_MEMORY) {
    await env.BOT_MEMORY.put('mail_ticket_' + id, JSON.stringify(rec), { expirationTtl: TICKET_TTL });
  }
  return id;
}

export async function consumeMailTicket(env, id, ip) {
  const ticketId = String(id || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
  if (!ticketId || !env?.BOT_MEMORY) return { ok: false, error: 'Ticket no válido' };
  const raw = await env.BOT_MEMORY.get('mail_ticket_' + ticketId);
  if (!raw) return { ok: false, error: 'Confirma de nuevo: el paso anterior caducó.' };
  let rec;
  try { rec = JSON.parse(raw); } catch (e) { rec = null; }
  await env.BOT_MEMORY.delete('mail_ticket_' + ticketId);
  if (!rec || !rec.payload) return { ok: false, error: 'Ticket no válido' };
  if (Date.now() - (rec.createdAt || 0) < 400) {
    return { ok: false, error: 'Demasiado rápido. Haz clic otra vez.' };
  }
  const sameIp = rec.ip && rec.ip === ipKey(ip);
  if (!sameIp && rec.ip && rec.ip !== 'anon') {
    return { ok: false, error: 'Confirma desde el mismo navegador.' };
  }
  return { ok: true, payload: rec.payload };
}
