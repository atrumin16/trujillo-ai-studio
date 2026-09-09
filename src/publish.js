export const ARTIFACT_ORIGIN = 'https://ai.trujillomingorance.com';
export const GUIDES_ORIGIN = 'https://guides.trujillomingorance.com';
export const OWNER_HANDLE = 'atrumin16';

export function normalizeDest(d) {
  const v = String(d || '').toLowerCase().trim();
  return v === 'guide' || v === 'guides' ? 'guide' : 'artifact';
}

export function slugifyHandle(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^@+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '')
    .slice(0, 24);
}

export function slugifySlug(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function suggestedHandle(user, isOwner) {
  const existing = slugifyHandle(user && user.handle);
  if (existing.length >= 2) return existing;
  const email = String((user && user.email) || '').toLowerCase();
  if (isOwner || email === 'alberto@trujillomingorance.com' || email === 'atrumin16@gmail.com' || email === 'atrumin16@x.com') {
    return OWNER_HANDLE;
  }
  if (user && user.provider === 'x' && user.xId) {
    const h = slugifyHandle(user.xId);
    if (h.length >= 2) return h;
  }
  const local = slugifyHandle(email.split('@')[0]);
  if (local.length >= 2) return local;
  const fromName = slugifyHandle(user && user.name);
  if (fromName.length >= 2) return fromName;
  return 'user';
}

export function recordKey(dest, handle, slug) {
  return (dest === 'guide' ? 'guide:' : 'art:') + handle + ':' + slug;
}

export function userIndexKey(dest, handle) {
  return (dest === 'guide' ? 'guide:index:' : 'art:index:') + handle;
}

export function publicIndexKey(dest) {
  return dest === 'guide' ? 'guide:public' : 'art:public';
}

export const LIBRARY_PREFIX = '/library';
export const TITLE_MAX = 72;

export function clampTitle(value) {
  const s = String(value || '').replace(/\s+/g, ' ').trim();
  if (s.length <= TITLE_MAX) return s;
  const cut = s.slice(0, TITLE_MAX);
  const sp = cut.lastIndexOf(' ');
  return (sp >= 36 ? cut.slice(0, sp) : cut).replace(/[–—:,.-]+$/, '').trim();
}

export function publicUrl(dest, handle, slug) {
  if (dest === 'guide') return GUIDES_ORIGIN + '/u/@' + handle + '/' + slug;
  return ARTIFACT_ORIGIN + LIBRARY_PREFIX + '/@' + handle + '/' + slug;
}

export function authorBoardUrl(dest, handle) {
  if (dest === 'guide') return GUIDES_ORIGIN + '/u/@' + handle;
  return ARTIFACT_ORIGIN + LIBRARY_PREFIX + '/@' + handle;
}

export function letterAvatarDataUri(name, handle) {
  const letter = String(name || handle || '?').replace(/^@/, '').slice(0, 1).toUpperCase() || '?';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#0b1220"/><text x="32" y="42" text-anchor="middle" font-family="Inter,ui-sans-serif,sans-serif" font-size="28" font-weight="700" fill="#e2e8f0">${letter}</text></svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export function resolvePicture(user, handle, origin) {
  const pic = String((user && user.picture) || '').trim();
  if (/^https:\/\//i.test(pic) || pic.startsWith('data:')) return pic;
  const email = String((user && user.email) || '').toLowerCase();
  const host = origin || ARTIFACT_ORIGIN;
  if (handle === OWNER_HANDLE || email === 'alberto@trujillomingorance.com' || email === 'atrumin16@gmail.com') {
    return host + '/avatar.png';
  }
  return letterAvatarDataUri(user && user.name, handle);
}

export function ownsRecord(user, record) {
  if (!user || !record) return false;
  const email = String(user.email || '').toLowerCase();
  const uid = String(user.id || '').toLowerCase();
  const author = String(record.author || '').toLowerCase();
  const authorId = String(record.authorId || '').toLowerCase();
  const recHandle = String(record.handle || '').toLowerCase();
  const myHandle = String(user.handle || '').toLowerCase();
  if (authorId && uid && authorId === uid) return true;
  if (author && email && author === email) return true;
  if (author && uid && author === uid) return true;
  if (recHandle && myHandle && recHandle === myHandle) return true;
  return false;
}

export function indexItem(record) {
  return {
    slug: record.slug,
    title: record.title,
    lang: record.lang || 'markdown',
    dest: record.dest || 'artifact',
    handle: record.handle || '',
    author: record.author || '',
    authorId: record.authorId || '',
    authorName: record.authorName || '',
    authorPicture: record.authorPicture || '',
    updatedAt: record.updatedAt || Date.now()
  };
}

export function sanitizeHttpUrl(value) {
  try {
    const u = new URL(String(value || '').trim());
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
    u.protocol = 'https:';
    return u.toString().slice(0, 500);
  } catch (e) {
    return '';
  }
}

function asList(v) {
  return Array.isArray(v) ? v : [];
}

export function normalizeExtras(raw) {
  const src = raw && typeof raw === 'object' ? raw : {};
  const sources = asList(src.sources).slice(0, 12).map(function (it) {
    const url = sanitizeHttpUrl(it && (it.url || it.href));
    const title = clampTitle((it && (it.title || it.label)) || url);
    if (!url) return null;
    return { title: title || url, url };
  }).filter(Boolean);
  const resources = asList(src.resources).slice(0, 12).map(function (it) {
    const url = sanitizeHttpUrl(it && (it.url || it.href));
    const title = clampTitle((it && (it.title || it.label)) || url);
    const note = String((it && (it.note || it.text)) || '').trim().slice(0, 160);
    if (!url && !title) return null;
    return { title: title || url || 'Recurso', url: url || '', note };
  }).filter(Boolean);
  const widgets = asList(src.widgets).slice(0, 8).map(function (it) {
    const type = String((it && it.type) || '').toLowerCase();
    if (type === 'quote' || type === 'chart') {
      const symbol = String((it && (it.symbol || it.ticker)) || '').toUpperCase().replace(/[^A-Z0-9.=^-]/g, '').slice(0, 12);
      if (!symbol) return null;
      return { type: type === 'chart' ? 'chart' : 'quote', symbol, label: clampTitle((it && it.label) || symbol) };
    }
    if (type === 'link') {
      const url = sanitizeHttpUrl(it && it.url);
      if (!url) return null;
      return { type: 'link', url, label: clampTitle((it && (it.label || it.title)) || url) };
    }
    if (type === 'note') {
      const text = String((it && (it.text || it.note)) || '').trim().slice(0, 280);
      if (!text) return null;
      return { type: 'note', text };
    }
    if (type === 'embed') {
      const url = sanitizeHttpUrl(it && it.url);
      if (!url) return null;
      return { type: 'embed', url, label: clampTitle((it && it.label) || '') };
    }
    return null;
  }).filter(Boolean);
  return { sources, resources, widgets };
}

export function parsePubPath(pathname) {
  const raw = String(pathname || '').replace(/\/+$/, '') || '/';
  if (raw === '/library' || raw === '/artifact') return { kind: 'global', prefix: raw === '/library' ? LIBRARY_PREFIX : '/artifact' };
  let rest = '';
  let prefix = '';
  if (raw.startsWith('/library/')) {
    prefix = LIBRARY_PREFIX;
    rest = raw.slice('/library/'.length);
  } else if (raw.startsWith('/artifact/')) {
    prefix = '/artifact';
    rest = raw.slice('/artifact/'.length);
  } else {
    return null;
  }
  return parseArtifactPath('/artifact/' + rest, prefix);
}

export function parseArtifactPath(pathname, prefix) {
  const base = String(pathname || '').replace(/\/+$/, '') || '/';
  const pref = prefix || '/artifact';
  if (base === '/artifact') return { kind: 'global', prefix: pref };
  if (!base.startsWith('/artifact/')) return null;
  const parts = base.slice('/artifact/'.length).split('/').filter(Boolean);
  if (!parts.length) return { kind: 'global' };
  if (parts[0].startsWith('@')) {
    const handle = slugifyHandle(parts[0]);
    if (!handle) return { kind: 'missing', prefix: pref };
    if (parts[1]) {
      const slug = slugifySlug(parts[1]);
      return slug ? { kind: 'item', handle, slug, prefix: pref } : { kind: 'missing', prefix: pref };
    }
    return { kind: 'author', handle, prefix: pref };
  }
  if (parts.length >= 2) {
    const handle = slugifyHandle(parts[0]);
    const slug = slugifySlug(parts[1]);
    if (handle && slug) return { kind: 'item', handle, slug, prefix: pref };
  }
  const slug = slugifySlug(parts[0]);
  return slug ? { kind: 'legacy', slug, prefix: pref } : { kind: 'missing', prefix: pref };
}

export async function readJsonArray(kv, key) {
  if (!kv) return [];
  const raw = await kv.get(key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export async function writeJson(kv, key, value) {
  if (!kv) return;
  await kv.put(key, JSON.stringify(value));
}
