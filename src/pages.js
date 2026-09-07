import { SITE, renderMarketingPage } from './site_theme.js';

export function getAboutHtml() {
  return renderMarketingPage({
    title: 'Acerca de Trujillo AI',
    description: 'Trujillo AI construye workspace de inteligencia para trabajo real: conversación, documentos, proyectos y herramientas en el edge.',
    path: '/about',
    active: 'about',
    jsonExtra: [{
      '@type': 'AboutPage',
      '@id': SITE.domain + '/about#page',
      name: 'Acerca de Trujillo AI',
      url: SITE.domain + '/about',
      mainEntity: { '@id': SITE.domain + '/#organization' }
    }, {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: '¿Qué es Trujillo AI?', acceptedAnswer: { '@type': 'Answer', text: 'Trujillo AI es un workspace de inteligencia empresarial con chat, documentos, proyectos, generación de imágenes y análisis de mercados, desplegado en el perímetro.' } },
        { '@type': 'Question', name: '¿Es gratuito?', acceptedAnswer: { '@type': 'Answer', text: 'El workspace web es gratuito con cuota diaria. También puedes usar tu propia clave de Groq (BYOK) para un acceso ilimitado.' } },
        { '@type': 'Question', name: '¿Quién lo desarrolla?', acceptedAnswer: { '@type': 'Answer', text: 'Alberto Trujillo Mingorance, arquitecto de sistemas de IA. Dominio ai.trujillomingorance.com.' } }
      ]
    }],
    body: `<header class="hero wrap">
      <p class="kicker">Acerca de</p>
      <h1>Una IA hecha para trabajar, no para rellenar.</h1>
      <p class="lede">Trujillo AI es un workspace de inteligencia para trabajo real: conversación, documentos, proyectos y herramientas sobre infraestructura de borde.</p>
    </header>
    <main class="wrap">
      <div class="grid-2">
        <article class="card">
          <h3>El producto</h3>
          <p>Un workspace de conversación propio: historial, proyectos, documentos, artefactos de código y un compositor limpio. Inferencia en Cloudflare Edge con aceleración Groq LPU.</p>
        </article>
        <article class="card">
          <h3>El fundador</h3>
          <p>${SITE.founder} diseña y opera Trujillo AI. Contacto: <a href="mailto:${SITE.email}">${SITE.email}</a>. Web personal: <a href="${SITE.personal}">trujillomingorance.com</a>.</p>
        </article>
      </div>
      <article class="prose">
        <h2>Principios</h2>
        <ul>
          <li>Respuestas directas, sin disclaimers de relleno.</li>
          <li>Tus prompts y documentos no se venden ni se usan para entrenar modelos públicos.</li>
          <li>Las claves BYOK viven solo en tu navegador.</li>
          <li>El código y los documentos que genera el modelo son tuyos.</li>
        </ul>
        <h2>Stack</h2>
        <p>Cloudflare Workers, KV, Groq LPU, modelos abiertos (GPT OSS, Qwen, Compound) y generación visual Flux 1.1 Ultra.</p>
      </article>
    </main>`
  });
}

export function getFeaturesHtml() {
  return renderMarketingPage({
    title: 'Capacidades',
    description: 'Chat, documentos, proyectos, búsqueda web, cotizaciones en vivo, generación de imágenes Flux y conectores REST en Trujillo AI.',
    path: '/features',
    active: 'features',
    body: `<header class="hero wrap">
      <p class="kicker">Producto</p>
      <h1>Todo lo que necesitas en un solo workspace.</h1>
      <p class="lede">Conversar, organizar, adjuntar y extraer documentos. Con herramientas propias de mercados, imagen y edge.</p>
    </header>
    <main class="wrap">
      <div class="grid-3">
        <article class="card"><h3>Chat de baja latencia</h3><p>Streaming SSE sobre Groq. Modelos de 20B a 120B. Longitud corto, normal o extendido.</p></article>
        <article class="card"><h3>Proyectos</h3><p>Agrupa conversaciones y documentos por iniciativa. Todo queda en el navegador.</p></article>
        <article class="card"><h3>Documentos y RAG</h3><p>Importa .md, .txt o .json. El modelo usa esos recuerdos en el contexto de cada pregunta.</p></article>
        <article class="card"><h3>Artefactos</h3><p>Cuando la respuesta es un documento o un bloque de código largo, se abre a la derecha para copiar o guardar.</p></article>
        <article class="card"><h3>Imagen Flux 1.1 Ultra</h3><p>Genera renders 1024×1024 desde el compositor. El prompt se puede refinar con el propio LLM.</p></article>
        <article class="card"><h3>Mercados en vivo</h3><p>Cashtags tipo $BTC o $NVDA con precio spot, variación y enlace a TradingView.</p></article>
        <article class="card"><h3>Búsqueda web</h3><p>Activa la píldora de búsqueda para anclar la respuesta a fuentes actuales.</p></article>
        <article class="card"><h3>Conectores</h3><p>Webhooks y APIs REST propias, más integraciones de imagen, web, mercados y memoria.</p></article>
        <article class="card"><h3>BYOK</h3><p>Pega tu clave Groq en Ajustes. No sale de localStorage. Acceso ilimitado.</p></article>
      </div>
    </main>`
  });
}

export function getModelsHtml() {
  return renderMarketingPage({
    title: 'Modelos',
    description: 'Modelos disponibles en Trujillo AI: OpenAI GPT OSS 120B, Qwen 3.6 27B, GPT OSS 20B Turbo y Groq Compound. Contexto de 131.072 tokens.',
    path: '/models',
    active: 'models',
    jsonExtra: [{
      '@type': 'ItemList',
      name: 'Modelos de Trujillo AI',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'OpenAI GPT OSS 120B' },
        { '@type': 'ListItem', position: 2, name: 'Qwen 3.6 27B' },
        { '@type': 'ListItem', position: 3, name: 'OpenAI GPT OSS 20B Turbo' },
        { '@type': 'ListItem', position: 4, name: 'Groq Compound' }
      ]
    }],
    body: `<header class="hero wrap">
      <p class="kicker">Modelos</p>
      <h1>Cuatro motores. Un compositor.</h1>
      <p class="lede">Cambia de modelo en la barra superior del chat. Todos corren sobre Groq LPU con contexto de 131.072 tokens.</p>
    </header>
    <main class="wrap">
      <div class="grid-2">
        <article class="card">
          <h3>OpenAI GPT OSS 120B</h3>
          <p>Modelo por defecto. Máxima capacidad para arquitectura, código y análisis largo. Contexto 131.072.</p>
        </article>
        <article class="card">
          <h3>Qwen 3.6 27B</h3>
          <p>Razonamiento lógico denso. Útil para matemáticas, criptografía y cadenas de deducción.</p>
        </article>
        <article class="card">
          <h3>OpenAI GPT OSS 20B Turbo</h3>
          <p>Respuestas cortas y rápidas. Ideal para iterar, resumir o chatear con latencia mínima.</p>
        </article>
        <article class="card">
          <h3>Groq Compound</h3>
          <p>Modelo compuesto de Groq. Equilibrio entre herramientas, síntesis y velocidad.</p>
        </article>
      </div>
      <p class="lede" style="margin-bottom:64px">El clasificador interno elige especialidad (arquitectura, seguridad, FinOps, DevOps, RAG, cumplimiento) según el prompt, independientemente del modelo.</p>
    </main>`
  });
}

export function getDocsHtml() {
  return renderMarketingPage({
    title: 'Documentación',
    description: 'Guía de Trujillo AI: chat, proyectos, documentos, artefactos, BYOK, imagen, mercados, Discord y privacidad.',
    path: '/docs',
    active: 'docs',
    jsonExtra: [{
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: '¿Cómo empiezo un chat?', acceptedAnswer: { '@type': 'Answer', text: 'Entra en ai.trujillomingorance.com, escribe en el compositor y pulsa enviar. Atajo: Ctrl o Cmd + K para una conversación nueva.' } },
        { '@type': 'Question', name: '¿Dónde se guardan los documentos?', acceptedAnswer: { '@type': 'Answer', text: 'Proyectos, historial y documentos RAG se guardan en el navegador (localStorage). Las claves BYOK no se envían a una base de datos.' } },
        { '@type': 'Question', name: '¿Cómo funciona BYOK?', acceptedAnswer: { '@type': 'Answer', text: 'En Ajustes pega una clave Groq (gsk_...). Se almacena solo en localStorage y viaja por TLS en el encabezado x-groq-user-key.' } }
      ]
    }],
    body: `<header class="hero wrap">
      <p class="kicker">Documentación</p>
      <h1>Cómo usar Trujillo AI</h1>
      <p class="lede">Workspace, organización de documentos, proyectos y herramientas. Todo en el navegador.</p>
    </header>
    <main class="wrap prose">
      <h2>Empezar</h2>
      <ol>
        <li>Abre <a href="/">ai.trujillomingorance.com</a>.</li>
        <li>Elige modelo en la barra superior.</li>
        <li>Escribe. Enter envía; Shift+Enter es salto de línea. <code>Ctrl/Cmd+K</code> crea un chat nuevo.</li>
      </ol>
      <h2>Proyectos</h2>
      <p>En la barra lateral, abre Proyectos y crea uno. Asigna conversaciones y documentos a ese proyecto para no mezclar contextos (trabajo, trading, código).</p>
      <h2>Documentos</h2>
      <p>Importa archivos o pega notas. Trujillo las inyecta como memoria RAG (hasta 20 piezas, las 6 más recientes en cada llamada). Los artefactos de código se pueden guardar aquí desde el panel derecho.</p>
      <h2>Compositor</h2>
      <ul>
        <li><strong>Buscar en la web</strong> — fuentes actuales.</li>
        <li><strong>Generar imagen</strong> — Flux 1.1 Ultra.</li>
        <li><strong>Adjuntar</strong> — .txt .md .json .js .ts .py .csv .log (máx. 250 KB).</li>
        <li><strong>Micrófono</strong> — dictado en español.</li>
      </ul>
      <h2>Cuenta y BYOK</h2>
      <p><a href="/register">Crea cuenta</a> para verificar el correo, o pega tu clave Groq en Ajustes. Invitados tienen cuota diaria de 50.000 tokens.</p>
      <h2>Discord</h2>
      <p>El mismo motor responde en Discord. Comandos de chat, memoria y personalidad viven en el Worker.</p>
      <h2>Legal</h2>
      <p><a href="/terms-of-use">Términos</a> y <a href="/privacy-policy">privacidad</a>. Los datos de chat no se usan para entrenar modelos públicos.</p>
    </main>`
  });
}
