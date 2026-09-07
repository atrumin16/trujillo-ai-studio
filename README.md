# 🧠 Trujillo AI Studio & Groq Discord Bot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Runtime](https://img.shields.io/badge/Runtime-Cloudflare%20Workers-f38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com)
[![Inference Engine](https://img.shields.io/badge/Inference-Groq%20LPU-f55036?style=flat-square)](https://groq.com)
[![Discord API](https://img.shields.io/badge/Discord-Interactions%20API-5865F2?style=flat-square&logo=discord)](https://discord.com/developers/docs)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> **Enterprise-grade Multimodal AI Studio & Discord Bot on Cloudflare Edge**  
> An open-source, edge-native web application and Discord bot delivering ultra-low-latency inference via Groq LPUs. Features multimodal vision, audio transcription, persistent KV conversation memory, role personalization, and a corporate dark-glassmorphism interface.

---

## 🌟 Overview & Key Features

- **⚡ Blazing Fast Groq LPU Inference:** Stream tokens near-instantaneously using cutting-edge open models (`openai/gpt-oss-120b`, `qwen/qwen3.6-27b`, `openai/gpt-oss-20b`).
- **👁️ Multimodal Vision & Audio:** Native image analysis, document reasoning, and edge-powered voice transcription via Whisper turbo.
- **🤖 Dual Platform:**
  - **Web Studio:** Full-featured single-page application (SPA) with markdown rendering, syntax highlighting, conversation branching, and localized i18n support.
  - **Discord Bot:** Edge-native webhook handler verifying incoming interactions via Ed25519 cryptography with `/ia` slash commands and interactive modals.
- **🧠 Persistent Edge Memory:** Seamlessly store user preferences, customized assistant personas, and session turns via Cloudflare Workers KV (`BOT_MEMORY`).
- **🔑 BYOK Support (Bring Your Own Key):** Users can supply their own Groq API key directly in their browser (`localStorage`), bypassing global token rate limits.
- **🎨 Modern Corporate Theme:** Sleek slate-navy palette (`#080c14`), frosted glass mica layering, and WCAG AAA contrast compliance.

---

## 🏗️ Architecture

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

## 🌿 Enterprise Branching Model

| Branch | Purpose | Deployment Trigger |
| :--- | :--- | :--- |
| `main` | **Production Release** | Production deployment on Cloudflare Edge |
| `develop` | **Staging & Integration** | Feature testing, model evaluations & active development |
| `feature/*` | Feature development | Target pull requests merged into `develop` |

---

## 📁 Repository Structure

```
trujillo-ai-studio/
├── public/                  # Static SPA assets, CSS, JS and i18n translation catalogs
│   ├── assets/              # App bundle and localized language packs (26+ languages)
│   └── _headers             # Security headers & edge cache directives
├── src/                     # Cloudflare Worker edge backend
│   ├── memory/              # Conversation turns, KV resolution, user personas & schema
│   ├── index.js             # Main entry point & request router
│   ├── html_shell.js        # Responsive SSR shell & corporate dark chrome
│   ├── ops.js               # Analytics, Groq fallback ladder & operations metrics
│   ├── seo.js               # Metadata, sitemap.xml, robots.txt & llms.txt generator
│   └── time.js              # Real-time system context & timezone resolution
├── scripts/                 # Asset extractors, translation builders & memory tests
├── docs/                    # Architecture runbooks & zero-cost email guides
├── web/                     # React / Vite alternate frontend client
├── register.js              # Discord slash command registrar CLI
├── wrangler.toml.example    # Configuration template for self-hosters
├── wrangler.toml            # Edge deployment configuration
└── LICENSE                  # MIT License
```

---

## 🚀 Self-Hosting Guide (Deploy to Your Own Infrastructure)

Follow these steps to deploy your own instance of AI Studio and Discord Bot onto your Cloudflare account.

### 📋 Prerequisites

1. **[Node.js](https://nodejs.org/)** (v20.x or higher) and `npm`.
2. **[Cloudflare Account](https://dash.cloudflare.com/)** with `wrangler` CLI installed.
3. **[Groq Cloud API Key](https://console.groq.com/keys)** (Free / Pay-as-you-go).
4. **[Discord Developer Application](https://discord.com/developers/applications)** *(Optional, only if using the Discord bot)*.

---

### Step 1: Clone the Repository & Install Dependencies

```bash
git clone https://github.com/atrumin16/trujillo-ai-studio.git
cd trujillo-ai-studio

# Install dependencies
npm install
```

---

### Step 2: Authenticate Wrangler with Cloudflare

Log in to your Cloudflare account:
```bash
npx wrangler login
```

---

### Step 3: Create a Cloudflare Workers KV Namespace

Create a persistent KV namespace to hold conversation memory and session state:
```bash
npx wrangler kv:namespace create BOT_MEMORY
```
*Note the generated namespace ID in the terminal output (e.g., `id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"`).*

---

### Step 4: Configure `wrangler.toml`

Copy the template configuration file:
```bash
cp wrangler.toml.example wrangler.toml
```

Open `wrangler.toml` and update:
1. `id`: Paste the KV namespace ID obtained in Step 3:
   ```toml
   [[kv_namespaces]]
   binding = "BOT_MEMORY"
   id = "your_kv_namespace_id_here"
   ```
2. `SITE_DOMAIN`: Set your custom domain or leave as your `workers.dev` subdomain:
   ```toml
   SITE_DOMAIN = "ai.yourdomain.com"
   ```
3. `OWNER_EMAILS`: Your administrator email address for unlimited token access:
   ```toml
   OWNER_EMAILS = "you@yourdomain.com"
   ```

---

### Step 5: Configure Environment Secrets

Securely inject required API keys into Cloudflare Workers:

```bash
# 1. Groq Cloud API Key (Required for AI completions & vision)
npx wrangler secret put GROQ_API_KEY

# 2. JWT Secret (Recommended: generate a 32-character random string)
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

If you configured a Discord Bot, register the slash commands (`/ia`) with Discord's API:
```bash
# Syntax: node register.js <DISCORD_BOT_TOKEN> <DISCORD_APPLICATION_ID>
node register.js YOUR_BOT_TOKEN YOUR_APPLICATION_ID
```
Then, in the **Discord Developer Portal** under your application:
- Set **Interactions Endpoint URL** to: `https://<YOUR_WORKER_URL>/discord` (or `https://your-domain.com/discord`).

---

### Step 7: Local Development

Run the local development server to test edge functions and static assets:
```bash
npm run dev
```
Open [http://localhost:8787](http://localhost:8787) in your browser.

---

### Step 8: Production Deployment

Deploy the entire studio (SPA assets + edge worker) to Cloudflare's global edge:
```bash
npm run deploy
```

Your AI Studio is now live across hundreds of edge locations worldwide! 🌍

---

## 🤖 Discord Slash Commands

Once invited to your Discord server, Trujillo AI supports the `/ia` slash command:

| Option | Type | Description |
| :--- | :---: | :--- |
| `pregunta` / `prompt` | String | Query, code request, or analytical prompt. |
| `modelo` / `model` | Choice | `openai/gpt-oss-120b`, `qwen/qwen3.6-27b`, `openai/gpt-oss-20b`. |
| `longitud` / `length` | Choice | `corto` (concise summary), `normal`, `extendido` (deep dive). |
| `archivo` / `file` | Attachment | Image attachment for visual analysis or data document. |
| `buscar_web` | Boolean | Enable live web crawling and retrieval augmented context. |

---

## 🔒 Security & Privacy by Design

- **Zero Hardcoded Secrets:** All credentials are dynamically bound at runtime via Cloudflare Secrets.
- **Client-Side BYOK Encryption:** User-supplied Groq API keys are stored solely in the client's browser (`localStorage`) and transmitted directly via TLS 1.3 to Groq.
- **Cryptographic Discord Validation:** All incoming interactions are verified with Ed25519 digital signatures prior to execution.
- **Rate-Limiting & Quota Management:** Built-in token quotas protect your infrastructure from unintended abuse.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/atrumin16/trujillo-ai-studio/issues).

1. Fork the Project (`git checkout -b feature/AmazingFeature`)
2. Commit your Changes (`git commit -m 'feat: add some amazing feature'`)
3. Push to the Branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

**Crafted with ⚡ and open models by [Alberto Trujillo Mingorance](https://alberto.trujillomingorance.com).**
