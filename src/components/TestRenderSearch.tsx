"use client";

import { useEffect, useState } from "react";

interface resultProps {
  title: string;
  url: string;
}
const keywords = [
  "latest",
  "current",
  "now",
  "today",
  "recent",
  "2024",
  "2025",
  "news",
  "update",
  "live",
  "release",
  "price",
  "cost",
  "weather",
  "forecast",
  "who is",
  "what is",
  "when is",
  "where is",
  "opening hours",
  "directions",
  "market",
  "stock",
  "crypto",
  "download",
  "official site",
  "documentation",
  "api docs",
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
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (checkHeuristics(searchQuery) === true) {
            getResult();
            setModelDirect("");
          } else {
            getModelDirect();
            setModelSearchSum("");
          }
        }}
      >
        <input
          className="border"
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>
        <button className="p-5 border cursor-pointer" type="submit">
          Submit
        </button>
      </form>
      <div>{modelSearchSum}</div>
      <hr></hr>

      <div>
        {modelDirect.length < 1500 && modelDirect.length > 10
          ? modelDirect
          : ""}
      </div>
    </div>
  );
}
