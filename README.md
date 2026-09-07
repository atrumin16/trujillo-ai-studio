# Trujillo AI Studio and Groq Discord Bot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Runtime](https://img.shields.io/badge/Runtime-Cloudflare%20Workers-f38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com)
[![Inference Engine](https://img.shields.io/badge/Inference-Groq%20LPU-f55036?style=flat-square)](https://groq.com)
[![Discord API](https://img.shields.io/badge/Discord-Interactions%20API-5865F2?style=flat-square&logo=discord)](https://discord.com/developers/docs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Production Gateway: [ai.trujillomingorance.com](https://ai.trujillomingorance.com)

An open-source, edge-native web workspace and Discord bot powered by Cloudflare Workers and Groq LPU inference. It provides fast token streaming with modern open models, multimodal image reasoning, voice transcription, persistent conversation memory, and custom role personas.

---

## Technical Overview

- Fast LPU Inference: Near-instant token generation using open-weights models such as OpenAI GPT OSS 120B, Qwen 3.6 27B, and OpenAI GPT OSS 20B Turbo.
- Multimodal Processing: Support for image analysis, visual reasoning, and edge-powered speech-to-text transcription via Whisper Large v3 Turbo.
- Dual Access Surface:
  - Web Studio: Responsive single-page application with streaming markdown, syntax highlighting, conversation branching, and 26+ language translations.
  - Discord Bot: Edge webhook endpoint verifying incoming interactions using Ed25519 cryptography, featuring the `/ia` slash command and interactive modals.
- Persistent Edge State: Session state, customized system personas, and daily token usage tracked through Cloudflare Workers KV (`BOT_MEMORY`).
- Bring Your Own Key (BYOK): Users can save their personal Groq API key in their browser (stored locally in `localStorage`), enabling unlimited tokens without server-side credential persistence.
- Dark Slate Visual Design: Obsidian navy palette (#080c14) with translucent acrylic surfaces and accessible typography.

---

## System Architecture

```
                               ┌────────────────────────────────┐
                               │       Client Requests          │
                               │  (Web Browser / Discord Bot)   │
                               └───────────────┬────────────────┘
                                               │
                                               ▼
                      ┌──────────────────────────────────────────────────┐
                      │        Cloudflare Worker (Global Edge)           │
                      │  - Ed25519 Cryptographic Verification (Discord)  │
                      │  - JWT Authentication & OAuth (Google / X)       │
                      │  - SPA Static Asset Delivery (Assets Binding)    │
                      │  - Quota Limiter & Daily Token Management        │
                      └─────────┬────────────────────────────┬───────────┘
                                │                            │
                                ▼                            ▼
                    ┌──────────────────────┐     ┌──────────────────────┐
                    │    Groq LPU Engine   │     │ Cloudflare Workers KV│
                    │  - GPT-OSS 120B/20B  │     │  - Conversation Turns│
                    │  - Qwen 3.6 / 3.8    │     │  - Custom Personas   │
                    │  - Whisper Turbo     │     │  - Daily Ops Metrics │
                    └──────────────────────┘     └──────────────────────┘
```

---

## Enterprise Branching Model

| Branch | Purpose | Deployment Trigger |
| :--- | :--- | :--- |
| `main` | Production Release | Production deployment on Cloudflare Edge |
| `develop` | Staging & Integration | Feature testing, model evaluations, and active development |
| `feature/*` | Feature development | Target pull requests merged into `develop` |

---

## Repository Structure

```
trujillo-ai-studio/
├── public/                  # Static SPA assets, CSS, JS, and i18n translation catalogs
│   ├── assets/              # App bundle and localized language packs (26+ languages)
│   └── _headers             # Security policies and edge cache headers
├── src/                     # Cloudflare Worker edge backend
│   ├── memory/              # Conversation turns, KV resolution, user personas, and schema
│   ├── index.js             # Main worker entry point and API route dispatcher
│   ├── html_shell.js        # Responsive SSR shell and corporate dark layout
│   ├── ops.js               # Analytics, Groq fallback ladder, and telemetry
│   ├── seo.js               # Metadata, sitemap.xml, robots.txt, and llms.txt generator
│   └── time.js              # Real-time system context and timezone resolution
├── scripts/                 # Translation builders and memory testing utilities
├── docs/                    # Architecture runbooks and zero-cost email setup guides
├── web/                     # React / Vite alternate frontend client
├── register.js              # Discord slash command registration script
├── wrangler.toml.example    # Configuration template for self-hosting
├── wrangler.toml            # Edge deployment configuration
└── LICENSE                  # MIT License
```

---

## Self-Hosting Guide (Deploy to Your Own Infrastructure)

Follow these steps to deploy your own instance of the AI Studio and Discord bot to your Cloudflare account.

### Prerequisites

1. Node.js (v20 or higher) and npm.
2. Cloudflare Account with the `wrangler` CLI installed.
3. Groq Cloud API Key (from console.groq.com).
4. Discord Developer Application (optional, needed only if using the Discord bot).

---

### Step 1: Clone the Repository and Install Dependencies

```bash
git clone https://github.com/atrumin16/trujillo-ai-studio.git
cd trujillo-ai-studio

# Install dependencies
npm install
```

---

### Step 2: Authenticate Wrangler with Cloudflare

```bash
npx wrangler login
```

---

### Step 3: Create a Cloudflare Workers KV Namespace

```bash
npx wrangler kv:namespace create BOT_MEMORY
```

Note the generated namespace ID in the terminal output (e.g., `id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`).

---

### Step 4: Configure wrangler.toml

Copy the template configuration:
```bash
cp wrangler.toml.example wrangler.toml
```

Open `wrangler.toml` and update:
1. `id`: Paste the KV namespace ID from Step 3 into the `[[kv_namespaces]]` section.
2. `SITE_DOMAIN`: Set your custom domain or leave it as your `workers.dev` subdomain.
3. `OWNER_EMAILS`: Your administrator email address for unlimited token access.

---

### Step 5: Configure Environment Secrets

Inject the required secrets securely into Cloudflare Workers:

```bash
# 1. Groq Cloud API Key (Required for AI completions and vision)
npx wrangler secret put GROQ_API_KEY

# 2. JWT Secret (Generate a secure 32-character random string)
npx wrangler secret put JWT_SECRET

# --- OPTIONAL: Discord Bot Integration ---
# 3. Discord Application Public Key (from Discord Developer Portal)
npx wrangler secret put DISCORD_PUBLIC_KEY

# 4. Discord Bot Token (from Discord Developer Portal -> Bot tab)
npx wrangler secret put DISCORD_BOT_TOKEN

# --- OPTIONAL: Transactional Emails (Resend) ---
npx wrangler secret put RESEND_API_KEY
```

---

### Step 6: (Optional) Register Discord Slash Commands

If you configured a Discord bot, register the `/ia` command:
```bash
# Usage: node register.js <DISCORD_BOT_TOKEN> <DISCORD_APPLICATION_ID>
node register.js YOUR_BOT_TOKEN YOUR_APPLICATION_ID
```

In the Discord Developer Portal under your application, configure:
- Interactions Endpoint URL: `https://<YOUR_WORKER_URL>/discord` (or `https://your-domain.com/discord`).

---

### Step 7: Local Development

```bash
npm run dev
```

Open `http://localhost:8787` in your browser.

---

### Step 8: Production Deployment

Deploy the entire studio (SPA assets and edge worker) to Cloudflare:
```bash
npm run deploy
```

---

## Discord Slash Commands

Once invited to your Discord server, the bot supports the `/ia` command with the following options:

| Option | Type | Description |
| :--- | :--- | :--- |
| `pregunta` / `prompt` | String | Query, code request, or analytical prompt. |
| `modelo` / `model` | Choice | `openai/gpt-oss-120b`, `qwen/qwen3.6-27b`, `openai/gpt-oss-20b`. |
| `longitud` / `length` | Choice | `corto` (concise summary), `normal`, `extendido` (deep dive). |
| `archivo` / `file` | Attachment | Image attachment for visual analysis or document inspection. |
| `buscar_web` | Boolean | Enables web retrieval for live context. |

---

## Security Principles

- Zero Hardcoded Secrets: All credentials are dynamically bound at runtime through Cloudflare Secrets.
- Client-Side BYOK Encryption: User-provided Groq API keys are stored only in client `localStorage` and sent over encrypted TLS 1.3 to Groq.
- Cryptographic Signature Validation: Incoming Discord requests are validated with Ed25519 signatures before processing.
- Rate Limiting: Daily token quotas protect backend resources against unexpected spikes in traffic.

---

## Contributing

Contributions and pull requests are welcome. Feel free to open an issue on the GitHub repository to discuss improvements.

1. Fork the repository (`git checkout -b feature/improvement`)
2. Commit your changes (`git commit -m 'feat: description of change'`)
3. Push to your branch (`git push origin feature/improvement`)
4. Open a Pull Request against `develop`

---

## License

Distributed under the MIT License. See [LICENSE](./LICENSE) for full terms.
