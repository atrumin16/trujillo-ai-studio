# 🧠 Trujillo AI Studio & Discord Bot

[![Status](https://img.shields.io/badge/Status-Production%20Live-emerald?style=flat-square)](https://ai.trujillomingorance.com)
[![Runtime](https://img.shields.io/badge/Runtime-Cloudflare%20Workers-f38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com)
[![Inference](https://img.shields.io/badge/Inference-Groq%20LPU-f55036?style=flat-square)](https://groq.com)
[![Discord](https://img.shields.io/badge/Discord-Interactions%20API-5865F2?style=flat-square&logo=discord)](https://discord.com)
[![License](https://img.shields.io/badge/License-Proprietary-blue?style=flat-square)](#)

> **Enterprise-grade Multimodal AI Studio & Discord Bot on Cloudflare Edge**  
> Unified corporate web platform and real-time Discord bot powered by Groq LPU ultra-low-latency inference, supporting state-of-the-art open models with vision, voice transcription, and persistent memory.

---

## 🌐 Live Production Domains

- **Web Studio Primary:** [ai.trujillomingorance.com](https://ai.trujillomingorance.com)
- **Alternate Route:** [groq.trujillomingorance.com](https://groq.trujillomingorance.com)
- **Edge Routing Worker:** Cloudflare Workers Global Anycast Network

---

## 🚀 Key Features

- **⚡ Ultra-Low Latency Inference:** Native integration with Groq LPUs for near-instant token streaming.
- **👁️ Multimodal Capabilities:** High-precision vision parsing for image reasoning, documents, and visual QA.
- **🎙️ Voice & Audio Transcription:** Audio processing and transcription pipeline directly at the edge.
- **🤖 Discord Bot Interactions:** Fully featured Discord bot utilizing slash commands (`/ia`), message components, interactive modals, and autocomplete.
- **🎨 Unified Corporate Design:** Modern dark-mode interface styled with corporate slate-navy tokens (`#080c14`), frosted glass mica effects, and responsive navigation.
- **🌍 Internationalization (i18n):** Multi-language UI and response localization with dynamic client & server translation.
- **💾 Cloudflare KV Memory:** Persistent user profiles, preferences, conversation turns, and daily automated operational reports via cron triggers.

---

## 🏗️ Architecture

```
                                 ┌─────────────────────────────────┐
                                 │   ai.trujillomingorance.com     │
                                 │   Discord Webhook Endpoint      │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                        ┌──────────────────────────────────────────────────┐
                        │       Cloudflare Worker (Global Edge)            │
                        │  - Request Router & Auth Middleware              │
                        │  - Discord Ed25519 Signature Verification        │
                        │  - HTML Shell & Corporate Static Assets Binding  │
                        └─────────┬────────────────────────────┬───────────┘
                                  │                            │
                                  ▼                            ▼
                      ┌──────────────────────┐     ┌──────────────────────┐
                      │    Groq LPU Engine   │     │ Cloudflare KV Memory │
                      │  - GPT-OSS 120B / 20B│     │ - Session State      │
                      │  - Qwen 3.6 / 3.8    │     │ - User Preferences   │
                      │  - Vision / Audio    │     │ - Daily Ops Logging  │
                      └──────────────────────┘     └──────────────────────┘
```

---

## 🛠️ Tech Stack

- **Edge Computing:** Cloudflare Workers (JavaScript / ES Modules)
- **Front-End UI:** Corporate Glassmorphism, CSS Custom Properties, Vanilla JS SPA
- **Inference Provider:** Groq Cloud API (LPUs)
- **Bot Protocol:** Discord Interactions API (Signature verification with Ed25519)
- **Persistence:** Cloudflare Workers KV (`BOT_MEMORY`)
- **Automations:** Cloudflare Scheduled Cron Triggers (`0 7 * * *`)

---

## 💻 Local Development

### Prerequisites
- Node.js 20+
- Cloudflare Wrangler CLI (`npm install -g wrangler`)
- Discord Developer Application credentials
- Groq Cloud API Key

### Installation
```bash
# Clone the private repository
git clone https://github.com/atrumin16/trujillo-ai-studio.git
cd trujillo-ai-studio

# Install dependencies
npm install
```

### Environment Variables
Configure your Cloudflare Worker secrets:
```bash
wrangler secret put GROQ_API_KEY
wrangler secret put DISCORD_BOT_TOKEN
wrangler secret put X_CLIENT_SECRET
```

### Running Locally
```bash
# Start local dev server
npm run dev

# Register Discord slash commands
npm run register <YOUR_DISCORD_BOT_TOKEN>
```

### Production Deployment
```bash
# Build assets and deploy to Cloudflare
npm run deploy
```

---

## 🔐 Security & Zero-Trust

- **No Hardcoded Credentials:** All API keys and secrets are securely injected via Cloudflare Secrets and Infisical.
- **Zero-Trust Pre-Commit:** Continuous entropy and signature auditing prevents secret leakage.
- **Ed25519 Discord Verification:** Cryptographic signature validation on all incoming webhook payloads.

---

## 📄 License & Ownership

© 2026 Alberto Trujillo Mingorance. All rights reserved. Private and confidential.
