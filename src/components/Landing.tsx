"use client";

import OrcaIcon from "@/svg/OrcaIcon";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import GettingStarted from "./DevGuide";
import OrchaReadme from "./Readme";

export default function Landing() {
  return (
    <main className="w-full h-screen px-20 flex flex-wrap justify-center items-center ">
      <div
        className="fixed z-1 w-full h-full  "
        style={{
          backgroundImage: `url('/canvas/pexels-shottrotter-2249961.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.4,
        }}
      ></div>
      <div className="w-1/2 min-[1100px]:pr-5 max-[1100px]:w-200 max-h py-5 min-[1100px]:py-15 relative z-100 ">
        <h1 className="text-2xl font-bold w-full flex items-center border-b mb-5 border p-3 rounded-lg bg-neutral-900/70 border-neutral-500">
          <OrcaIcon color="#f87171" className="ml-1 w-5 h-5 mr-2" />
          Orcha
        </h1>
        <div className="border w-full border-neutral-500 overflow-y-auto p-3 rounded-lg bg-neutral-900/70 text-neutral-300 h-111.5">
          <OrchaReadme />
        </div>
      </div>
      <section className="relative overflow-y-auto bg-neutral-900/70 border border-neutral-500 z-100 w-1/2 max-[1100px]:w-200 h-130 rounded-lg px-5">
        <GettingStarted />
      </section>
    </main>
  );
}
