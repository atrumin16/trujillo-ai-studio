const ORIGIN = 'https://ai.trujillomingorance.com';

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function srcdocEsc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/<\/iframe/gi, '&lt;/iframe');
}

const KIND_ALIASES = {
  html: 'html', htm: 'html', react: 'html', jsx: 'html',
  markdown: 'markdown', md: 'markdown',
  plaintext: 'plaintext', text: 'plaintext', txt: 'plaintext',
  code: 'code',
  javascript: 'javascript', js: 'javascript', ts: 'javascript', typescript: 'javascript',
  python: 'python', py: 'python',
  json: 'json',
  csv: 'csv', tsv: 'csv',
  svg: 'svg',
  mermaid: 'mermaid', mmd: 'mermaid'
};

export function detectKind(lang, content) {
  const l = String(lang || '').toLowerCase().trim();
  if (KIND_ALIASES[l]) return KIND_ALIASES[l];
  const c = String(content || '').trim();
  if (/^<svg[\s>]/i.test(c)) return 'svg';
  if (/^<!doctype html/i.test(c) || /^<html[\s>]/i.test(c)) return 'html';
  if (/^(graph|flowchart|sequenceDiagram|classDiagram|erDiagram|pie |gantt|mindmap)\b/m.test(c)) return 'mermaid';
  if (/^[\[{]/.test(c)) {
    try { JSON.parse(c); return 'json'; } catch (e) {}
  }
  if (/^#\s+/m.test(c) && c.length > 40) return 'markdown';
  return 'code';
}

function prettyJson(text) {
  try { return JSON.stringify(JSON.parse(text), null, 2); } catch (e) { return text; }
}

function csvTable(text) {
  const rows = String(text || '').trim().split(/\r?\n/).filter(Boolean);
  if (!rows.length) return '<p>CSV vacío</p>';
  const parseRow = (line) => line.split(',').map((cell) => esc(cell.trim()));
  const head = parseRow(rows[0]);
  const body = rows.slice(1).map(parseRow);
  let html = '<table class="tbl"><thead><tr>' + head.map((c) => '<th>' + c + '</th>').join('') + '</tr></thead><tbody>';
  body.forEach((r) => { html += '<tr>' + r.map((c) => '<td>' + c + '</td>').join('') + '</tr>'; });
  html += '</tbody></table>';
  return html;
}

function mermaidDoc(src) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{margin:0;background:#080c14;display:flex;justify-content:center;padding:24px}</style>
<script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"><\/script></head>
<body><pre class="mermaid">${esc(src)}</pre>
<script>mermaid.initialize({startOnLoad:true,theme:'dark',securityLevel:'strict'});<\/script></body></html>`;
}

function inlineMd(text) {
  let s = esc(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+)\)/g, '<a href="$2" rel="noopener" target="_blank">$1</a>');
  return s;
}

export function renderMarkdown(md) {
  const src = String(md || '').replace(/\r\n/g, '\n');
  const parts = src.split(/```/);
  let html = '';
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      const nl = parts[i].indexOf('\n');
      const code = nl === -1 ? parts[i] : parts[i].slice(nl + 1);
      html += '<pre><code>' + esc(code.replace(/\n$/, '')) + '</code></pre>';
      continue;
    }
    const lines = parts[i].split('\n');
    let buf = [];
    const flush = () => {
      const t = buf.join(' ').trim();
      buf = [];
      if (t) html += '<p>' + inlineMd(t) + '</p>';
    };
    for (const line of lines) {
      const h = line.match(/^(#{1,3})\s+(.+)$/);
      if (h) {
        flush();
        html += '<h' + h[1].length + '>' + inlineMd(h[2]) + '</h' + h[1].length + '>';
        continue;
      }
      if (/^[-*]\s+/.test(line)) {
        flush();
        html += '<li>' + inlineMd(line.replace(/^[-*]\s+/, '')) + '</li>';
        continue;
      }
      if (!line.trim()) { flush(); continue; }
      buf.push(line.trim());
    }
    flush();
  }
  return html.replace(/(?:<li>[\s\S]*?<\/li>)+/g, (b) => '<ul>' + b + '</ul>');
}

const SHELL_CSS = `
html,body{margin:0;height:100%;background:#080c14;color:#f8fafc;font-family:Inter,ui-sans-serif,system-ui,sans-serif}
body{display:flex;flex-direction:column}
.bar{height:48px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 16px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(8,12,20,.92);backdrop-filter:blur(12px)}
.brand{display:flex;align-items:center;gap:8px;color:#f8fafc;text-decoration:none;font-weight:650;letter-spacing:-.03em;font-size:13px}
.brand img{width:22px;height:22px;border-radius:6px;border:1px solid rgba(255,255,255,.12)}
.bar-title{font-size:13px;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:46vw}
.bar-actions{display:flex;gap:8px;align-items:center}
.btn{background:transparent;border:1px solid rgba(255,255,255,.12);color:#cbd5e1;border-radius:8px;padding:6px 10px;font-size:12px;text-decoration:none;cursor:pointer;font-family:inherit}
.btn:hover{color:#fff;border-color:rgba(255,255,255,.28)}
.poster{flex-shrink:0;display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(12,18,30,.92)}
.by-logo{width:40px;height:40px;border-radius:12px;object-fit:cover;border:1px solid rgba(255,255,255,.14);background:#000;flex-shrink:0}
.by-meta{min-width:0}
.by-name{font-size:14px;font-weight:650;color:#fff;letter-spacing:-.02em}
.by-handle{font-size:12px;color:#7dd3fc;margin-top:2px}
.by-handle a{color:inherit;text-decoration:none}
.by-handle a:hover{text-decoration:underline}
.stage{flex:1;min-height:0;position:relative;background:#080c14}
.frame{position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff}
.doc{max-width:760px;margin:0 auto;padding:36px 24px 80px;line-height:1.7;color:#e2e8f0}
.doc h1,.doc h2,.doc h3{color:#fff;letter-spacing:-.03em;line-height:1.2}
.doc h1{font-size:2rem;margin:0 0 16px}
.doc h2{font-size:1.35rem;margin:28px 0 10px}
.doc p{margin:0 0 14px;color:#cbd5e1}
.doc a{color:#7dd3fc}
.doc ul{margin:0 0 16px 20px}
.doc code{font-family:ui-monospace,Cascadia Code,monospace;font-size:.86em;background:rgba(255,255,255,.06);padding:1px 5px;border-radius:4px}
.doc pre{background:#0c1220;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px 16px;overflow:auto}
.doc pre code{background:none;padding:0}
.tbl{width:100%;border-collapse:collapse;font-size:13px}
.tbl th,.tbl td{border:1px solid rgba(255,255,255,.1);padding:8px 10px;text-align:left}
.tbl th{background:rgba(255,255,255,.04);color:#fff}
.kind{font-size:11px;color:#64748b;border:1px solid rgba(255,255,255,.12);border-radius:999px;padding:3px 8px}
.code{margin:0;height:100%;overflow:auto;padding:24px;font-family:ui-monospace,Cascadia Code,Consolas,monospace;font-size:13px;line-height:1.55;white-space:pre-wrap;color:#e2e8f0}
.svgwrap{height:100%;display:flex;align-items:center;justify-content:center;padding:24px}
.svgwrap svg{max-width:100%;max-height:100%}
.empty{max-width:560px;margin:12vh auto;padding:24px;text-align:center;color:#94a3b8}
.empty h1{color:#fff;font-size:1.6rem;margin:0 0 10px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;padding:28px 20px 60px;max-width:1100px;margin:0 auto;width:100%;box-sizing:border-box}
.card{display:block;text-decoration:none;color:inherit;background:rgba(15,22,36,.78);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px}
.card:hover{border-color:rgba(255,255,255,.18)}
.card h2{margin:0 0 8px;font-size:1rem;color:#fff}
.card p{margin:0;font-size:12px;color:#64748b;font-family:ui-monospace,monospace}
.card-by{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.card-by img{width:22px;height:22px;border-radius:7px;object-fit:cover;border:1px solid rgba(255,255,255,.12)}
.card-by span{font-size:12px;color:#7dd3fc}
`;

function bylineHtml(item) {
  const handle = String((item && item.handle) || '').replace(/^@/, '');
  if (!handle && !(item && item.authorName)) return '';
  const name = (item && item.authorName) || handle;
  const pic = (item && item.authorPicture) || '/avatar.png';
  const dest = (item && item.dest) === 'guide' ? 'Guides' : 'Artifact';
  const board = handle ? `/artifact/@${esc(handle)}` : '/artifact';
  return `<div class="poster">
  <img class="by-logo" src="${esc(pic)}" alt="" width="40" height="40">
  <div class="by-meta">
    <div class="by-name">${esc(name)}</div>
    <div class="by-handle">by ${handle ? `<a href="${board}">@${esc(handle)}</a>` : 'autor'} · ${dest}</div>
  </div>
</div>`;
}

function wrap(title, inner, extraBar, poster) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Artifact · Trujillo AI</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#080c14">
<link rel="icon" href="/avatar.png">
<style>${SHELL_CSS}</style>
</head>
<body>
<header class="bar">
  <a class="brand" href="/"><img src="/avatar.png" alt="" width="22" height="22">Trujillo AI</a>
  <div class="bar-title">${esc(title)}</div>
  <div class="bar-actions">${extraBar || ''}<a class="btn" href="/">Studio</a></div>
</header>
${poster || ''}
${inner}
</body>
</html>`;
}

function itemHref(it) {
  if (it.handle && it.slug) return '/artifact/@' + encodeURIComponent(it.handle) + '/' + encodeURIComponent(it.slug);
  return '/artifact/' + encodeURIComponent(it.slug);
}

export function renderArtifactPage(item) {
  const kind = detectKind(item.lang, item.content);
  const copy = `<span class="kind">${esc(kind)}</span><button class="btn" type="button" id="copy">Copiar enlace</button>
<script>document.getElementById('copy').onclick=function(){navigator.clipboard.writeText(location.href).then(()=>{this.textContent='Copiado';setTimeout(()=>this.textContent='Copiar enlace',1600)})}</script>`;
  const raw = item.content || '';
  let stage = '';
  if (kind === 'html') {
    stage = `<div class="stage"><iframe class="frame" sandbox="allow-scripts allow-forms allow-modals" srcdoc="${srcdocEsc(raw)}"></iframe></div>`;
  } else if (kind === 'svg') {
    stage = `<div class="stage"><div class="svgwrap"><img alt="" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(raw)}"></div></div>`;
  } else if (kind === 'mermaid') {
    stage = `<div class="stage"><iframe class="frame" sandbox="allow-scripts allow-same-origin" srcdoc="${srcdocEsc(mermaidDoc(raw))}"></iframe></div>`;
  } else if (kind === 'markdown') {
    stage = `<div class="stage" style="overflow:auto"><article class="doc">${renderMarkdown(raw)}</article></div>`;
  } else if (kind === 'csv') {
    stage = `<div class="stage" style="overflow:auto"><article class="doc">${csvTable(raw)}</article></div>`;
  } else if (kind === 'json') {
    stage = `<div class="stage"><pre class="code">${esc(prettyJson(raw))}</pre></div>`;
  } else if (kind === 'plaintext') {
    stage = `<div class="stage" style="overflow:auto"><article class="doc"><p style="white-space:pre-wrap">${esc(raw)}</p></article></div>`;
  } else {
    stage = `<div class="stage"><pre class="code">${esc(raw)}</pre></div>`;
  }
  return wrap(item.title || 'Artifact', stage, copy, bylineHtml(item));
}

export function renderArtifactIndex(items, opts) {
  const handle = opts && opts.handle;
  const cards = (items || []).map((it) => {
    const h = it.handle || handle || '';
    const pic = it.authorPicture || '/avatar.png';
    const by = h
      ? `<div class="card-by"><img src="${esc(pic)}" alt=""><span>@${esc(h)}</span></div>`
      : '';
    return `<a class="card" href="${itemHref({ ...it, handle: h })}">${by}<h2>${esc(it.title || it.slug)}</h2><p>${h ? '/artifact/@' + esc(h) + '/' + esc(it.slug) : '/artifact/' + esc(it.slug)}</p></a>`;
  }).join('');
  const heading = handle ? '@' + handle : 'Artifacts';
  const inner = cards
    ? `<div class="grid">${cards}</div>`
    : `<div class="empty"><h1>${esc(heading)}</h1><p>${handle ? 'Este autor aún no ha publicado artifacts.' : 'Cada cuenta tiene su propio tablero. Publica desde el studio con una cuenta registrada: ' + ORIGIN + '/artifact/@usuario/slug'}</p></div>`;
  const poster = handle ? bylineHtml({ handle, authorName: (opts && opts.authorName) || handle, authorPicture: (opts && opts.authorPicture) || '/avatar.png', dest: 'artifact' }) : '';
  return wrap(heading, inner, '', poster);
}

export function renderArtifactMissing() {
  return wrap('No encontrado', `<div class="empty"><h1>Este artifact no existe</h1><p>Se despublicó, es de otra cuenta o el enlace es incorrecto.</p><p><a class="btn" href="/artifact">Ver publicados</a></p></div>`, '');
}
