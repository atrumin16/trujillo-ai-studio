import { renderLegalPage, renderNotFound } from './site_theme.js';

export const termsHtml = renderLegalPage({
  title: 'Términos de Servicio',
  description: 'Términos y condiciones de uso de Trujillo AI en ai.trujillomingorance.com.',
  path: '/terms-of-use',
  badge: 'Legal',
  updated: 'Versión 2026.2 · ai.trujillomingorance.com',
  sections: [
    {
      title: '1. Aceptación y ámbito',
      html: `<p>Al usar <strong>Trujillo AI</strong> en <a href="https://ai.trujillomingorance.com">ai.trujillomingorance.com</a> o el bot de Discord asociado, aceptas estos términos.</p>`
    },
    {
      title: '2. El servicio',
      html: `<p>Trujillo AI ofrece chat con modelos abiertos de alta capacidad (GPT OSS, Qwen, Groq Compound), documentos, proyectos, búsqueda web, cotizaciones y generación visual Flux 1.1 Ultra sobre Cloudflare Edge y Groq LPU.</p>
      <p>El servicio está pensado para ingeniería, análisis, escritura y trabajo técnico. No es asesoramiento legal, médico ni de inversión vinculante.</p>`
    },
    {
      title: '3. Propiedad y uso',
      html: `<ul>
        <li><strong>Tuyo:</strong> prompts, código, documentos y resultados que generes.</li>
        <li><strong>Prohibido:</strong> malware, ataques, scraping abusivo o cualquier uso ilegal.</li>
        <li><strong>Verificación:</strong> el usuario debe revisar el código y los datos antes de usarlos en producción.</li>
      </ul>`
    },
    {
      title: '4. Claves API (BYOK)',
      html: `<p>Si configuras una clave Groq, se guarda <strong>solo en tu navegador</strong> (<code>localStorage</code>) y viaja cifrada por TLS. No se persiste en bases de datos del servidor.</p>`
    },
    {
      title: '5. Disponibilidad',
      html: `<p>La plataforma corre en el edge global. Podemos cambiar modelos, cuotas o defensas de tráfico para mantener el clúster estable.</p>`
    }
  ]
});

export const privacyHtml = renderLegalPage({
  title: 'Política de Privacidad',
  description: 'Política de privacidad y gobierno de datos de Trujillo AI.',
  path: '/privacy-policy',
  badge: 'Privacidad',
  updated: 'Versión 2026.2 · ai.trujillomingorance.com',
  sections: [
    {
      title: '1. Sin venta de datos',
      html: `<ul>
        <li>No vendemos ni monetizamos prompts, documentos ni resultados.</li>
        <li>No usamos tus entradas para entrenar modelos públicos.</li>
      </ul>`
    },
    {
      title: '2. Inferencia efímera',
      html: `<p>El chat se procesa en memoria mediante streaming cifrado (SSE + TLS 1.3). No indexamos el contenido de las sesiones de inferencia en servidores intermedios.</p>`
    },
    {
      title: '3. Documentos y proyectos',
      html: `<p>Historial, proyectos y documentos RAG se guardan de forma local en tu navegador, salvo que una función concreta (cuenta, chat compartido) requiera KV de Cloudflare. Puedes borrar la memoria en cualquier momento.</p>`
    },
    {
      title: '4. Cuentas y correo',
      html: `<ul>
        <li>Las contraseñas se almacenan con hash y sal.</li>
        <li>Puedes entrar con Google o X. En ese caso guardamos el identificador de la cuenta, el nombre y el avatar que nos envía el proveedor.</li>
        <li>El correo transaccional sale desde <code>no-reply@trujillomingorance.com</code> sin trackers publicitarios.</li>
      </ul>`
    },
    {
      title: '5. GDPR',
      html: `<p>Acceso, rectificación o borrado: <strong>alberto@trujillomingorance.com</strong>.</p>`
    }
  ]
});

export const notFoundHtml = renderNotFound();
