"use client";
import { LuCircleArrowUp, LuX } from "react-icons/lu";

import { useContext, useEffect, useState } from "react";
import { chatContext } from "@/context/chat";

interface resultProps {
  title: string;
  url: string;
}
const keywords = [
  // Temporal (keep these - they're unambiguous enough)
  "latest",
  "current",
  "now",
  "today",
  "recent",
  "2024",
  "2025",
  "this week",
  "this month",

  // News/updates
  "news",
  "update",
  "updates",
  "live",
  "release",
  "released",
  "announced",
  "announcement",

  // Pricing/shopping
  "price",
  "cost",
  "how much",
  "buy",
  "purchase",
  "review",
  "reviews",

  // Comparisons
  "vs",
  "versus",
  "compare",
  "better",
  "best",

  // Weather
  "weather",
  "forecast",
  "temperature",

  // Identity/factual questions
  "who is",
  "what is",
  "when is",
  "where is",
  "how many",

  // Location/services
  "opening hours",
  "directions",
  "near me",
  "closest",
  "open now",

  // Finance
  "market",
  "stock",
  "crypto",
  "exchange rate",

  // Tech/downloads
  "download",
  "official site",
  "documentation",
  "api docs",

  // Sports/events
  "score",
  "game",
  "match",
  "won",

  // Rankings/lists
  "top",
  "ranking",
];

const checkHeuristics = (query: string) => {
  const q = query.toLowerCase();
  const words = q.split(/\s+/);
  return keywords.some((kw) => {
    if (kw.includes(" ")) {
      return q.includes(kw);
    } else return words.includes(kw);
  });
};

export default function TestRenderSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<resultProps[]>([]);
  const [promptInject, setPromptInject] = useState("");
  const [modelSearchSum, setModelSearchSum] = useState("");
  const [isPromptReady, setIsPromptReady] = useState(false);
  const [modelDirect, setModelDirect] = useState("");

  // const getTempId = () => {
  //   return;
  // };

  let tempId = 36437;
  let tempInstanceId = 36437;

  const chatHistoryContext = useContext(chatContext);
  if (!chatHistoryContext) throw new Error("context not loaded");

  const { chatHistoryClient, setChatHistoryClient } = chatHistoryContext;

  async function getResult() {
    try {
      let request = await fetch("/api/get-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchQuery: searchQuery }),
      });
      const response = await request.json();
      const jsonResponseString = JSON.stringify(
        response.searchResponse.web.results
      );
      setPromptInject(jsonResponseString);
      setSearchResult(response.searchResponse.web.results);
      setIsPromptReady(true);
      setTimeout(() => {
        setIsPromptReady(false);
      }, 10);
    } catch (e) {
      console.error(e);
    }
  }

  async function getModelSearchSum() {
    try {
      console.log("🟢 Summary START:", new Date().toISOString());

      let request = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: "gemma3:1b",
          prompt: `please summarise the following search results'${promptInject}'`,
          stream: false,
        }),
      });
      // console.log(searchResult);
      // console.log(promptInject, "this is console log");
      console.log("🟢 Summary FETCH SENT, waiting for response...");

      let response = await request.json();
      console.log("🟢 Summary END:", new Date().toISOString());

      setModelSearchSum(response.response);
    } catch (e) {
      console.error(e);
    }
  }

  async function getModelDirect() {
    try {
      console.log("🔵 Direct START:", new Date().toISOString());

      const request = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: "gemma3:1b",
          prompt: searchQuery,
          stream: false,
        }),
      });
      console.log("🔵 Direct FETCH SENT, waiting for response...");

      const response = await request.json();
      console.log("🔵 Direct END:", new Date().toISOString());

      setModelDirect(response.response);

      setChatHistoryClient((prev) =>
        prev.map((item) =>
          item.id === tempId
            ? { ...item, id: 3, response: response.response }
            : item
        )
      );
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (isPromptReady) {
      getModelSearchSum();
    }
  }, [isPromptReady]);

  return (
    <div className="flex flex-col h-screen border  ">
      <div className="flex flex-1 min-h-0 overflow-y-scroll border p-2.5 ">
        <div>{modelSearchSum}</div>
        <hr></hr>

        <div>
          {chatHistoryClient.map((item, index) => (
            <div key={index + 1246}>
              <p>{item.prompt}</p>
              <p>{item.response}</p>
            </div>
          ))}
        </div>
      </div>
      <div className=" ">
        <form
          className="h-full w-full flex justify-center px-2.5 py-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            checkHeuristics(searchQuery) === true
              ? getResult()
              : getModelDirect();

            setChatHistoryClient((prev) => [
              ...prev,
              { id: tempId, prompt: searchQuery, instanceId: tempInstanceId },
            ]);

            // if (checkHeuristics(searchQuery) === true) {
            //   getResult();

            //   setModelDirect("");
            // } else {
            //   getModelDirect();
            //   setModelSearchSum("");
            // }
          }}
        >
          <input
            className="border w-full h-full px-5 bg-neutral-800 outline-none"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            placeholder="How Can I Help?"
          ></input>
          <div className="flex flex-col ml-2">
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="p-2.5 border bg-neutral-800 cursor-pointer hover:bg-teal-700 transition-all duration-300 group "
            >
              <LuX className="w-5 h-5 group-hover:scale-120 transition-all duration-300" />
            </button>
            <button
              className={`p-2.5 ${
                searchQuery.length > 0 ? "bg-teal-700" : "bg-neutral-800"
              }  mt-2 border cursor-pointer hover:bg-teal-500 transition-all duration-300 group`}
              type="submit"
            >
              <LuCircleArrowUp className="h-5 w-5 group-hover:scale-120 transition-all duration-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
