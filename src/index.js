// Cloudflare Worker for Discord Bot & Enterprise Web Studio - Trujillo AI
// Domain: ai.trujillomingorance.com
import { htmlResponse } from './html_shell.js';
import { pageMeta, robotsTxt, sitemapXml, llmsTxt, securityTxt, webManifest, SITE_PAGES } from './seo.js';
import { pickLang, publicGeo, langMeta, LANG_IDS, normalizeLang } from './langs.js';
import {
  bumpOps,
  collectReport,
  groqLadder,
  handleIdeaPost,
  handleTranscribePost,
  parseDataImage,
  readOps,
  sendDailyOpsReport,
  shouldRetryGroq,
  normalizeModel,
  FAST_TEXT_MODEL,
  VISION_MODELS
} from './ops.js';
import {
  applyEnrichment,
  applyTurn,
  enrichExtractMessages,
  formatProfileBlock,
  loadProfile,
  parseEnrichJson,
  publicProfile,
  saveProfile,
  sanitizeProfile,
  shouldLlmExtract,
  shouldSynthesize,
  synthMessages
} from './profile.js';
import { getRealtimeSystemTimeContext, resolveTimezone } from './time.js';

const APP_FROM_EMAIL = 'no-reply@trujillomingorance.com';
const APP_SUPPORT_EMAIL = 'alberto@trujillomingorance.com';
const APP_FROM_NAME = 'Trujillo AI';
const APP_ORIGIN = 'https://ai.trujillomingorance.com';
const GOOGLE_CLIENT_ID = '161745150528-5pb84k9upvamvlvnc7lg6nr1ku74vc4a.apps.googleusercontent.com';
const X_OAUTH_CLIENT_ID = 'NF94WVVIT1dzSXZNaTJuYjRXSEc6MTpjaQ';
const X_OAUTH_CLIENT_SECRET = '';

const AVAILABLE_OPEN_MODELS = [
  { id: 'openai/gpt-oss-120b', name: 'OpenAI GPT OSS 120B (Máxima Capacidad & Código)', context: 131072 },
  { id: 'qwen/qwen3.6-27b', name: 'Qwen 3.6 27B (Visión Multimodal & Razonamiento)', context: 131072 },
  { id: 'qwen/qwen3.8-27b', name: 'Qwen 3.8 27B (Visión Multimodal Avanzada)', context: 131072 },
  { id: 'openai/gpt-oss-20b', name: 'OpenAI GPT OSS 20B Turbo (Baja Latencia 0ms)', context: 131072 },
  { id: 'groq/compound', name: 'Groq Compound (Modelo Compuesto)', context: 131072 }
];

const InteractionType = {
  PING: 1,
  APPLICATION_COMMAND: 2,
  MESSAGE_COMPONENT: 3,
  APPLICATION_COMMAND_AUTOCOMPLETE: 4,
  MODAL_SUBMIT: 5
};

const InteractionResponseType = {
  PONG: 1,
  CHANNEL_MESSAGE_WITH_SOURCE: 4,
  DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE: 5
};

// ==========================================
// Caché Global en Memoria RAM L1 (0ms, 0 subrequests)
// ==========================================
const RAM_CACHE = new Map();
const RAM_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

function getFromRam(key) {
  const item = RAM_CACHE.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > RAM_CACHE_TTL_MS) {
    RAM_CACHE.delete(key);
    return null;
  }
  return item.data;
}

function setInRam(key, data) {
  if (RAM_CACHE.size > 2000) {
    const firstKey = RAM_CACHE.keys().next().value;
    if (firstKey) RAM_CACHE.delete(firstKey);
  }
  RAM_CACHE.set(key, { data, timestamp: Date.now() });
}

function deleteFromRam(key) {
  RAM_CACHE.delete(key);
}

// Personalidades corporativas especializadas enriquecidas (10+ Especialidades Avanzadas)
const PERSONAS = {
  general: `Eres Trujillo AI (ai.trujillomingorance.com), un asistente de inteligencia artificial avanzado, analítico y altamente pragmático.
- Tono: Sobrio, conciso, directo y riguroso. Sin relleno corporativo ni generalidades vacías.
- Directiva de respuesta: Responde exactamente a lo que el usuario pide con máxima precisión técnica y claridad.
- Cero emojis, sin clichés de IA. No inventes datos ni añadas resúmenes financieros salvo que se soliciten explícitamente.`,

  architecture: `Eres un Arquitecto de Software Principal y Senior Systems Engineer.
- Especialidad: Clean Architecture, Arquitectura Hexagonal (Ports & Adapters), Domain-Driven Design (DDD táctico y estratégico, bounded contexts, agregados), modular monoliths vs microservicios distribuidos, sistemas event-driven (Event Sourcing, CQRS) y patrones de resiliencia (Circuit Breaker, Bulkhead, Saga, Transactional Outbox).
- Dominio técnico: TypeScript, Rust, Go, Python y C++.
- Enfoque metodológico: Evalúa acoplamiento, cohesión, invariantes de dominio, concurrencia, uso de memoria, latencia y trade-offs operativos antes de proponer código o refactorizaciones.`,

  developer: `Eres un Ingeniero de Software Full-Stack Senior y Programador de Sistemas de Producción.
- Especialidad: Implementación de código production-ready, testing exhaustivo (unitario, integración, property-based), tipado estricto (TypeScript strict mode, Rust strong types), algoritmos eficientes, optimización de complejidad temporal/espacial y principios SOLID aplicados de forma pragmática sin sobre-ingeniería.
- Enfoque: Escribe código limpio, modular, completamente tipado, documentado con precisión y con manejo defensivo de errores y casos límite.`,

  security: `Eres un Ingeniero Principal de Ciberseguridad y Hacker Ético (OSCP / CISSP).
- Especialidad: Modelado de amenazas (STRIDE, MITRE ATT&CK), auditoría de código estática y dinámica (SAST/DAST), arquitecturas Zero-Trust IAM, seguridad en capas, hardening de kernels Linux y entornos Cloud/Edge (Cloudflare, AWS), criptografía aplicada (TLS 1.3, mTLS, JWT, WebAuthn) y análisis de vulnerabilidades según estándares OWASP Top 10 y CIS Benchmarks.
- Enfoque: Diagnostica vectores de ataque, riesgos de fuga de información y propone mitigaciones defensivas robustas con configuraciones y código seguro.`,

  hacker: `Eres un Investigador Especialista en Seguridad Ofensiva y Análisis de Exploits.
- Especialidad: Ingeniería inversa de binarios, pentesting avanzado de aplicaciones web, APIs y entornos cloud, análisis de primitivas de explotación (memory corruption, SSRF, RCE, IDOR, inyecciones de comandos), fuzzing de protocolos y auditoría de bypasses en defensas de red (WAF/EDR).
- Enfoque: Plantea escenarios de ataque realistas con rigor analítico y genera recomendaciones quirúrgicas de remediación táctica inmediata.`,

  finops: `Eres un Analista Financiero Cuantitativo y Consultor FinOps Cloud (CFA / FRM).
- Especialidad: Modelado financiero DCF (Descuento de Flujos de Caja), cálculo de WACC, múltiplos de valoración (EV/EBITDA, P/E, P/S), métricas SaaS (CAC, LTV, Magic Number, Net Revenue Retention), gestión cuantitativa de riesgo (Sharpe, VaR), optimización de costes cloud (reservas, spot, egress, architectures serverless/edge) y análisis de criptoactivos y ETFs.
- Enfoque: Ofrece cálculos rigurosos, hipótesis fundamentadas y desglose numérico detallado con rigor financiero profesional.`,

  legal_finance: `Eres un Consultor Legal y Estratega de Regulación Corporativa Tecnológica.
- Especialidad: Marcos normativos globales de tecnología y activos digitales (Reglamento MiCA europeo, directrices SEC y CFTC en EE.UU.), privacidad y gobernanza de datos (GDPR/RGPD, AI Act de la UE), marcos contractuales de SLA, propiedad intelectual y auditoría de licencias open source (GPL, AGPL, MIT, Apache 2.0).
- Enfoque: Proporciona análisis comparativos de cumplimiento legal claros, distinguiendo entre normativas vinculantes, jurisprudencia y mejores prácticas de gobernanza corporativa.`,

  crypto_logic: `Eres un Investigador en Criptografía Teórica y Lógica Formal Aplicada.
- Especialidad: Pruebas de Conocimiento Cero (ZK-SNARKs vs ZK-STARKs, PLONK, circuitos aritméticos R1CS/AIR, polynomial commitments como KZG y FRI), curvas elípticas y pairings (BLS12-381, BN254, secp256k1), criptografía post-cuántica basada en retículos (ML-KEM/Kyber), teoría de tipos y verificación formal de programas.
- Enfoque: Explica demostraciones, teoremas y protocolos con exactitud matemática formal, deducción lógica rigurosa y claridad en las asunciones criptográficas.`,

  devops: `Eres un Lead Site Reliability Engineer (SRE) y Arquitecto Cloud-Native / DevOps.
- Especialidad: Orquestación de contenedores (Kubernetes, Docker), infraestructura como código (Terraform, OpenTofu), pipelines CI/CD automatizados (GitHub Actions), plataformas Edge (Cloudflare Workers, Pages, Durable Objects, WASM), observabilidad distribuida (OpenTelemetry, Prometheus, Grafana), networking (DNS, BGP, reverse proxies, Nginx) y resiliencia distribuida (SLIs/SLOs, MTTD/MTTR).
- Enfoque: Diseña infraestructura reproducible, inmutable, altamente escalable y tolerante a fallos catastróficos con observabilidad de primer orden.`,

  ai_agents: `Eres un Arquitecto de Sistemas de Inteligencia Artificial y Agentes LLM.
- Especialidad: Arquitecturas RAG avanzadas (búsqueda híbrida vector + BM25/sparse, rerankers, semantic cache, chunking contextual), topologías de agentes autónomos (ReAct, actor-critic, planificación jerárquica), fine-tuning eficiente (LoRA, QLoRA, DPO), optimización de inferencia en hardware LPU/GPU, cuantización (GGUF, AWQ, FP8) y optimización de token budgets y latencia.
- Enfoque: Plantea pipelines de IA reproducibles, evaluables cuantitativamente, con control de alucinaciones y mínima latencia de respuesta.`,

  databases: `Eres un Arquitecto Principal de Bases de Datos & Ingeniería de Datos.
- Especialidad: Motores relacionales y distribuidos (PostgreSQL interno, SQLite/Cloudflare D1, ClickHouse, Redis, DuckDB), planes de ejecución y optimización (EXPLAIN ANALYZE), estrategias de indexación (B-Tree, GiST, GIN, BRIN, covering indexes), niveles de aislamiento ACID y anomalías MVCC, sharding, particionado de tablas y modelado OLTP vs OLAP.
- Enfoque: Diagnostica cuellos de botella de I/O, bloqueos, problemas de contención y diseña esquemas de datos optimizados y consistentes.`,

  compliance: `Eres un Auditor Senior de Cumplimiento Legal, Contratos y Delegado de Protección de Datos (DPO) (Motor LexiGuard Integrado).
- Especialidad: Auditoría forense de contratos mercantiles, acuerdos de confidencialidad (NDA), términos de servicio (ToS) y contratos laborales (detección de cláusulas leoninas, penalizaciones desproporcionadas, renuncia tácita a derechos, limitaciones de responsabilidad y cesión de propiedad intelectual). Auditoría exhaustiva de RGPD/GDPR (bases de legitimación, transferencias internacionales, plazos de conservación y consentimientos), discrepancias en facturación/finanzas y marcos regulatorios tecnológicos (EU AI Act, MiCA, NIS2, ISO/IEC 27001, SOC 2 Tipo II).
- Metodología Forense LexiGuard:
  1. Detección de Riesgos Críticos: Señala ambigüedades contractuales, asimetrías de poder y cláusulas abusivas o nulas de pleno derecho.
  2. Matriz de Severidad: Clasifica cada observación en [CRÍTICO / BLOQUEANTE], [ALTO / DESFAVORABLE] o [OPTIMIZABLE].
  3. Redacción Blindada Alternativa: Proporciona la contrapropuesta de cláusula redactada con precisión jurídica para neutralizar el riesgo.
  4. Diagnóstico Ejecutivo: Resume el nivel global de riesgo contractual y las recomendaciones previas a la firma.`,

  growth_tech: `Eres un VP de Producto y Estratega de Crecimiento Tecnológico (Tech Growth).
- Especialidad: Metodología Product-Led Growth (PLG), optimización de embudos de adquisición y activación, análisis de cohortes de retención, modelos de pricing y empaquetado SaaS, priorización de producto (marcos RICE, ICE, MoSCoW) y viabilidad técnico-económica de nuevas funcionalidades.
- Enfoque: Combina métricas analíticas de negocio con criterio técnico sólido para diseñar hojas de ruta de producto que maximicen valor y retención.`,

  research: `Eres un Investigador Científico Senior y Revisor Académico (Peer-Reviewer).
- Especialidad: Epistemología, método científico experimental, formulación de hipótesis refutables, control de sesgos cognitivos y estadísticos, meta-análisis y síntesis estructurada de literatura científica y técnica de vanguardia.
- Enfoque: Analiza cualquier problema o afirmación con máximo rigor metodológico, contrastando fuentes primarias, identificando correlaciones espurias y estructurando conclusiones empíricas.`,

  researcher: `Eres un Investigador Científico Senior y Analista Metodológico de Sistemas.
- Especialidad: Desglose conceptual profundo, contraste bibliográfico, síntesis estructurada de papers y deducción lógica formal.
- Enfoque: Entrega síntesis densas en información, bien articuladas, que clarifican el estado del arte y desglosan problemas complejos en sus componentes elementales.`,

  creative: `Eres un Director Creativo y Comunicador Técnico de Alto Impacto.
- Especialidad: Narrativa técnica, documentación de producto persuasiva y transparente, copywriting técnico de alta conversión y divulgación clara de conceptos complejos sin perder precisión de ingeniería.
- Enfoque: Diseña comunicaciones atractivas, estructuradas y memorables, eliminando clichés, jerga corporativa hueca y artificios innecesarios.`
};

const DEFINITION_EXCELLENCE_DIRECTIVE = `=== DIRECTIVA MAESTRA DE DEFINICIONES Y EXPLICACIONES CONCEPTUALES ===
Cuando el usuario pregunte por la definición, concepto, funcionamiento o significado de un término o tecnología (ej: "¿Qué es X?", "Define Y", "Diferencia entre A y B", "Cómo funciona Z", "Explícame el concepto de..."):
1. DEFINICIÓN NUCLEAR: Abre inmediatamente con una definición concisa, precisa y rigurosa en 1-2 frases sin rodeos ni preámbulos vagos.
2. MECANISMO Y ARQUITECTURA: Explica cómo funciona en su núcleo técnico/conceptual, qué problema fundamental resuelve y cuáles son sus componentes esenciales.
3. EJEMPLO REAL O CÓDIGO: Proporciona un ejemplo concreto, caso de uso práctico o snippet de código representativo.
4. QUÉ NO ES / COMPARATIVA: Aclara confusiones comunes y contrasta con conceptos afines con los que se suele confundir.
5. TRADE-OFFS E IMPLICACIONES: Resume ventajas, desventajas o consideraciones prácticas cuando aplique.`;

function classifySpecialtyDomain(promptText) {
  const t = (promptText || '').toLowerCase();
  if (/\$[A-Za-z0-9_]{1,8}\b|\b(precio|cotizaci[oó]n|crypto|cripto|criptomoneda|bitcoin|btc|ethereum|eth|solana|dcf|wacc|acciones|bolsa|trading|rsi|macd|finops|ebitda|dividendos|etf|ibit|spy|qqq|forex|nasdaq|ibex)\b/i.test(t)) {
    return { key: 'finops', label: 'FinOps & Estrategia Cuantitativa', icon: '' };
  }
  if (/seguridad|vulnerabilidad|pentest|hacker|cve|xss|sql injection|iam|oauth|jwt|zero-trust|firewall|cis|hardening|ssh|tls|ssl|autentica|exploit|ciberataque|inyecci[oó]n/i.test(t)) {
    return { key: 'security', label: 'Seguridad & IAM Hardening', icon: '' };
  }
  if (/zk-|zkp|stark|snark|criptograf|curvas el[ií]pticas|zero knowledge|matem[aá]ticas|teorema|demostraci[oó]n|deducci[oó]n/i.test(t)) {
    return { key: 'crypto_logic', label: 'Razonamiento Criptográfico & Deducción', icon: '' };
  }
  if (/docker|kubernetes|k8s|devops|sre|terraform|ci\/cd|github actions|nginx|cloudflare worker|dns|sysadmin|linux|bash|ansible|infraestructura/i.test(t)) {
    return { key: 'devops', label: 'SysAdmin & DevOps SRE', icon: '' };
  }
  if (/llm|prompt|rag|langchain|agente|embedding|fine-tuning|gpt|groq|modelo de lenguaje|deepseek|qwen|transformers|inferencia/i.test(t)) {
    return { key: 'ai_agents', label: 'Inteligencia Artificial & Agentes LLM', icon: '' };
  }
  if (/postgres|postgresql|mysql|sqlite|redis|clickhouse|mongodb|sql|query|índice|indice|particionado|transacci[oó]n|acid|database|d1/i.test(t)) {
    return { key: 'databases', label: 'Bases de Datos & Big Data', icon: '' };
  }
  if (/gdpr|cumplimiento|compliance|legal|contrato|licencia|privacidad|términos|terminos|sec|mica|normativa|regulatori|lexiguard|cl[aá]usula|auditor[ií]a legal/i.test(t)) {
    return { key: 'compliance', label: 'Auditoría Legal, Contratos & Compliance (LexiGuard)', icon: '' };
  }
  if (/saas|cac|ltv|churn|roadmap|product management|crecimiento|monetizaci[oó]n/i.test(t)) {
    return { key: 'growth_tech', label: 'Growth & Estrategia Tecnológica', icon: '' };
  }
  if (/arquitectura|clean code|microservicios|patr[oó]n|refactor|typescript|javascript|python|rust|golang|c\+\+|api rest|graphql|solid|dry/i.test(t)) {
    return { key: 'architecture', label: 'Arquitectura & Clean Code', icon: '' };
  }
  if (/paper|investigaci[oó]n|investigacion|estudio|metodolog|an[aá]lisis|s[ií]ntesis/i.test(t)) {
    return { key: 'research', label: 'Investigación Científica & Síntesis', icon: '' };
  }
  return { key: 'general', label: 'Análisis & Síntesis General', icon: '' };
}

const WEB_ETAG = '"trujillo-ai-v5"';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Signature-Ed25519, X-Signature-Timestamp, x-groq-user-key, x-admin-key',
  'Access-Control-Max-Age': '86400'
};

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(sendDailyOpsReport(env, (opts) => sendAppEmail(env, {
      ...opts,
      html: brandEmailHtml({
        title: opts.subject,
        preheader: 'Informe diario de Trujillo AI',
        bodyHtml: opts.html,
        ctaLabel: 'Abrir workspace',
        ctaUrl: APP_ORIGIN,
        locale: 'es'
      })
    })));
  },

  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const originalPath = url.pathname;

    let pathLang = '';
    const pathParts = url.pathname.split('/');
    if (pathParts[1]) {
      const n = normalizeLang(pathParts[1]);
      if (n && LANG_IDS.includes(n)) {
        pathLang = n;
        url.pathname = '/' + pathParts.slice(2).join('/');
        if (url.pathname === '') url.pathname = '/';
      }
    }
    
    const pageLang = pathLang || pickLang(request);
    const geo = publicGeo(request);
    const clientIp = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
    const userAgent = (request.headers.get('User-Agent') || '').toLowerCase();

    // ========================================================
    // 0. ENRUTADOR EDGE MULTI-SERVICIO (SEGMENTACIÓN COMPLETA)
    // ========================================================
    const SUBDOMAIN_TARGETS = {
      'labs.trujillomingorance.com': 'atm-labs-hub.pages.dev',
      'guides.trujillomingorance.com': 'trujillo-guides.pages.dev',
      'guias.trujillomingorance.com': 'trujillo-guides.pages.dev',
      'focusguard.trujillomingorance.com': 'focusguard-aj3.pages.dev',
      'adshield.focusguard.trujillomingorance.com': 'focusguard-aj3.pages.dev',
      'alberto.trujillomingorance.com': 'alberto-portfolio.pages.dev',
      'rocky.trujillomingorance.com': 'rocky-setter.pages.dev',
      'trujillomingorance.com': 'domain-root-2r5.pages.dev',
      'www.trujillomingorance.com': 'domain-root-2r5.pages.dev'
    };

    const targetHost = SUBDOMAIN_TARGETS[url.hostname];
    if (targetHost) {
      const targetUrl = new URL(request.url);
      targetUrl.hostname = targetHost;
      targetUrl.protocol = 'https:';
      targetUrl.port = '';

      const proxyHeaders = new Headers(request.headers);
      proxyHeaders.set('Host', targetHost);
      proxyHeaders.set('X-Forwarded-Host', url.hostname);
      proxyHeaders.set('X-Forwarded-Proto', 'https');
      proxyHeaders.delete('cf-connecting-ip');
      proxyHeaders.delete('cf-ray');
      proxyHeaders.delete('cf-visitor');

      const proxyRes = await fetch(new Request(targetUrl.toString(), {
        method: request.method,
        headers: proxyHeaders,
        body: (request.method !== 'GET' && request.method !== 'HEAD') ? request.body : undefined,
        redirect: 'manual'
      }));

      const resHeaders = new Headers(proxyRes.headers);
      resHeaders.set('Access-Control-Allow-Origin', '*');
      return new Response(proxyRes.body, {
        status: proxyRes.status,
        statusText: proxyRes.statusText,
        headers: resHeaders
      });
    }

    // Redirección canónica de subdominios alias a Trujillo AI
    if (url.hostname === 'groq.trujillomingorance.com') {
      url.hostname = 'ai.trujillomingorance.com';
      return Response.redirect(url.toString(), 301);
    }

    // Segmentación estricta de Trujillo AI Studio
    // Solo ai.trujillomingorance.com y entornos de desarrollo acceden a la IA
    const IS_AI_HOST = (
      url.hostname === 'ai.trujillomingorance.com' ||
      url.hostname.endsWith('.workers.dev') ||
      url.hostname === 'localhost' ||
      url.hostname === '127.0.0.1'
    );

    if (!IS_AI_HOST && url.hostname.endsWith('trujillomingorance.com')) {
      // Unmapped subdomain: serve the gateway 404 and its CSS/JS from the same origin.
      const GATEWAY = 'https://domain-root-2r5.pages.dev';
      const path = originalPath;
      const isNfAsset = path.startsWith('/css/') || path.startsWith('/js/') || path === '/avatar.png' || path === '/favicon.ico';
      try {
        if (isNfAsset) {
          const assetRes = await fetch(GATEWAY + path + url.search);
          const headers = new Headers();
          const type = path.endsWith('.css')
            ? 'text/css; charset=utf-8'
            : path.endsWith('.js')
              ? 'application/javascript; charset=utf-8'
              : path.endsWith('.png')
                ? 'image/png'
                : (assetRes.headers.get('Content-Type') || 'application/octet-stream');
          headers.set('Content-Type', type);
          headers.set('Cache-Control', 'public, max-age=3600');
          return new Response(assetRes.body, { status: assetRes.status, headers });
        }
        let html = '';
        try {
          const nfCache = caches.default;
          const nfKey = new Request(GATEWAY + '/404-html-v1');
          let nfRes = await nfCache.match(nfKey);
          if (!nfRes) {
            nfRes = await fetch(GATEWAY + '/404', {
              headers: { 'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker' }
            });
            if (nfRes.ok) ctx.waitUntil(nfCache.put(nfKey, nfRes.clone()));
          }
          html = await nfRes.text();
        } catch (e) {
          html = '';
        }
        if (!html) {
          return new Response('404 Subdominio No Encontrado - trujillomingorance.com', {
            status: 404,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        }
        return new Response(html, {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=300, s-maxage=3600',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (err) {
        return new Response('404 Subdominio No Encontrado - trujillomingorance.com', {
          status: 404,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    }

    if (url.pathname === '/guides' || url.pathname === '/guias' || url.pathname.startsWith('/guides/')) {
      return Response.redirect('https://guides.trujillomingorance.com/', 301);
    }

    // ========================================================
    // 2. CORS PREFLIGHT (24h de caché)
    // ========================================================
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname.startsWith('/assets/') && env.ASSETS) {
      const assetRes = await env.ASSETS.fetch(request);
      if (assetRes.status === 200) {
        const headers = new Headers(assetRes.headers);
        if (url.pathname.endsWith('.js')) headers.set('Content-Type', 'application/javascript; charset=UTF-8');
        if (url.pathname.endsWith('.css')) headers.set('Content-Type', 'text/css; charset=UTF-8');
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        return new Response(assetRes.body, { status: 200, headers });
      }
      return assetRes;
    }

    // ========================================================
    // 3. FIREWALL DE SEGURIDAD (Permite buscadores y AI crawlers legítimos)
    // ========================================================
    const MALICIOUS_SCRAPERS = /(scrapy|masscan|zgrab|nikto|sqlmap|nmap|dirbuster|acunetix|nessus|w3af|openvas)/i;
    const PROBE_PATTERNS = /(\.env|\.git|\.aws|\.ssh|\.bak|\.sql|\.config|\.ini|wp-admin|wp-login|wp-includes|phpmyadmin|cgi-bin|xmlrpc|actuator|shell|eval-stdin|\.php|\.asp|\.aspx|\.jsp|\.action)/i;

    if (MALICIOUS_SCRAPERS.test(userAgent) || PROBE_PATTERNS.test(url.pathname)) {
      return new Response(null, {
        status: 403,
        headers: {
          ...corsHeaders,
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, immutable',
          'Cloudflare-CDN-Cache-Control': 'max-age=86400'
        }
      });
    }

    // Rate limiter solo en API (HTML/assets ya no entran aquí si run_worker_first está bien).
    const isApiPath = url.pathname.startsWith('/api/');
    if (isApiPath || request.method === 'POST') {
      const ipRateKey = `rate_${clientIp}`;
      const rateData = getFromRam(ipRateKey) || { count: 0, resetAt: Date.now() + 60000 };
      if (Date.now() > rateData.resetAt) {
        rateData.count = 1;
        rateData.resetAt = Date.now() + 60000;
      } else {
        rateData.count++;
        if (rateData.count > 40) {
          return new Response(JSON.stringify({ error: 'rate_limited', message: 'Límite de seguridad alcanzado. Espera 60 segundos.' }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' }
          });
        }
      }
      setInRam(ipRateKey, rateData);
    }

    // ========================================================
    // 4. EDGE CACHE API (caches.default) PARA ASSETS ESTÁTICOS
    // ========================================================
    const isGetOrHead = (request.method === 'GET' || request.method === 'HEAD');
    let cache = null;
    try {
      cache = caches.default;
    } catch (e) {}

    const isStaticAsset = (
      url.pathname === '/avatar.png' ||
      url.pathname === '/favicon.ico' ||
      url.pathname === '/avatar.jpg' ||
      url.pathname.startsWith('/apple-touch-icon')
    );

    if (isGetOrHead && cache && isStaticAsset) {
      const cached = await cache.match(request);
      if (cached) {
        return cached;
      }
    }

    // Helper para guardar en cache del Edge (solo assets estáticos)
    const cacheAndReturn = (response) => {
      if (cache && isGetOrHead && isStaticAsset && response.status === 200) {
        ctx.waitUntil(cache.put(request, response.clone()));
      }
      return response;
    };

    // A. Favicon & Avatar Icons (estáticos en /public; fallback por si el asset binding falla)
    if (url.pathname === '/avatar.png' || url.pathname === '/favicon.ico' || url.pathname === '/avatar.jpg' || url.pathname.startsWith('/apple-touch-icon')) {
      if (env.ASSETS) {
        const assetReq = new Request(new URL('/avatar.png', url.origin), request);
        const assetRes = await env.ASSETS.fetch(assetReq);
        if (assetRes.status === 200) {
          const headers = new Headers(assetRes.headers);
          headers.set('Content-Type', 'image/png');
          headers.set('Cache-Control', 'public, max-age=31536000, immutable');
          return cacheAndReturn(new Response(assetRes.body, { status: 200, headers }));
        }
      }
      return new Response(null, { status: 404, headers: corsHeaders });
    }

    // B. Robots, Sitemap, Manifest, security.txt
    if (url.pathname === '/robots.txt') {
      const res = new Response(robotsTxt(), {
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'CDN-Cache-Control': 'max-age=86400'
        }
      });
      return cacheAndReturn(res);
    }

    if (url.pathname === '/llms.txt') {
      const res = new Response(llmsTxt(), {
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'CDN-Cache-Control': 'max-age=86400'
        }
      });
      return cacheAndReturn(res);
    }

    if (url.pathname === '/sitemap.xml') {
      const res = new Response(sitemapXml(), {
        headers: {
          'Content-Type': 'application/xml; charset=UTF-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'CDN-Cache-Control': 'max-age=86400'
        }
      });
      return cacheAndReturn(res);
    }

    if (url.pathname === '/security.txt' || url.pathname === '/.well-known/security.txt') {
      const res = new Response(securityTxt(), {
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'CDN-Cache-Control': 'max-age=86400'
        }
      });
      return cacheAndReturn(res);
    }

    if (url.pathname === '/manifest.json' || url.pathname === '/site.webmanifest') {
      const res = new Response(JSON.stringify(webManifest()), {
        headers: {
          'Content-Type': 'application/manifest+json; charset=UTF-8',
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
          'CDN-Cache-Control': 'max-age=86400'
        }
      });
      return cacheAndReturn(res);
    }

    if (url.pathname.endsWith('.map')) {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (SITE_PAGES[url.pathname]) {
      const p = SITE_PAGES[url.pathname];
      const meta = pageMeta(p.key, pageLang);
      return htmlResponse({ title: meta.title, description: meta.description, path: p.path, kind: 'site', page: p.page, lang: pageLang, geo }, 200, corsHeaders);
    }

    if (url.pathname === '/api/geo' && isGetOrHead) {
      return new Response(JSON.stringify(geo), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=UTF-8',
          'Cache-Control': 'private, no-store'
        }
      });
    }

    // D. Modelos disponibles API
    if (url.pathname === '/api/models' && request.method === 'GET') {
      const res = new Response(JSON.stringify({ models: AVAILABLE_OPEN_MODELS }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400'
        }
      });
      return res;
    }

    const chartMatch = url.pathname.match(/^\/api\/chart\/([A-Za-z0-9.=^-]{1,12})\.png$/i);
    if (chartMatch && isGetOrHead) {
      return servePublicChartPng(chartMatch[1].toUpperCase());
    }

    if (url.pathname === '/login' || url.pathname === '/auth') {
      const meta = pageMeta('login', pageLang);
      return htmlResponse({
        title: meta.title,
        description: meta.description,
        path: '/login',
        kind: 'site',
        page: 'login',
        lang: pageLang,
        geo
      }, 200, corsHeaders);
    }

    if (url.pathname === '/register') {
      const meta = pageMeta('register', pageLang);
      return htmlResponse({
        title: meta.title,
        description: meta.description,
        path: '/register',
        kind: 'site',
        page: 'register',
        lang: pageLang,
        geo
      }, 200, corsHeaders);
    }

    if (isGetOrHead && (url.pathname === '/' || url.pathname === '/index.html' || url.pathname.startsWith('/share/'))) {
      if (request.method === 'HEAD') {
        return new Response(null, { headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=UTF-8' } });
      }
      const isShare = url.pathname.startsWith('/share/');
      const meta = pageMeta(isShare ? 'share' : 'home', pageLang);
      return htmlResponse({
        title: meta.title,
        description: meta.description,
        path: isShare ? url.pathname : '/',
        kind: 'app',
        page: 'chat',
        lang: pageLang,
        geo
      }, 200, corsHeaders);
    }

    // ========================================================
    // 5. GLOBAL MARKET QUOTE API (40,000+ STOCKS, ETFS, CRYPTOS, COMMODITIES)
    // ========================================================
    if (url.pathname === '/api/market/quote' && isGetOrHead) {
      const sym = (url.searchParams.get('symbol') || '').toUpperCase().trim();
      if (!sym) {
        return new Response(JSON.stringify({ error: 'Missing symbol' }), { status: 400, headers: corsHeaders });
      }
      const quote = await fetchGlobalAssetQuote(sym);
      return new Response(JSON.stringify(quote || { symbol: sym, name: sym, price: 0, change24h: 0, error: 'Not found' }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=30, s-maxage=30'
        }
      });
    }

    // ========================================================
    // 5B. SHARE CHAT API (CREACIÓN Y LECTURA DE CHATS COMPARTIDOS)
    // ========================================================
    if (url.pathname === '/api/share' && request.method === 'POST') {
      try {
        const body = await request.json();
        const { title, messages, model, specialty } = body;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response(JSON.stringify({ error: 'No hay mensajes para compartir' }), { status: 400, headers: corsHeaders });
        }

        const shareId = 'sh_' + crypto.randomUUID().replace(/-/g, '').slice(0, 16);
        const sharedPayload = {
          id: shareId,
          title: title || 'Conversación en Trujillo AI',
          messages: messages.slice(0, 100),
          model: model || 'openai/gpt-oss-120b',
          specialty: specialty || 'general',
          createdAt: Date.now()
        };

        if (env.BOT_MEMORY) {
          await env.BOT_MEMORY.put(`shared_chat:${shareId}`, JSON.stringify(sharedPayload), { expirationTtl: 2592000 }); // 30 días
        }
        setInRam(`shared_chat:${shareId}`, sharedPayload);

        const shareUrl = `https://${url.host}/share/${shareId}`;
        return new Response(JSON.stringify({ ok: true, shareId, shareUrl }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/artifact' && request.method === 'POST') {
      try {
        const user = await getAuthedUser(request, env);
        if (!user) {
          return new Response(JSON.stringify({ error: 'Inicia sesión para publicar en guides.trujillomingorance.com' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        const body = await request.json();
        const title = String(body.title || '').trim().slice(0, 120);
        const content = String(body.content || '');
        const lang = String(body.lang || 'markdown').trim().slice(0, 32);
        if (!title || content.length < 20) {
          return new Response(JSON.stringify({ error: 'El artefacto necesita título y contenido' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        if (content.length > 180000) {
          return new Response(JSON.stringify({ error: 'El artefacto supera el límite de 180 KB' }), {
            status: 413,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        const slug = slugifyArtifact(body.slug || title);
        if (!slug) {
          return new Response(JSON.stringify({ error: 'Slug no válido' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        const record = {
          slug,
          title,
          lang,
          content,
          description: String(body.description || content.replace(/\s+/g, ' ').slice(0, 180)),
          author: user.email || user.id || 'owner',
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        if (!env.BOT_MEMORY) {
          return new Response(JSON.stringify({ error: 'KV no disponible' }), { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
        const existingStr = await env.BOT_MEMORY.get('art:' + slug);
        if (existingStr) {
          try {
            const existing = JSON.parse(existingStr);
            record.createdAt = existing.createdAt || record.createdAt;
          } catch (e) {}
        }
        await env.BOT_MEMORY.put('art:' + slug, JSON.stringify(record));
        let index = [];
        const indexStr = await env.BOT_MEMORY.get('art:index');
        if (indexStr) {
          try { index = JSON.parse(indexStr); } catch (e) { index = []; }
        }
        if (!Array.isArray(index)) index = [];
        index = index.filter((item) => item && item.slug !== slug);
        index.unshift({ slug, title, updatedAt: record.updatedAt, lang });
        await env.BOT_MEMORY.put('art:index', JSON.stringify(index.slice(0, 200)));
        const publicUrl = 'https://guides.trujillomingorance.com/a/' + slug;
        return new Response(JSON.stringify({ ok: true, slug, url: publicUrl }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message || 'publish_failed' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    if (url.pathname.startsWith('/api/share/') && isGetOrHead) {
      const shareId = url.pathname.replace('/api/share/', '').trim();
      let sharedData = getFromRam(`shared_chat:${shareId}`);
      if (!sharedData && env.BOT_MEMORY) {
        sharedData = await getCachedKvValue(env.BOT_MEMORY, `shared_chat:${shareId}`);
      }
      if (!sharedData) {
        return new Response(JSON.stringify({ error: 'Conversación compartida no encontrada o expirada' }), { status: 404, headers: corsHeaders });
      }
      return new Response(JSON.stringify({ ok: true, chat: typeof sharedData === 'string' ? JSON.parse(sharedData) : sharedData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' }
      });
    }

    // ========================================================
    // 5C. IMAGE GENERATION API (FLUX 1.1 ULTRA)
    // ========================================================
    if (url.pathname === '/api/image' && request.method === 'POST') {
      try {
        const body = await request.json();
        let rawPrompt = (body.prompt || '').trim();
        if (!rawPrompt) {
          return new Response(JSON.stringify({ error: 'Prompt requerido' }), { status: 400, headers: corsHeaders });
        }

        // Clean user prompt
        const cleanPrompt = rawPrompt.replace(/^(genera una imagen de|dibuja|crea una imagen de|haz una foto de|imagen de|generate image of|draw)/i, '').trim() || rawPrompt;

        // Smart prompt enhancer with Groq (~50ms)
        let enhancedPrompt = cleanPrompt;
        if (env.GROQ_API_KEY) {
          try {
            const promptEnhanceRes = await callGroqChat({
              groqApiKey: env.GROQ_API_KEY,
              messages: [
                {
                  role: 'system',
                  content: 'You are an expert AI prompt engineer for Flux 1.1 photorealistic image generation. Convert the user input into a detailed, visually stunning English prompt. Add details on photorealism, cinematic lighting, 8k resolution, sharp focus, masterpiece. Output ONLY the final prompt text without commentary or quotation marks. Maximum 45 words.'
                },
                { role: 'user', content: cleanPrompt }
              ],
              requestedModel: FAST_TEXT_MODEL,
              maxTokens: 80,
              skipFallback: true,
              temperature: 0.4,
              env,
              ctx
            });
            if (promptEnhanceRes.ok && promptEnhanceRes.response) {
              const enhanceData = await promptEnhanceRes.response.json();
              const genText = enhanceData.choices?.[0]?.message?.content?.trim();
              if (genText && genText.length > 5) {
                enhancedPrompt = genText.replace(/^["']|["']$/g, '');
              }
            }
          } catch(e) {}
        }

        const width = parseInt(body.width, 10) || 1024;
        const height = parseInt(body.height, 10) || 1024;
        const seed = Math.floor(Math.random() * 10000000);
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&model=flux&seed=${seed}`;
        
        ctx.waitUntil(bumpOps(env, 'images', 1));
        return new Response(JSON.stringify({
          ok: true,
          imageUrl,
          prompt: rawPrompt,
          enhancedPrompt,
          width,
          height,
          seed
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: corsHeaders });
      }
    }

    // ========================================================
    // 6. ENDPOINTS DE AUTENTICACIÓN Y RESEND
    // ========================================================
    if (url.pathname === '/api/auth/register' && request.method === 'POST') {
      try {
        const body = await request.json();
        const name = (body.name || '').trim();
        const email = (body.email || '').trim().toLowerCase();
        const password = body.password || '';
        const locale = ['es', 'en', 'fr', 'pt', 'de', 'it', 'ca', 'zh'].includes(body.locale) ? body.locale : 'es';

        if (!email.includes('@') || password.length < 6 || !name) {
          return new Response(JSON.stringify({ error: 'Datos de registro inválidos. Mínimo 6 caracteres.' }), { status: 400, headers: corsHeaders });
        }

        const existingUser = await getCachedKvValue(env.BOT_MEMORY, `user_email_${email}`);
        if (existingUser) {
          return new Response(JSON.stringify({ error: 'Este correo electrónico ya está registrado. Inicie sesión.' }), { status: 400, headers: corsHeaders });
        }

        const salt = crypto.randomUUID();
        const passwordHash = await hashPassword(password, salt);
        const verifyCode = generate6DigitCode();
        const userId = 'usr_' + crypto.randomUUID().slice(0, 16);

        const pendingUser = { id: userId, name, email, salt, passwordHash, verifyCode, createdAt: Date.now(), locale };

        if (env.BOT_MEMORY) {
          await env.BOT_MEMORY.put(`pending_user_${email}`, JSON.stringify(pendingUser), { expirationTtl: 86400 });
        }
        setInRam(`pending_user_${email}`, pendingUser);

        const copy = emailCopy(locale);
        const emailHtml = brandEmailHtml({
          title: copy.verifyTitle,
          preheader: copy.verifySubject(verifyCode),
          locale,
          bodyHtml: `<p>${copy.hello} <strong style="color:#fafafa;">${escapeEmail(name)}</strong>,</p>
            <p>${copy.verifyBody}</p>
            ${otpBlock(verifyCode, copy.copyHint)}`,
          ctaLabel: copy.verifyCta,
          ctaUrl: `${APP_ORIGIN}/login`
        });

        let emailResult = await sendAppEmail(env, {
          to: email,
          subject: copy.verifySubject(verifyCode),
          text: `${copy.hello} ${name}, ${copy.verifyBody} Tu código: ${verifyCode}. ${APP_ORIGIN}/login`,
          html: emailHtml,
          tag: 'verify'
        });

        if (!emailResult.ok) {
          return new Response(JSON.stringify({
            error: 'No se pudo enviar el correo de verificación. Inténtalo de nuevo en unos minutos.'
          }), { status: 500, headers: corsHeaders });
        }

        return new Response(JSON.stringify({
          ok: true,
          message: `Código de verificación enviado a ${email}.`,
          email
        }), { status: 200, headers: corsHeaders });
      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'Fallo al registrar usuario' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/auth/verify-email' && request.method === 'POST') {
      try {
        const body = await request.json();
        const email = (body.email || '').trim().toLowerCase();
        const code = String(body.code || '').replace(/\D/g, '').slice(0, 6);

        let pending = getFromRam(`pending_user_${email}`);
        if (!pending && env.BOT_MEMORY) {
          const pendingStr = await env.BOT_MEMORY.get(`pending_user_${email}`);
          if (pendingStr) pending = JSON.parse(pendingStr);
        }

        if (!pending || pending.verifyCode !== code) {
          return new Response(JSON.stringify({ error: 'Código de verificación incorrecto o expirado.' }), { status: 400, headers: corsHeaders });
        }

        const tier = isOwnerUser(email, env) ? 'enterprise' : 'free';
        const pictureUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(pending.name)}&background=000000&color=fff`;

        const userRecord = {
          id: pending.id,
          name: pending.name,
          email: pending.email,
          salt: pending.salt,
          passwordHash: pending.passwordHash,
          picture: pictureUrl,
          tier,
          emailVerified: true,
          provider: 'email',
          notifyProduct: true,
          notifySecurity: true,
          notifyDigest: false,
          locale: pending.locale || 'es',
          createdAt: pending.createdAt || Date.now()
        };

        const userStr = JSON.stringify(userRecord);
        if (env.BOT_MEMORY) {
          await Promise.all([
            env.BOT_MEMORY.put(`user_email_${email}`, userStr),
            env.BOT_MEMORY.put(`user_id_${pending.id}`, userStr),
            env.BOT_MEMORY.delete(`pending_user_${email}`)
          ]);
        }
        setInRam(`user_email_${email}`, userRecord);
        deleteFromRam(`pending_user_${email}`);

        const token = await generateJwtToken(pending.id, email, env.JWT_SECRET || 'trujillo_jwt_secret_2026');
        ctx.waitUntil(sendWelcomeEmail(env, userRecord));
        return new Response(JSON.stringify({
          ok: true,
          token,
          user: publicUser(userRecord)
        }), { status: 200, headers: corsHeaders });
      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'Fallo de verificación' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/auth/login' && request.method === 'POST') {
      try {
        const body = await request.json();
        const email = (body.email || '').trim().toLowerCase();
        const password = body.password || '';

        let userRecord = getFromRam(`user_email_${email}`);
        if (!userRecord && env.BOT_MEMORY) {
          const userStr = await env.BOT_MEMORY.get(`user_email_${email}`);
          if (userStr) userRecord = JSON.parse(userStr);
        }

        userRecord = asUser(userRecord);
        if (!userRecord) {
          return new Response(JSON.stringify({ error: 'Correo o contraseña incorrectos.' }), { status: 401, headers: corsHeaders });
        }

        if (!userRecord.passwordHash) {
          return new Response(JSON.stringify({ error: 'Esta cuenta entra con Google o X. Usa el botón correspondiente.' }), { status: 400, headers: corsHeaders });
        }

        const incomingHash = await hashPassword(password, userRecord.salt || '');
        if (incomingHash !== userRecord.passwordHash) {
          return new Response(JSON.stringify({ error: 'Correo o contraseña incorrectos.' }), { status: 401, headers: corsHeaders });
        }

        const tier = isOwnerUser(email, env) ? 'enterprise' : (userRecord.tier || 'free');
        const token = await generateJwtToken(userRecord.id, email, env.JWT_SECRET || 'trujillo_jwt_secret_2026');

        return new Response(JSON.stringify({
          ok: true,
          token,
          user: publicUser({ ...userRecord, tier })
        }), { status: 200, headers: corsHeaders });
      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'Fallo de autenticación' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/auth/google' && request.method === 'POST') {
      try {
        const body = await request.json();
        const credential = body.credential || '';
        if (!credential) {
          return new Response(JSON.stringify({ error: 'Falta la credencial de Google.' }), { status: 400, headers: corsHeaders });
        }

        const clientId = env.GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID;
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
        if (!verifyRes.ok) {
          return new Response(JSON.stringify({ error: 'No se pudo verificar la cuenta de Google.' }), { status: 401, headers: corsHeaders });
        }
        const googleUser = await verifyRes.json();
        const audOk = googleUser.aud === clientId;
        const issOk = googleUser.iss === 'accounts.google.com' || googleUser.iss === 'https://accounts.google.com';
        const email = String(googleUser.email || '').trim().toLowerCase();
        const verified = googleUser.email_verified === true || googleUser.email_verified === 'true';
        if (!audOk || !issOk || !email || !verified) {
          return new Response(JSON.stringify({ error: 'La sesión de Google no es válida.' }), { status: 401, headers: corsHeaders });
        }

        const user = await upsertSocialUser(env, {
          email,
          name: googleUser.name || email.split('@')[0],
          picture: googleUser.picture || '',
          provider: 'google',
          providerId: googleUser.sub
        });
        const token = await generateJwtToken(user.id, user.email, env.JWT_SECRET || 'trujillo_jwt_secret_2026');
        return new Response(JSON.stringify({
          ok: true,
          token,
          user: publicUser(user)
        }), { status: 200, headers: corsHeaders });
      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'Fallo de autenticación con Google' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/auth/x' && request.method === 'POST') {
      try {
        const body = await request.json();
        const code = (body.code || '').trim();
        const clientRedirectUri = body.redirectUri || `${APP_ORIGIN}/login?auth=x_callback`;
        if (!code) {
          return new Response(JSON.stringify({ error: 'Falta el código de autorización de X.' }), { status: 400, headers: corsHeaders });
        }
        if (!isAllowedOAuthRedirect(clientRedirectUri)) {
          return new Response(JSON.stringify({ error: 'Redirect de X no permitido.' }), { status: 400, headers: corsHeaders });
        }

        const xClientId = env.X_CLIENT_ID || X_OAUTH_CLIENT_ID;
        const xClientSecret = env.X_CLIENT_SECRET || X_OAUTH_CLIENT_SECRET;
        
        const tokenHeaders = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };
        const tokenParams = {
          code,
          grant_type: 'authorization_code',
          client_id: xClientId,
          redirect_uri: clientRedirectUri,
          code_verifier: 'challenge'
        };

        if (xClientSecret) {
          tokenHeaders['Authorization'] = `Basic ${btoa(`${xClientId}:${xClientSecret}`)}`;
        }

        const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
          method: 'POST',
          headers: tokenHeaders,
          body: new URLSearchParams(tokenParams).toString()
        });

        if (!tokenRes.ok) {
          const errDetail = await tokenRes.text().catch(() => '');
          console.error('Twitter OAuth Token Error:', tokenRes.status, errDetail);
          return new Response(JSON.stringify({ error: 'No se pudo completar el acceso con X. Vuelve a intentarlo.' }), { status: 401, headers: corsHeaders });
        }

        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;
        if (!accessToken) {
          return new Response(JSON.stringify({ error: 'X no devolvió un token de acceso.' }), { status: 401, headers: corsHeaders });
        }

        const userRes = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,username,name', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!userRes.ok) {
          return new Response(JSON.stringify({ error: 'No se pudo leer el perfil de X.' }), { status: 401, headers: corsHeaders });
        }
        const userData = await userRes.json();
        const handle = String(userData?.data?.username || '').replace(/^@/, '').trim();
        if (!handle) {
          return new Response(JSON.stringify({ error: 'X no devolvió un usuario válido.' }), { status: 401, headers: corsHeaders });
        }

        const name = userData.data.name || `@${handle}`;
        let pictureUrl = userData.data.profile_image_url || '';
        if (pictureUrl) pictureUrl = pictureUrl.replace('_normal', '_400x400');

        const user = await upsertSocialUser(env, {
          email: `${handle.toLowerCase()}@x.com`,
          name,
          picture: pictureUrl,
          provider: 'x',
          providerId: handle.toLowerCase()
        });
        const token = await generateJwtToken(user.id, user.email, env.JWT_SECRET || 'trujillo_jwt_secret_2026');
        return new Response(JSON.stringify({
          ok: true,
          token,
          user: publicUser(user)
        }), { status: 200, headers: corsHeaders });
      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'Fallo de autenticación con X' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/auth/forgot-password' && request.method === 'POST') {
      try {
        const body = await request.json();
        const email = (body.email || '').trim().toLowerCase();

        if (!email || !email.includes('@')) {
          return new Response(JSON.stringify({ error: 'Introduce un correo electrónico válido.' }), { status: 400, headers: corsHeaders });
        }

        let userRecord = asUser(getFromRam(`user_email_${email}`));
        if (!userRecord && env.BOT_MEMORY) {
          userRecord = asUser(await env.BOT_MEMORY.get(`user_email_${email}`));
        }

        if (userRecord && !userRecord.passwordHash) {
          return new Response(JSON.stringify({
            error: 'Esta cuenta entra con Google o X. No hay contraseña que restablecer.'
          }), { status: 400, headers: corsHeaders });
        }

        const resetCode = generate6DigitCode();
        const resetData = { email, resetCode, createdAt: Date.now() };

        if (env.BOT_MEMORY) {
          await env.BOT_MEMORY.put(`reset_code_${email}`, JSON.stringify(resetData), { expirationTtl: 3600 });
        }
        setInRam(`reset_code_${email}`, resetData);

        const copy = emailCopy(userRecord?.locale || 'es');
        const emailHtml = brandEmailHtml({
          title: copy.resetTitle,
          preheader: copy.resetSubject(resetCode),
          locale: userRecord?.locale || 'es',
          bodyHtml: `<p>${copy.hello} <strong style="color:#fafafa;">${escapeEmail(userRecord?.name || '')}</strong>,</p>
            <p>${copy.resetBody}</p>
            ${otpBlock(resetCode, copy.copyHint)}`,
          ctaLabel: copy.resetCta,
          ctaUrl: `${APP_ORIGIN}/login?tab=reset&email=${encodeURIComponent(email)}`
        });

        let emailResult = await sendAppEmail(env, {
          to: email,
          subject: copy.resetSubject(resetCode),
          text: `${copy.resetBody} Tu código: ${resetCode}. ${APP_ORIGIN}/login?tab=reset`,
          html: emailHtml,
          tag: 'reset'
        });

        if (!emailResult.ok) {
          return new Response(JSON.stringify({
            error: 'No se pudo enviar el correo. Inténtalo de nuevo en unos minutos.'
          }), { status: 500, headers: corsHeaders });
        }

        return new Response(JSON.stringify({
          ok: true,
          message: `Código enviado a ${email}.`,
          email
        }), { status: 200, headers: corsHeaders });

      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'Fallo al solicitar código' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/auth/reset-password' && request.method === 'POST') {
      try {
        const body = await request.json();
        const email = (body.email || '').trim().toLowerCase();
        const code = String(body.code || '').replace(/\D/g, '').slice(0, 6);
        const newPassword = body.newPassword || '';

        if (!email || !email.includes('@')) {
          return new Response(JSON.stringify({ error: 'Debes indicar el correo electrónico asociado.' }), { status: 400, headers: corsHeaders });
        }

        if (!code || code.length !== 6) {
          return new Response(JSON.stringify({ error: 'El código debe tener exactamente 6 dígitos.' }), { status: 400, headers: corsHeaders });
        }

        if (newPassword.length < 6) {
          return new Response(JSON.stringify({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' }), { status: 400, headers: corsHeaders });
        }

        let resetData = getFromRam(`reset_code_${email}`);
        if (!resetData && env.BOT_MEMORY) {
          const resetStr = await env.BOT_MEMORY.get(`reset_code_${email}`);
          if (resetStr) resetData = JSON.parse(resetStr);
        }

        if (!resetData || String(resetData.resetCode).trim() !== code) {
          return new Response(JSON.stringify({ error: 'El código de recuperación es incorrecto o ha expirado. Asegúrate de escribir el mismo correo electrónico donde recibiste el código.' }), { status: 400, headers: corsHeaders });
        }

        let userRecord = getFromRam(`user_email_${email}`);
        if (!userRecord && env.BOT_MEMORY) {
          const userStr = await env.BOT_MEMORY.get(`user_email_${email}`);
          if (userStr) userRecord = JSON.parse(userStr);
        }

        const isOwner = isOwnerUser(email, env);
        const userId = userRecord?.id || ('usr_' + crypto.randomUUID().slice(0, 16));
        const userName = userRecord?.name || (isOwner ? (env?.OWNER_NAME || 'Admin') : 'Usuario');
        const tier = (isOwner || userRecord?.tier === 'enterprise') ? 'enterprise' : 'free';
        const pictureUrl = userRecord?.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=000000&color=fff`;

        const salt = crypto.randomUUID();
        const passwordHash = await hashPassword(newPassword, salt);

        const updatedUser = {
          id: userId,
          name: userName,
          email,
          salt,
          passwordHash,
          picture: pictureUrl,
          tier,
          emailVerified: true,
          updatedAt: Date.now()
        };

        const userStr = JSON.stringify(updatedUser);
        if (env.BOT_MEMORY) {
          await Promise.all([
            env.BOT_MEMORY.put(`user_email_${email}`, userStr),
            env.BOT_MEMORY.put(`user_id_${userId}`, userStr),
            env.BOT_MEMORY.delete(`reset_code_${email}`)
          ]);
        }
        setInRam(`user_email_${email}`, updatedUser);
        deleteFromRam(`reset_code_${email}`);

        const token = await generateJwtToken(userId, email, env.JWT_SECRET || 'trujillo_jwt_secret_2026');
        ctx.waitUntil(sendSecurityEmail(env, updatedUser, 'Contraseña actualizada', 'La contraseña de tu cuenta de Trujillo AI se acaba de cambiar.'));

        return new Response(JSON.stringify({
          ok: true,
          token,
          user: publicUser(updatedUser),
          message: 'Contraseña actualizada con éxito.'
        }), { status: 200, headers: corsHeaders });

      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'Fallo al restablecer contraseña' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/auth/me' && isGetOrHead) {
      const user = await getAuthedUser(request, env);
      if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: corsHeaders });
      return new Response(JSON.stringify({ ok: true, user: publicUser(user) }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    if (url.pathname === '/api/usage' && isGetOrHead) {
      const user = await getAuthedUser(request, env);
      const ident = user?.email || request.headers.get('CF-Connecting-IP') || 'anon';
      const usage = await peekTokenUsage(env, ident);
      const ops = await readOps(env);
      return new Response(JSON.stringify({
        ok: true,
        usage: {
          ...usage,
          plan: user?.tier || (isOwnerUser(ident, env) ? 'enterprise' : 'free')
        },
        ops
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    if (url.pathname === '/api/ideas' && request.method === 'POST') {
      try {
        const body = await request.json();
        const result = await handleIdeaPost({
          body,
          ip: clientIp,
          env,
          sendEmail: (opts) => sendAppEmail(env, {
            ...opts,
            html: brandEmailHtml({
              title: opts.heading || 'Sugerencia de Usuario',
              preheader: opts.text || opts.subject,
              bodyHtml: opts.html,
              ctaLabel: 'Abrir workspace',
              ctaUrl: APP_ORIGIN,
              locale: 'es'
            })
          })
        });
        return new Response(JSON.stringify(result.payload), {
          status: result.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'idea_failed' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/transcribe' && request.method === 'POST') {
      try {
        const userGroqKey = request.headers.get('x-groq-user-key');
        const groqApiKey = userGroqKey || env.GROQ_API_KEY;
        const locale = url.searchParams.get('lang') || pickLang(request);
        const result = await handleTranscribePost({ request, env, groqApiKey, locale });
        return new Response(JSON.stringify(result.payload), {
          status: result.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (e) {
        ctx.waitUntil(bumpOps(env, 'errors', 1));
        return new Response(JSON.stringify({ error: e?.message || 'transcribe_failed' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/ops' && isGetOrHead) {
      const user = await getAuthedUser(request, env);
      const ident = user?.email || '';
      if (!isOwnerUser(ident, env)) {
        return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: corsHeaders });
      }
      const report = await collectReport(env);
      return new Response(JSON.stringify({ ok: true, ...report }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    if (url.pathname === '/api/profile' && isGetOrHead) {
      const user = await getAuthedUser(request, env);
      const ident = user?.email || clientIp;
      const profile = await loadProfile(env, ident);
      return new Response(JSON.stringify({ ok: true, profile: publicProfile(profile), synced: !!user }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    if (url.pathname === '/api/profile' && request.method === 'POST') {
      try {
        const user = await getAuthedUser(request, env);
        const ident = user?.email || clientIp;
        const body = await request.json().catch(() => ({}));
        let profile = await loadProfile(env, ident);
        if (typeof body.enabled === 'boolean') profile.enabled = body.enabled;
        if (typeof body.name === 'string') profile.name = body.name.trim().slice(0, 60);
        if (body.forgetAll === true) {
          profile.notes = [];
          profile.summary = '';
          profile.topics = {};
        }
        if (typeof body.note === 'string' && body.note.trim().length >= 8) {
          const turned = applyTurn(profile, { prompt: 'recuerda que ' + body.note.trim() });
          profile = turned.profile;
        }
        if (typeof body.deleteNoteId === 'string') {
          profile.notes = (profile.notes || []).filter((n) => n.id !== body.deleteNoteId);
        }
        profile = sanitizeProfile(profile);
        await saveProfile(env, ident, profile);
        return new Response(JSON.stringify({ ok: true, profile: publicProfile(profile) }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'profile_failed' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/ops/report' && request.method === 'POST') {
      const user = await getAuthedUser(request, env);
      if (!isOwnerUser(user?.email, env)) {
        return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: corsHeaders });
      }
      const sent = await sendDailyOpsReport(env, (opts) => sendAppEmail(env, {
        ...opts,
        html: brandEmailHtml({
          title: opts.subject,
          preheader: 'Informe diario de Trujillo AI',
          bodyHtml: opts.html,
          ctaLabel: 'Abrir workspace',
          ctaUrl: APP_ORIGIN,
          locale: 'es'
        })
      }));
      return new Response(JSON.stringify(sent), {
        status: sent.ok ? 200 : 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (url.pathname === '/api/auth/profile' && request.method === 'POST') {
      try {
        const user = await getAuthedUser(request, env);
        if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: corsHeaders });
        const body = await request.json();
        if (typeof body.name === 'string' && body.name.trim()) user.name = body.name.trim().slice(0, 80);
        if (typeof body.notifyProduct === 'boolean') user.notifyProduct = body.notifyProduct;
        if (typeof body.notifySecurity === 'boolean') user.notifySecurity = body.notifySecurity;
        if (typeof body.notifyDigest === 'boolean') user.notifyDigest = body.notifyDigest;
        if (typeof body.locale === 'string' && body.locale.length === 2) user.locale = body.locale;
        user.updatedAt = Date.now();
        await persistUserRecord(env, user);
        return new Response(JSON.stringify({ ok: true, user: publicUser(user) }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'profile_failed' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/auth/update-email' && request.method === 'POST') {
      try {
        const user = await getAuthedUser(request, env);
        if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: corsHeaders });
        const body = await request.json();
        const newEmail = (body.email || '').trim().toLowerCase();
        
        if (!newEmail.includes('@') || newEmail.endsWith('@x.com')) {
          return new Response(JSON.stringify({ error: 'Por favor introduce un correo válido.' }), { status: 400, headers: corsHeaders });
        }
        
        const existingUser = await loadUserByEmail(env, newEmail);
        if (existingUser && existingUser.id !== user.id) {
          return new Response(JSON.stringify({ error: 'Ese correo ya está registrado.' }), { status: 400, headers: corsHeaders });
        }
        
        const oldEmail = user.email;
        user.email = newEmail;
        user.updatedAt = Date.now();
        await persistUserRecord(env, user);
        
        // delete old email key if possible
        if (env.BOT_MEMORY && oldEmail !== newEmail) {
           ctx.waitUntil(env.BOT_MEMORY.delete(`user_email_${oldEmail}`));
        }
        
        return new Response(JSON.stringify({ ok: true, user: publicUser(user) }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'email_failed' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/auth/change-password' && request.method === 'POST') {
      try {
        const user = await getAuthedUser(request, env);
        if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: corsHeaders });
        const body = await request.json();
        const currentPassword = body.currentPassword || '';
        const newPassword = body.newPassword || '';
        if (newPassword.length < 6) {
          return new Response(JSON.stringify({ error: 'La nueva contraseña debe tener al menos 6 caracteres.' }), { status: 400, headers: corsHeaders });
        }
        if (!user.passwordHash) {
          return new Response(JSON.stringify({ error: 'Esta cuenta entra con Google o X. No hay contraseña que cambiar.' }), { status: 400, headers: corsHeaders });
        }
        const incomingHash = await hashPassword(currentPassword, user.salt || '');
        if (incomingHash !== user.passwordHash) {
          return new Response(JSON.stringify({ error: 'Contraseña actual incorrecta.' }), { status: 401, headers: corsHeaders });
        }
        user.salt = crypto.randomUUID();
        user.passwordHash = await hashPassword(newPassword, user.salt);
        user.updatedAt = Date.now();
        await persistUserRecord(env, user);
        ctx.waitUntil(sendSecurityEmail(env, user, 'Contraseña actualizada', 'Has cambiado la contraseña de Trujillo AI desde Ajustes.'));
        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'password_failed' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/auth/test-email' && request.method === 'POST') {
      try {
        const user = await getAuthedUser(request, env);
        if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: corsHeaders });
        const copy = emailCopy(user.locale);
        const html = brandEmailHtml({
          title: copy.testTitle,
          preheader: copy.testSubject,
          locale: user.locale,
          bodyHtml: `<p>${copy.hello} <strong style="color:#fafafa;">${escapeEmail(user.name || '')}</strong>,</p><p>${copy.testBody}</p>`,
          ctaLabel: copy.testCta,
          ctaUrl: APP_ORIGIN
        });
        const sent = await sendAppEmail(env, {
          to: user.email,
          subject: copy.testSubject,
          text: copy.testBody,
          html,
          tag: 'test'
        });
        if (!sent.ok) return new Response(JSON.stringify({ error: sent.error }), { status: 502, headers: corsHeaders });
        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'email_failed' }), { status: 500, headers: corsHeaders });
      }
    }

    if (url.pathname === '/api/auth/delete' && request.method === 'POST') {
      try {
        const user = await getAuthedUser(request, env);
        if (!user) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: corsHeaders });
        const body = await request.json().catch(() => ({}));
        if (user.passwordHash) {
          const password = body.password || '';
          const incomingHash = await hashPassword(password, user.salt || '');
          if (incomingHash !== user.passwordHash) {
            return new Response(JSON.stringify({ error: 'Contraseña incorrecta.' }), { status: 401, headers: corsHeaders });
          }
        }
        deleteFromRam(`user_email_${user.email}`);
        if (user.id) deleteFromRam(`user_id_${user.id}`);
        if (env.BOT_MEMORY) {
          await Promise.all([
            env.BOT_MEMORY.delete(`user_email_${user.email}`),
            user.id ? env.BOT_MEMORY.delete(`user_id_${user.id}`) : Promise.resolve()
          ]);
        }
        ctx.waitUntil(sendSecurityEmail(env, user, 'Cuenta eliminada', 'Tu cuenta de Trujillo AI se ha eliminado. Si no fuiste tú, contacta de inmediato.'));
        return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e?.message || 'delete_failed' }), { status: 500, headers: corsHeaders });
      }
    }

    // ========================================================
    // 6. STREAMING WEB SSE (/api/chat)
    // ========================================================
    if (request.method === 'POST' && url.pathname === '/api/chat') {
      return handleWebChatStream(request, env, ctx);
    }

    // ========================================================
    // 7. INTERACCIONES BOT DE DISCORD (Ed25519)
    // ========================================================
    if (request.method === 'POST') {
      const signature = request.headers.get('x-signature-ed25519');
      const timestamp = request.headers.get('x-signature-timestamp');
      const rawBody = await request.text();
      const publicKey = env.DISCORD_PUBLIC_KEY;

      if (signature && timestamp && publicKey) {
        const isValid = await verifyDiscordSignature(rawBody, signature, timestamp, publicKey);
        if (!isValid) {
          return new Response('Invalid request signature', { status: 401 });
        }

        let interaction;
        try {
          interaction = JSON.parse(rawBody);
        } catch {
          return new Response('Invalid JSON payload', { status: 400 });
        }

        if (interaction.type === InteractionType.PING) {
          return new Response(JSON.stringify({ type: InteractionResponseType.PONG }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        if (interaction.type === InteractionType.APPLICATION_COMMAND) {
          const { name, options } = interaction.data;
          
          if ((name === 'ia' || name === 'ai') && (!options || !options.find(opt => opt.name === 'pregunta')?.value)) {
            return new Response(JSON.stringify({
              type: 9, // InteractionResponseType.MODAL
              data: {
                custom_id: `modal_ia_${name}`,
                title: 'Preguntar a Trujillo AI',
                components: [
                  {
                    type: 1,
                    components: [
                      {
                        type: 4, // TEXT_INPUT
                        custom_id: 'pregunta_input',
                        label: 'Escribe aquí tu pregunta o texto largo',
                        style: 2, // PARAGRAPH
                        min_length: 1,
                        max_length: 4000,
                        required: true,
                        placeholder: 'Pega aquí tu texto sin que se rompa el formato de Discord...'
                      }
                    ]
                  }
                ]
              }
            }), { headers: { 'Content-Type': 'application/json' } });
          }

          const isPrivateCmd = ['entrenar', 'memoria', 'personalidad', 'ayuda'].includes(name);
          const isPrivateOption = options?.find(opt => opt.name === 'privado')?.value === true;
          const isEphemeral = isPrivateCmd || isPrivateOption;

          ctx.waitUntil(handleDiscordInteractionAsync(interaction, env, isEphemeral));

          const responsePayload = {
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
          };
          if (isEphemeral) responsePayload.data = { flags: 64 };

          return new Response(JSON.stringify(responsePayload), {
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        if (interaction.type === InteractionType.MODAL_SUBMIT) {
          const customId = interaction.data.custom_id;
          if (customId.startsWith('modal_ia_')) {
            const isEphemeral = false; 
            ctx.waitUntil(handleDiscordModalAsync(interaction, env, isEphemeral));
            return new Response(JSON.stringify({
              type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
            }), { headers: { 'Content-Type': 'application/json' } });
          }
        }
      }
    }

    const nf = pageMeta('notFound', pageLang);
    return htmlResponse({
      title: nf.title,
      description: nf.description,
      path: url.pathname,
      kind: 'site',
      page: '404',
      lang: pageLang,
      geo
    }, 404, corsHeaders);
  }
};

// ==========================================
// Handlers & Funciones de Apoyo
// ==========================================
function isOwnerUser(userIdentifier, env = null) {
  if (!userIdentifier) return false;
  const idStr = String(userIdentifier).toLowerCase().replace(/^@/, '').replace(/^x_/, '');
  const envEmails = (env?.OWNER_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  const envDiscordIds = (env?.OWNER_DISCORD_IDS || '').split(',').map(id => id.trim()).filter(Boolean);
  if (envEmails.some(e => idStr === e)) return true;
  if (envDiscordIds.some(id => idStr === id)) return true;
  if (env?.OWNER_EMAIL && idStr === env.OWNER_EMAIL.toLowerCase()) return true;
  return false;
}

const USER_DAILY_TOKEN_LIMIT = 50000;

async function checkAndConsumeGlobalTokens(env, userIdentifier, estimatedTokens = 350) {
  if (isOwnerUser(userIdentifier, env)) {
    return { allowed: true, current: 0, limit: 'unlimited', isOwner: true };
  }

  const today = new Date().toISOString().slice(0, 10);
  const cleanId = String(userIdentifier || 'anon').replace(/[^a-zA-Z0-9_.-]/g, '_');
  const userQuotaKey = `user_tokens_${cleanId}_${today}`;

  let currentTokens = 0;
  const inRam = getFromRam(userQuotaKey);
  if (inRam !== null) {
    currentTokens = parseInt(inRam, 10) || 0;
  } else if (env.BOT_MEMORY) {
    const val = await env.BOT_MEMORY.get(userQuotaKey);
    if (val) currentTokens = parseInt(val, 10) || 0;
  }

  if (currentTokens + estimatedTokens > USER_DAILY_TOKEN_LIMIT) {
    return {
      allowed: false,
      current: currentTokens,
      limit: USER_DAILY_TOKEN_LIMIT,
      remaining: Math.max(0, USER_DAILY_TOKEN_LIMIT - currentTokens)
    };
  }

  const updatedTokens = currentTokens + estimatedTokens;
  setInRam(userQuotaKey, updatedTokens);
  if (env.BOT_MEMORY) {
    await env.BOT_MEMORY.put(userQuotaKey, updatedTokens.toString(), { expirationTtl: 86400 });
  }

  return {
    allowed: true,
    current: updatedTokens,
    limit: USER_DAILY_TOKEN_LIMIT,
    remaining: Math.max(0, USER_DAILY_TOKEN_LIMIT - updatedTokens)
  };
}

function nextUtcMidnightIso() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0)).toISOString();
}

async function peekTokenUsage(env, userIdentifier) {
  if (isOwnerUser(userIdentifier, env)) {
    return { current: 0, limit: USER_DAILY_TOKEN_LIMIT, remaining: USER_DAILY_TOKEN_LIMIT, unlimited: true, resetAt: nextUtcMidnightIso() };
  }
  const today = new Date().toISOString().slice(0, 10);
  const cleanId = String(userIdentifier || 'anon').replace(/[^a-zA-Z0-9_.-]/g, '_');
  const userQuotaKey = `user_tokens_${cleanId}_${today}`;
  let currentTokens = 0;
  const inRam = getFromRam(userQuotaKey);
  if (inRam !== null) currentTokens = parseInt(inRam, 10) || 0;
  else if (env.BOT_MEMORY) {
    const val = await env.BOT_MEMORY.get(userQuotaKey);
    if (val) currentTokens = parseInt(val, 10) || 0;
  }
  return {
    current: currentTokens,
    limit: USER_DAILY_TOKEN_LIMIT,
    remaining: Math.max(0, USER_DAILY_TOKEN_LIMIT - currentTokens),
    unlimited: false,
    resetAt: nextUtcMidnightIso()
  };
}

async function callGroqChat({ groqApiKey, messages, requestedModel = 'openai/gpt-oss-120b', stream = false, maxTokens = 2048, vision = false, skipFallback = false, temperature = 0.65, env = null, ctx = null }) {
  const sanitizedModel = normalizeModel(requestedModel);
  const ladder = groqLadder(sanitizedModel, { vision, skipFallback });
  const track = (field) => {
    if (!env) return;
    const p = bumpOps(env, field, 1).catch(() => {});
    if (ctx) ctx.waitUntil(p);
  };

  let lastErrorText = '';
  let lastStatus = 500;

  for (const modelToTry of ladder) {
    try {
      const requestPayload = {
        model: modelToTry,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream
      };

      if (modelToTry.includes('gpt-oss')) {
        requestPayload.reasoning_format = 'hidden';
        requestPayload.reasoning_effort = 'low';
      } else if (modelToTry.includes('qwen')) {
        requestPayload.reasoning_format = 'hidden';
        requestPayload.reasoning_effort = 'none';
      }

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });

      track('groqCalls');

      if (res.ok) {
        return { ok: true, response: res, model: modelToTry };
      }

      lastStatus = res.status;
      lastErrorText = await res.text().catch(() => '');
      console.warn(`Groq fallback: model ${modelToTry} failed (${res.status}): ${lastErrorText}`);
      track('groqFail');

      if (shouldRetryGroq(res.status)) continue;
      break;
    } catch (err) {
      console.warn(`Groq fetch error for model ${modelToTry}: ${err.message}`);
      lastErrorText = err.message;
      track('groqFail');
    }
  }

  return { ok: false, status: lastStatus, error: lastErrorText };
}

async function handleWebChatStream(request, env, ctx) {
  try {
    const authHeader = request.headers.get('Authorization') || '';
    const userGroqKey = request.headers.get('x-groq-user-key');
    let authedUser = null;

    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      authedUser = await verifyJwtToken(token, env.JWT_SECRET || 'trujillo_jwt_secret_2026');
    }

    const body = await request.json();
    const { prompt, model, role_preset, custom_prompt, knowledge_snippets, search_web, chat_history, length_mode, locale } = body;
    const attachedImage = parseDataImage(body.image);
    const useVision = !!attachedImage;
    if (!String(prompt || '').trim() && !useVision) {
      return new Response(JSON.stringify({ error: 'empty_message' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const userIdentifier = authedUser?.email || request.headers.get('CF-Connecting-IP') || 'anon';
    const isOwner = isOwnerUser(userIdentifier, env);

    // Control de Cuota Diaria por Usuario / IP
    if (!userGroqKey && !isOwner) {
      const quotaCheck = await checkAndConsumeGlobalTokens(env, userIdentifier, 350);
      if (!quotaCheck.allowed) {
        return new Response(JSON.stringify({
          error: 'global_quota_exceeded',
          message: `Límite diario de 50,000 tokens alcanzado para hoy (${quotaCheck.current.toLocaleString()}/${USER_DAILY_TOKEN_LIMIT.toLocaleString()} tokens consumidos). Se reinicia a las 00:00 UTC. Puedes configurar tu clave de API Groq (BYOK) en Ajustes para acceso ilimitado.`
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    const clientTz = body.timezone || request.cf?.timezone || userProfile?.timezone || 'Europe/Madrid';
    const timeContext = getRealtimeSystemTimeContext({
      timezone: clientTz,
      locale: locale || 'es',
      now: new Date()
    });

    const adaptOn = body.adapt !== false;
    let userProfile = await loadProfile(env, userIdentifier);
    if (!authedUser && body.profile && typeof body.profile === 'object') {
      userProfile = sanitizeProfile({ ...userProfile, ...body.profile, notes: body.profile.notes || userProfile.notes });
    }
    if (typeof body.adapt === 'boolean') userProfile.enabled = body.adapt;
    const learned = adaptOn && userProfile.enabled !== false
      ? applyTurn(userProfile, {
          prompt,
          topic: classifySpecialtyDomain(prompt).key,
          locale,
          lengthMode: length_mode,
          accountName: authedUser?.name,
          timezone: clientTz
        })
      : { profile: userProfile, added: [], forgotten: [], forgetAll: false };
    userProfile = learned.profile;

    const detectedSpecialty = classifySpecialtyDomain(prompt);
    let effectiveRoleKey = (role_preset && role_preset !== 'auto' && PERSONAS[role_preset]) ? role_preset : detectedSpecialty.key;
    let basePersona = PERSONAS[effectiveRoleKey] || PERSONAS.general;

    if (custom_prompt && custom_prompt.trim()) {
      basePersona += `\n\n[INSTRUCCIÓN CORPORATIVA PERSONALIZADA]:\n${custom_prompt.trim()}`;
    }
    if (locale) {
      const meta = langMeta(locale);
      if (meta && meta.reply) basePersona += `\n\n[IDIOMA]: ${meta.reply}`;
    }
    const profileBlock = adaptOn ? formatProfileBlock(userProfile, prompt) : '';
    if (profileBlock) {
      basePersona += `\n\n${profileBlock}`;
    }

    let systemPrompt = `${basePersona}

=== DIRECTIVAS GENERALES Y ADAPTABILIDAD ===
- Responde de forma natural, inteligente y contextual a lo que el usuario realmente pide.
- Si el usuario saluda o formula una pregunta informal (ej: "hola", "que pasa", "buenas", "que tal"), responde de forma directa, ágil y conversacional sin soltar informes de mercado ni plantillas vacías a menos que te lo soliciten.
- NUNCA inventes cotizaciones de mercado, precios de materias primas (oro, petróleo, índices) ni estadísticas inventadas. Si el usuario no pregunta por mercados o finanzas, no incluyas resúmenes financieros.
- No asumas intereses (cripto, bolsa, arquitectura, código) si no aparecen en la conversación ni en el perfil del usuario.
- Cero emojis, emoticonos o expresiones infantiles: mantén un estándar claro, profesional y sobrio.

${timeContext.systemPromptBlock}

${DEFINITION_EXCELLENCE_DIRECTIVE}

=== DIRECTIVAS DE DATOS EN VIVO Y MERCADOS ===
- Si el usuario pregunta por precios, cotizaciones, noticias o eventos actuales, básate estrictamente en los bloques de datos proporcionados.
- Si analizas un activo financiero específico consultado por el usuario, cita su $CASHTAG en mayúsculas (ej: $BTC, $MSTR, $NVDA, $TSLA).
- Usa Markdown estructurado, tablas cuando faciliten la comparativa, y bloques de código tipados.`;

    if (Array.isArray(knowledge_snippets) && knowledge_snippets.length > 0) {
      systemPrompt += `\n\n=== CONOCIMIENTOS CONTEXTUALES DE LA BASE DE CONOCIMIENTO (RAG) ===\n`;
      knowledge_snippets.forEach((item) => {
        if (item.title && item.content) {
          systemPrompt += `• [${item.title}]: ${item.content}\n`;
        }
      });
    }

    let customContext = '';
    let webSources = [];

    const autoSearch = !useVision && shouldAutoSearchWeb(prompt);
    const doWebSearch = !useVision && (search_web || autoSearch);

    if (!useVision) {
      const liveMarket = await fetchLiveMarketData(prompt);
      if (liveMarket) {
        customContext += `\n\n${liveMarket}`;
      }
    }

    if (doWebSearch && prompt) {
      const searchResult = await searchWeb(prompt);
      if (searchResult.snippets) {
        customContext += `\n\n[RESULTADOS DE BÚSQUEDA WEB EN TIEMPO REAL - ${timeContext.formattedDate}]:\n${searchResult.snippets}`;
        webSources = searchResult.sources || [];
      }
    }

    let effectiveMaxTokens = 2048;
    if (length_mode === 'corto') {
      effectiveMaxTokens = 600;
      systemPrompt += `\n\n=== DIRECTIVA DE LONGITUD: CORTO ===\n- Sé extremadamente conciso, directo y sintético. Ve al grano sin introducciones ni rodeos.\n`;
    } else if (length_mode === 'extendido') {
      effectiveMaxTokens = 3800;
      systemPrompt += `\n\n=== DIRECTIVA DE LONGITUD: EXTENDIDO ===\n- Entrega una respuesta exhaustiva, profunda, con explicaciones paso a paso, ejemplos de código completos y máxima granularidad técnica.\n`;
    } else {
      effectiveMaxTokens = 2048;
      systemPrompt += `\n\n=== DIRECTIVA DE LONGITUD: NORMAL ===\n- Estructura la respuesta de forma clara, equilibrada y precisa.\n`;
    }

    if (useVision) {
      systemPrompt += `\n\n=== IMAGEN ADJUNTA ===\nEl usuario ha adjuntado una imagen. Analízala con precisión y responde a su pregunta. Si no hay pregunta, describe lo relevante.`;
    }

    const messages = [{ role: 'system', content: systemPrompt }];
    if (chat_history && Array.isArray(chat_history)) {
      chat_history.slice(-8).forEach(m => {
        if (m.role && m.content) {
          messages.push({ role: m.role === 'user' ? 'user' : 'assistant', content: String(m.content).slice(0, 900) });
        }
      });
    }
    const userText = (customContext ? `${prompt}\n\n${customContext}` : prompt).slice(0, 8000);
    if (useVision) {
      messages.push({
        role: 'user',
        content: [
          { type: 'text', text: userText || 'Analiza esta imagen.' },
          { type: 'image_url', image_url: { url: attachedImage.dataUrl } }
        ]
      });
    } else {
      messages.push({ role: 'user', content: userText });
    }

    const groqApiKey = userGroqKey || env.GROQ_API_KEY;
    if (!groqApiKey) {
      return new Response(JSON.stringify({ error: 'missing_key', message: 'Error: GROQ_API_KEY no configurada en Cloudflare Secrets' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    if (adaptOn && userProfile.enabled !== false) {
      ctx.waitUntil(saveProfile(env, userIdentifier, userProfile).catch(() => {}));
    }

    const groqResult = await callGroqChat({
      groqApiKey,
      messages,
      requestedModel: useVision ? VISION_MODELS[0] : (model || env.GROQ_MODEL || 'openai/gpt-oss-120b'),
      stream: true,
      maxTokens: effectiveMaxTokens,
      vision: useVision,
      env,
      ctx
    });

    if (!groqResult.ok || !groqResult.response) {
      ctx.waitUntil(bumpOps(env, 'errors', 1));
      let errorMsg = 'Error en el servicio de IA. Inténtalo de nuevo en unos segundos.';
      try {
        const parsed = JSON.parse(groqResult.error);
        if (parsed?.error?.message) errorMsg = parsed.error.message;
      } catch (e) {
        if (groqResult.error && typeof groqResult.error === 'string') errorMsg = groqResult.error;
      }
      return new Response(JSON.stringify({ error: 'groq_error', message: errorMsg }), {
        status: groqResult.status || 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    ctx.waitUntil(bumpOps(env, 'chats', 1));
    if (useVision) ctx.waitUntil(bumpOps(env, 'vision', 1));

    const groqRes = groqResult.response;

    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    ctx.waitUntil((async () => {
      try {
        // Enviar metadata inicial (Especialidad Detectada y Fuentes Web) de forma asíncrona dentro del stream
        await writer.write(encoder.encode(`data: ${JSON.stringify({ 
          specialty: detectedSpecialty,
          sources: webSources.length > 0 ? webSources : undefined,
          profile: publicProfile(userProfile),
          remembered: learned.added.map((n) => n.text),
          forgotten: learned.forgotten.map((n) => n.text)
        })}\n\n`));

        if (adaptOn && userProfile.enabled !== false) {
          ctx.waitUntil((async () => {
            try {
              await saveProfile(env, userIdentifier, userProfile);
              if (shouldLlmExtract(prompt, userProfile, learned) && groqApiKey && !useVision) {
                const ext = await callGroqChat({
                  groqApiKey,
                  messages: enrichExtractMessages(prompt, locale),
                  requestedModel: FAST_TEXT_MODEL,
                  stream: false,
                  maxTokens: 160,
                  skipFallback: true,
                  temperature: 0.1,
                  env
                });
                if (ext.ok && ext.response) {
                  const data = await ext.response.json();
                  const parsed = parseEnrichJson(data.choices?.[0]?.message?.content || '');
                  if (parsed.facts.length) {
                    const extra = applyEnrichment(userProfile, parsed);
                    userProfile = extra.profile;
                    await saveProfile(env, userIdentifier, userProfile);
                  } else {
                    userProfile.lastExtractAt = userProfile.turns;
                    await saveProfile(env, userIdentifier, userProfile);
                  }
                }
              } else if (shouldSynthesize(userProfile) && groqApiKey && !useVision) {
                const syn = await callGroqChat({
                  groqApiKey,
                  messages: synthMessages(userProfile, locale),
                  requestedModel: FAST_TEXT_MODEL,
                  stream: false,
                  maxTokens: 120,
                  skipFallback: true,
                  temperature: 0.2,
                  env
                });
                if (syn.ok && syn.response) {
                  const data = await syn.response.json();
                  const sum = String(data.choices?.[0]?.message?.content || '').trim().slice(0, 500);
                  if (sum.length > 20) {
                    userProfile.summary = sum;
                    userProfile.lastSynthAt = userProfile.turns;
                    await saveProfile(env, userIdentifier, userProfile);
                  }
                }
              }
            } catch (_) {}
          })());
        }

        const reader = groqRes.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let sentAnyContent = false;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const jsonStr = trimmed.slice(6);
            if (jsonStr === '[DONE]') {
              if (!sentAnyContent) {
                await writer.write(encoder.encode(`data: ${JSON.stringify({ content: 'Disculpa, no se pudo completar la respuesta en este turno. Por favor, reformula o envía de nuevo.' })}\n\n`));
              }
              await writer.write(encoder.encode('data: [DONE]\n\n'));
              continue;
            }
            try {
              const parsed = JSON.parse(jsonStr);
              const textChunk = parsed.choices?.[0]?.delta?.content || '';
              if (textChunk) {
                sentAnyContent = true;
                await writer.write(encoder.encode(`data: ${JSON.stringify({ content: textChunk })}\n\n`));
              }
            } catch (e) {}
          }
        }
      } catch (err) {
        console.error('Error streaming chat:', err);
      } finally {
        await writer.close().catch(() => {});
      }
    })());

    return new Response(readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive'
      }
    });

  } catch (err) {
    return new Response(`Error: ${err.message}`, { status: 500, headers: corsHeaders });
  }
}

// ==========================================
// Handlers de Discord
// ==========================================
async function handleDiscordInteractionAsync(interaction, env, isEphemeral = false) {
  const { name, options } = interaction.data;
  const discordUserId = interaction.user?.id || interaction.member?.user?.id || 'anon';
  const isOwnerDiscord = (discordUserId === '1056428300588818432');

  try {
    if (name === 'ayuda') {
      const helpMessage = 
`### Trujillo AI Enterprise Engine
**ai.trujillomingorance.com**

**Comandos Principales:**
• \`/ia\` o \`/ai\`: Inferencia de alta velocidad sobre arquitecturas OSS 120B & Qwen.
• \`/buscar\`: Búsqueda en tiempo real con fuentes citadas.
• \`/leer-url\`: Inspección y síntesis de URLs o repositorios.
• \`/imagen\`: Generación de arte (Próximamente).

**Portal Web:**
https://ai.trujillomingorance.com — chat, imagen adjunta, voz, lectura en voz alta e ideas de producto.`;
      await sendDiscordReply(interaction, helpMessage, isEphemeral);
      return;
    }

    // Comandos de memoria y personalidad
    if (name === 'entrenar') {
      const conocimiento = options?.find(o => o.name === 'conocimiento')?.value;
      const titulo = options?.find(o => o.name === 'titulo')?.value || 'Dato sin título';
      
      let memStr = env.BOT_MEMORY ? await env.BOT_MEMORY.get(`mem_discord_${discordUserId}`) : null;
      let memories = memStr ? JSON.parse(memStr) : [];
      memories.push({ titulo, conocimiento, date: Date.now() });
      if (memories.length > 15) memories.shift(); // Limitar a 15 recuerdos
      
      if (env.BOT_MEMORY) await env.BOT_MEMORY.put(`mem_discord_${discordUserId}`, JSON.stringify(memories));
      
      await sendDiscordReply(interaction, `**Conocimiento memorizado:** "${titulo}"\nYa puedo usar esta información en nuestras próximas conversaciones.`, true);
      return;
    }

    if (name === 'personalidad') {
      const rol = options?.find(o => o.name === 'rol')?.value;
      const promptPersonalizado = options?.find(o => o.name === 'prompt_personalizado')?.value;
      
      let systemInstruction = "Eres Trujillo AI Enterprise Engine (ai.trujillomingorance.com). Eres un asistente de Inteligencia Artificial avanzado, desarrollado sobre arquitecturas de vanguardia (OSS 120B / Qwen). Tu tono es altamente profesional, directo, analítico y corporativo.";
      let rolName = "Asistente Universal";

      if (rol === 'developer') { systemInstruction = "Eres Trujillo AI, un Arquitecto de Software Senior y Desarrollador Experto. Analizas código meticulosamente, ofreces arquitecturas robustas y escribes código limpio, eficiente y documentado."; rolName = "Arquitecto de Software"; }
      else if (rol === 'researcher') { systemInstruction = "Eres Trujillo AI, un Investigador Científico y Analista de Datos. Piensas de forma rigurosa, basada en evidencia, y explicas conceptos complejos con claridad académica."; rolName = "Investigador Científico"; }
      else if (rol === 'legal_finance') { systemInstruction = "Eres Trujillo AI, un Experto Legal y Analista Financiero. Tu tono es formal, preciso y mitigador de riesgos. Estructuras las respuestas como informes ejecutivos."; rolName = "Experto Legal & Negocios"; }
      else if (rol === 'creative') { systemInstruction = "Eres Trujillo AI, un Redactor Creativo y Copywriter brillante. Piensas de forma ingeniosa, persuasiva y original, adaptando tu tono para cautivar a la audiencia."; rolName = "Redactor Creativo"; }
      else if (rol === 'hacker') { systemInstruction = "Eres Trujillo AI, un Hacker Ético y Especialista en Ciberseguridad. Piensas en vectores de ataque, vulnerabilidades y mitigación de riesgos de forma paranoica y detallada."; rolName = "Hacker Ético"; }
      else if (rol === 'custom' && promptPersonalizado) { systemInstruction = promptPersonalizado; rolName = "Personalizado"; }
      
      if (env.BOT_MEMORY) {
        await env.BOT_MEMORY.put(`persona_discord_${discordUserId}`, systemInstruction);
        await env.BOT_MEMORY.put(`persona_name_discord_${discordUserId}`, rolName);
      }
      
      await sendDiscordReply(interaction, `**Personalidad actualizada:** Ahora actuaré como **${rolName}**.`, true);
      return;
    }

    if (name === 'memoria') {
      const accion = options?.find(o => o.name === 'accion')?.value;
      
      if (accion === 'borrar_todo') {
        if (env.BOT_MEMORY) {
          await env.BOT_MEMORY.delete(`mem_discord_${discordUserId}`);
          await env.BOT_MEMORY.delete(`persona_discord_${discordUserId}`);
          await env.BOT_MEMORY.delete(`persona_name_discord_${discordUserId}`);
        }
        await sendDiscordReply(interaction, `**Memoria formateada.** He olvidado todos los conocimientos y mi personalidad ha vuelto a la de fábrica.`, true);
        return;
      }
      
      if (accion === 'borrar_ultimo') {
        let memStr = env.BOT_MEMORY ? await env.BOT_MEMORY.get(`mem_discord_${discordUserId}`) : null;
        let memories = memStr ? JSON.parse(memStr) : [];
        if (memories.length > 0) {
          const removed = memories.pop();
          if (env.BOT_MEMORY) await env.BOT_MEMORY.put(`mem_discord_${discordUserId}`, JSON.stringify(memories));
          await sendDiscordReply(interaction, `**Conocimiento olvidado:** "${removed.titulo}"`, true);
        } else {
          await sendDiscordReply(interaction, `Tu memoria ya está vacía.`, true);
        }
        return;
      }
      
      if (accion === 'ver') {
        let memStr = env.BOT_MEMORY ? await env.BOT_MEMORY.get(`mem_discord_${discordUserId}`) : null;
        let memories = memStr ? JSON.parse(memStr) : [];
        let pName = (env.BOT_MEMORY ? await env.BOT_MEMORY.get(`persona_name_discord_${discordUserId}`) : null) || "Asistente Universal";
        
        let reply = `### Base de Conocimiento Activa\n**Personalidad Actual:** ${pName}\n\n**Recuerdos Entrenados (${memories.length}/15):**\n`;
        if (memories.length === 0) reply += "No me has enseñado nada todavía. Usa `/entrenar` para añadir datos.";
        else memories.forEach((m, i) => { reply += `${i+1}. **${m.titulo}**\n`; });
        
        await sendDiscordReply(interaction, reply, true);
        return;
      }
    }

    if (name === 'modo') {
      const selectedMode = options?.find(o => o.name === 'longitud')?.value || 'normal';
      let modeLabel = 'Normal / Equilibrado (3-4 puntos clave)';
      if (selectedMode === 'corto') modeLabel = 'Corto y Directo (Síntesis ejecutiva en 1-2 puntos)';
      else if (selectedMode === 'extendido') modeLabel = 'Extendido / Análisis Completo (Deep Dive exhaustivo)';

      if (env.BOT_MEMORY) {
        await env.BOT_MEMORY.put(`length_discord_${discordUserId}`, selectedMode);
      }

      await sendDiscordReply(interaction, `**Preferencia de Longitud Guardada:** Tus respuestas ahora se generarán en modo **${modeLabel}** por defecto.\n*(Puedes sobrescribirlo puntualmente en cualquier comando usando la opción \`longitud\`)*.`, true);
      return;
    }

    if (name === 'imagen') {
      const promptOpt = options?.find(o => o.name === 'prompt' || o.name === 'descripcion' || o.name === 'texto')?.value;
      const estiloOpt = options?.find(o => o.name === 'estilo')?.value || '';
      const aspectoOpt = options?.find(o => o.name === 'aspecto')?.value || '1024x1024';
      if (!promptOpt) {
        await sendDiscordReply(interaction, 'Introduce una descripción para generar la imagen: `/imagen prompt:tu_idea`.', isEphemeral);
        return;
      }
      let [width, height] = aspectoOpt.split('x').map(n => parseInt(n, 10));
      if (!width || !height) { width = 1024; height = 1024; }
      const finalPrompt = estiloOpt ? `${promptOpt}, ${estiloOpt}` : promptOpt;
      const seed = Math.floor(Math.random() * 10000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=${width}&height=${height}&nologo=true&model=flux&seed=${seed}`;
      const embed = {
        title: `Generación Visual: ${promptOpt.slice(0, 80)}`,
        description: `**Prompt:** ${promptOpt}\n**Modelo:** Flux 1.1 Ultra\n**Dimensiones:** ${width}x${height}px\n**Infraestructura:** [Trujillo AI](https://ai.trujillomingorance.com)`,
        color: 0x000000,
        image: { url: imageUrl },
        footer: { text: 'Trujillo AI Enterprise · ai.trujillomingorance.com' }
      };
      await sendDiscordReply(interaction, `Aquí tienes la imagen generada con **Trujillo AI** (Flux 1.1 Ultra):`, isEphemeral, [embed]);
      return;
    }

    if (name === 'vincular') {
      await sendDiscordReply(interaction, `El comando \`/${name}\` se encuentra actualmente en fase de despliegue en la infraestructura de Trujillo Labs y estará disponible próximamente.`, isEphemeral);
      return;
    }

    let userPrompt = '';
    let shouldSearchWeb = false;
    let selectedModel = env.GROQ_MODEL || 'openai/gpt-oss-120b';
    let explicitLength = null;

    if (name === 'ia' || name === 'ai' || name === 'groq') {
      const promptOpt = options?.find(opt => opt.name === 'pregunta');
      const searchOpt = options?.find(opt => opt.name === 'buscar_web');
      const modelOpt = options?.find(opt => opt.name === 'modelo');
      const lengthOpt = options?.find(opt => opt.name === 'longitud');

      userPrompt = promptOpt?.value || 'Hola';
      shouldSearchWeb = (searchOpt?.value === true || shouldAutoSearchWeb(userPrompt));
      if (modelOpt?.value) selectedModel = modelOpt.value;
      if (lengthOpt?.value) explicitLength = lengthOpt.value;
    } else if (name === 'buscar') {
      const queryOpt = options?.find(opt => opt.name === 'consulta');
      const modelOpt = options?.find(opt => opt.name === 'modelo');
      const lengthOpt = options?.find(opt => opt.name === 'longitud');

      userPrompt = queryOpt?.value || '';
      shouldSearchWeb = true;
      if (modelOpt?.value) selectedModel = modelOpt.value;
      if (lengthOpt?.value) explicitLength = lengthOpt.value;
    } else if (name === 'leer-url') {
      const urlOpt = options?.find(opt => opt.name === 'url');
      const questionOpt = options?.find(opt => opt.name === 'pregunta');
      const lengthOpt = options?.find(opt => opt.name === 'longitud');

      const targetUrl = urlOpt?.value || '';
      const question = questionOpt?.value || 'Resume e inspecciona el contenido de este enlace.';
      if (lengthOpt?.value) explicitLength = lengthOpt.value;

      const webContent = await fetchUrlContent(targetUrl);
      userPrompt = `${question}\n\n[CONTENIDO DE LA URL (${targetUrl})]:\n${webContent}`;
    } else if (name === 'Responder con Trujillo AI' || name === 'Respond with Trujillo AI') {
      const targetMsgId = interaction.data.target_id;
      const targetMsg = interaction.data.resolved?.messages?.[targetMsgId];
      if (targetMsg) {
        userPrompt = `El usuario me ha pedido responder a este mensaje:\n\n"${targetMsg.content}"\n\nPor favor, responde de forma adecuada basándote en su contenido.`;
      } else {
        userPrompt = 'Responde al usuario y dile que no has podido leer el mensaje original por un error técnico.';
      }
    }

    // Determinar modo de longitud (explícito en el comando o guardado en la memoria del usuario)
    let lengthMode = explicitLength;
    if (!lengthMode && env.BOT_MEMORY) {
      lengthMode = await env.BOT_MEMORY.get(`length_discord_${discordUserId}`);
    }
    if (!['corto', 'normal', 'extendido'].includes(lengthMode)) {
      lengthMode = 'normal';
    }

    let lengthRule = "";
    let maxTokens = 1000;

    if (lengthMode === 'corto') {
      maxTokens = 500;
      lengthRule = `=== DIRECTIVA DE LONGITUD: CORTO Y DIRECTO (SÍNTESIS ULTRA-CONCISA) ===
- Responde estrictamente en 1 a 2 viñetas o un párrafo muy conciso y directo al grano.
- Cero introducciones, saludos o despedidas. Entrega inmediatamente el dato, resultado o código clave.`;
    } else if (lengthMode === 'extendido') {
      maxTokens = 2200;
      lengthRule = `=== DIRECTIVA DE LONGITUD: EXTENDIDO Y PROFUNDO (DEEP DIVE / ANÁLISIS EXHAUSTIVO) ===
- Desarrolla un informe exhaustivo, riguroso y detallado de máximo nivel profesional.
- Estructura con encabezados '### Título', desglose detallado punto por punto, contexto técnico/arquitectónico, métricas clave, riesgos y conclusiones operativas.
- Si incluye código o soluciones técnicas, escribe el código completo tipado y comentado.`;
    } else {
      maxTokens = 1000;
      lengthRule = `=== DIRECTIVA DE LONGITUD: EQUILIBRADO Y PROFESIONAL (ESTÁNDAR) ===
- Estructura tu respuesta de forma clara y equilibrada en 2 a 4 puntos clave o apartados bien definidos.
- Equilibrio óptimo entre concisión ejecutiva y profundidad técnica.`;
    }

    const now = new Date();
    const currentDateStr = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const currentYear = now.getFullYear();

    let webSources = [];
    const originalUserPrompt = userPrompt;

    const earlySymbols = extractCashtagSymbols(originalUserPrompt);
    if (isSimpleTickerQuery(originalUserPrompt) && earlySymbols.length) {
      const discordEmbeds = [];
      const lines = [];
      for (const sym of earlySymbols.slice(0, 4)) {
        try {
          const quote = await fetchGlobalAssetQuote(sym);
          if (!quote || !(quote.price > 0)) continue;
          const embed = buildDiscordAssetEmbed(quote);
          if (embed) discordEmbeds.push(embed);
          const chg = quote.change24h || 0;
          const priceStr = quote.price >= 1
            ? '$' + quote.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : '$' + quote.price.toFixed(4);
          lines.push(`**$${quote.symbol}** · ${quote.name || quote.symbol} · ${priceStr} (${chg >= 0 ? '+' : ''}${chg.toFixed(2)}%) · [TradingView](${tradingViewChartUrl(quote)}) · [Investing](${investingUrl(quote.symbol)})`);
        } catch (e) {
          console.error('ticker widget', sym, e);
        }
      }
      if (discordEmbeds.length) {
        await sendDiscordReply(interaction, lines.join('\n'), isEphemeral, discordEmbeds);
        return;
      }
    }

    const liveMarket = await fetchLiveMarketData(originalUserPrompt);
    if (liveMarket) {
      userPrompt += `\n\n${liveMarket}`;
    }

    if (shouldSearchWeb && userPrompt) {
      const searchResult = await searchWeb(userPrompt);
      if (searchResult.snippets) {
        userPrompt += `\n\n[RESULTADOS DE BÚSQUEDA WEB EN TIEMPO REAL - ${currentDateStr}]:\n${searchResult.snippets}`;
        webSources = searchResult.sources || [];
      }
    }

    let basePersona = "Eres Trujillo AI Enterprise Engine (ai.trujillomingorance.com). Eres un asistente de Inteligencia Artificial avanzado, desarrollado sobre arquitecturas de vanguardia (OSS 120B / Qwen). Tu tono es altamente profesional, directo, analítico y corporativo.";
    if (env.BOT_MEMORY) {
      const customPersona = await env.BOT_MEMORY.get(`persona_discord_${discordUserId}`);
      if (customPersona) basePersona = customPersona;
    }
    
    let memoryInjection = "";
    if (env.BOT_MEMORY) {
      let memStr = await env.BOT_MEMORY.get(`mem_discord_${discordUserId}`);
      if (memStr) {
        let memories = JSON.parse(memStr);
        if (memories.length > 0) {
          memoryInjection = "\n\n=== CONOCIMIENTO APRENDIDO DEL USUARIO (MUY IMPORTANTE) ===\n" + memories.map(m => `- [${m.titulo}]: ${m.conocimiento}`).join('\n');
        }
      }
    }
    let discordProfile = await loadProfile(env, discordUserId);
    const discordTz = discordProfile.timezone || 'Europe/Madrid';
    const timeContext = getRealtimeSystemTimeContext({
      timezone: discordTz,
      locale: 'es',
      now: new Date()
    });
    const discordLearned = applyTurn(discordProfile, {
      prompt: originalUserPrompt,
      topic: classifySpecialtyDomain(originalUserPrompt).key,
      lengthMode,
      timezone: discordTz
    });
    discordProfile = discordLearned.profile;
    const discordProfileBlock = formatProfileBlock(discordProfile, originalUserPrompt);
    if (discordProfileBlock) memoryInjection += '\n\n' + discordProfileBlock;
    if (env.BOT_MEMORY) {
      try { await saveProfile(env, discordUserId, discordProfile); } catch (e) {}
    }

    const systemPrompt = `${basePersona}

=== ADAPTABILIDAD TOTAL Y DIRECTIVAS DE RESPUESTA ===
${lengthRule}
- PREGUNTAS CASUALES O SALUDOS: Si el usuario te saluda o hace una pregunta informal (ej: "hola", "que pasa", "que tal", "quién eres"), responde de forma natural, directa y ágil (ej: "¡Hola! Todo en orden por aquí. ¿En qué te puedo ayudar hoy?"), SIN generar resúmenes de mercado ni plantillas rígidas a menos que te lo pidan expresamente.
- CERO ALUCINACIONES: NUNCA inventes cotizaciones de mercado, precios de materias primas (oro, petróleo, divisas) ni estadísticas inventadas. Si el usuario no te pregunta por mercados o finanzas, no incluyas resúmenes financieros.
- PROHIBIDO EL USO DE EMOJIS, EMOTICONOS O CARITAS: Mantén un estilo sobrio, formal, limpio y profesional.
- FORMATO DISCORD:
  * Responde directo al grano sin repetir la pregunta.
  * Usa negritas y viñetas '•' para listas.
  * NO uses tablas Markdown con barras ('|---|') ni divisores ('---').
  * Bloques de código tipados cuando te pidan programación o configuración.
  * Si el usuario consulta un activo financiero específico o criptomoneda, cita su $CASHTAG en mayúsculas (ej: $BTC, $MSTR, $NVDA).
  * Si nombra un $TICKER concreto, habla SOLO de ese activo. No compares con $QQQ, $SPY ni otros índices salvo que lo pida.
  * Frases completas: no cortes palabras ni uses espacios raros. Si hay widget de cotización, no recites todos los números; da 2-4 frases de contexto.

${timeContext.systemPromptBlock}

${DEFINITION_EXCELLENCE_DIRECTIVE}

=== CONTEXTO TEMPORAL Y MERCADOS ===
- Si recibes cotizaciones o noticias en los metadatos de búsqueda, úsalos para dar respuestas 100% actualizadas.${memoryInjection}`;

    const rawAiResponse = await queryGroq(systemPrompt, userPrompt, selectedModel, env, maxTokens);
    let finalReply = formatForDiscord(rawAiResponse);

    if (webSources.length > 0) {
      finalReply += `\n\n### Fuentes:\n` + webSources.slice(0, 3).map(s => `• [${s.title}](${s.url})`).join('\n');
    }

    // Gráficos: solo los tickers que el usuario nombró. Nunca extraer de la respuesta ni de "NASDAQ".
    const userSymbols = extractCashtagSymbols(originalUserPrompt);
    const isMarketIntent = userSymbols.length > 0 || /\b(precio|cotizaci[oó]n|cu[aá]nto vale|analiza|gr[aá]fico|ticker|acci[oó]n|etf|cripto|crypto|bolsa)\b/i.test(originalUserPrompt);
    const detectedSymbols = userSymbols.length > 0
      ? userSymbols
      : (isMarketIntent ? extractCashtagSymbols(rawAiResponse, { allowNames: false }) : []);
    const discordEmbeds = [];

    for (const sym of detectedSymbols.slice(0, 4)) {
      try {
        const quote = await fetchGlobalAssetQuote(sym);
        if (quote && quote.price > 0) {
          const embed = buildDiscordAssetEmbed(quote);
          if (embed) discordEmbeds.push(embed);
        }
      } catch (e) {
        console.error('Error fetching discord asset quote for', sym, e);
      }
    }

    await sendDiscordReply(interaction, finalReply, isEphemeral, discordEmbeds);

  } catch (err) {
    console.error('Error Discord interaction:', err);
    await sendDiscordReply(interaction, `Error: ${err.message}`, isEphemeral);
  }
}

async function handleDiscordModalAsync(interaction, env, isEphemeral = false) {
  try {
    const discordUserId = interaction.user?.id || interaction.member?.user?.id || 'anon';
    let basePersona = "Eres Trujillo AI Enterprise Engine (ai.trujillomingorance.com).";
    if (env.BOT_MEMORY) {
      const customPersona = await env.BOT_MEMORY.get(`persona_discord_${discordUserId}`);
      if (customPersona) basePersona = customPersona;
    }
    let memoryInjection = "";
    if (env.BOT_MEMORY) {
      let memStr = await env.BOT_MEMORY.get(`mem_discord_${discordUserId}`);
      if (memStr) {
        let memories = JSON.parse(memStr);
        if (memories.length > 0) {
          memoryInjection = "\n\n=== CONOCIMIENTO APRENDIDO ===\n" + memories.map(m => `- [${m.titulo}]: ${m.conocimiento}`).join('\n');
        }
      }
    }
    const modalTimeContext = getRealtimeSystemTimeContext({ timezone: 'Europe/Madrid', locale: 'es', now: new Date() });
    const rawAiResponse = await queryGroq(
      `${basePersona}\n\n=== REGLAS OBLIGATORIAS ===\n- RESPUESTAS DIRECTAS. NO repitas la pregunta.\n- Usa Markdown limpio.\n- Mantén un tono altamente profesional y analítico.\n\n${modalTimeContext.systemPromptBlock}\n\n${DEFINITION_EXCELLENCE_DIRECTIVE}${memoryInjection}`,
      interaction.data.components[0].components[0].value,
      env.GROQ_MODEL || 'openai/gpt-oss-120b',
      env,
      1500
    );
    await sendDiscordReply(interaction, formatForDiscord(rawAiResponse), isEphemeral);
  } catch (err) {
    await sendDiscordReply(interaction, `Error: ${err.message}`, isEphemeral);
  }
}

async function queryGroq(systemPrompt, userPrompt, model, env, maxTokens = 1500) {
  const groqApiKey = env.GROQ_API_KEY;
  if (!groqApiKey) throw new Error('GROQ_API_KEY no configurada');

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  const groqResult = await callGroqChat({
    groqApiKey,
    messages,
    requestedModel: model || env.GROQ_MODEL || 'openai/gpt-oss-120b',
    stream: false,
    maxTokens
  });

  if (!groqResult.ok || !groqResult.response) {
    throw new Error(`Groq Error: ${groqResult.error || 'Fallo de inferencia'}`);
  }

  const data = await groqResult.response.json();
  return data.choices?.[0]?.message?.content || 'Sin respuesta generada.';
}

function convertMarkdownTablesToDiscord(text) {
  if (!text || !text.includes('|')) return text;

  const lines = text.split('\n');
  const result = [];
  let inTable = false;
  let headers = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (rawLine.startsWith('|') && rawLine.endsWith('|')) {
      const cells = rawLine.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (cells.every(c => /^[-:]+$/.test(c))) {
        continue;
      }
      if (!inTable) {
        inTable = true;
        headers = cells;
      } else {
        if (cells.length === 2) {
          result.push(`• **${cells[0]}:** ${cells[1]}`);
        } else if (cells.length > 2) {
          const mainKey = cells[0];
          const rest = cells.slice(1).map((val, idx) => {
            const h = headers[idx + 1] ? `**${headers[idx + 1]}:** ` : '';
            return `${h}${val}`;
          }).join(' • ');
          result.push(`• **${mainKey}** — ${rest}`);
        } else if (cells.length === 1) {
          result.push(`• ${cells[0]}`);
        }
      }
    } else {
      inTable = false;
      headers = [];
      result.push(lines[i]);
    }
  }
  return result.join('\n');
}

function formatForDiscord(text) {
  if (!text) return '';
  let cleaned = text;

  // 1. Convert markdown tables into clean Discord lists
  cleaned = convertMarkdownTablesToDiscord(cleaned);

  // 2. Normalize headers
  cleaned = cleaned.replace(/^#{4,}\s*(.+)$/gm, '### $1');
  cleaned = cleaned.replace(/^(#{1,3})([^\s#])/gm, '$1 $2');

  // 3. Remove excessive divider lines and blank spaces
  cleaned = cleaned.replace(/\n\s*---\s*\n/g, '\n\n');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // 4. Character limit guard
  if (cleaned.length > 1900) {
    let cut = cleaned.slice(0, 1890);
    const br = Math.max(cut.lastIndexOf('\n'), cut.lastIndexOf('. '), cut.lastIndexOf(' '));
    if (br > 1400) cut = cut.slice(0, br);
    cleaned = cut.replace(/[\s•\-–—]+$/, '') + '\n\n*(Continuar en https://ai.trujillomingorance.com)*';
  }

  return cleaned.trim();
}

function shouldAutoSearchWeb(prompt) {
  if (!prompt) return false;
  const p = prompt.toLowerCase();
  if (/\b(noticias?|actualidad|ultima hora|última hora|breaking)\b/i.test(p)) return true;
  if (/\b(precio|precios|cotizaci[oó]n|cu[aá]nto vale|cu[aá]nto cuesta|bitcoin|\bbtc\b|ethereum|\beth\b|solana|cripto|crypto|nasdaq|ibex|inflaci[oó]n|\bfed\b|elecciones)\b/i.test(p)) return true;
  if (/\b(hoy|ayer|mañana)\b/.test(p) && /\b(noticias?|precio|partido|elecciones|resultado|lanzamiento)\b/.test(p)) return true;
  return false;
}

async function fetchGlobalAssetQuote(symbol) {
  const sym = (symbol || '').toUpperCase().replace(/^\$/, '').trim();
  if (!sym) return null;
  const cacheKey = `global_quote_v3:${sym}`;
  const cached = getFromRam(cacheKey);
  if (cached) return cached;

  // 1. Tier 1: Major Cryptos via Kraken & Binance & Coinbase Spot
  const isLikelyCrypto = ['BTC', 'ETH', 'SOL', 'XRP', 'DOGE', 'ADA', 'AVAX', 'LINK', 'DOT', 'NEAR', 'SUI', 'PEPE', 'SHIB', 'BNB', 'TRX', 'MATIC', 'RENDER', 'WIF', 'BONK', 'PENGU', 'FARTCOIN'].includes(sym);
  if (isLikelyCrypto) {
    // 1A. Kraken Spot Feed (100% accessible worldwide from Cloudflare Edge)
    try {
      const krakenMap = { 'BTC': 'XXBTZUSD', 'ETH': 'XETHZUSD', 'SOL': 'SOLUSD', 'XRP': 'XXRPZUSD', 'DOGE': 'XDGUSD', 'ADA': 'ADAUSD', 'AVAX': 'AVAXUSD', 'LINK': 'LINKUSD', 'DOT': 'DOTUSD' };
      if (krakenMap[sym]) {
        const kRes = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${krakenMap[sym]}`, {
          signal: AbortSignal.timeout(1800),
          headers: { 'User-Agent': 'TrujilloAI/2.0' }
        });
        if (kRes.ok) {
          const kData = await kRes.json();
          const item = kData.result?.[krakenMap[sym]];
          if (item) {
            const last = parseFloat(item.c[0]);
            const open = parseFloat(item.o);
            const high = parseFloat(item.h[1]);
            const low = parseFloat(item.l[1]);
            const changePct = ((last - open) / open) * 100;
            const names = { 'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'SOL': 'Solana', 'XRP': 'Ripple', 'DOGE': 'Dogecoin', 'ADA': 'Cardano', 'AVAX': 'Avalanche', 'LINK': 'Chainlink', 'DOT': 'Polkadot' };
            const volQuote = parseFloat(item.v[1]) * last;
            const formattedVol = volQuote >= 1e9 ? '$' + (volQuote/1e9).toFixed(2)+'B' : (volQuote>=1e6 ? '$' + (volQuote/1e6).toFixed(2)+'M' : '$' + (volQuote/1e3).toFixed(1)+'K');
            const quote = {
              symbol: sym,
              name: names[sym] || sym,
              price: last,
              currency: 'USD',
              change24h: changePct,
              high24h: high,
              low24h: low,
              volume: formattedVol,
              rsi: changePct > 5 ? '68.4' : (changePct < -5 ? '34.2' : '52.8'),
              rating: changePct > 3 ? 'Alcista Fuerte' : (changePct > 0 ? 'Alcista' : (changePct < -3 ? 'Bajista' : 'Neutral')),
              type: 'CRIPTO',
              source: 'Kraken Spot / Binance',
              exchange: 'BINANCE',
              sparkline: [open, low, (open + high)/2, high, last]
            };
            setInRam(cacheKey, quote);
            return quote;
          }
        }
      }
    } catch(e) {}

    // 1B. Binance Global 24hr Feed
    try {
      const bRes = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${sym}USDT`, {
        signal: AbortSignal.timeout(1800)
      });
      if (bRes.ok) {
        const b = await bRes.json();
        if (b.lastPrice) {
          const price = parseFloat(b.lastPrice);
          const change = parseFloat(b.priceChangePercent);
          const high = parseFloat(b.highPrice);
          const low = parseFloat(b.lowPrice);
          const volUsdt = parseFloat(b.quoteVolume);
          const formattedVol = volUsdt >= 1e9 ? '$' + (volUsdt/1e9).toFixed(2)+'B' : (volUsdt>=1e6 ? '$' + (volUsdt/1e6).toFixed(2)+'M' : '$' + (volUsdt/1e3).toFixed(1)+'K');
          const names = { 'BTC': 'Bitcoin', 'ETH': 'Ethereum', 'SOL': 'Solana', 'XRP': 'Ripple', 'DOGE': 'Dogecoin', 'BNB': 'BNB Chain', 'PEPE': 'Pepe', 'SUI': 'Sui Network', 'NEAR': 'NEAR Protocol', 'AVAX': 'Avalanche', 'WIF': 'dogwifhat', 'BONK': 'Bonk' };
          
          const quote = {
            symbol: sym,
            name: names[sym] || `${sym} / USDT`,
            price: price,
            currency: 'USD',
            change24h: change,
            high24h: high,
            low24h: low,
            volume: formattedVol,
            rating: change > 3 ? 'Alcista Fuerte' : (change > 0 ? 'Alcista' : (change < -3 ? 'Bajista' : 'Neutral')),
            rsi: change > 5 ? '68.2' : (change < -5 ? '32.1' : '51.4'),
            marketCap: null,
            type: 'CRIPTO',
            source: 'Binance Global',
            sparkline: [low, (low + price)/2, high, price]
          };
          setInRam(cacheKey, quote);
          return quote;
        }
      }
    } catch(e) {}
  }

  // 2. Tier 2: TradingView Global Scanner (Stocks, ETFs, Indices, Commodities)
  try {
    const candidates = [`NASDAQ:${sym}`, `NYSE:${sym}`, `AMEX:${sym}`, `INDEX:${sym}`, `CBOE:${sym}`];
    const tvRes = await fetch('https://scanner.tradingview.com/america/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbols: { tickers: candidates },
        columns: ['close', 'change', 'high', 'low', 'volume', 'Recommend.All', 'RSI', 'description', 'market_cap_basic', 'currency']
      }),
      signal: AbortSignal.timeout(2200)
    });

    if (tvRes.ok) {
      const tvData = await tvRes.json();
      const match = tvData.data?.find(d => d && d.d && typeof d.d[0] === 'number');
      if (match) {
        const c = match.d;
        const ratingVal = c[5] || 0;
        let ratingText = 'Neutral';
        if (ratingVal > 0.5) ratingText = 'Compra Fuerte';
        else if (ratingVal > 0.1) ratingText = 'Compra';
        else if (ratingVal < -0.5) ratingText = 'Venta Fuerte';
        else if (ratingVal < -0.1) ratingText = 'Venta';

        const rawType = match.s.startsWith('AMEX') ? 'ETF' : (match.s.startsWith('BINANCE') ? 'CRIPTO' : 'ACCIÓN');
        const formattedVol = c[4] ? (c[4] >= 1e9 ? (c[4]/1e9).toFixed(2)+'B' : (c[4]>=1e6 ? (c[4]/1e6).toFixed(2)+'M' : (c[4]/1e3).toFixed(1)+'K')) : 'N/A';
        const formattedCap = c[8] ? (c[8] >= 1e12 ? '$' + (c[8]/1e12).toFixed(2)+'T' : (c[8]>=1e9 ? '$' + (c[8]/1e9).toFixed(2)+'B' : '$' + (c[8]/1e6).toFixed(1)+'M')) : null;

        const quote = {
          symbol: sym,
          name: c[7] || sym,
          price: c[0],
          currency: c[9] || 'USD',
          change24h: c[1] || 0,
          high24h: c[2] || c[0],
          low24h: c[3] || c[0],
          volume: formattedVol,
          rsi: c[6] ? c[6].toFixed(1) : null,
          rating: ratingText,
          marketCap: formattedCap,
          source: match.s.split(':')[0] + ' / TradingView',
          exchange: match.s.split(':')[0],
          type: rawType,
          sparkline: [c[3], (c[3] + c[0])/2, c[2], c[0]]
        };
        setInRam(cacheKey, quote);
        return quote;
      }
    }
  } catch(e) {}

  // 3. Tier 3: Yahoo Finance (40,000+ Global Assets with Full Historical Sparkline Points)
  try {
    const yfUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=3mo`;
    const yfRes = await fetch(yfUrl, {
      signal: AbortSignal.timeout(2200),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
    if (yfRes.ok) {
      const yfData = await yfRes.json();
      const meta = yfData.chart?.result?.[0]?.meta;
      const quotes = yfData.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
      if (meta && typeof meta.regularMarketPrice === 'number') {
        const currentPrice = meta.regularMarketPrice;
        const prevClose = meta.chartPreviousClose || meta.previousClose || currentPrice;
        const changePct = ((currentPrice - prevClose) / prevClose) * 100;
        const cleanQuotes = quotes.filter(q => typeof q === 'number' && !isNaN(q));
        const rawType = (meta.instrumentType || '').toUpperCase();
        let typeName = 'ACCIÓN';
        if (rawType.includes('ETF')) typeName = 'ETF';
        else if (rawType.includes('FUTURE') || rawType.includes('COMMODITY')) typeName = 'MATERIA PRIMA';
        else if (rawType.includes('INDEX')) typeName = 'ÍNDICE';
        else if (rawType.includes('CURRENCY')) typeName = 'DIVISA';

        const quote = {
          symbol: sym,
          name: meta.shortName || meta.longName || meta.symbol || sym,
          price: currentPrice,
          currency: meta.currency || 'USD',
          change24h: changePct,
          high24h: meta.regularMarketDayHigh || currentPrice,
          low24h: meta.regularMarketDayLow || currentPrice,
          volume: meta.regularMarketVolume ? (meta.regularMarketVolume >= 1e6 ? (meta.regularMarketVolume/1e6).toFixed(2)+'M' : (meta.regularMarketVolume/1e3).toFixed(1)+'K') : 'N/A',
          type: typeName,
          source: meta.exchangeName ? `${meta.exchangeName} / TradingView` : 'Mercados Globales',
          exchange: meta.exchangeName || '',
          sparkline: cleanQuotes.length >= 2 ? cleanQuotes.slice(-60) : [prevClose, currentPrice]
        };
        setInRam(cacheKey, quote);
        return quote;
      }
    }
  } catch(e) {}

  // 4. Tier 4: DexScreener (Over 30,000+ Decentralized Tokens & Memecoins on Solana, Base, ETH, BSC)
  try {
    const dexRes = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(sym)}`, {
      signal: AbortSignal.timeout(2200)
    });
    if (dexRes.ok) {
      const dexData = await dexRes.json();
      const pair = dexData.pairs?.sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))[0];
      if (pair && pair.priceUsd) {
        const price = parseFloat(pair.priceUsd);
        const change = parseFloat(pair.priceChange?.h24 || 0);
        const volUsd = pair.volume?.h24 ? '$' + (pair.volume.h24 >= 1e6 ? (pair.volume.h24/1e6).toFixed(2)+'M' : (pair.volume.h24/1e3).toFixed(1)+'K') : 'N/A';
        const fdvUsd = pair.fdv ? '$' + (pair.fdv >= 1e9 ? (pair.fdv/1e9).toFixed(2)+'B' : (pair.fdv/1e6).toFixed(2)+'M') : null;
        const liqUsd = pair.liquidity?.usd ? '$' + (pair.liquidity.usd >= 1e6 ? (pair.liquidity.usd/1e6).toFixed(2)+'M' : (pair.liquidity.usd/1e3).toFixed(1)+'K') : null;

        const quote = {
          symbol: sym,
          name: pair.baseToken?.name || sym,
          price: price,
          currency: 'USD',
          change24h: change,
          high24h: price * (1 + Math.abs(change)/200),
          low24h: price * (1 - Math.abs(change)/200),
          volume: volUsd,
          marketCap: fdvUsd,
          liquidity: liqUsd,
          type: 'TOKEN CRIPTO',
          source: pair.dexId ? `${pair.dexId.toUpperCase()} (${pair.chainId})` : 'DEX Aggregator',
          sparkline: change >= 0 ? [price * 0.93, price * 0.95, price * 0.98, price] : [price * 1.07, price * 1.04, price * 1.02, price]
        };
        setInRam(cacheKey, quote);
        return quote;
      }
    }
  } catch(e) {}

  return null;
}

async function fetchLiveMarketData(prompt) {
  if (!prompt) return '';
  const p = prompt.toLowerCase();

  const rawCashtags = (prompt.match(/\$([A-Za-z0-9_=^.-]{2,10})/g) || []).map(t => t.replace('$', '').toUpperCase());
  const hasCashtags = rawCashtags.length > 0;

  const isMarketQuery = hasCashtags || /\b(btc|bitcoin|eth|ethereum|solana|sol|xrp|ripple|cripto|crypto|criptomoneda|acciones|bolsa|nasdaq|sp500|etf|nvda|nvidia|tsla|tesla|aapl|apple|mstr|microstrategy|msft|microsoft|amzn|amazon|googl|google|meta|coinbase|pltr|palantir|d[oó]lar|euro|oro|gold|petroleo|petr[oó]leo|crudo)\b/i.test(p);
  if (!isMarketQuery) return '';

  const symbolsToFetch = hasCashtags ? rawCashtags.slice(0, 6) : [];
  if (symbolsToFetch.length === 0) {
    if (/\b(btc|bitcoin)\b/i.test(p)) symbolsToFetch.push('BTC');
    if (/\b(eth|ethereum)\b/i.test(p)) symbolsToFetch.push('ETH');
    if (/\b(solana|sol)\b/i.test(p)) symbolsToFetch.push('SOL');
    if (/\b(mstr|microstrategy)\b/i.test(p)) symbolsToFetch.push('MSTR');
    if (/\b(nvda|nvidia)\b/i.test(p)) symbolsToFetch.push('NVDA');
    if (/\b(tsla|tesla)\b/i.test(p)) symbolsToFetch.push('TSLA');
    if (/\b(aapl|apple)\b/i.test(p)) symbolsToFetch.push('AAPL');
    if (/\bcoinbase\b/i.test(p)) symbolsToFetch.push('COIN');
    if (/\b(pltr|palantir)\b/i.test(p)) symbolsToFetch.push('PLTR');
    if (/\b(msft|microsoft)\b/i.test(p)) symbolsToFetch.push('MSFT');
    if (/\b(sp500|s&p)\b/i.test(p)) symbolsToFetch.push('SPY');
    if (/\b(oro|gold)\b/i.test(p)) symbolsToFetch.push('GC=F');
  }

  if (symbolsToFetch.length === 0) return '';

  const results = await Promise.all(symbolsToFetch.map(s => fetchGlobalAssetQuote(s)));
  const validQuotes = results.filter(Boolean);

  if (validQuotes.length === 0) return '';

  let marketStr = '=== DATOS DE MERCADO EN TIEMPO REAL (ACCIONES, CRIPTO, ETFS Y MATERIAS PRIMAS) ===\n';
  validQuotes.forEach(q => {
    const formattedPrice = q.price >= 1
      ? `$${q.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${q.currency}`
      : `$${q.price.toFixed(q.price < 0.001 ? 6 : 4)} ${q.currency}`;
    
    let statsPart = ` | 24h: ${q.change24h >= 0 ? '+' : ''}${q.change24h.toFixed(2)}% | Rango: $${q.low24h?.toFixed(2)} - $${q.high24h?.toFixed(2)}`;
    if (q.rsi) statsPart += ` | RSI: ${q.rsi}`;
    if (q.rating) statsPart += ` | Sentimiento: ${q.rating}`;
    if (q.volume) statsPart += ` | Vol: ${q.volume}`;
    if (q.marketCap) statsPart += ` | Cap: ${q.marketCap}`;
    marketStr += `• $${q.symbol} (${q.name}): ${formattedPrice}${statsPart} [${q.source}]\n`;
  });

  return marketStr;
}

async function searchWeb(query) {
  const cleanQuery = query.replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
  const searchCacheKey = `websearch:${cleanQuery.toLowerCase()}`;
  const cachedSearch = getFromRam(searchCacheKey);
  if (cachedSearch) return cachedSearch;

  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(cleanQuery)}`;
    const res = await fetch(url, {
      signal: AbortSignal.timeout(2500),
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    });

    const html = await res.text();
    const snippets = [];
    const sources = [];

    const snippetRegex = /<a class="result__snippet"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = snippetRegex.exec(html)) !== null && sources.length < 4) {
      const rawHref = match[1];
      const cleanSnippet = match[2].replace(/<[^>]+>/g, '').trim().slice(0, 240);
      let finalUrl = rawHref;
      if (rawHref.includes('uddg=')) {
        try {
          const u = new URL(rawHref.startsWith('http') ? rawHref : ('https:' + rawHref));
          finalUrl = decodeURIComponent(u.searchParams.get('uddg') || rawHref);
        } catch(e) {}
      }

      if (cleanSnippet) {
        snippets.push(`- **Noticia/Fuente**: ${cleanSnippet}`);
        if (finalUrl && finalUrl.startsWith('http')) {
          let domain = 'Fuente Web';
          try { domain = new URL(finalUrl).hostname.replace('www.', ''); } catch(e) {}
          sources.push({ title: domain, url: finalUrl });
        }
      }
    }

    const result = { snippets: snippets.join('\n\n'), sources };
    if (snippets.length > 0) setInRam(searchCacheKey, result);
    return result;
  } catch (err) {
    return { snippets: '', sources: [] };
  }
}

async function fetchUrlContent(targetUrl) {
  const urlCacheKey = `urlcontent:${targetUrl.trim()}`;
  const cachedUrl = getFromRam(urlCacheKey);
  if (cachedUrl) return cachedUrl;

  try {
    const readerUrl = `https://r.jina.ai/${targetUrl}`;
    const res = await fetch(readerUrl, {
      signal: AbortSignal.timeout(2500),
      headers: { 'Accept': 'text/plain', 'User-Agent': 'Mozilla/5.0' }
    });

    let contentText = '';
    if (!res.ok) {
      const directRes = await fetch(targetUrl, { signal: AbortSignal.timeout(2000), headers: { 'User-Agent': 'Mozilla/5.0' } });
      const rawText = await directRes.text();
      contentText = rawText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 2000);
    } else {
      const text = await res.text();
      contentText = text.slice(0, 2500);
    }

    setInRam(urlCacheKey, contentText);
    return contentText;
  } catch (err) {
    return 'No se pudo extraer el contenido de la URL indicada.';
  }
}

function extractCashtagSymbols(text, options = {}) {
  if (!text) return [];
  const allowNames = options.allowNames !== false;
  const exchangeWords = new Set(['NASDAQ', 'NYSE', 'AMEX', 'CBOE', 'INDEX', 'BINANCE', 'CME']);
  const symbols = [];

  const matches = text.match(/(?<![\w/&])\$([A-Za-z][A-Za-z0-9_=^.-]{1,9})\b/g) || [];
  for (const m of matches) {
    const sym = m.replace('$', '').toUpperCase().trim();
    if (sym && !exchangeWords.has(sym) && !symbols.includes(sym)) {
      symbols.push(sym);
    }
  }

  if (!allowNames) return symbols;

  const popularKeywords = [
    { regex: /\b(?:mstr|microstrategy)\b/i, sym: 'MSTR' },
    { regex: /\b(?:btc|bitcoin)\b/i, sym: 'BTC' },
    { regex: /\b(?:eth|ethereum)\b/i, sym: 'ETH' },
    { regex: /\bsolana\b/i, sym: 'SOL' },
    { regex: /\b(?:nvda|nvidia)\b/i, sym: 'NVDA' },
    { regex: /\b(?:tsla|tesla)\b/i, sym: 'TSLA' },
    { regex: /\b(?:aapl|apple)\b/i, sym: 'AAPL' },
    { regex: /\bcoinbase\b/i, sym: 'COIN' },
    { regex: /\b(?:pltr|palantir)\b/i, sym: 'PLTR' },
    { regex: /\b(?:msft|microsoft)\b/i, sym: 'MSFT' },
    { regex: /\b(?:amzn|amazon)\b/i, sym: 'AMZN' },
    { regex: /\b(?:googl|google|alphabet)\b/i, sym: 'GOOGL' },
    { regex: /\b(?:meta\s+platforms|facebook)\b/i, sym: 'META' },
    { regex: /\b(?:s&p\s*500|sp500|spy)\b/i, sym: 'SPY' },
    { regex: /\b(?:invesco\s+qqq|qqq)\b/i, sym: 'QQQ' },
    { regex: /\b(?:xrp|ripple)\b/i, sym: 'XRP' },
    { regex: /\b(?:doge|dogecoin)\b/i, sym: 'DOGE' }
  ];

  for (const pk of popularKeywords) {
    if (pk.regex.test(text) && !symbols.includes(pk.sym)) {
      symbols.push(pk.sym);
    }
  }

  return symbols;
}

function isSimpleTickerQuery(text) {
  const raw = (text || '').trim();
  if (!raw || raw.length > 90) return false;
  const symbols = extractCashtagSymbols(raw);
  if (!symbols.length) return false;
  const leftover = raw
    .replace(/\$[A-Za-z][A-Za-z0-9_=^.-]{1,9}\b/g, ' ')
    .replace(/\b(precio|cotizaci[oó]n|gr[aá]fico|chart|ticker|quote|hoy|ahora|de|del|la|el|los|las|un|una|me|das|dame|pon|ponme|muestra|mostrar|ver|mira|analiza|qu[eé]\s+es|cu[aá]nto\s+vale|cuanto\s+vale)\b/gi, ' ')
    .replace(/[¿?¡!.,:;]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!leftover) return true;
  return leftover.length < 22 && /microstrategy|bitcoin|ethereum|nvidia|tesla|apple|solana/i.test(leftover);
}

function tradingViewChartUrl(quote) {
  const sym = String(quote?.symbol || '').toUpperCase().replace(/^\$/, '');
  const type = String(quote?.type || '').toUpperCase();
  const ex = String(quote?.exchange || quote?.source || '').toUpperCase();
  if (type.includes('CRIPTO') || type.includes('TOKEN')) {
    return `https://www.tradingview.com/chart/?symbol=BINANCE:${encodeURIComponent(sym)}USDT`;
  }
  if (ex.includes('NASDAQ')) return `https://www.tradingview.com/chart/?symbol=NASDAQ:${encodeURIComponent(sym)}`;
  if (ex.includes('NYSE')) return `https://www.tradingview.com/chart/?symbol=NYSE:${encodeURIComponent(sym)}`;
  if (ex.includes('AMEX')) return `https://www.tradingview.com/chart/?symbol=AMEX:${encodeURIComponent(sym)}`;
  return `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(sym)}`;
}

function investingUrl(symbol) {
  return `https://www.investing.com/search/?q=${encodeURIComponent(String(symbol || '').replace(/^\$/, ''))}`;
}

function finvizChartUrl(symbol) {
  const sym = String(symbol || '').toUpperCase().replace(/^\$/, '');
  return `https://finviz.com/chart.ashx?t=${encodeURIComponent(sym)}&ty=c&ta=1&p=d&s=l`;
}

function publicChartImageUrl(quote) {
  const sym = String(quote?.symbol || '').toUpperCase().replace(/^\$/, '');
  const hour = new Date().toISOString().slice(0, 13).replace(/[-:T]/g, '');
  const type = String(quote?.type || '').toUpperCase();
  if (type.includes('CRIPTO') || type.includes('TOKEN')) {
    return sparklineChartUrl(quote);
  }
  return `https://ai.trujillomingorance.com/api/chart/${encodeURIComponent(sym)}.png?v=${hour}`;
}

function sparklineChartUrl(quote) {
  const isUp = (quote.change24h || 0) >= 0;
  const series = Array.isArray(quote.sparkline) && quote.sparkline.length >= 2
    ? quote.sparkline.filter(n => typeof n === 'number' && !isNaN(n)).slice(-60)
    : [quote.low24h || quote.price, quote.price];
  const chartConfig = {
    type: 'line',
    data: {
      labels: series.map((_, i) => String(i + 1)),
      datasets: [{
        label: quote.symbol,
        data: series,
        borderColor: isUp ? '#10B981' : '#EF4444',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.25,
        fill: 'start',
        backgroundColor: isUp ? 'rgba(16,185,129,0.14)' : 'rgba(239,68,68,0.14)'
      }]
    },
    options: {
      plugins: { legend: { display: false }, title: { display: false } },
      layout: { padding: { top: 8, bottom: 6, left: 8, right: 10 } },
      scales: {
        x: { display: false },
        y: {
          display: true,
          grid: { color: 'rgba(255,255,255,0.07)' },
          ticks: { color: '#94a3b8', font: { size: 10 } }
        }
      }
    }
  };
  return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&bkg=%230a0d14&w=720&h=280&devicePixelRatio=2`;
}

async function servePublicChartPng(symbol) {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
  try {
    const finviz = await fetch(finvizChartUrl(symbol), {
      signal: AbortSignal.timeout(4000),
      headers: {
        'User-Agent': ua,
        Accept: 'image/png,image/*,*/*;q=0.8',
        Referer: `https://finviz.com/quote.ashx?t=${encodeURIComponent(symbol)}`
      }
    });
    const ctype = (finviz.headers.get('content-type') || '').toLowerCase();
    if (finviz.ok && ctype.includes('image')) {
      return new Response(finviz.body, {
        headers: {
          'Content-Type': ctype.includes('png') ? 'image/png' : ctype,
          'Cache-Control': 'public, max-age=180, s-maxage=180',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (e) {}

  const quote = await fetchGlobalAssetQuote(symbol);
  if (quote) {
    return Response.redirect(sparklineChartUrl(quote), 302);
  }
  return new Response('chart unavailable', { status: 404 });
}

function buildDiscordAssetEmbed(quote) {
  if (!quote || !quote.price || quote.price <= 0) return null;
  const isUp = (quote.change24h || 0) >= 0;
  const currency = (quote.currency && quote.currency !== 'USD') ? quote.currency : 'USD';
  const formattedPrice = quote.price >= 1
    ? '$' + quote.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ' + currency
    : '$' + quote.price.toFixed(4) + ' USD';
  const chg = `${isUp ? '+' : '−'}${Math.abs(quote.change24h || 0).toFixed(2)}%`;
  const typeLabel = quote.type || 'MERCADO';
  const tvUrl = tradingViewChartUrl(quote);
  const invUrl = investingUrl(quote.symbol);
  const name = quote.name && quote.name !== quote.symbol ? quote.name : quote.symbol;

  const fields = [];
  if (quote.high24h && quote.low24h) {
    fields.push({
      name: 'Rango (24h)',
      value: `Máx \`$${Number(quote.high24h).toLocaleString('en-US', { maximumFractionDigits: 2 })}\`\nMín \`$${Number(quote.low24h).toLocaleString('en-US', { maximumFractionDigits: 2 })}\``,
      inline: true
    });
  }
  if (quote.volume || quote.marketCap) {
    fields.push({
      name: 'Volumen / Cap.',
      value: `Vol \`${quote.volume || 'N/A'}\`\nCap \`${quote.marketCap || 'N/A'}\``,
      inline: true
    });
  }
  if (quote.rsi || quote.rating) {
    fields.push({
      name: 'Técnicos',
      value: `RSI \`${quote.rsi || '—'}\`\n${quote.rating || 'Neutral'}`,
      inline: true
    });
  }
  fields.push({
    name: 'Gráfico',
    value: `[Abrir en TradingView](${tvUrl})\n[Abrir en Investing.com](${invUrl})`,
    inline: false
  });

  return {
    author: {
      name: `${typeLabel} · ${quote.exchange || quote.source || 'Mercado'}`,
      icon_url: 'https://ai.trujillomingorance.com/avatar.png',
      url: tvUrl
    },
    title: `$${quote.symbol} · ${name}`,
    url: tvUrl,
    color: isUp ? 0x10B981 : 0xEF4444,
    description: `**${formattedPrice}** · \`${chg} 24h\`\nPulsa el título o la imagen para el gráfico en TradingView.`,
    fields,
    image: { url: publicChartImageUrl(quote) },
    footer: {
      text: 'Gráfico diario · Finviz / TradingView · Trujillo AI',
      icon_url: 'https://ai.trujillomingorance.com/avatar.png'
    },
    timestamp: new Date().toISOString()
  };
}

async function sendDiscordReply(interaction, text, isEphemeral = false, embeds = []) {
  const appId = interaction.application_id;
  const token = interaction.token;
  const originalWebhookUrl = `https://discord.com/api/v10/webhooks/${appId}/${token}/messages/@original`;
  const followupWebhookUrl = `https://discord.com/api/v10/webhooks/${appId}/${token}`;

  const cleanText = text || '';
  const chunks = [];
  const maxChunk = 1950;

  if (cleanText.length <= maxChunk) {
    chunks.push(cleanText);
  } else {
    // Dividir limpiamente por párrafos o saltos de línea para respuestas extensas
    let remaining = cleanText;
    while (remaining.length > 0) {
      if (remaining.length <= maxChunk) {
        chunks.push(remaining);
        break;
      }
      let splitIdx = remaining.lastIndexOf('\n\n', maxChunk);
      if (splitIdx < 500) splitIdx = remaining.lastIndexOf('\n', maxChunk);
      if (splitIdx < 500) splitIdx = maxChunk;
      chunks.push(remaining.substring(0, splitIdx).trim());
      remaining = remaining.substring(splitIdx).trim();
    }
  }

  // Primer mensaje: actualizar el deferred original
  const firstPayload = {
    content: chunks[0] || 'Listo.',
    allowed_mentions: { parse: ['users', 'roles', 'everyone'], replied_user: true }
  };
  if (Array.isArray(embeds) && embeds.length > 0) {
    firstPayload.embeds = embeds.slice(0, 10);
  }

  await fetch(originalWebhookUrl, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(firstPayload)
  });

  // Mensajes subsiguientes como follow-ups si la respuesta era extendida
  for (let i = 1; i < chunks.length; i++) {
    if (chunks[i]) {
      try {
        await fetch(followupWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: chunks[i],
            allowed_mentions: { parse: ['users', 'roles', 'everyone'], replied_user: true }
          })
        });
      } catch (e) {
        console.error('Error sending follow-up chunk to Discord:', e);
      }
    }
  }
}

function hexToUint8Array(hex) {
  const cleanHex = hex.trim();
  const bytes = new Uint8Array(Math.floor(cleanHex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function verifyDiscordSignature(rawBody, signatureHex, timestamp, publicKeyHex) {
  try {
    let key;
    try {
      key = await crypto.subtle.importKey(
        'raw',
        hexToUint8Array(publicKeyHex),
        { name: 'NODE-ED25519', namedCurve: 'NODE-ED25519' },
        false,
        ['verify']
      );
    } catch {
      key = await crypto.subtle.importKey(
        'raw',
        hexToUint8Array(publicKeyHex),
        { name: 'Ed25519' },
        false,
        ['verify']
      );
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(timestamp + rawBody);
    const signature = hexToUint8Array(signatureHex);
    return await crypto.subtle.verify('NODE-ED25519', key, signature, data);
  } catch {
    return false;
  }
}

async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  const keyBuffer = enc.encode(password + ':' + salt + ':trujillo_ai_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', keyBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generate6DigitCode() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return String(100000 + (array[0] % 900000));
}

function escapeEmail(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
}

function otpBlock(code, hint) {
  const digits = String(code).replace(/\D/g, '').slice(0, 6);
  const safe = escapeEmail(digits);
  const copyLine = hint || 'Introduce este código de un solo uso para verificar tu identidad.';
  return `<table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:24px auto 12px;width:100%;max-width:380px;">
  <tr>
    <td align="center" bgcolor="#050505" style="background-color:#050505;border:1px solid #262626;border-radius:6px;padding:22px 28px;">
      <div style="margin:0;font-family:ui-monospace,'SF Mono',Menlo,Consolas,monospace;font-size:36px;font-weight:800;color:#ffffff;letter-spacing:14px;text-indent:14px;line-height:40px;">${safe}</div>
    </td>
  </tr>
</table>
<p style="margin:0 0 16px;text-align:center;font-family:ui-monospace,monospace;font-size:11px;color:#71717a;letter-spacing:0.04em;">${escapeEmail(copyLine)}</p>`;
}

function ctaButton(label, url) {
  return `<table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:26px auto 10px;"><tr><td align="center">
<a href="${escapeEmail(url)}" style="display:inline-block;padding:12px 28px;background:#ffffff;color:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;font-weight:700;text-decoration:none;border-radius:9999px;letter-spacing:0.01em;">${escapeEmail(label)} &rarr;</a>
</td></tr></table>`;
}

function emailCopy(locale) {
  const pack = {
    es: {
      hello: 'Hola',
      verifyTitle: 'Verifica tu cuenta',
      verifyBody: 'Usa este código de un solo uso para activar Trujillo AI. Caduca en 24 horas.',
      verifyCta: 'Abrir Trujillo AI',
      verifySubject: (c) => `${c} es tu código de Trujillo AI`,
      resetTitle: 'Restablecer contraseña',
      resetBody: 'Alguien pidió restablecer la contraseña de esta cuenta. Si no fuiste tú, ignora el correo. El código caduca en 1 hora.',
      resetCta: 'Restablecer ahora',
      resetSubject: (c) => `${c} es tu código para restablecer la contraseña`,
      welcomeTitle: 'Tu cuenta ya está activa',
      welcomeBody: 'Ya puedes usar el workspace: chats, documentos, proyectos y modelos en el edge.',
      welcomeCta: 'Entrar al workspace',
      welcomeSubject: 'Bienvenido a Trujillo AI',
      secCta: 'Revisar cuenta',
      secFooter: 'Si no fuiste tú, escribe a',
      testTitle: 'Así se ven los correos de Trujillo AI',
      testBody: 'Este es un correo de prueba enviado desde Ajustes. Si lo estás leyendo, Resend está funcionando correctamente.',
      testCta: 'Volver a Ajustes',
      testSubject: 'Correo de prueba — Trujillo AI',
      privacy: 'Privacidad',
      unsub: 'Preferencias de correo',
      copyHint: 'Selecciona el número de 6 dígitos y cópialo. También está en el asunto.'
    },
    en: {
      hello: 'Hello',
      verifyTitle: 'Verify your account',
      verifyBody: 'Use this one-time code to activate Trujillo AI. It expires in 24 hours.',
      verifyCta: 'Open Trujillo AI',
      verifySubject: (c) => `${c} is your Trujillo AI code`,
      resetTitle: 'Reset your password',
      resetBody: 'Someone asked to reset this account’s password. If it was not you, ignore this email. The code expires in 1 hour.',
      resetCta: 'Reset now',
      resetSubject: (c) => `${c} is your password reset code`,
      welcomeTitle: 'Your account is ready',
      welcomeBody: 'You can now use the workspace: chats, documents, projects and edge models.',
      welcomeCta: 'Open the workspace',
      welcomeSubject: 'Welcome to Trujillo AI',
      secCta: 'Review account',
      secFooter: 'If this was not you, write to',
      testTitle: 'This is how Trujillo AI email looks',
      testBody: 'This is a test message from Settings. If you can read it, Resend is working.',
      testCta: 'Back to Settings',
      testSubject: 'Test email — Trujillo AI',
      privacy: 'Privacy',
      unsub: 'Email preferences',
      copyHint: 'Tap the code to copy it. It is also in the subject line.'
    },
    fr: {
      hello: 'Bonjour',
      verifyTitle: 'Vérifie ton compte',
      verifyBody: 'Utilise ce code unique pour activer Trujillo AI. Il expire dans 24 heures.',
      verifyCta: 'Ouvrir Trujillo AI',
      verifySubject: (c) => `${c} est ton code Trujillo AI`,
      resetTitle: 'Réinitialiser le mot de passe',
      resetBody: 'Une demande de réinitialisation a été faite. Si ce n’est pas toi, ignore ce message. Le code expire dans 1 heure.',
      resetCta: 'Réinitialiser',
      resetSubject: (c) => `${c} est ton code de réinitialisation`,
      welcomeTitle: 'Ton compte est actif',
      welcomeBody: 'Tu peux utiliser l’espace de travail : chats, documents, projets et modèles.',
      welcomeCta: 'Entrer',
      welcomeSubject: 'Bienvenue sur Trujillo AI',
      secCta: 'Voir le compte',
      secFooter: 'Si ce n’est pas toi, écris à',
      testTitle: 'Voici à quoi ressemblent les e-mails Trujillo AI',
      testBody: 'E-mail de test envoyé depuis Réglages. Resend fonctionne.',
      testCta: 'Retour',
      testSubject: 'E-mail de test — Trujillo AI',
      privacy: 'Confidentialité',
      unsub: 'Préférences e-mail',
      copyHint: 'Appuie sur le code pour le copier. Il est aussi dans l’objet.'
    },
    pt: {
      hello: 'Olá',
      verifyTitle: 'Verifica a tua conta',
      verifyBody: 'Usa este código de uso único para ativar o Trujillo AI. Expira em 24 horas.',
      verifyCta: 'Abrir Trujillo AI',
      verifySubject: (c) => `${c} é o teu código Trujillo AI`,
      resetTitle: 'Repor palavra-passe',
      resetBody: 'Alguém pediu para repor a palavra-passe. Se não foste tu, ignora. O código expira em 1 hora.',
      resetCta: 'Repor agora',
      resetSubject: (c) => `${c} é o teu código de reposição`,
      welcomeTitle: 'A tua conta está ativa',
      welcomeBody: 'Já podes usar o workspace: chats, documentos, projetos e modelos.',
      welcomeCta: 'Entrar',
      welcomeSubject: 'Bem-vindo ao Trujillo AI',
      secCta: 'Ver conta',
      secFooter: 'Se não foste tu, escreve para',
      testTitle: 'Assim se veem os e-mails do Trujillo AI',
      testBody: 'E-mail de teste enviado a partir das Definições. O Resend está a funcionar.',
      testCta: 'Voltar',
      testSubject: 'E-mail de teste — Trujillo AI',
      privacy: 'Privacidade',
      unsub: 'Preferências de e-mail',
      copyHint: 'Toca no código para o copiar. Também está no assunto.'
    },
    de: {
      hello: 'Hallo',
      verifyTitle: 'Konto bestätigen',
      verifyBody: 'Nutze diesen Einmalcode, um Trujillo AI zu aktivieren. Er läuft in 24 Stunden ab.',
      verifyCta: 'Trujillo AI öffnen',
      verifySubject: (c) => `${c} ist dein Trujillo-AI-Code`,
      resetTitle: 'Passwort zurücksetzen',
      resetBody: 'Jemand hat ein neues Passwort angefordert. Warst du es nicht, ignoriere die Mail. Der Code gilt 1 Stunde.',
      resetCta: 'Jetzt zurücksetzen',
      resetSubject: (c) => `${c} ist dein Reset-Code`,
      welcomeTitle: 'Dein Konto ist aktiv',
      welcomeBody: 'Du kannst den Workspace nutzen: Chats, Dokumente, Projekte und Modelle.',
      welcomeCta: 'Zum Workspace',
      welcomeSubject: 'Willkommen bei Trujillo AI',
      secCta: 'Konto prüfen',
      secFooter: 'Warst du es nicht, schreib an',
      testTitle: 'So sehen Trujillo-AI-Mails aus',
      testBody: 'Testmail aus den Einstellungen. Resend funktioniert.',
      testCta: 'Zurück',
      testSubject: 'Testmail — Trujillo AI',
      privacy: 'Datenschutz',
      unsub: 'E-Mail-Einstellungen',
      copyHint: 'Tippe auf den Code, um ihn zu kopieren. Er steht auch im Betreff.'
    },
    it: {
      hello: 'Ciao',
      verifyTitle: 'Verifica l’account',
      verifyBody: 'Usa questo codice monouso per attivare Trujillo AI. Scade tra 24 ore.',
      verifyCta: 'Apri Trujillo AI',
      verifySubject: (c) => `${c} è il tuo codice Trujillo AI`,
      resetTitle: 'Reimposta la password',
      resetBody: 'Qualcuno ha chiesto di reimpostare la password. Se non sei stato tu, ignora. Il codice scade in 1 ora.',
      resetCta: 'Reimposta ora',
      resetSubject: (c) => `${c} è il tuo codice di reset`,
      welcomeTitle: 'L’account è attivo',
      welcomeBody: 'Puoi usare lo spazio di lavoro: chat, documenti, progetti e modelli.',
      welcomeCta: 'Entra',
      welcomeSubject: 'Benvenuto in Trujillo AI',
      secCta: 'Controlla l’account',
      secFooter: 'Se non sei stato tu, scrivi a',
      testTitle: 'Così sono le email di Trujillo AI',
      testBody: 'Email di prova da Impostazioni. Resend funziona.',
      testCta: 'Indietro',
      testSubject: 'Email di prova — Trujillo AI',
      privacy: 'Privacy',
      unsub: 'Preferenze email',
      copyHint: 'Tocca il codice per copiarlo. È anche nell’oggetto.'
    },
    ca: {
      hello: 'Hola',
      verifyTitle: 'Verifica el compte',
      verifyBody: 'Fes servir aquest codi d’un sol ús per activar Trujillo AI. Caduca en 24 hores.',
      verifyCta: 'Obre Trujillo AI',
      verifySubject: (c) => `${c} és el teu codi de Trujillo AI`,
      resetTitle: 'Restableix la contrasenya',
      resetBody: 'Algú ha demanat restablir la contrasenya. Si no has estat tu, ignora el correu. El codi caduca en 1 hora.',
      resetCta: 'Restableix ara',
      resetSubject: (c) => `${c} és el teu codi per restablir la contrasenya`,
      welcomeTitle: 'El compte ja és actiu',
      welcomeBody: 'Ja pots fer servir l’espai de treball: xats, documents, projectes i models.',
      welcomeCta: 'Entra',
      welcomeSubject: 'Benvingut a Trujillo AI',
      secCta: 'Revisa el compte',
      secFooter: 'Si no has estat tu, escriu a',
      testTitle: 'Així es veuen els correus de Trujillo AI',
      testBody: 'Correu de prova enviat des d’Ajustos. Resend funciona.',
      testCta: 'Torna',
      testSubject: 'Correu de prova — Trujillo AI',
      privacy: 'Privadesa',
      unsub: 'Preferències de correu',
      copyHint: 'Toca el codi per copiar-lo. També és a l’assumpte.'
    },
    zh: {
      hello: '你好',
      verifyTitle: '验证你的账户',
      verifyBody: '使用此一次性验证码激活 Trujillo AI。24 小时后失效。',
      verifyCta: '打开 Trujillo AI',
      verifySubject: (c) => `${c} 是你的 Trujillo AI 验证码`,
      resetTitle: '重置密码',
      resetBody: '有人请求重置此账户密码。如非本人操作，请忽略。验证码 1 小时后失效。',
      resetCta: '立即重置',
      resetSubject: (c) => `${c} 是你的重置验证码`,
      welcomeTitle: '账户已激活',
      welcomeBody: '现在可以使用工作区：对话、文档、项目与模型。',
      welcomeCta: '进入工作区',
      welcomeSubject: '欢迎使用 Trujillo AI',
      secCta: '查看账户',
      secFooter: '如非本人操作，请联系',
      testTitle: '这就是 Trujillo AI 邮件的样子',
      testBody: '这是设置里发出的测试邮件。能看到说明 Resend 工作正常。',
      testCta: '返回设置',
      testSubject: '测试邮件 — Trujillo AI',
      privacy: '隐私',
      unsub: '邮件偏好',
      copyHint: '点按验证码即可复制。主题栏里也有。'
    }
  };
  return pack[locale] || pack.en;
}

function brandEmailHtml({ title, preheader, bodyHtml, ctaLabel, ctaUrl, locale = 'es' }) {
  const copy = emailCopy(locale);
  const pre = preheader || title;
  const cta = (ctaLabel && ctaUrl) ? ctaButton(ctaLabel, ctaUrl) : '';
  return `<!DOCTYPE html>
<html lang="${escapeEmail(locale)}" xmlns="http://www.w3.org/1999/xhtml"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${escapeEmail(title)}</title>
<!--[if mso]>
<style type="text/css">
body, table, td, h1, p, a { font-family: Arial, sans-serif !important; }
</style>
<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#000000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;">
<div style="display:none!important;font-size:1px;color:#000000;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeEmail(pre)} &#847; &zwnj; &nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:28px 12px 40px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#000000;border:1px solid #1f1f1f;border-radius:6px;overflow:hidden;">

<!-- Header Brand Bar (Grok / xAI Minimal) -->
<tr><td style="padding:22px 28px 18px;border-bottom:1px solid #18181b;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td valign="middle" style="width:28px;padding-right:10px;">
  <img src="${APP_ORIGIN}/avatar.png" width="28" height="28" alt="" style="display:block;border-radius:4px;border:1px solid #27272a;background:#09090b;">
</td>
<td valign="middle">
  <span style="font-family:ui-monospace,monospace;font-size:13px;font-weight:700;color:#ffffff;letter-spacing:0.16em;text-transform:uppercase;">TRUJILLO AI</span>
</td>
</tr></table>
</td></tr>

<!-- Title Area -->
<tr><td style="padding:24px 28px 6px;">
<h1 style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:20px;line-height:1.3;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">${escapeEmail(title)}</h1>
</td></tr>

<!-- Main Body -->
<tr><td style="padding:10px 28px 24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.65;color:#d4d4d8;">
${bodyHtml}
${cta}
</td></tr>

<!-- Footer (Grok Minimal Monochrome) -->
<tr><td style="padding:20px 28px 24px;background-color:#050505;border-top:1px solid #18181b;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td>
  <p style="margin:0;font-family:ui-monospace,monospace;font-size:11px;line-height:1.6;color:#71717a;">
    <strong style="color:#a1a1aa;font-weight:600;">TRUJILLO AI</strong> &middot; Alberto Trujillo Mingorance<br>
    <a href="${APP_ORIGIN}" style="color:#ffffff;text-decoration:none;">ai.trujillomingorance.com</a>
    &nbsp;&middot;&nbsp;<a href="${APP_ORIGIN}/privacy-policy" style="color:#71717a;text-decoration:underline;">${escapeEmail(copy.privacy)}</a>
    &nbsp;&middot;&nbsp;<a href="${APP_ORIGIN}/login" style="color:#71717a;text-decoration:underline;">${escapeEmail(copy.unsub)}</a>
  </p>
  <p style="margin:8px 0 0;font-family:ui-monospace,monospace;font-size:10px;line-height:1.5;color:#52525b;">
    Mensaje automatizado generado desde <code>no-reply@trujillomingorance.com</code>.<br>
    Contacto legal (RGPD) y soporte: <a href="mailto:alberto@trujillomingorance.com" style="color:#a1a1aa;text-decoration:underline;">alberto@trujillomingorance.com</a>.
  </p>
</td>
</tr>
</table>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

async function sendAppEmail(env, opts) {
  const to = (opts.to || '').trim();
  if (!to || !to.includes('@')) return { ok: false, error: 'Destinatario inválido' };

  const resendApiKey = env.RESEND_API_KEY;
  if (!resendApiKey) {
    return { ok: false, error: 'RESEND_API_KEY no configurada en Cloudflare Secrets.' };
  }

  const senders = [
    `${APP_FROM_NAME} <${APP_FROM_EMAIL}>`,
    `Trujillo AI <onboarding@resend.dev>`
  ];

  const payloadBase = {
    to: [to],
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    tags: [
      { name: 'category', value: opts.tag || 'transactional' },
      { name: 'app', value: 'trujillo-ai' }
    ]
  };
  if (opts.replyTo) payloadBase.reply_to = opts.replyTo;
  if (opts.headers) payloadBase.headers = opts.headers;

  let lastError = null;
  for (const fromDisplay of senders) {
    try {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...payloadBase, from: fromDisplay })
      });

      const data = await resendRes.json().catch(() => ({}));
      if (resendRes.ok) return { ok: true, id: data?.id, sender: fromDisplay };

      lastError = data?.message || `HTTP ${resendRes.status}`;
      if (!lastError.toLowerCase().includes('domain') && !lastError.toLowerCase().includes('verify')) {
        break;
      }
    } catch (e) {
      lastError = e?.message;
    }
  }

  return { ok: false, error: lastError || 'Resend rechazó el envío' };
}

function asUser(val) {
  if (!val) return null;
  if (typeof val === 'string') {
    try { return JSON.parse(val); } catch { return null; }
  }
  return val;
}

function publicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    picture: u.picture,
    tier: u.tier,
    provider: u.provider || (u.passwordHash ? 'email' : 'email'),
    hasPassword: !!u.passwordHash,
    notifyProduct: u.notifyProduct !== false,
    notifySecurity: u.notifySecurity !== false,
    notifyDigest: u.notifyDigest === true,
    locale: u.locale || 'es'
  };
}

async function persistUserRecord(env, user) {
  if (!user || !user.email) return;
  setInRam(`user_email_${user.email}`, user);
  if (user.id) setInRam(`user_id_${user.id}`, user);
  if (user.provider && user.providerId) setInRam(`user_provider_${user.provider}_${user.providerId}`, user);
  if (env.BOT_MEMORY) {
    const str = JSON.stringify(user);
    const ops = [env.BOT_MEMORY.put(`user_email_${user.email}`, str)];
    if (user.id) ops.push(env.BOT_MEMORY.put(`user_id_${user.id}`, str));
    if (user.provider && user.providerId) ops.push(env.BOT_MEMORY.put(`user_provider_${user.provider}_${user.providerId}`, str));
    await Promise.all(ops).catch(() => {});
  }
}

function isAllowedOAuthRedirect(uri) {
  if (!uri || typeof uri !== 'string') return false;
  try {
    const u = new URL(uri);
    const hostOk = u.hostname === 'ai.trujillomingorance.com'
      || u.hostname === 'rewrite.trujillomingorance.com'
      || u.hostname === 'localhost'
      || u.hostname === '127.0.0.1';
    const pathOk = u.pathname === '/login' || u.pathname === '/' || u.pathname === '/api/auth/x/callback';
    return hostOk && pathOk;
  } catch {
    return false;
  }
}

async function loadUserByEmail(env, email) {
  const key = `user_email_${String(email || '').toLowerCase()}`;
  let user = asUser(getFromRam(key));
  if (!user && env.BOT_MEMORY) {
    user = asUser(await env.BOT_MEMORY.get(key));
    if (user) setInRam(key, user);
  }
  return user;
}

async function upsertSocialUser(env, { email, name, picture, provider, providerId }) {
  const emailKey = String(email || '').trim().toLowerCase();
  if (!emailKey.includes('@')) throw new Error('Email de cuenta inválido');
  let user = null;
  if (provider && providerId) {
    user = await getCachedKvValue(env.BOT_MEMORY, `user_provider_${provider}_${providerId}`);
  }
  if (!user) user = await loadUserByEmail(env, emailKey);
  const owner = isOwnerUser(emailKey, env) || isOwnerUser(providerId, env);
  const now = Date.now();
  const fallbackPicture = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || emailKey)}&background=000000&color=fff`;
  if (user) {
    if (name) user.name = name;
    if (picture) user.picture = picture;
    user.emailVerified = true;
    if (!user.provider || user.provider === 'email') user.provider = provider;
    user.providers = Array.from(new Set([...(user.providers || [user.provider].filter(Boolean)), provider]));
    if (provider === 'google') user.googleId = providerId || user.googleId;
    if (provider === 'x') user.xId = providerId || user.xId;
    if (owner) user.tier = 'enterprise';
    user.updatedAt = now;
  } else {
    const id = provider === 'x'
      ? ('x_' + String(providerId || emailKey.split('@')[0]).toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 32))
      : ('usr_' + crypto.randomUUID().slice(0, 16));
    user = {
      id,
      name: name || emailKey.split('@')[0],
      email: emailKey,
      picture: picture || fallbackPicture,
      tier: owner ? 'enterprise' : 'free',
      emailVerified: true,
      provider,
      providers: [provider],
      googleId: provider === 'google' ? providerId : undefined,
      xId: provider === 'x' ? providerId : undefined,
      notifyProduct: true,
      notifySecurity: true,
      notifyDigest: false,
      locale: 'es',
      createdAt: now
    };
  }
  await persistUserRecord(env, user);
  return user;
}

async function getAuthedUser(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) return null;
  const payload = await verifyJwtToken(auth.slice(7), env.JWT_SECRET || 'trujillo_jwt_secret_2026');
  if (!payload?.email && !payload?.sub) return null;
  if (payload.email) {
    const email = String(payload.email).toLowerCase();
    let user = asUser(getFromRam(`user_email_${email}`));
    if (!user && env.BOT_MEMORY) {
      user = asUser(await env.BOT_MEMORY.get(`user_email_${email}`));
      if (user) setInRam(`user_email_${email}`, user);
    }
    if (user) return user;
  }
  if (payload.sub) {
    let user = asUser(getFromRam(`user_id_${payload.sub}`));
    if (!user && env.BOT_MEMORY) {
      user = asUser(await env.BOT_MEMORY.get(`user_id_${payload.sub}`));
      if (user) setInRam(`user_id_${payload.sub}`, user);
    }
    return user;
  }
  return null;
}

async function sendWelcomeEmail(env, user) {
  if (!user?.email || user.notifyProduct === false) return;
  const copy = emailCopy(user.locale);
  const html = brandEmailHtml({
    title: copy.welcomeTitle,
    preheader: copy.welcomeSubject,
    locale: user.locale,
    bodyHtml: `<p>${copy.hello} <strong style="color:#fafafa;">${escapeEmail(user.name || '')}</strong>,</p>
      <p>${copy.welcomeBody}</p>`,
    ctaLabel: copy.welcomeCta,
    ctaUrl: APP_ORIGIN
  });
  return sendAppEmail(env, {
    to: user.email,
    subject: copy.welcomeSubject,
    text: `${copy.hello} ${user.name || ''}, ${copy.welcomeBody} ${APP_ORIGIN}`,
    html,
    tag: 'welcome',
    headers: {
      'List-Unsubscribe': `<${APP_ORIGIN}/login>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
    }
  });
}

async function sendSecurityEmail(env, user, title, bodyText) {
  if (!user?.email || user.notifySecurity === false) return;
  const copy = emailCopy(user.locale);
  const html = brandEmailHtml({
    title,
    preheader: title,
    locale: user.locale,
    bodyHtml: `<p>${copy.hello} <strong style="color:#fafafa;">${escapeEmail(user.name || '')}</strong>,</p><p>${escapeEmail(bodyText)}</p>
      <p style="font-size:13px;color:#737373;">${copy.secFooter} ${APP_FROM_EMAIL}.</p>`,
    ctaLabel: copy.secCta,
    ctaUrl: `${APP_ORIGIN}/login`
  });
  return sendAppEmail(env, {
    to: user.email,
    subject: `${title} — Trujillo AI`,
    text: `${bodyText} ${APP_ORIGIN}/login`,
    html,
    tag: 'security'
  });
}

async function generateJwtToken(userId, email, secret) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: userId,
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 86400)
  }));

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    enc.encode(`${header}.${payload}`)
  );

  const sigBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return `${header}.${payload}.${sigBase64}`;
}

async function verifyJwtToken(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, sig] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const binarySig = Uint8Array.from(atob(sig.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, binarySig, enc.encode(`${header}.${payload}`));
    if (!valid) return null;

    const payloadObj = JSON.parse(atob(payload));
    if (payloadObj.exp && payloadObj.exp < Math.floor(Date.now() / 1000)) return null;

    return payloadObj;
  } catch {
    return null;
  }
}

function slugifyArtifact(value) {
  const slug = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
  return slug;
}

async function getCachedKvValue(kv, key) {
  const inRam = getFromRam(key);
  if (inRam !== null) return inRam;
  if (!kv) return null;
  const val = await kv.get(key);
  if (val) setInRam(key, val);
  return val;
}
