// Shared visual system, SEO chrome and marketing shell for Trujillo AI.
// Used by legal, auth and product pages so the whole site feels like one product.

export const SITE = {
  name: 'Trujillo AI',
  short: 'Trujillo',
  domain: 'https://ai.trujillomingorance.com',
  host: 'ai.trujillomingorance.com',
  founder: 'Alberto Trujillo Mingorance',
  email: 'alberto@trujillomingorance.com',
  twitter: '@atrumin16',
  github: 'https://github.com/atrumin16',
  personal: 'https://trujillomingorance.com',
  year: '2026'
};

const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:opsz,wght@6..72,500;6..72,600&family=IBM+Plex+Mono:wght@400;500&display=swap';

export function seoHead({
  title,
  description,
  path = '/',
  type = 'website',
  robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  extra = '',
  jsonLd = ''
}) {
  const url = SITE.domain + path;
  const fullTitle = title.includes('Trujillo') ? title : `${title} — Trujillo AI`;
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeAttr(fullTitle)}</title>
  <meta name="description" content="${escapeAttr(description)}">
  <meta name="author" content="${SITE.founder}">
  <meta name="creator" content="${SITE.founder}">
  <meta name="publisher" content="${SITE.name}">
  <meta name="robots" content="${robots}">
  <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="theme-color" content="#000000">
  <meta name="color-scheme" content="dark">
  <meta name="application-name" content="${SITE.name}">
  <link rel="canonical" href="${url}">
  <link rel="sitemap" type="application/xml" href="${SITE.domain}/sitemap.xml">
  <link rel="alternate" hreflang="es" href="${url}">
  <link rel="alternate" hreflang="x-default" href="${url}">
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${url}">
  <meta property="og:site_name" content="${SITE.name}">
  <meta property="og:title" content="${escapeAttr(fullTitle)}">
  <meta property="og:description" content="${escapeAttr(description)}">
  <meta property="og:image" content="${SITE.domain}/avatar.png">
  <meta property="og:image:width" content="512">
  <meta property="og:image:height" content="512">
  <meta property="og:locale" content="es_ES">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="${SITE.twitter}">
  <meta name="twitter:creator" content="${SITE.twitter}">
  <meta name="twitter:title" content="${escapeAttr(fullTitle)}">
  <meta name="twitter:description" content="${escapeAttr(description)}">
  <meta name="twitter:image" content="${SITE.domain}/avatar.png">
  <link rel="icon" type="image/png" href="/avatar.png">
  <link rel="apple-touch-icon" href="${SITE.domain}/avatar.png">
  <link rel="manifest" href="/manifest.json">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONT_HREF}" rel="stylesheet">
  ${jsonLd}
  ${extra}
`;
}

export function coreJsonLd(extraNodes = []) {
  const graph = [
    {
      '@type': 'Organization',
      '@id': SITE.domain + '/#organization',
      name: SITE.name,
      alternateName: ['Trujillo', 'Trujillo AI Studio', 'Trujillo Mingorance AI'],
      url: SITE.domain,
      logo: SITE.domain + '/avatar.png',
      email: SITE.email,
      founder: { '@id': SITE.domain + '/#founder' },
      sameAs: [SITE.personal, SITE.github, 'https://x.com/atrumin16']
    },
    {
      '@type': 'Person',
      '@id': SITE.domain + '/#founder',
      name: SITE.founder,
      url: SITE.personal,
      jobTitle: 'Fundador y arquitecto de sistemas de IA',
      sameAs: [SITE.github, 'https://x.com/atrumin16']
    },
    {
      '@type': 'WebSite',
      '@id': SITE.domain + '/#website',
      url: SITE.domain,
      name: SITE.name,
      inLanguage: 'es-ES',
      publisher: { '@id': SITE.domain + '/#organization' }
    },
    {
      '@type': 'SoftwareApplication',
      '@id': SITE.domain + '/#app',
      name: SITE.name,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: SITE.domain,
      image: SITE.domain + '/avatar.png',
      creator: { '@id': SITE.domain + '/#founder' },
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      description: 'Enterprise intelligence workspace. Chat, documents, projects, research and image generation at the edge.'
    },
    ...extraNodes
  ];
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

export function breadcrumbLd(items) {
  return {
    '@type': 'BreadcrumbList',
    '@id': SITE.domain + items[items.length - 1].path + '/#breadcrumb',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: SITE.domain + it.path
    }))
  };
}

export const marketingCss = `
:root {
  --bg: #050505;
  --bg-elev: #0e0e0e;
  --bg-card: #141414;
  --line: rgba(255,255,255,0.08);
  --line-strong: rgba(255,255,255,0.14);
  --text: #f4f4f5;
  --muted: #a1a1aa;
  --dim: #71717a;
  --white: #ffffff;
  --font: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --serif: Newsreader, "Iowan Old Style", Georgia, serif;
  --mono: "IBM Plex Mono", ui-monospace, monospace;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}
a { color: inherit; }
img { max-width: 100%; display: block; }
.wrap { width: min(1120px, calc(100% - 40px)); margin: 0 auto; }
.site-nav {
  position: sticky; top: 0; z-index: 40;
  backdrop-filter: blur(16px);
  background: rgba(5,5,5,0.78);
  border-bottom: 1px solid var(--line);
}
.site-nav-inner {
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.brand {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; color: var(--white); font-weight: 650; letter-spacing: -0.03em;
}
.brand img { width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--line-strong); }
.brand span { font-size: 0.98rem; }
.nav-links { display: flex; align-items: center; gap: 4px; }
.nav-links a {
  text-decoration: none; color: var(--muted);
  font-size: 0.86rem; font-weight: 500;
  padding: 8px 12px; border-radius: 999px;
}
.nav-links a:hover, .nav-links a.active { color: var(--white); background: rgba(255,255,255,0.06); }
.nav-cta {
  display: flex; align-items: center; gap: 8px;
}
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  text-decoration: none; border: 1px solid transparent; cursor: pointer;
  font-family: var(--font); font-weight: 600; font-size: 0.88rem;
  border-radius: 999px; padding: 10px 16px; transition: 0.15s ease;
}
.btn-ghost { color: var(--muted); border-color: var(--line); background: transparent; }
.btn-ghost:hover { color: var(--white); border-color: var(--line-strong); }
.btn-white { background: var(--white); color: #000; }
.btn-white:hover { background: #e4e4e7; }
.hero {
  padding: 88px 0 56px;
  text-align: center;
}
.kicker {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--dim); font-weight: 600; margin-bottom: 18px;
}
.hero h1, .page-title {
  font-family: var(--serif);
  font-weight: 500;
  letter-spacing: -0.035em;
  line-height: 1.08;
  font-size: clamp(2.4rem, 6vw, 4.4rem);
  color: var(--white);
}
.lede {
  margin: 18px auto 0;
  max-width: 640px;
  color: var(--muted);
  font-size: 1.08rem;
}
.hero-actions { margin-top: 28px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
.grid-3, .grid-2 { display: grid; gap: 14px; margin: 28px 0 64px; }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.card {
  background: var(--bg-card);
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 22px;
}
.card h3 { font-size: 1.02rem; letter-spacing: -0.02em; margin-bottom: 8px; }
.card p, .prose p { color: var(--muted); font-size: 0.94rem; }
.prose { max-width: 760px; margin: 0 auto 80px; }
.prose h2 { font-size: 1.35rem; letter-spacing: -0.03em; margin: 36px 0 10px; }
.prose h3 { font-size: 1.05rem; margin: 22px 0 8px; }
.prose ul, .prose ol { margin: 10px 0 16px 1.2rem; color: var(--muted); }
.prose li { margin: 6px 0; }
.prose a { color: var(--white); }
.prose code, .mono {
  font-family: var(--mono); font-size: 0.84em;
  background: rgba(255,255,255,0.06); padding: 1px 6px; border-radius: 5px;
}
.section-label {
  font-size: 0.78rem; color: var(--dim); font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px;
}
.site-footer {
  border-top: 1px solid var(--line);
  padding: 36px 0 48px;
  color: var(--dim);
  font-size: 0.82rem;
}
.footer-grid {
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 28px;
}
.footer-grid a { text-decoration: none; color: var(--muted); display: block; margin: 6px 0; }
.footer-grid a:hover { color: var(--white); }
.footer-brand { font-weight: 650; color: var(--white); margin-bottom: 8px; }
@media (max-width: 860px) {
  .nav-links { display: none; }
  .grid-3, .grid-2, .footer-grid { grid-template-columns: 1fr; }
  .hero { padding: 56px 0 36px; }
  .site-nav-inner { width: min(1120px, calc(100% - 24px)); }
  .wrap { width: min(1120px, calc(100% - 24px)); }
}
@media (max-width: 480px) {
  .hero { padding: 36px 0 24px; }
  .hero h1, .page-title { font-size: 2.1rem; }
  .lede { font-size: 0.96rem; }
  .btn { padding: 8px 12px; font-size: 0.82rem; }
  .card { padding: 18px 14px; border-radius: 14px; }
  .prose { margin-bottom: 48px; }
}
`;

export function marketingNav(active = '') {
  const item = (href, label, key) =>
    `<a href="${href}" class="${active === key ? 'active' : ''}">${label}</a>`;
  return `<nav class="site-nav" aria-label="Principal">
  <div class="site-nav-inner">
    <a class="brand" href="/">
      <img src="/avatar.png" width="28" height="28" alt="Trujillo AI">
      <span>Trujillo AI</span>
    </a>
    <div class="nav-links">
      ${item('/', 'Chat', 'chat')}
      ${item('/features', 'Capacidades', 'features')}
      ${item('/models', 'Modelos', 'models')}
      ${item('/docs', 'Documentación', 'docs')}
      ${item('/about', 'Acerca de', 'about')}
    </div>
    <div class="nav-cta">
      <a class="btn btn-ghost" href="/login">Acceder</a>
      <a class="btn btn-white" href="/">Empezar</a>
    </div>
  </div>
</nav>`;
}

export function marketingFooter() {
  return `<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <div class="footer-brand">Trujillo AI</div>
      <p>Workspace empresarial de inteligencia. Chat, documentos, proyectos e investigación en el perímetro.</p>
    </div>
    <div>
      <div class="section-label">Producto</div>
      <a href="/">Chat</a>
      <a href="/features">Capacidades</a>
      <a href="/models">Modelos</a>
      <a href="/docs">Documentación</a>
    </div>
    <div>
      <div class="section-label">Compañía</div>
      <a href="/about">Acerca de</a>
      <a href="${SITE.personal}">trujillomingorance.com</a>
      <a href="${SITE.github}">GitHub</a>
      <a href="mailto:${SITE.email}">${SITE.email}</a>
    </div>
    <div>
      <div class="section-label">Legal</div>
      <a href="/terms-of-use">Términos</a>
      <a href="/privacy-policy">Privacidad</a>
      <a href="/llms.txt">llms.txt</a>
      <a href="/sitemap.xml">Sitemap</a>
    </div>
  </div>
</footer>`;
}

export function renderMarketingPage({ title, description, path, active, jsonExtra = [], body }) {
  const head = seoHead({
    title,
    description,
    path,
    jsonLd: coreJsonLd([
      breadcrumbLd([
        { name: 'Trujillo AI', path: '/' },
        { name: title.replace(' — Trujillo AI', ''), path }
      ]),
      ...jsonExtra
    ])
  });
  return `${head}<style>${marketingCss}</style></head>
<body>
${marketingNav(active)}
${body}
${marketingFooter()}
</body></html>`;
}

export function renderLegalPage({ title, description, path, badge, updated, sections }) {
  const cards = sections.map((s) =>
    `<section class="card" style="margin-bottom:14px">
      <h2 style="font-size:1.08rem;margin-bottom:10px">${s.title}</h2>
      ${s.html}
    </section>`
  ).join('');
  return renderMarketingPage({
    title,
    description,
    path,
    active: '',
    body: `<main class="wrap" style="padding:56px 0 24px">
      <p class="kicker">${badge}</p>
      <h1 class="page-title" style="font-size:clamp(2rem,4vw,3.1rem);text-align:left">${title}</h1>
      <p class="lede" style="margin:12px 0 32px;text-align:left">${updated}</p>
      <article class="prose" style="margin:0 0 64px">${cards}</article>
    </main>`
  });
}

export function renderNotFound() {
  const head = seoHead({
    title: 'Página no encontrada',
    description: 'La ruta solicitada no existe en Trujillo AI.',
    path: '/404',
    robots: 'noindex, follow'
  });
  return `${head}<style>${marketingCss}
  .nf { min-height: 70vh; display:flex; align-items:center; justify-content:center; text-align:center; padding: 48px 20px; }
  .nf-code { font-family: var(--mono); font-size: 4rem; font-weight: 700; letter-spacing:-0.06em; }
  </style></head>
<body>
${marketingNav('')}
<main class="nf">
  <div>
    <div class="nf-code">404</div>
    <h1 style="margin:8px 0 12px;font-size:1.6rem">Esta página no existe</h1>
    <p style="color:var(--muted);max-width:420px;margin:0 auto 24px">La ruta no está en Trujillo AI. Vuelve al chat o consulta la documentación.</p>
    <div class="hero-actions">
      <a class="btn btn-white" href="/">Ir al chat</a>
      <a class="btn btn-ghost" href="/docs">Documentación</a>
    </div>
  </div>
</main>
${marketingFooter()}
</body></html>`;
}

function escapeAttr(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}
