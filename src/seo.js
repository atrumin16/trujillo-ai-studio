export const ORIGIN = 'https://ai.trujillomingorance.com'
export const BRAND = 'Trujillo AI'
export const HREFLANGS = ['es', 'en', 'zh', 'zh-TW', 'hi', 'ar', 'bn', 'pt', 'ru', 'ur', 'id', 'de', 'ja', 'vi', 'tr', 'ko', 'fa', 'fil', 'it', 'th', 'pl', 'uk', 'ms', 'nl', 'fr', 'ca']

const COPY = {
  es: {
    homeTitle: 'Trujillo AI | Workspace de inteligencia empresarial',
    homeDesc: 'Workspace empresarial de inteligencia. Chat, documentos, proyectos, investigación e imagen en el perímetro.',
    aboutTitle: 'Acerca de | Trujillo AI',
    aboutDesc: 'Trujillo AI construye workspace de inteligencia para trabajo real: conversación, documentos, proyectos y herramientas en el edge.',
    featuresTitle: 'Producto | Trujillo AI',
    featuresDesc: 'Chat de baja latencia, documentos, proyectos, búsqueda, mercados e imagen en un solo workspace.',
    modelsTitle: 'Modelos | Trujillo AI',
    modelsDesc: 'Motores de alta capacidad para código, razonamiento y respuestas rápidas. Un compositor, varios modelos.',
    docsTitle: 'Documentación | Trujillo AI',
    docsDesc: 'Guía de Trujillo AI: chat, proyectos, documentos, cuenta e integraciones.',
    loginTitle: 'Acceder | Trujillo AI',
    loginDesc: 'Entra en tu workspace de Trujillo AI.',
    registerTitle: 'Crear cuenta | Trujillo AI',
    registerDesc: 'Crea una cuenta para sincronizar historial, proyectos y documentos.',
    termsTitle: 'Términos | Trujillo AI',
    termsDesc: 'Términos de servicio de Trujillo AI.',
    privacyTitle: 'Privacidad | Trujillo AI',
    privacyDesc: 'Política de privacidad y gobierno de datos de Trujillo AI.',
    notFoundTitle: 'Página no encontrada | Trujillo AI',
    notFoundDesc: 'Esa ruta no existe en Trujillo AI.',
    shareTitle: 'Conversación | Trujillo AI',
    shareDesc: 'Conversación compartida en Trujillo AI.',
  },
  en: {
    homeTitle: 'Trujillo AI | Enterprise Intelligence Workspace',
    homeDesc: 'Enterprise intelligence workspace. Chat, documents, projects, research and image generation at the edge.',
    aboutTitle: 'About | Trujillo AI',
    aboutDesc: 'Trujillo AI builds an intelligence workspace for real work: conversation, documents, projects and edge tools.',
    featuresTitle: 'Product | Trujillo AI',
    featuresDesc: 'Low-latency chat, documents, projects, search, markets and images in one workspace.',
    modelsTitle: 'Models | Trujillo AI',
    modelsDesc: 'High-capacity engines for code, reasoning and fast answers. One composer, several models.',
    docsTitle: 'Documentation | Trujillo AI',
    docsDesc: 'How to use Trujillo AI: chat, projects, documents, account and integrations.',
    loginTitle: 'Sign in | Trujillo AI',
    loginDesc: 'Sign in to your Trujillo AI workspace.',
    registerTitle: 'Create account | Trujillo AI',
    registerDesc: 'Create an account to sync history, projects and documents.',
    termsTitle: 'Terms | Trujillo AI',
    termsDesc: 'Trujillo AI terms of service.',
    privacyTitle: 'Privacy | Trujillo AI',
    privacyDesc: 'Trujillo AI privacy policy and data governance.',
    notFoundTitle: 'Page not found | Trujillo AI',
    notFoundDesc: 'That path is not on Trujillo AI.',
    shareTitle: 'Conversation | Trujillo AI',
    shareDesc: 'A shared conversation on Trujillo AI.',
  },
}

export function pageMeta(page, lang = 'es') {
  const pack = COPY[lang] || COPY.en
  const fallback = COPY.en
  return {
    title: pack[page + 'Title'] || fallback[page + 'Title'] || BRAND,
    description: pack[page + 'Desc'] || fallback[page + 'Desc'] || COPY.es.homeDesc,
  }
}

export function hreflangLinks(url) {
  return HREFLANGS.map((c) => `<link rel="alternate" hreflang="${c}" href="${url}">`).join('\n') +
    `\n<link rel="alternate" hreflang="x-default" href="${url}">`
}

export function jsonLdFor(path = '/') {
  const url = ORIGIN + (path === '/index.html' ? '/' : path)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORIGIN + '/#organization',
        name: BRAND,
        url: ORIGIN,
        logo: ORIGIN + '/avatar.png',
        email: 'alberto@trujillomingorance.com',
        sameAs: ['https://trujillomingorance.com', 'https://rewrite.trujillomingorance.com', 'https://github.com/atrumin16', 'https://x.com/atrumin16'],
      },
      {
        '@type': 'WebSite',
        '@id': ORIGIN + '/#website',
        url: ORIGIN,
        name: BRAND,
        inLanguage: ['es', 'en'],
        publisher: { '@id': ORIGIN + '/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: ORIGIN + '/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': ORIGIN + '/#app',
        name: BRAND,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: ORIGIN,
        image: ORIGIN + '/avatar.png',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        description: COPY.en.homeDesc,
        publisher: { '@id': ORIGIN + '/#organization' },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://rewrite.trujillomingorance.com/#app',
        name: 'Rewrite AI — Humanización 0% IA & Corrector',
        applicationCategory: 'TextEditor',
        operatingSystem: 'Web',
        url: 'https://rewrite.trujillomingorance.com',
        image: ORIGIN + '/avatar.png',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
        description: 'Motor de humanización y reescritura de texto 0% IA y corrección editorial indetectable.',
        publisher: { '@id': ORIGIN + '/#organization' },
      },
      {
        '@type': 'WebPage',
        '@id': url + '#webpage',
        url,
        name: path === '/' ? BRAND : undefined,
        isPartOf: { '@id': ORIGIN + '/#website' },
        about: { '@id': ORIGIN + '/#app' },
      },
    ],
  }
}

export function robotsTxt() {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /share/

User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot
Allow: /

Sitemap: ${ORIGIN}/sitemap.xml
`
}

export function sitemapXml() {
  const lastmod = new Date().toISOString().slice(0, 10)
  const pages = [
    ['/', '1.0', 'daily'],
    ['/features', '0.9', 'weekly'],
    ['/models', '0.8', 'weekly'],
    ['/docs', '0.8', 'weekly'],
    ['/about', '0.7', 'monthly'],
    ['/login', '0.5', 'monthly'],
    ['/register', '0.5', 'monthly'],
    ['/terms-of-use', '0.3', 'yearly'],
    ['/privacy-policy', '0.3', 'yearly'],
  ]
  const urls = pages.map(([path, priority, changefreq]) => {
    const loc = ORIGIN + path
    const alts = HREFLANGS.map((c) => `    <xhtml:link rel="alternate" hreflang="${c}" href="${loc}"/>`).join('\n')
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${alts}
    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}"/>
  </url>`
  }).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`
}

export function llmsTxt() {
  return `# Trujillo AI
> Enterprise intelligence workspace. Chat, documents, projects, research and image generation at the edge.

## Product
- [Workspace](${ORIGIN}/): primary chat
- [Rewrite AI & Corrector 0% IA](https://rewrite.trujillomingorance.com/): Stealth AI text humanizer & professional text corrector
- [Product](${ORIGIN}/features)
- [Models](${ORIGIN}/models)
- [Documentation](${ORIGIN}/docs)
- [About](${ORIGIN}/about)

## Legal
- [Terms](${ORIGIN}/terms-of-use)
- [Privacy](${ORIGIN}/privacy-policy)

## Contact
- ${ORIGIN}
- alberto@trujillomingorance.com
`
}

export function securityTxt() {
  const exp = new Date()
  exp.setFullYear(exp.getFullYear() + 1)
  return `Contact: mailto:alberto@trujillomingorance.com
Expires: ${exp.toISOString()}
Preferred-Languages: es, en
Canonical: ${ORIGIN}/.well-known/security.txt
`
}

export function webManifest() {
  return {
    name: BRAND,
    short_name: 'Trujillo',
    description: COPY.en.homeDesc,
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    lang: 'es',
    categories: ['productivity', 'business'],
    icons: [{ src: '/avatar.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }],
  }
}

export const SITE_PAGES = {
  '/about': { page: 'about', key: 'about', path: '/about' },
  '/features': { page: 'features', key: 'features', path: '/features' },
  '/models': { page: 'models', key: 'models', path: '/models' },
  '/docs': { page: 'docs', key: 'docs', path: '/docs' },
  '/terms-of-use': { page: 'terms', key: 'terms', path: '/terms-of-use' },
  '/terms': { page: 'terms', key: 'terms', path: '/terms-of-use' },
  '/privacy-policy': { page: 'privacy', key: 'privacy', path: '/privacy-policy' },
  '/privacy': { page: 'privacy', key: 'privacy', path: '/privacy-policy' },
}
