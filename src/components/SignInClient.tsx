"use client";
import OrcaIcon from "@/svg/OrcaIcon";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGoogle } from "react-icons/fa";

export function SignInClient() {
  return (
    <main className="w-full h-screen flex justify-center items-center px-80">
      <div
        className="fixed z-1 w-full h-full "
        style={{
          backgroundImage: `url('/canvas/pexels-shottrotter-2249961.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.4,
        }}
      ></div>
      <div className="w-1/2   m-2.5  relative z-100 ">
        <h3 className="text-lg flex items-center border-b mb-5 border p-3 rounded-lg bg-neutral-900/70 border-neutral-500">
          <OrcaIcon color="#f87171" className="ml-1 w-5 h-5 mr-2" />
          Welcome To Orcha
        </h3>
        <div className="border border-neutral-500 p-3 min-h-111.5 rounded-lg bg-neutral-900/70 text-neutral-300">
          <p className="mb-2">
            AI is getting powerful enough to run entirely on your laptop —
            private, free, and offline. The problem? It's still buried in a
            command line that most people will never touch. Orcha changes that.
          </p>
          <p className="mb-2">
            It's a desktop app that wraps locally-run AI models in a clean,
            full-featured interface — persistent chat history, organised
            conversations, and live web search built right in. No cloud. No
            subscription. No data leaving your machine. Built on top of Ollama,
          </p>
          <p>
            Orcha takes the raw power of local AI and makes it genuinely
            accessible to non-technical users. You get the privacy and cost
            benefits of running a model locally, without needing to know what a
            terminal is. We're early stage, but the core is working: chat UI,
            saved conversation history, and real-time web results injected
            directly into the model's context before it responds. Local AI, made
            accessible. That's Orcha.
          </p>
        </div>
      </div>
      <section className="relative bg-neutral-900/70 border border-neutral-500 z-100 w-1/2 h-130 rounded-lg m-2.5 flex justify-center items-center">
        <div className=" flex flex-col align-middle justify-center items-center">
          <button
            className="w-full h-full cursor-pointer flex justify-center items-center"
            onClick={() => signIn("google", { redirectTo: "/dashboard" })}
          >
            <div className="w-25 h-25 p-2 hover:bg-white transition-all duration-300 hover:text-black border border-neutral-500 rounded-xl">
              <FaGoogle className="w-full p-2 h-full hover:-white transition-all duration-300 hover:fill-black" />
            </div>
          </button>
          <button
            className=""
            onClick={() => signIn("google", { redirectTo: "/dashboard" })}
          >
            <h3 className="hover:bg-white transition-all duration-300 hover:text-black flex items-center my-5 p-3 border border-neutral-500  cursor-pointer rounded-lg">
              <FcGoogle className="w-5 h-5 mr-1.5" />
              Sign In With Google
            </h3>
          </button>
        </div>
      </section>
    </main>
  );
}
