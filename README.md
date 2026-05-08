# Orcha

**Local AI, made accessible for people priced out of frontier models.**

Orcha is a full-stack chat application that brings persistent conversations, live web search, and a production-quality UI to locally-run AI models. Inference runs entirely on your machine by default. Your conversations, prompts, and responses stay local unless you choose otherwise. Built around [Ollama](https://ollama.com/) and designed for small models that run on a laptop. The capability is already there, it just needed the right infrastructure around it.

---
https://github.com/user-attachments/assets/bf526a1c-0616-4748-b65c-71b2a90e0a05




## The problem

Small local models are private, free, and increasingly capable. But they ship with fundamental limitations:

- **No memory within a session.** Every message is stateless by default. Without context injection the model doesn't remember what you said two messages ago.
- **No memory between sessions.** Even if you solve the above, nothing persists when you close the app.
- **No access to current information.** Responses are limited to whatever the model was trained on.

Orcha fixes all three.

---

## What it does

- **Context injection.** Chat history is merged from both server and client state, formatted to Ollama's spec, and injected into every request. The model knows what was said earlier in the conversation because you tell it, every time. This is the foundational layer everything else builds on.
- **Persistent chat instances.** Conversations are saved, organised, and resumable. History reloads into context on return so conversations stay coherent across sessions. Instances and their first message are created atomically. An instance without an initial chatlog doesn't exist.
- **Live web search.** Brave Search API pulls real-time results and injects them into the model context before responding. Your local model answers questions about things that happened last week. This is what closes the gap between a local model and a frontier app for everyday use.
- **Context window management.** History is trimmed to a 20-message sliding window before each request. Small models stay coherent longer than you'd expect with the right context management.
- **Streaming responses.** Responses stream token by token with optimistic UI. State reconciles against the database on completion without blocking the interface.
- **Production UI.** Not a demo. Not a Streamlit wrapper. A real interface with thoughtful UX built to last.

---

## Stack

`React` `Next.js` `TypeScript` `Tailwind CSS` `Prisma` `Ollama API` `Brave Search API`

---

## Getting started

Set up and run Orcha locally in five steps.

### Prerequisites

- Node.js 18+
- [Ollama](https://ollama.com/) installed and running
- Neon or Postgres database
- Google OAuth credentials
- Brave Search API key

### Installation

**1. Pull the model**

```bash
ollama pull gemma3:1b
```

**2. Clone and install**

```bash
git clone https://github.com/Beamzi/orcha
cd orcha
npm install
```

**3. Set up environment variables**

Create a `.env` file in the project root:

```env
DATABASE_URL=your_postgres_connection_string
AUTH_SECRET=your_auth_secret
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
BRAVE_API_KEY=your_brave_search_api_key
```

**4. Run database migrations**

```bash
npx prisma migrate deploy
```

**5. Start the app**

```bash
npm run dev
```

Visit `http://localhost:3000/dashboard` and sign in with Google to get started.

---

## Recommended models

Orcha is built and tested around small models that run on consumer hardware. `gemma3:1b` is the primary target, fast, coherent, and cheap to run. The context management is tuned for its limitations. Larger models will work but aren't the point. The thesis is that the right infrastructure makes small models genuinely competitive with frontier apps for everyday use. As small models improve, Orcha's capability grows with them.

---

## Roadmap

Orcha is being built across three distributions, each targeting a different audience with a different trust contract.

### Distribution 1 — `npm install` (current)

Clone, configure, run. Full source visibility. Bring your own Brave API key. No accounts, no telemetry, no intermediaries. This is the most transparent way to run Orcha and it will always exist.

### Distribution 2 — Orcha OSS Installer _(in progress)_

A packaged Electron installer for Windows and Ubuntu. Ollama and a base model bundled in. Works out of the box without touching a terminal. Web search unlocks when you add a Brave API key. A setup guide is provided. Open source, auditable, no accounts required.

### Distribution 3 — Orcha _(planned)_

A consumer product aimed at non-technical users. Signup required. Inference still runs locally and the cloud layer is opt-in, not the default. Web search included at ~1000 requests/month for $2-3/month. Optional cloud sync for conversation history across devices at $7-10/month. The free tier is a complete local chat experience.

The OSS distributions exist permanently alongside the consumer product. The code is open because the privacy claim should be verifiable, not just stated.

---

## Architecture notes

- **Why nested Prisma creates?** Chat instances and their first message are created atomically. An instance without an initial chatlog is meaningless, so they're born together or not at all.
- **Why optimistic UI with temp IDs?** Streaming starts before the database confirms the record. Temp IDs allow state to update mid-stream and reconcile on completion without the UI waiting on the database.
- **Why merge server and client state for context?** Messages exist on the client before they're confirmed server-side. Both sources are needed to give the model complete conversation context on every request.

---

## Status

Early alpha. Core chat flow, streaming, web search injection, and persistent instances are functional. Electron packaging and installer tooling are next. This is Distribution 1. It works. Solo project in active development, issues and feedback welcome.

---

## License

[AGPL v3](https://www.gnu.org/licenses/agpl-3.0.en.html)

You are free to use, modify, and distribute this software under the terms of the GNU Affero General Public License v3. Any modifications or derivative works must also be released under AGPL v3. If you run a modified version as a network service, you must make the source available to users of that service.
