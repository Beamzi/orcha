# Orcha

**Local AI, made accessible.**

Orcha is an early-stage desktop chat application that brings a proper UI, persistent chat history, and live web search to locally-run AI models — no cloud, no subscriptions, no data leaving your machine.

Built around [Ollama](https://ollama.com), Orcha wraps a locally-installed language model in a full-featured interface that non-technical users can actually use.

---

## The Problem

Small local AI models are powerful, private, and free to run — but they're locked behind a command line, have no memory between sessions, and no access to current information. Orcha is an attempt to fix that.

---

## What It Does

- **Local model interface** — Chat UI for Ollama-powered models running entirely on your machine
- **Persistent chat history** — Conversations are saved and organised into instances
- **Live web search** — Brave Search API injects real-time results into the model context before responding
- **No cloud dependency** — Your prompts, responses, and history never leave your machine

---

## Stack

React · Next.js · TypeScript · Tailwind CSS · Prisma · Ollama API · Brave Search API

---

## Status

Early alpha. Core chat and search-inject flow are functional. Installer tooling and full UI in progress.

---

## Getting Started

1. Install [Ollama](https://ollama.com) and pull a model:
   ```bash
   ollama pull gemma3
   ```
2. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/yourusername/orcha
   cd orcha
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

---

## Roadmap

- [ ] One-click installer (no CLI required)
- [ ] Expanded model support
- [ ] Refined UI and conversation management
- [ ] Brave Search integration polish

---

_Orcha is an independent project by [Your Agency]. Built to explore the frontier of private, local-first AI tooling._
