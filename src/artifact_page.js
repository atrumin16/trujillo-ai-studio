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

export function detectKind(lang, content) {
  const l = String(lang || '').toLowerCase();
  const c = String(content || '').trim();
  if (l === 'svg' || /^<svg[\s>]/i.test(c)) return 'svg';
  if (l === 'html' || l === 'htm' || /^<!doctype html/i.test(c) || /^<html[\s>]/i.test(c) || /^<(div|section|main|article|style)[\s>]/i.test(c)) return 'html';
  if (l === 'markdown' || l === 'md' || l === 'text' || /^#\s+/m.test(c)) return 'markdown';
  return 'code';
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
.stage{flex:1;min-height:0;position:relative;background:#080c14}
.frame{position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff}
.doc{max-width:760px;margin:0 auto;padding:48px 24px 80px;line-height:1.7;color:#e2e8f0}
.doc h1,.doc h2,.doc h3{color:#fff;letter-spacing:-.03em;line-height:1.2}
.doc h1{font-size:2rem;margin:0 0 16px}
.doc h2{font-size:1.35rem;margin:28px 0 10px}
.doc p{margin:0 0 14px;color:#cbd5e1}
.doc a{color:#7dd3fc}
.doc ul{margin:0 0 16px 20px}
.doc code{font-family:ui-monospace,Cascadia Code,monospace;font-size:.86em;background:rgba(255,255,255,.06);padding:1px 5px;border-radius:4px}
.doc pre{background:#0c1220;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px 16px;overflow:auto}
.doc pre code{background:none;padding:0}
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
`;

function wrap(title, inner, extraBar) {
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
${inner}
</body>
</html>`;
}

export function renderArtifactPage(item) {
  const kind = detectKind(item.lang, item.content);
  const copy = `<button class="btn" type="button" id="copy">Copiar enlace</button>
<script>document.getElementById('copy').onclick=function(){navigator.clipboard.writeText(location.href).then(()=>{this.textContent='Copiado';setTimeout(()=>this.textContent='Copiar enlace',1600)})}</script>`;
  let stage = '';
  if (kind === 'html') {
    stage = `<div class="stage"><iframe class="frame" sandbox="allow-scripts allow-forms allow-modals" srcdoc="${srcdocEsc(item.content)}"></iframe></div>`;
  } else if (kind === 'svg') {
    stage = `<div class="stage"><div class="svgwrap"><img alt="" src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.content)}"></div></div>`;
  } else if (kind === 'markdown') {
    stage = `<div class="stage" style="overflow:auto"><article class="doc">${renderMarkdown(item.content)}</article></div>`;
  } else {
    stage = `<div class="stage"><pre class="code">${esc(item.content)}</pre></div>`;
  }
  return wrap(item.title || 'Artifact', stage, copy);
}

export function renderArtifactIndex(items) {
  const cards = (items || []).map((it) =>
    `<a class="card" href="/artifact/${encodeURIComponent(it.slug)}"><h2>${esc(it.title)}</h2><p>/artifact/${esc(it.slug)}</p></a>`
  ).join('');
  const inner = cards
    ? `<div class="grid">${cards}</div>`
    : `<div class="empty"><h1>Artifacts</h1><p>Publica un artefacto desde el studio. Quedará en una URL limpia: ${ORIGIN}/artifact/slug</p></div>`;
  return wrap('Artifacts', inner, '');
}

export function renderArtifactMissing() {
  return wrap('No encontrado', `<div class="empty"><h1>Este artifact no existe</h1><p>Se despublicó o el enlace es incorrecto.</p><p><a class="btn" href="/artifact">Ver publicados</a></p></div>`, '');
}
