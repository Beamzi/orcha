"use client";

const stack = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Prisma",
  "Ollama API",
  "Brave Search API",
];

const features = [
  {
    title: "Context injection",
    description:
      "Chat history is merged from both server and client state, formatted to Ollama's spec, and injected into every request. The model knows what was said earlier in the conversation because you tell it, every time. This is the foundational layer everything else builds on.",
  },
  {
    title: "Persistent chat instances",
    description:
      "Conversations are saved, organised, and resumable. History reloads into context on return so conversations stay coherent across sessions. Instances and their first message are created atomically. An instance without an initial chatlog doesn't exist.",
  },
  {
    title: "Live web search",
    description:
      "Brave Search API pulls real-time results and injects them into the model context before responding. Your local model answers questions about things that happened last week. This is what closes the gap between a local model and a frontier app for everyday use.",
  },
  {
    title: "Context window management",
    description:
      "History is trimmed to a 20-message sliding window before each request. Small models stay coherent longer than you'd expect with the right context management.",
  },
  {
    title: "Streaming responses",
    description:
      "Responses stream token by token with optimistic UI. State reconciles against the database on completion without blocking the interface.",
  },
  {
    title: "Production UI",
    description:
      "Not a demo. Not a Streamlit wrapper. A real interface with thoughtful UX built to last.",
  },
];

const distributions = [
  {
    label: "Distribution 1",
    sublabel: "npm install",
    status: "current",
    description:
      "Clone, configure, run. Full source visibility. Bring your own Brave API key. No accounts, no telemetry, no intermediaries. This is the most transparent way to run Orcha and it will always exist.",
  },
  {
    label: "Distribution 2",
    sublabel: "Orcha OSS Installer",
    status: "in progress",
    description:
      "A packaged Electron installer for Windows and Ubuntu. Ollama and a base model bundled in. Works out of the box without touching a terminal. Web search unlocks when you add a Brave API key. A setup guide is provided. Open source, auditable, no accounts required.",
  },
  {
    label: "Distribution 3",
    sublabel: "Orcha",
    status: "planned",
    description:
      "A consumer product aimed at non-technical users. Signup required. Inference still runs locally and the cloud layer is opt-in, not the default. Web search included at ~1000 requests/month for $2-3/month. Optional cloud sync for conversation history across devices at $7-10/month. The free tier is a complete local chat experience.",
  },
];

const architectureNotes = [
  {
    question: "Why nested Prisma creates?",
    answer:
      "Chat instances and their first message are created atomically. An instance without an initial chatlog is meaningless, so they're born together or not at all.",
  },
  {
    question: "Why optimistic UI with temp IDs?",
    answer:
      "Streaming starts before the database confirms the record. Temp IDs allow state to update mid-stream and reconcile on completion without the UI waiting on the database.",
  },
  {
    question: "Why merge server and client state for context?",
    answer:
      "Messages exist on the client before they're confirmed server-side. Both sources are needed to give the model complete conversation context on every request.",
  },
];

const statusColor: Record<string, string> = {
  current: "bg-emerald-400",
  "in progress": "bg-amber-400",
  planned: "bg-neutral-500",
};

export default function OrchaReadme() {
  return (
    <article className="max-w-2xl space-y-8 px-2 py-8 text-sm text-neutral-300">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-neutral-400">
          Local AI, made accessible for people priced out of frontier models
        </p>
        <p className="leading-relaxed text-neutral-300">
          Orcha is a full-stack chat application that brings persistent
          conversations, live web search, and a production-quality UI to
          locally-run AI models. Inference runs entirely on your machine by
          default. Your conversations, prompts, and responses stay local unless
          you choose otherwise. Built around{" "}
          <a
            href="https://ollama.com/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline"
          >
            Ollama
          </a>{" "}
          and designed for small models that run on a laptop. The capability is
          already there, it just needed the right infrastructure around it.
        </p>
      </div>

      <hr className="border-neutral-700" />

      {/* The Problem */}
      <div className="space-y-3">
        <h2 className="text-base font-medium text-white">The problem</h2>
        <p className="leading-relaxed text-neutral-400">
          Small local models are private, free, and increasingly capable. But
          they ship with fundamental limitations:
        </p>
        <ul className="space-y-2">
          {[
            {
              title: "No memory within a session",
              body: "every message is stateless by default. Without context injection the model doesn't remember what you said two messages ago.",
            },
            {
              title: "No memory between sessions",
              body: "even if you solve the above, nothing persists when you close the app.",
            },
            {
              title: "No access to current information",
              body: "responses are limited to whatever the model was trained on.",
            },
          ].map(({ title, body }) => (
            <li key={title} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500" />
              <span className="text-neutral-400">
                <span className="font-medium text-neutral-200">{title}.</span>{" "}
                {body}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-neutral-400">Orcha fixes all three.</p>
      </div>

      <hr className="border-neutral-700" />

      {/* What It Does */}
      <div className="space-y-3">
        <h2 className="text-base font-medium text-white">What it does</h2>
        <ul className="space-y-2">
          {features.map(({ title, description }) => (
            <li key={title} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500" />
              <span className="text-neutral-400">
                <span className="font-medium text-neutral-200">{title}.</span>{" "}
                {description}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-neutral-700" />

      {/* Stack */}
      <div className="space-y-3">
        <h2 className="text-base font-medium text-white">Stack</h2>
        <div className="flex flex-wrap gap-2">
          {stack.map((item) => (
            <span
              key={item}
              className="rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs text-neutral-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <hr className="border-neutral-700" />

      {/* Recommended Models */}
      <div className="space-y-2">
        <h2 className="text-base font-medium text-white">Recommended models</h2>
        <p className="leading-relaxed text-neutral-400">
          Orcha is built and tested around small models that run on consumer
          hardware.{" "}
          <span className="font-mono text-neutral-300">gemma3:1b</span> is the
          primary target, fast, coherent, and cheap to run. The context
          management is tuned for its limitations. Larger models will work but
          aren't the point. The thesis is that the right infrastructure makes
          small models genuinely competitive with frontier apps for everyday
          use. As small models improve, Orcha's capability grows with them.
        </p>
      </div>

      <hr className="border-neutral-700" />

      {/* Roadmap */}
      <div className="space-y-4">
        <h2 className="text-base font-medium text-white">Roadmap</h2>
        <p className="text-neutral-400">
          Orcha is being built across three distributions, each targeting a
          different audience with a different trust contract.
        </p>
        <div className="space-y-4">
          {distributions.map(({ label, sublabel, status, description }) => (
            <div
              key={label}
              className="rounded-lg border border-neutral-700 bg-neutral-800/40 p-4 space-y-2"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-neutral-500">
                  {label}
                </span>
                <span className="font-medium text-neutral-200">{sublabel}</span>
                <span className="flex items-center gap-1.5 ml-auto">
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${statusColor[status]}`}
                  />
                  <span className="text-xs text-neutral-500">{status}</span>
                </span>
              </div>
              <p className="text-neutral-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
        <p className="text-neutral-400">
          The OSS distributions exist permanently alongside the consumer
          product. The code is open because the privacy claim should be
          verifiable, not just stated.
        </p>
      </div>

      <hr className="border-neutral-700" />

      {/* Architecture Notes */}
      <div className="space-y-3">
        <h2 className="text-base font-medium text-white">Architecture notes</h2>
        <ul className="space-y-3">
          {architectureNotes.map(({ question, answer }) => (
            <li key={question} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500" />
              <span className="text-neutral-400">
                <span className="font-medium text-neutral-200">{question}</span>{" "}
                {answer}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-neutral-700" />

      {/* Status */}
      <div className="space-y-2">
        <h2 className="text-base font-medium text-white">Status</h2>
        <p className="flex items-center gap-2 text-neutral-400">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
          Early alpha. Core chat flow, streaming, web search injection, and
          persistent instances are functional. Electron packaging and installer
          tooling are next. This is Distribution 1. It works. Solo project in
          active development, issues and feedback welcome.
        </p>
      </div>
    </article>
  );
}
