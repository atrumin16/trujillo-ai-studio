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
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{margin:0;background:#0b0f14;display:flex;justify-content:center;padding:24px}</style>
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
      const fence = (nl === -1 ? '' : parts[i].slice(0, nl)).trim().toLowerCase();
      const code = (nl === -1 ? parts[i] : parts[i].slice(nl + 1)).replace(/\n$/, '');
      if (fence === 'mermaid') {
        html += '<pre class="mermaid">' + esc(code) + '</pre>';
      } else {
        html += '<pre><code' + (fence ? ' class="lang-' + esc(fence) + '"' : '') + '>' + esc(code) + '</code></pre>';
      }
      continue;
    }
    const lines = parts[i].split('\n');
    let buf = [];
    let inTable = false;
    const flush = () => {
      const t = buf.join(' ').trim();
      buf = [];
      if (t) html += '<p>' + inlineMd(t) + '</p>';
    };
    const closeTable = () => {
      if (!inTable) return;
      html += '</tbody></table></div>';
      inTable = false;
    };
    for (const line of lines) {
      const tv = line.match(/^<(?:TradingViewWidget|tradingview)\s+symbol=["']([^"']+)["'](?:\s+interval=["']([^"']+)["'])?[^>]*\/?>$/i)
        || line.match(/^:::tradingview\s+(\S+)(?:\s+(\S+))?/);
      if (tv) {
        flush();
        closeTable();
        html += tvEmbed(tv[1], tv[2]);
        continue;
      }
      if (/^\s*\|.+\|\s*$/.test(line)) {
        flush();
        const cells = line.split('|').slice(1, -1).map((c) => c.trim());
        if (/^\s*\|?\s*:?-{3,}/.test(line)) continue;
        if (!inTable) {
          html += '<div class="overflow-x-auto my-6 border border-neutral-800 rounded-lg table-wrap"><table class="w-full text-left text-sm border-collapse"><thead><tr>' + cells.map((c) => '<th>' + inlineMd(c) + '</th>').join('') + '</tr></thead><tbody>';
          inTable = true;
        } else {
          html += '<tr>' + cells.map((c) => '<td>' + inlineMd(c) + '</td>').join('') + '</tr>';
        }
        continue;
      }
      closeTable();
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
    closeTable();
  }
  return html.replace(/(?:<li>[\s\S]*?<\/li>)+/g, (b) => '<ul>' + b + '</ul>');
}

const SHELL_CSS = `
:root{--bg:#0b0f14;--bg-card:#11161d;--bg-hover:#171d26;--bg-code:#0e1319;--border:#1f2937;--text:#f8fafc;--muted:#94a3b8;--dim:#64748b;--accent:#3b82f6;--pill:#2563eb}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%;background:var(--bg);color:var(--text);font-family:Inter,ui-sans-serif,system-ui,sans-serif}
body{display:flex;flex-direction:column;min-height:100vh}
.docs-topbar{display:flex;align-items:center;gap:12px;height:56px;padding:0 20px;background:rgba(11,15,20,.92);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;backdrop-filter:blur(16px);width:100%}
.brand{display:inline-flex;align-items:center;gap:10px;color:var(--text);text-decoration:none;font-size:12.5px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;flex-shrink:0}
.brand img{width:26px;height:26px;border-radius:6px;object-fit:cover;border:1px solid var(--border)}
.topbar-actions{display:inline-flex;align-items:center;gap:8px;margin-left:auto}
.hub-link,.btn{display:inline-flex;align-items:center;justify-content:center;padding:6px 12px;font-size:12px;font-weight:600;border-radius:8px;border:1px solid var(--border);background:var(--bg-code);color:var(--text);text-decoration:none;cursor:pointer;font-family:inherit}
.hub-link:hover,.btn:hover{border-color:var(--accent);color:var(--accent)}
.home-main,.guide-container{width:100%;margin:0 auto;padding:36px 24px 80px;flex:1;align-self:center}
.home-main{max-width:1120px}
.guide-container,.article-head,.community-main{max-width:720px}
.kicker{font-family:ui-monospace,monospace;font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);font-weight:600;margin:0 0 12px}
.hero h1,.page-title{font-size:clamp(1.6rem,3.6vw,2.1rem);font-weight:650;letter-spacing:-.035em;line-height:1.2;margin:0 0 12px;color:var(--text)}
.lede{font-size:1.02rem;line-height:1.65;color:var(--muted);margin:0 0 28px;max-width:40rem}
.guides-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;width:100%}
.guide-card{display:flex;flex-direction:row;gap:14px;align-items:flex-start;text-decoration:none;color:inherit;background:var(--bg-card);border:1px solid var(--border);border-radius:10px;padding:16px;transition:border-color .15s,background .15s}
.guide-card:hover{border-color:var(--accent);background:var(--bg-hover)}
.guide-card-avatar{width:36px;height:36px;border-radius:50%;object-fit:cover;border:1px solid var(--border);flex-shrink:0}
.guide-card-body{min-width:0;flex:1}
.guide-card h2{font-size:1.05rem;font-weight:650;letter-spacing:-.02em;color:var(--text);margin:0 0 6px;line-height:1.35}
.guide-card p{color:var(--muted);font-size:.85rem;margin:0;line-height:1.45}
.article-head{width:100%;margin:0 auto;padding:32px 20px 0;box-sizing:border-box}
.meta-bar,.poster{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 0;margin:12px 0 24px;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.by-logo{width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid var(--border);flex-shrink:0}
.meta-line{font-size:13px;color:var(--muted);margin:0;min-width:0;flex:1}
.meta-line strong{color:var(--text);font-weight:600}
.meta-bar .btn,.meta-bar .copy-link{margin-left:auto}
.guide-badge,.kind{display:inline-block;background:rgba(37,99,235,.12);color:#93c5fd;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;border:1px solid rgba(37,99,235,.28);letter-spacing:.04em}
.community-main,.doc{width:100%;margin:0 auto;padding:8px 20px 64px;line-height:1.7;color:var(--muted)}
.doc h1,.doc h2,.doc h3{color:var(--text);letter-spacing:-.03em;line-height:1.25;font-weight:650}
.doc h1{font-size:1.6rem;margin:0 0 16px}
.doc h2{font-size:1.25rem;margin:28px 0 10px}
.doc p{margin:0 0 14px}
.doc a{color:var(--accent);text-decoration:none}
.doc a:hover{text-decoration:underline}
.doc ul,.doc ol{margin:0 0 16px;padding-left:1.35em}
.doc code{font-family:ui-monospace,Cascadia Code,monospace;font-size:.86em;background:var(--bg-code);color:#93c5fd;padding:2px 6px;border-radius:4px;border:1px solid var(--border)}
.doc pre{background:var(--bg-code);border:1px solid var(--border);border-radius:8px;padding:16px 18px;overflow:auto}
.doc pre code{background:none;padding:0;border:0;color:var(--text)}
.table-wrap{overflow-x:auto;margin:24px 0;border:1px solid var(--border);border-radius:8px;background:var(--bg-code)}
.doc table,.table-wrap table,.tbl{width:100%;border-collapse:collapse;font-size:13px}
.doc th,.table-wrap th,.tbl th{text-transform:uppercase;letter-spacing:.06em;font-size:11px;color:var(--muted);padding:10px 12px;text-align:left;border-bottom:1px solid var(--border);background:var(--bg-card)}
.doc td,.table-wrap td,.tbl td{padding:10px 12px;border-bottom:1px solid var(--border);color:var(--muted)}
.stage{width:100%;max-width:1120px;margin:0 auto;padding:0 20px 48px;background:transparent}
.stage.iframe{min-height:70vh}
.frame{width:100%;min-height:70vh;border:1px solid var(--border);border-radius:10px;background:var(--bg-card);display:block}
.code{margin:0 auto 48px;max-width:720px;width:100%;overflow:auto;padding:20px;font-family:ui-monospace,Cascadia Code,Consolas,monospace;font-size:13px;line-height:1.55;white-space:pre-wrap;color:var(--text);background:var(--bg-code);border:1px solid var(--border);border-radius:8px}
.svgwrap{display:flex;align-items:center;justify-content:center;padding:24px}
.svgwrap img,.svgwrap svg{max-width:100%;height:auto}
.empty{max-width:560px;margin:12vh auto;padding:24px;text-align:center;color:var(--muted)}
.empty h1{color:var(--text);font-size:1.6rem;margin:0 0 10px;font-weight:650;letter-spacing:-.03em}
.extras{border-top:1px solid var(--border);padding:28px 20px 48px;max-width:720px;margin:0 auto;width:100%}
.extras-grid{display:grid;gap:16px}
.extras h2{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:var(--dim);margin:0 0 8px}
.extras a,.extras p{font-size:13px;color:var(--muted);text-decoration:none}
.extras a:hover{color:var(--accent)}
.attach-card{display:flex;align-items:center;gap:12px;border:1px solid var(--border);border-radius:10px;padding:12px 16px;background:var(--bg-card);text-decoration:none;color:inherit}
.attach-figure img{max-width:100%;border-radius:8px;border:1px solid var(--border)}
.widget{border:1px solid var(--border);border-radius:10px;padding:12px;background:var(--bg-card)}
.widget img{max-width:100%;border-radius:8px;display:block}
.widget iframe{width:100%;min-height:180px;border:0;border-radius:8px}
.ticker{display:inline-flex;align-items:center;gap:4px;padding:1px 8px;border-radius:999px;background:var(--bg-code);border:1px solid var(--border);color:var(--accent);font-size:12px;font-weight:650;text-decoration:none;font-family:ui-monospace,monospace}
.tv-wrap{margin:18px 0;border:1px solid var(--border);border-radius:12px;overflow:hidden;background:var(--bg-code)}
.tv-wrap iframe{width:100%;height:420px;border:0;display:block}
.docs-footer{margin-top:auto;border-top:1px solid var(--border);padding:28px 24px 36px;text-align:center;font-size:12px;color:var(--dim)}
.docs-footer-nav{display:flex;justify-content:center;gap:16px;margin-top:12px}
.docs-footer-nav a{color:var(--muted);text-decoration:none}
.docs-footer-nav a:hover{color:var(--accent)}
@media(max-width:720px){.home-main,.guide-container,.article-head,.community-main,.doc,.stage,.extras{padding-left:16px;padding-right:16px}}
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
  const when = formatPubDate(item && (item.date || item.updatedAt || item.createdAt));
  const copy = `<button class="btn copy-link" type="button" id="copy">Copiar enlace</button>
<script>document.getElementById('copy').onclick=function(){navigator.clipboard.writeText(location.href).then(()=>{this.textContent='Copiado';setTimeout(()=>this.textContent='Copiar enlace',1600)})}<\/script>`;
  return `<div class="article-head">
  ${title ? `<h1 class="page-title">${esc(title)}</h1>` : ''}
  <div class="meta-bar">
    <img class="by-logo" src="${esc(pic)}" alt="" width="28" height="28">
    <p class="meta-line"><strong>${esc(name || 'Alberto Trujillo Mingorance')}</strong>${handle ? ` · @${esc(handle)}` : ''} · <span class="guide-badge">${esc(dest)}</span>${when ? ' · ' + esc(when) : ''}</p>
    ${copy}
  </div>
</div>`;
}

function wrap(title, inner, extraBar, poster, opts) {
  const isGuide = opts && opts.dest === 'guide';
  const brand = isGuide ? 'ATM Docs' : 'Trujillo AI';
  const home = isGuide ? 'https://guides.trujillomingorance.com/' : '/library';
  return `<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ${esc(brand)}</title>
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#0b0f14">
<link rel="icon" href="/avatar.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<style>${SHELL_CSS}</style>
</head>
<body class="docs-body">
<header class="docs-topbar">
  <a class="brand" href="${home}"><img class="brand-avatar" src="/avatar.png" alt="" width="26" height="26"><span>${esc(brand)}</span></a>
  <div class="topbar-actions">${extraBar || ''}<a class="hub-link" href="https://ai.trujillomingorance.com">Studio</a></div>
</header>
${poster || ''}
${inner}
<footer class="docs-footer">
  <p>© 2026 ATM Software Labs</p>
  <nav class="docs-footer-nav">
    <a href="${home}">${isGuide ? 'Índice' : 'Library'}</a>
    <a href="https://guides.trujillomingorance.com/">Guides</a>
    <a href="https://ai.trujillomingorance.com/">Studio</a>
  </nav>
</footer>
</body>
</html>`;
}

function itemHref(it, prefix) {
  if (it && it.href) return it.href;
  if (it && it.static) return '/guides/' + it.slug + '/';
  return (prefix || LIBRARY_PREFIX) + '/' + encodeURIComponent(it.slug);
}

function extrasHtml(item) {
  const extra = (item && item.extras) || {};
  const sources = Array.isArray(extra.sources) ? extra.sources : [];
  const resources = Array.isArray(extra.resources) ? extra.resources : [];
  const widgets = Array.isArray(extra.widgets) ? extra.widgets : [];
  const attachments = Array.isArray(extra.attachments) ? extra.attachments : [];
  if (!sources.length && !resources.length && !widgets.length && !attachments.length) return '';
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
  if (attachments.length) {
    html += '<div><h2>Adjuntos</h2>' + attachments.map((a) => {
      if (!a || !a.url) return '';
      return `<a class="btn" href="${esc(a.url)}" rel="noopener" download>${esc(a.name || a.url)}</a>`;
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
    stage = `<div class="stage iframe"><iframe class="frame" sandbox="allow-scripts allow-forms allow-modals" srcdoc="${srcdocEsc(raw)}" title="Artifact"></iframe></div>`;
  } else if (kind === 'svg') {
    stage = `<div class="community-main"><div class="svgwrap"><img alt="" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(raw)}"></div></div>`;
  } else if (kind === 'mermaid') {
    stage = `<div class="stage iframe"><iframe class="frame" sandbox="allow-scripts allow-same-origin" srcdoc="${srcdocEsc(mermaidDoc(raw))}" title="Mermaid"></iframe></div>`;
  } else if (kind === 'markdown') {
    stage = `<main class="community-main"><article class="doc">${renderMarkdown(stripMatchingH1(raw, item.title))}</article></main>`;
  } else if (kind === 'csv') {
    stage = `<main class="community-main"><article class="doc">${csvTable(raw)}</article></main>`;
  } else if (kind === 'json') {
    stage = `<pre class="code">${esc(prettyJson(raw))}</pre>`;
  } else if (kind === 'plaintext') {
    stage = `<main class="community-main"><article class="doc"><p style="white-space:pre-wrap">${esc(raw)}</p></article></main>`;
  } else {
    stage = `<pre class="code">${esc(raw)}</pre>`;
  }
  const extra = (item && item.extras) || {};
  const payload = JSON.stringify({
    attachments: extra.attachments || [],
    widgets: extra.widgets || [],
    date: item.date || ''
  }).replace(/</g, '\\u003c');
  return wrap(
    item.title || 'Library',
    stage + extrasHtml(item) + `<script type="application/json" id="guide-payload">${payload}</script><aside id="guide-attachments" hidden></aside>`,
    `<span class="kind">${esc(kind)}</span>`,
    bylineHtml(item),
    { dest: item.dest }
  );
}

export function renderArtifactIndex(items, opts) {
  const handle = opts && opts.handle;
  const cards = (items || []).map((it) => {
    const h = it.handle || handle || '';
    const pic = it.authorPicture || '/avatar.png';
    const pref = (opts && opts.prefix) || LIBRARY_PREFIX;
    const meta = [h ? '@' + h : '', (pref || '') + '/' + it.slug].filter(Boolean).join(' · ');
    return `<a class="guide-card" href="${itemHref(it, pref)}"><img class="guide-card-avatar" src="${esc(pic)}" alt="" width="36" height="36"><div class="guide-card-body"><h2>${esc(it.title || it.slug)}</h2><p data-notranslate>${esc(meta)}</p></div></a>`;
  }).join('');
  const heading = handle ? '@' + handle : ((opts && opts.heading) || 'Library');
  const dest = (opts && opts.dest) || 'artifact';
  const kicker = dest === 'guide' ? 'Guías' : 'Library';
  const lede = handle
    ? 'Publicaciones de @' + handle + '.'
    : 'Piezas publicadas desde Studio. Misma cabecera, tarjetas y columna de lectura que Guides.';
  const inner = `<main class="home-main">
    <section class="hero"><p class="kicker">${esc(kicker)}</p><h1>${esc(heading)}</h1><p class="lede">${esc(lede)}</p></section>
    ${cards ? `<div class="guides-grid">${cards}</div>` : `<p class="lede">${handle ? 'Este autor aún no ha publicado.' : 'Publica desde Studio. URL: ' + ORIGIN + '/library/slug'}</p>`}
  </main>`;
  return wrap(heading, inner, '', '', { dest, index: true });
}

export function renderArtifactMissing(opts) {
  const dest = opts && opts.dest;
  const home = dest === 'guide' ? 'https://guides.trujillomingorance.com/' : LIBRARY_PREFIX;
  const label = dest === 'guide' ? 'Ver guías' : 'Ver library';
  return wrap('No encontrado', `<main class="home-main"><section class="hero"><p class="kicker">404</p><h1>Esta pieza no existe</h1><p class="lede">Se despublicó, es de otra cuenta o el enlace es incorrecto.</p><p><a class="hub-link" href="${home}">${label}</a></p></section></main>`, '', '', { dest, index: true });
}
