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
    title: "Local model interface",
    description:
      "Chat UI for Ollama-powered models running entirely on your machine.",
  },
  {
    title: "Persistent chat history",
    description: "Conversations are saved and organised into instances.",
  },
  {
    title: "Live web search",
    description:
      "Brave Search API injects real-time results into the model context before responding.",
  },
  {
    title: "No cloud dependency",
    description:
      "Your prompts, responses, and history never leave your machine.",
  },
];

export default function OrchaReadme() {
  return (
    <article className="max-w-2xl space-y-8 px-2 py-8 text-sm text-neutral-300">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-neutral-400">
          Local AI, made accessible for people priced out of frontier models
        </p>
        <p className="leading-relaxed text-neutral-300">
          Orcha is an early-stage desktop chat application that brings a proper
          UI, persistent chat history, and live web search to locally-run AI
          models — no cloud, no subscriptions, no data leaving your machine.
          Built around{" "}
          <a
            href="https://ollama.com/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline"
          >
            Ollama
          </a>
          , Orcha wraps a locally-installed language model in a full-featured
          interface that non-technical users can actually use.
        </p>
      </div>

      <hr className="border-neutral-700" />

      {/* The Problem */}
      <div className="space-y-2">
        <h2 className="text-base font-medium text-white">The problem</h2>
        <p className="leading-relaxed text-neutral-400">
          Small local AI models are powerful, private, and free to run — but
          they're locked behind a command line, have no memory between sessions,
          and no access to current information. Orcha is an attempt to fix that.
        </p>
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
                <span className="font-medium text-neutral-200">{title}</span> —{" "}
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

      {/* Status */}
      <div className="space-y-2">
        <h2 className="text-base font-medium text-white">Status</h2>
        <p className="flex items-center gap-2 text-neutral-400">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
          Early alpha — core chat and search-inject flow are functional.
          Installer tooling and full UI in progress.
        </p>
      </div>
    </article>
  );
}
