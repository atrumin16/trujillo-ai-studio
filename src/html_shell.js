import { ORIGIN, BRAND, jsonLdFor, hreflangLinks } from './seo.js'

const ASSET_V = '48'

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

export function htmlShell({ title, description, path, kind = 'site', page = '', lang = 'es', ogType = 'website', robots = 'index, follow', geo = null }) {
  const url = ORIGIN + path
  const css = kind === 'app' ? '/assets/app.css' : '/assets/site.css'
  const js = kind === 'app' ? '/assets/app.js' : '/assets/site.js'
  const fonts = kind === 'app'
    ? 'Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500'
    : 'Inter:wght@400;500;600;700;800&family=Newsreader:opsz,wght@6..72,500;6..72,600&family=IBM+Plex+Mono:wght@400;500'
  const marked = kind === 'app'
    ? '<script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js" defer></script>\n'
    : ''
  const gsi = (page === 'login' || page === 'register')
    ? '<script src="https://accounts.google.com/gsi/client" async defer></script>\n'
    : ''
  const isShare = path.startsWith('/share/')
  const card = isShare ? 'summary' : 'summary_large_image'
  const robotsFull = isShare
    ? 'noindex, nofollow'
    : (robots.includes('max-image') ? robots : robots + ', max-image-preview:large, max-snippet:-1, max-video-preview:-1')
  const ld = isShare
    ? { '@context': 'https://schema.org', '@type': 'SocialMediaPosting', headline: title, abstract: description, url, isPartOf: { '@type': 'WebSite', name: BRAND, url: ORIGIN } }
    : jsonLdFor(path)
  const locale = lang === 'en' ? 'en_US' : lang === 'pt' ? 'pt_PT' : lang === 'zh' ? 'zh_CN' : `${lang}_${(lang || 'es').toUpperCase()}`
  return `<!DOCTYPE html>
<html lang="${esc(lang)}"${page ? ` data-page="${esc(page)}"` : ''}>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="application-name" content="${BRAND}">
<meta name="apple-mobile-web-app-title" content="${BRAND}">
<meta name="theme-color" content="#080c14">
<meta name="color-scheme" content="dark">
<meta name="robots" content="${esc(robotsFull)}">
<link rel="canonical" href="${esc(url)}">
<link rel="sitemap" type="application/xml" href="${ORIGIN}/sitemap.xml">
${hreflangLinks(url)}
<link rel="icon" href="/avatar.png">
<link rel="apple-touch-icon" href="${ORIGIN}/avatar.png">
<link rel="manifest" href="/manifest.json">
<meta property="og:type" content="${esc(ogType)}">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${ORIGIN}/avatar.png">
<meta property="og:image:alt" content="${BRAND}">
<meta property="og:locale" content="${esc(locale)}">
<meta property="og:locale:alternate" content="en_US">
<meta property="og:locale:alternate" content="es_ES">
<meta name="publisher" content="${BRAND}">
<meta name="twitter:card" content="${card}">
<meta name="twitter:site" content="@atrumin16">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${ORIGIN}/avatar.png">
<meta name="twitter:image:alt" content="${BRAND}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${fonts}&display=swap">
<link rel="stylesheet" href="${css}?v=${ASSET_V}">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body>
<div id="app"></div>
<script>
window.TA_GEO=${JSON.stringify(geo && typeof geo === 'object' ? geo : {}).replace(/</g, '\\u003c')};
try {
  if (localStorage.getItem('ta_lang') !== '${esc(lang)}') {
    localStorage.setItem('ta_lang', '${esc(lang)}');
    document.cookie = 'ta_lang=${esc(lang)};path=/;max-age=31536000;SameSite=Lax';
  }
} catch(e) {}
</script>
${gsi}${marked}<script src="/assets/i18n/${esc(lang)}.js?v=${ASSET_V}" defer></script>
<script src="/assets/i18n.js?v=${ASSET_V}" defer></script>
<script src="${js}?v=${ASSET_V}" defer></script>
</body>
</html>
`
}

export function htmlResponse(opts, status = 200, extraHeaders = {}) {
  const isApp = opts.kind === 'app'
  return new Response(htmlShell(opts), {
    status,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': isApp
        ? 'private, no-store'
        : 'public, max-age=300, s-maxage=86400, stale-while-revalidate=604800',
      'CDN-Cache-Control': isApp ? 'no-store' : 'max-age=86400',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      ...extraHeaders,
    },
  })
}
