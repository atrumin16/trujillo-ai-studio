/**
 * Script bilingüe para registrar los comandos completos de Trujillo AI en Discord
 * Uso: node register.js [DISCORD_BOT_TOKEN]
 */

const APPLICATION_ID = "1538306837240225842";
const BOT_TOKEN = process.argv[2] || process.env.DISCORD_BOT_TOKEN || "";

if (!BOT_TOKEN) {
  console.error("Falta el Bot Token. Uso: node register.js <TU_DISCORD_BOT_TOKEN>");
  process.exit(1);
}

const MODEL_CHOICES = [
  { 
    name: "OpenAI GPT OSS 120B (Max Quality & Code)",
    name_localizations: { "es-ES": "OpenAI GPT OSS 120B (Máxima Calidad & Código)" },
    value: "openai/gpt-oss-120b" 
  },
  { 
    name: "Qwen 3.6 27B (Deep Logical Reasoning)", 
    name_localizations: { "es-ES": "Qwen 3.6 27B (Razonamiento Lógico Profundo)" },
    value: "qwen/qwen3.6-27b" 
  },
  { 
    name: "OpenAI GPT OSS 20B (Ultra Fast 0ms)", 
    name_localizations: { "es-ES": "OpenAI GPT OSS 20B (Ultra Rápido 0ms)" },
    value: "openai/gpt-oss-20b" 
  }
];

const LENGTH_CHOICES = [
  {
    name: "Short & Direct (Executive summary in 1-2 points)",
    name_localizations: { "es-ES": "Corto y Directo (Síntesis ejecutiva en 1-2 puntos)" },
    value: "corto"
  },
  {
    name: "Normal / Balanced (Standard 3-4 structured points)",
    name_localizations: { "es-ES": "Normal / Equilibrado (Por defecto, 3-4 puntos)" },
    value: "normal"
  },
  {
    name: "Extended / Deep Dive (Complete in-depth analytical report)",
    name_localizations: { "es-ES": "Extendido / Análisis Completo (Deep Dive exhaustivo)" },
    value: "extendido"
  }
];

const commands = [
  {
    name: "ia",
    description: "Ask Trujillo AI with options to attach data, change model, or search the web",
    description_localizations: { "es-ES": "Pregunta a Trujillo AI con opción de adjuntar datos, cambiar modelo o buscar en la web" },
    type: 1,
    options: [
      {
        name: "pregunta",
        name_localizations: { "en-US": "prompt", "en-GB": "prompt" },
        description: "Your query or topic (leave blank to open a large text window)",
        description_localizations: { "es-ES": "Tu consulta, duda o el tema a redactar (déjalo vacío para abrir ventana de texto grande)" },
        type: 3, required: false
      },
      {
        name: "contexto",
        name_localizations: { "en-US": "context", "en-GB": "context" },
        description: "Extra data, logs, code snippets or specific instructions",
        description_localizations: { "es-ES": "Datos extra, logs, fragmentos de código o instrucciones específicas" },
        type: 3, required: false
      },
      {
        name: "longitud",
        name_localizations: { "en-US": "length", "en-GB": "length" },
        description: "Response length and detail level (Short, Normal, Extended)",
        description_localizations: { "es-ES": "Longitud y nivel de detalle de la respuesta (Corto, Normal, Extendido)" },
        type: 3, required: false, choices: LENGTH_CHOICES
      },
      {
        name: "buscar_web",
        name_localizations: { "en-US": "search_web", "en-GB": "search_web" },
        description: "Search for updated information on the Internet in real-time?",
        description_localizations: { "es-ES": "¿Buscar información actualizada en Internet en tiempo real?" },
        type: 5, required: false
      },
      {
        name: "modelo",
        name_localizations: { "en-US": "model", "en-GB": "model" },
        description: "Choose the AI model to use",
        description_localizations: { "es-ES": "Elige el modelo de IA a utilizar" },
        type: 3, required: false, choices: MODEL_CHOICES
      },
      {
        name: "privado",
        name_localizations: { "en-US": "private", "en-GB": "private" },
        description: "Ephemeral response visible only to you?",
        description_localizations: { "es-ES": "¿Respuesta efímera visible solo para ti?" },
        type: 5, required: false
      }
    ],
    integration_types: [0, 1], contexts: [0, 1, 2]
  },
  {
    name: "ai",
    description: "Quick query to Trujillo AI (alias for /ia)",
    description_localizations: { "es-ES": "Consulta rápida a Trujillo AI (alias de /ia)" },
    type: 1,
    options: [
      {
        name: "pregunta", name_localizations: { "en-US": "prompt", "en-GB": "prompt" },
        description: "Your query or topic (leave blank to open a large text window)",
        description_localizations: { "es-ES": "Tu consulta, duda o el tema a redactar (déjalo vacío para abrir ventana de texto grande)" },
        type: 3, required: false
      },
      {
        name: "contexto", name_localizations: { "en-US": "context", "en-GB": "context" },
        description: "Extra data, logs or code snippets",
        description_localizations: { "es-ES": "Datos extra, logs o fragmentos de código" },
        type: 3, required: false
      },
      {
        name: "longitud", name_localizations: { "en-US": "length", "en-GB": "length" },
        description: "Response length and detail level",
        description_localizations: { "es-ES": "Longitud y nivel de detalle de la respuesta (Corto, Normal, Extendido)" },
        type: 3, required: false, choices: LENGTH_CHOICES
      },
      {
        name: "buscar_web", name_localizations: { "en-US": "search_web", "en-GB": "search_web" },
        description: "Search for updated information on the Internet?",
        description_localizations: { "es-ES": "¿Buscar información actualizada en Internet?" },
        type: 5, required: false
      },
      {
        name: "modelo", name_localizations: { "en-US": "model", "en-GB": "model" },
        description: "Choose the AI model",
        description_localizations: { "es-ES": "Elige el modelo de IA" },
        type: 3, required: false, choices: MODEL_CHOICES
      },
      {
        name: "privado", name_localizations: { "en-US": "private", "en-GB": "private" },
        description: "Ephemeral response visible only to you?",
        description_localizations: { "es-ES": "¿Respuesta efímera visible solo para ti?" },
        type: 5, required: false
      }
    ],
    integration_types: [0, 1], contexts: [0, 1, 2]
  },
  {
    name: "buscar",
    name_localizations: { "en-US": "search", "en-GB": "search" },
    description: "Search for updated info on the Internet in real-time and generate a summary",
    description_localizations: { "es-ES": "Busca información actualizada en Internet en tiempo real y genera una síntesis" },
    type: 1,
    options: [
      {
        name: "consulta", name_localizations: { "en-US": "query", "en-GB": "query" },
        description: "What do you want to search on the Internet?",
        description_localizations: { "es-ES": "¿Qué quieres buscar en Internet?" },
        type: 3, required: true
      },
      {
        name: "longitud", name_localizations: { "en-US": "length", "en-GB": "length" },
        description: "Response length and detail level",
        description_localizations: { "es-ES": "Longitud y nivel de detalle de la respuesta (Corto, Normal, Extendido)" },
        type: 3, required: false, choices: LENGTH_CHOICES
      },
      {
        name: "modelo", name_localizations: { "en-US": "model", "en-GB": "model" },
        description: "Choose the AI model",
        description_localizations: { "es-ES": "Elige el modelo de IA" },
        type: 3, required: false, choices: MODEL_CHOICES
      },
      {
        name: "privado", name_localizations: { "en-US": "private", "en-GB": "private" },
        description: "Ephemeral response visible only to you?",
        description_localizations: { "es-ES": "¿Respuesta efímera visible solo para ti?" },
        type: 5, required: false
      }
    ],
    integration_types: [0, 1], contexts: [0, 1, 2]
  },
  {
    name: "modo",
    name_localizations: { "en-US": "mode", "en-GB": "mode" },
    description: "Set your default response length preference (Short, Normal, Extended)",
    description_localizations: { "es-ES": "Configura tu preferencia de longitud de respuesta por defecto (Corto, Normal, Extendido)" },
    type: 1,
    options: [
      {
        name: "longitud",
        name_localizations: { "en-US": "length", "en-GB": "length" },
        description: "Choose your default response length",
        description_localizations: { "es-ES": "Elige tu longitud de respuesta por defecto" },
        type: 3, required: true,
        choices: LENGTH_CHOICES
      }
    ],
    integration_types: [0, 1], contexts: [0, 1, 2]
  },
  {
    name: "imagen",
    name_localizations: { "en-US": "image", "en-GB": "image" },
    description: "Generate realistic images and high-quality digital art with AI",
    description_localizations: { "es-ES": "Genera imágenes realistas y arte digital de alta calidad con IA" },
    type: 1,
    options: [
      {
        name: "prompt",
        description: "Detailed description of the image you want to generate",
        description_localizations: { "es-ES": "Descripción detallada de la imagen que deseas generar" },
        type: 3, required: true
      },
      {
        name: "estilo", name_localizations: { "en-US": "style", "en-GB": "style" },
        description: "Artistic style or visual format",
        description_localizations: { "es-ES": "Estilo artístico o formato visual" },
        type: 3, required: false,
        choices: [
          { name: "Photorealistic 8K", name_localizations: { "es-ES": "Fotorrealista 8K" }, value: "photorealistic 8k highly detailed cinematic lighting masterwork" },
          { name: "Conceptual Digital Art", name_localizations: { "es-ES": "Arte Digital Conceptual" }, value: "digital art cinematic concept art trending on artstation masterpiece" },
          { name: "Futuristic Cyberpunk", name_localizations: { "es-ES": "Cyberpunk Futurista" }, value: "cyberpunk neon lights volumetric lighting ultra detailed 8k" },
          { name: "Minimalist Black and White", name_localizations: { "es-ES": "Minimalista Blanco y Negro" }, value: "minimalist monochrome high contrast clean vector aesthetic" },
          { name: "Anime Studio HQ", name_localizations: { "es-ES": "Anime Studio HQ" }, value: "anime style studio anime illustration vibrant high quality" }
        ]
      },
      {
        name: "aspecto", name_localizations: { "en-US": "aspect_ratio", "en-GB": "aspect_ratio" },
        description: "Aspect ratio",
        description_localizations: { "es-ES": "Relación de aspecto" },
        type: 3, required: false,
        choices: [
          { name: "Square (1:1 - 1024x1024)", name_localizations: { "es-ES": "Cuadrado (1:1 - 1024x1024)" }, value: "1024x1024" },
          { name: "Landscape (16:9 - 1280x720)", name_localizations: { "es-ES": "Paisaje / Horizontal (16:9 - 1280x720)" }, value: "1280x720" },
          { name: "Portrait (9:16 - 720x1280)", name_localizations: { "es-ES": "Retrato / Vertical (9:16 - 720x1280)" }, value: "720x1280" }
        ]
      },
      {
        name: "privado", name_localizations: { "en-US": "private", "en-GB": "private" },
        description: "Image visible only to you?",
        description_localizations: { "es-ES": "¿Imagen visible solo para ti?" },
        type: 5, required: false
      }
    ],
    integration_types: [0, 1], contexts: [0, 1, 2]
  },
  {
    name: "leer-url",
    name_localizations: { "en-US": "read-url", "en-GB": "read-url" },
    description: "Read the content of a web link or repo and ask Trujillo AI to analyze it",
    description_localizations: { "es-ES": "Lee el contenido de un enlace web o repositorio y pide a Trujillo AI que lo analice" },
    type: 1,
    options: [
      {
        name: "url",
        description: "URL link to inspect (e.g. https://github.com/... or https://news.com)",
        description_localizations: { "es-ES": "Enlace URL a inspeccionar (ej: https://github.com/... o https://noticia.com)" },
        type: 3, required: true
      },
      {
        name: "pregunta", name_localizations: { "en-US": "question", "en-GB": "question" },
        description: "What do you want to extract or analyze from that page?",
        description_localizations: { "es-ES": "¿Qué quieres que extraiga o analice de esa página?" },
        type: 3, required: false
      },
      {
        name: "longitud", name_localizations: { "en-US": "length", "en-GB": "length" },
        description: "Response length and detail level",
        description_localizations: { "es-ES": "Longitud y nivel de detalle de la respuesta (Corto, Normal, Extendido)" },
        type: 3, required: false, choices: LENGTH_CHOICES
      },
      {
        name: "privado", name_localizations: { "en-US": "private", "en-GB": "private" },
        description: "Ephemeral response visible only to you?",
        description_localizations: { "es-ES": "¿Respuesta efímera visible solo para ti?" },
        type: 5, required: false
      }
    ],
    integration_types: [0, 1], contexts: [0, 1, 2]
  },
  {
    name: "entrenar",
    name_localizations: { "en-US": "train", "en-GB": "train" },
    description: "Teach knowledge or rules that the AI will memorize (Visible only to you)",
    description_localizations: { "es-ES": "Enseña conocimientos o reglas que la IA memorizará (Solo visible para ti)" },
    type: 1,
    options: [
      {
        name: "conocimiento", name_localizations: { "en-US": "knowledge", "en-GB": "knowledge" },
        description: "Information, rules, manuals or data that the AI should memorize",
        description_localizations: { "es-ES": "Información, reglas, manuales o datos que la IA debe memorizar" },
        type: 3, required: true
      },
      {
        name: "titulo", name_localizations: { "en-US": "title", "en-GB": "title" },
        description: "Title or brief identifier of this knowledge",
        description_localizations: { "es-ES": "Título o identificador breve de este conocimiento" },
        type: 3, required: false
      }
    ],
    integration_types: [0, 1], contexts: [0, 1, 2]
  },
  {
    name: "personalidad",
    name_localizations: { "en-US": "personality", "en-GB": "personality" },
    description: "Configure the role, tone and response style of the bot (Visible only to you)",
    description_localizations: { "es-ES": "Configura el rol, tono y estilo de respuesta del bot (Solo visible para ti)" },
    type: 1,
    options: [
      {
        name: "rol", name_localizations: { "en-US": "role", "en-GB": "role" },
        description: "Choose the bot's specialty",
        description_localizations: { "es-ES": "Elige la especialidad del bot" },
        type: 3, required: true,
        choices: [
          { name: "Software Architect & Senior Dev", name_localizations: { "es-ES": "Arquitecto de Software & Dev Senior" }, value: "developer" },
          { name: "Scientific Researcher & Analyst", name_localizations: { "es-ES": "Investigador Científico & Analista" }, value: "researcher" },
          { name: "Legal & Finance Expert", name_localizations: { "es-ES": "Experto Legal & Negocios" }, value: "legal_finance" },
          { name: "Creative Writer & Copywriter", name_localizations: { "es-ES": "Redactor Creativo & Copywriter" }, value: "creative" },
          { name: "Ethical Hacker & Cybersecurity", name_localizations: { "es-ES": "Hacker Ético & Ciberseguridad" }, value: "hacker" },
          { name: "Universal Assistant (Default)", name_localizations: { "es-ES": "Asistente Universal (Por Defecto)" }, value: "general" },
          { name: "Custom (write your prompt in the other option)", name_localizations: { "es-ES": "Personalizado (escribe tu prompt en la otra opción)" }, value: "custom" }
        ]
      },
      {
        name: "prompt_personalizado", name_localizations: { "en-US": "custom_prompt", "en-GB": "custom_prompt" },
        description: "If you chose 'Custom', write the system instructions here",
        description_localizations: { "es-ES": "Si elegiste 'Personalizado', escribe las instrucciones de sistema aquí" },
        type: 3, required: false
      }
    ],
    integration_types: [0, 1], contexts: [0, 1, 2]
  },
  {
    name: "memoria",
    name_localizations: { "en-US": "memory", "en-GB": "memory" },
    description: "Consult learned knowledge or manage the memory (Visible only to you)",
    description_localizations: { "es-ES": "Consulta los conocimientos aprendidos o gestiona la memoria (Solo visible para ti)" },
    type: 1,
    options: [
      {
        name: "accion", name_localizations: { "en-US": "action", "en-GB": "action" },
        description: "Action to perform on the memory",
        description_localizations: { "es-ES": "Acción a realizar sobre la memoria" },
        type: 3, required: true,
        choices: [
          { name: "View learned knowledge and active personality", name_localizations: { "es-ES": "Ver conocimientos aprendidos y personalidad activa" }, value: "ver" },
          { name: "Delete the last added knowledge", name_localizations: { "es-ES": "Borrar el último conocimiento añadido" }, value: "borrar_ultimo" },
          { name: "Delete all memory and factory reset", name_localizations: { "es-ES": "Borrar toda la memoria y restaurar valores de fábrica" }, value: "borrar_todo" }
        ]
      }
    ],
    integration_types: [0, 1], contexts: [0, 1, 2]
  },
  {
    name: "ayuda",
    name_localizations: { "en-US": "help", "en-GB": "help" },
    description: "Shows the user manual, commands, web search and training options",
    description_localizations: { "es-ES": "Muestra el manual de uso, comandos, búsqueda web y opciones de entrenamiento" },
    type: 1,
    integration_types: [0, 1], contexts: [0, 1, 2]
  },
  {
    name: "Respond with Trujillo AI",
    name_localizations: { "es-ES": "Responder con Trujillo AI" },
    type: 3,
    integration_types: [0, 1], contexts: [0, 1, 2]
  },
  {
    name: "vincular",
    name_localizations: { "en-US": "link", "en-GB": "link" },
    description: "Link your ai.trujillomingorance.com account to unlock the bot",
    description_localizations: { "es-ES": "Vincula tu cuenta de ai.trujillomingorance.com para desbloquear el bot" },
    type: 1,
    options: [
      {
        name: "email",
        description: "The email address you used to register on the web",
        description_localizations: { "es-ES": "El correo electrónico con el que te registraste en la web" },
        type: 3, required: true
      }
    ],
    integration_types: [0, 1], contexts: [0, 1, 2]
  }
];

async function registerAllCommands() {
  console.log("Registrando comandos sobrios y bilingües de Trujillo AI en Discord API...");
  try {
    const res = await fetch(`https://discord.com/api/v10/applications/${APPLICATION_ID}/commands`, {
      method: "PUT",
      headers: {
        "Authorization": `Bot ${BOT_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(commands)
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Error de Discord API:", data);
      return;
    }

    console.log("Comandos actualizados con éxito en Discord.");
    console.log(`Registrados ${data.length} comandos:`);
    data.forEach(cmd => console.log(`   - ${cmd.name} (Tipo: ${cmd.type})`));
  } catch (err) {
    console.error("Error conectando con Discord API:", err);
  }
}

registerAllCommands();
