import { LIBRARY_PREFIX } from './publish.js';

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

function tickerHtml(sym) {
  const s = String(sym || '').toUpperCase();
  return `<a class="ticker" href="https://www.tradingview.com/symbols/${esc(s)}/" rel="noopener" target="_blank" title="${esc(s)}">$${esc(s)}</a>`;
}

function tvEmbed(symbol, interval) {
  const sym = encodeURIComponent(String(symbol || 'NASDAQ:AAPL').toUpperCase());
  const iv = encodeURIComponent(interval || 'D');
  return `<div class="tv-wrap"><iframe src="https://s.tradingview.com/widgetembed/?symbol=${sym}&interval=${iv}&hidesidetoolbar=1&theme=dark&style=1&locale=es&hideideas=1" title="TradingView ${esc(symbol)}" loading="lazy"></iframe></div>`;
}

function inlineMd(text) {
  let s = esc(text);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+)\)/g, '<a href="$2" rel="noopener" target="_blank">$1</a>');
  s = s.replace(/(^|[\s(])\$([A-Z]{1,6}(?:-[A-Z]{1,4})?)\b/g, (m, pre, sym) => pre + tickerHtml(sym));
  return s;
}

function stripMatchingH1(md, title) {
  const t = String(title || '').trim().toLowerCase();
  if (!t) return md;
  return String(md || '').replace(/^#\s+(.+)\s*\n+/, (all, h) => {
    return String(h || '').trim().toLowerCase() === t ? '' : all;
  });
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
      const tv = line.match(/^<(?:TradingViewWidget|tradingview)\s+symbol=["']([^"']+)["'](?:\s+interval=["']([^"']+)["'])?[^>]*\/?>$/i)
        || line.match(/^:::tradingview\s+(\S+)(?:\s+(\S+))?/);
      if (tv) {
        flush();
        html += tvEmbed(tv[1], tv[2]);
        continue;
      }
      if (/^\|.+\|$/.test(line)) {
        flush();
        const cells = line.split('|').slice(1, -1).map((c) => c.trim());
        if (/^\s*\|?\s*:?-{3,}/.test(line)) continue;
        if (!html.endsWith('</th></tr>') && cells.length) {
          html += '<div class="table-wrap"><table><thead><tr>' + cells.map((c) => '<th>' + inlineMd(c) + '</th>').join('') + '</tr></thead><tbody>';
        } else {
          html += '<tr>' + cells.map((c) => '<td>' + inlineMd(c) + '</td>').join('') + '</tr>';
        }
        continue;
      }
      if (html.includes('<tbody>') && !/^\|.+\|$/.test(line) && html.endsWith('</tr>')) {
        html += '</tbody></table></div>';
      }
      const h = line.match(/^(#{1,3})\s+(.+)$/);
      if (h) {
        flush();
        html += '<h' + h[1].length + '>' + inlineMd(h[2]) + '</h' + h[1].length + '>';
        continue;
      }
      if (/^[-*]\s+/.test(line) || /^\[[ xX]\]\s+/.test(line) || /^\d+\.\s+/.test(line)) {
        flush();
        const task = line.match(/^[-*]\s+\[([ xX])\]\s+(.+)$/);
        html += '<li>' + inlineMd(task ? task[2] : line.replace(/^[-*\d.]+\s+/, '')) + '</li>';
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
.bar{min-height:48px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 16px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(10,10,10,.94);backdrop-filter:blur(12px)}
.brand{display:flex;align-items:center;gap:8px;color:#f8fafc;text-decoration:none;font-weight:650;letter-spacing:-.03em;font-size:13px;flex-shrink:0}
.brand img{width:22px;height:22px;border-radius:6px;border:1px solid rgba(255,255,255,.12)}
.bar-actions{display:flex;gap:8px;align-items:center}
.btn{background:transparent;border:1px solid rgba(255,255,255,.12);color:#cbd5e1;border-radius:8px;padding:6px 10px;font-size:12px;text-decoration:none;cursor:pointer;font-family:inherit}
.btn:hover{color:#fff;border-color:rgba(255,255,255,.28)}
.article-head{flex-shrink:0;max-width:760px;width:100%;margin:0 auto;padding:28px 24px 0;box-sizing:border-box}
.page-title{margin:0 0 12px;font-size:1.85rem;font-weight:700;line-height:1.2;color:#fff;letter-spacing:-.03em;word-break:break-word}
.meta-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding-bottom:16px;margin-bottom:8px;border-bottom:1px solid #262626}
.by-logo{width:28px;height:28px;border-radius:999px;object-fit:cover;background:#262626;flex-shrink:0}
.meta-line{font-size:13px;color:#a3a3a3;line-height:1.3;min-width:0}
.meta-line strong{color:#e5e5e5;font-weight:600}
.meta-line a{color:#a3a3a3;text-decoration:none}
.meta-line a:hover{color:#fff}
.meta-bar .btn{margin-left:auto}
.extras{flex-shrink:0;border-top:1px solid rgba(255,255,255,.08);padding:18px 16px 28px;background:#080c14}
.extras-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;max-width:1100px;margin:0 auto}
.extras h2{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#64748b;margin:0 0 8px}
.extras a,.extras p{font-size:13px;color:#cbd5e1;text-decoration:none}
.extras a:hover{color:#7dd3fc}
.widget{border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:12px;background:rgba(15,22,36,.7)}
.widget img{max-width:100%;border-radius:8px;display:block}
.widget iframe{width:100%;min-height:180px;border:0;border-radius:8px;background:#fff}
.ticker{display:inline-flex;align-items:center;gap:4px;padding:1px 8px;margin:0 1px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#e5e5e5;font-size:12px;font-weight:650;text-decoration:none;font-family:ui-monospace,monospace}
.ticker:hover{border-color:rgba(255,255,255,.28);color:#fff}
.tv-wrap{margin:18px 0;border:1px solid #262626;border-radius:12px;overflow:hidden;background:#0a0a0a;min-height:420px}
.tv-wrap iframe{width:100%;height:420px;border:0;display:block}
.table-wrap{overflow-x:auto;margin:24px 0;border:1px solid #262626;border-radius:12px;background:rgba(10,10,10,.4)}
.doc table,.table-wrap table{width:100%;border-collapse:collapse;font-size:13px}
.doc thead,.table-wrap thead{background:rgba(23,23,23,.7)}
.doc th,.table-wrap th{text-transform:uppercase;letter-spacing:.06em;font-size:11px;color:#a3a3a3;padding:10px 12px;text-align:left;border-bottom:1px solid #262626}
.doc td,.table-wrap td{padding:10px 12px;border-bottom:1px solid rgba(38,38,38,.6);color:#d4d4d4}
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
.card h2{margin:0 0 8px;font-size:1rem;color:#fff;line-height:1.35;white-space:normal}
.card p{margin:0;font-size:12px;color:#64748b;font-family:ui-monospace,monospace}
.card-by{display:flex;align-items:center;gap:8px;margin-bottom:10px}
.card-by img{width:22px;height:22px;border-radius:7px;object-fit:cover;border:1px solid rgba(255,255,255,.12)}
.card-by span{font-size:12px;color:#7dd3fc}
`;

function formatPubDate(ts) {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch (e) { return ''; }
}

function bylineHtml(item) {
  const handle = String((item && item.handle) || '').replace(/^@/, '');
  const name = (item && item.authorName) || handle;
  const pic = (item && item.authorPicture) || '/avatar.png';
  const dest = (item && item.dest) === 'guide' ? 'Guides' : 'Library';
  const title = (item && item.title) || '';
  const when = formatPubDate(item && (item.updatedAt || item.createdAt));
  const copy = `<button class="btn" type="button" id="copy">Copiar enlace</button>
<script>document.getElementById('copy').onclick=function(){navigator.clipboard.writeText(location.href).then(()=>{this.textContent='Copiado';setTimeout(()=>this.textContent='Copiar enlace',1600)})}<\/script>`;
  return `<div class="article-head">
  ${title ? `<h1 class="page-title">${esc(title)}</h1>` : ''}
  <div class="meta-bar">
    <img class="by-logo" src="${esc(pic)}" alt="" width="28" height="28">
    <div class="meta-line"><strong>${esc(name || 'Autor')}</strong>${handle ? ` · <a href="${LIBRARY_PREFIX}">@${esc(handle)}</a>` : ''} · ${esc(dest)}${when ? ' · ' + esc(when) : ''}</div>
    ${copy}
  </div>
</div>`;
}

function wrap(title, inner, extraBar, poster) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Library · Trujillo AI</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#080c14">
<link rel="icon" href="/avatar.png">
<style>${SHELL_CSS}</style>
</head>
<body>
<header class="bar">
  <a class="brand" href="/"><img src="/avatar.png" alt="" width="22" height="22">Trujillo AI</a>
  <div class="bar-actions">${extraBar || ''}<a class="btn" href="/">Studio</a></div>
</header>
${poster || ''}
${inner}
</body>
</html>`;
}

function itemHref(it) {
  return LIBRARY_PREFIX + '/' + encodeURIComponent(it.slug);
}

function extrasHtml(item) {
  const extra = (item && item.extras) || {};
  const sources = Array.isArray(extra.sources) ? extra.sources : [];
  const resources = Array.isArray(extra.resources) ? extra.resources : [];
  const widgets = Array.isArray(extra.widgets) ? extra.widgets : [];
  if (!sources.length && !resources.length && !widgets.length) return '';
  let html = '<aside class="extras"><div class="extras-grid">';
  if (sources.length) {
    html += '<div><h2>Fuentes</h2>' + sources.map((s) =>
      s.url ? `<p><a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.title || s.url)}</a></p>` : `<p>${esc(s.title || '')}</p>`
    ).join('') + '</div>';
  }
  if (resources.length) {
    html += '<div><h2>Recursos</h2>' + resources.map((s) => {
      const note = s.note ? ` — ${esc(s.note)}` : '';
      return s.url
        ? `<p><a href="${esc(s.url)}" rel="noopener" target="_blank">${esc(s.title || s.url)}</a>${note}</p>`
        : `<p>${esc(s.title || '')}${note}</p>`;
    }).join('') + '</div>';
  }
  if (widgets.length) {
    html += '<div><h2>Widgets</h2>' + widgets.map((w) => {
      if (w.type === 'quote' || w.type === 'chart') {
        const sym = esc(w.symbol || '');
        return `<div class="widget"><div>${esc(w.label || w.symbol)}</div><img alt="${sym}" src="/api/chart/${encodeURIComponent(w.symbol)}.png"><p><a href="https://www.tradingview.com/symbols/${sym}/" rel="noopener" target="_blank">$${sym}</a></p></div>`;
      }
      if (w.type === 'embed' && w.url) {
        return `<div class="widget"><iframe sandbox="allow-scripts allow-forms" src="${esc(w.url)}" title="${esc(w.label || 'widget')}"></iframe></div>`;
      }
      if (w.type === 'link' && w.url) {
        return `<div class="widget"><a href="${esc(w.url)}" rel="noopener" target="_blank">${esc(w.label || w.url)}</a></div>`;
      }
      if (w.type === 'note' && w.text) {
        return `<div class="widget"><p>${esc(w.text)}</p></div>`;
      }
      return '';
    }).join('') + '</div>';
  }
  html += '</div></aside>';
  return html;
}

export function renderArtifactPage(item) {
  const kind = detectKind(item.lang, item.content);
  const raw = item.content || '';
  let stage = '';
  if (kind === 'html') {
    stage = `<div class="stage"><iframe class="frame" sandbox="allow-scripts allow-forms allow-modals" srcdoc="${srcdocEsc(raw)}"></iframe></div>`;
  } else if (kind === 'svg') {
    stage = `<div class="stage"><div class="svgwrap"><img alt="" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(raw)}"></div></div>`;
  } else if (kind === 'mermaid') {
    stage = `<div class="stage"><iframe class="frame" sandbox="allow-scripts allow-same-origin" srcdoc="${srcdocEsc(mermaidDoc(raw))}"></iframe></div>`;
  } else if (kind === 'markdown') {
    stage = `<div class="stage" style="overflow:auto"><article class="doc">${renderMarkdown(stripMatchingH1(raw, item.title))}</article></div>`;
  } else if (kind === 'csv') {
    stage = `<div class="stage" style="overflow:auto"><article class="doc">${csvTable(raw)}</article></div>`;
  } else if (kind === 'json') {
    stage = `<div class="stage"><pre class="code">${esc(prettyJson(raw))}</pre></div>`;
  } else if (kind === 'plaintext') {
    stage = `<div class="stage" style="overflow:auto"><article class="doc"><p style="white-space:pre-wrap">${esc(raw)}</p></article></div>`;
  } else {
    stage = `<div class="stage"><pre class="code">${esc(raw)}</pre></div>`;
  }
  return wrap(item.title || 'Library', stage + extrasHtml(item), `<span class="kind">${esc(kind)}</span>`, bylineHtml(item));
}

export function renderArtifactIndex(items, opts) {
  const handle = opts && opts.handle;
  const cards = (items || []).map((it) => {
    const h = it.handle || handle || '';
    const pic = it.authorPicture || '/avatar.png';
    const by = h
      ? `<div class="card-by"><img src="${esc(pic)}" alt=""><span>@${esc(h)}</span></div>`
      : '';
    return `<a class="card" href="${itemHref(it)}">${by}<h2>${esc(it.title || it.slug)}</h2><p>/library/${esc(it.slug)}</p></a>`;
  }).join('');
  const heading = handle ? '@' + handle : 'Library';
  const inner = cards
    ? `<div class="grid">${cards}</div>`
    : `<div class="empty"><h1>${esc(heading)}</h1><p>${handle ? 'Este autor aún no ha publicado en su library.' : 'Publica desde el studio. La URL es automática: ' + ORIGIN + '/library/slug'}</p></div>`;
  const poster = handle ? bylineHtml({ handle, authorName: (opts && opts.authorName) || handle, authorPicture: (opts && opts.authorPicture) || '/avatar.png', dest: 'artifact' }) : '';
  return wrap(heading, inner, '', poster);
}

export function renderArtifactMissing() {
  return wrap('No encontrado', `<div class="empty"><h1>Esta pieza no existe</h1><p>Se despublicó, es de otra cuenta o el enlace es incorrecto.</p><p><a class="btn" href="${LIBRARY_PREFIX}">Ver library</a></p></div>`, '');
}
