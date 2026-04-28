import { useState } from "react";
import { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Prereq {
  label: string;
  link?: string;
  suffix?: string;
}

interface EnvVar {
  key: string;
  value: string;
}

interface Step {
  title: string;
  content: ReactNode;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const prereqs: Prereq[] = [
  { label: "Node.js 18+" },
  {
    label: "Ollama",
    link: "https://ollama.com",
    suffix: " installed & running",
  },
  { label: "Neon or Postgres database" },
  { label: "Google OAuth credentials" },
  { label: "Brave Search API key" },
];

const envVars: EnvVar[] = [
  { key: "DATABASE_URL", value: "your_postgres_connection_string" },
  { key: "AUTH_SECRET", value: "your_auth_secret" },
  { key: "AUTH_GOOGLE_ID", value: "your_google_client_id" },
  { key: "AUTH_GOOGLE_SECRET", value: "your_google_client_secret" },
  { key: "BRAVE_API_KEY", value: "your_brave_search_api_key" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TerminalWindowProps {
  lines: string[];
  lang?: string;
}

function TerminalWindow({ lines, lang = "bash" }: TerminalWindowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-2.5 overflow-hidden rounded-xl bg-[#161616]">
      <div className="flex items-center gap-1.5 bg-[#232323] px-3 py-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-auto font-mono text-[11px] text-neutral-600">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className={`rounded border border-neutral-700 px-2 py-0.5 font-mono text-[11px] transition-colors duration-200 ${
            copied ? "text-teal-400" : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          {copied ? "copied!" : "copy"}
        </button>
      </div>
      <div className="px-4 py-3.5 font-mono text-[13px] leading-relaxed">
        {lines.map((line, i) => (
          <div key={i}>
            <span className="select-none text-teal-400">$ </span>
            <span className="text-neutral-200">{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface EnvBlockProps {
  vars: EnvVar[];
}

function EnvBlock({ vars }: EnvBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = vars.map(({ key, value }) => `${key}=${value}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-2.5 overflow-hidden rounded-xl border border-neutral-800 bg-[#111]">
      <div className="flex items-center bg-[#1a1a1a] px-3 py-2">
        <span className="font-mono text-[11px] text-neutral-600">.env</span>
        <button
          onClick={handleCopy}
          className={`ml-auto rounded border border-neutral-800 px-2 py-0.5 font-mono text-[11px] transition-colors duration-200 ${
            copied ? "text-teal-400" : "text-neutral-600 hover:text-neutral-400"
          }`}
        >
          {copied ? "copied!" : "copy"}
        </button>
      </div>
      <div className="px-4 py-3.5 font-mono text-[13px] leading-[1.9]">
        {vars.map(({ key, value }) => (
          <div key={key}>
            <span className="text-violet-300">{key}</span>
            <span className="text-neutral-600">=</span>
            <span className="text-amber-300">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface InlineCodeProps {
  children: ReactNode;
}

function InlineCode({ children }: InlineCodeProps) {
  return (
    <code className="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[12.5px] text-neutral-700">
      {children}
    </code>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const steps: Step[] = [
  {
    title: "Pull the model",
    content: <TerminalWindow lines={["ollama pull gemma3:1b"]} />,
  },
  {
    title: "Clone and install",
    content: (
      <TerminalWindow
        lines={[
          "git clone https://github.com/Beamzi/orcha",
          "cd orcha",
          "npm install",
        ]}
      />
    ),
  },
  {
    title: "Set up environment variables",
    content: (
      <>
        <p className="mb-1 text-[13px] text-neutral-500">
          Create a <InlineCode>.env</InlineCode> file in the project root:
        </p>
        <EnvBlock vars={envVars} />
      </>
    ),
  },
  {
    title: "Run database migrations",
    content: <TerminalWindow lines={["npx prisma migrate deploy"]} />,
  },
  {
    title: "Start the app",
    content: <TerminalWindow lines={["npm run dev"]} />,
  },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function GettingStarted() {
  return (
    <div className="max-w-2xl py-10 font-sans">
      <h1 className="mb-1.5 text-[26px] font-medium ">Getting started</h1>
      <p className="mb-8 border-b border-neutral-100 pb-6 text-sm text-neutral-400">
        Set up and run Orcha locally in five steps.
      </p>

      {/* Prerequisites */}
      <p className="mb-4 text-[11px] font-medium uppercase tracking-widest text-neutral-400">
        Prerequisites
      </p>
      <div className="mb-8 grid grid-cols-2 gap-2">
        {prereqs.map(({ label, link, suffix }) => (
          <div
            key={label}
            className="flex items-center gap-2.5 rounded-lg border border-neutral-100 bg-neutral-50 px-3.5 py-2.5"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
            <span className="text-[13px] text-neutral-700">
              {link ? (
                <>
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 no-underline hover:underline"
                  >
                    {label}
                  </a>
                  {suffix}
                </>
              ) : (
                label
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Installation steps */}
      <p className="mb-5 text-[11px] font-medium uppercase tracking-widest text-neutral-400">
        Installation
      </p>
      <div className="flex flex-col gap-6">
        {steps.map(({ title, content }, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-neutral-200 text-[13px] font-medium text-neutral-400">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-2 text-[15px] font-medium ">{title}</p>
              {content}
            </div>
          </div>
        ))}
      </div>

      {/* Footer callout */}
      <div className="mt-8 rounded-r-lg border-l-2 border-teal-400 bg-teal-50 px-4 py-3 text-[13px] text-neutral-600">
        <strong className="font-medium text-neutral-900">
          You're all set.
        </strong>{" "}
        Visit <InlineCode>http://localhost:3000</InlineCode> and sign in with
        Google to get started.
      </div>
    </div>
  );
}
