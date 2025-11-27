"use client";

import React, { useEffect, useState } from "react";

interface resultProps {
  title: string;
  url: string;
}

export default function TestRenderSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<resultProps[]>([]);
  const [promptInject, setPromptInject] = useState("");
  const [promptAnswer, setPromptAnswer] = useState("");
  const [isPromptReady, setIsPromptReady] = useState(false);

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
    } catch (e) {
      console.error(e);
    }
  }

  async function getPromptAnswer() {
    try {
      let response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: "gemma3:1b",
          prompt: `please summarise the following search results'${promptInject}'`,
          stream: false,
        }),
      });
      console.log(searchResult);
      console.log(promptInject, "this is console log");

      let result = await response.json();

      setPromptAnswer(result.response);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (isPromptReady) {
      getPromptAnswer();
    }
  }, [isPromptReady]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getResult();
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
      {/* <div>
        {searchResult.map((item) => (
          <p key={item.url}>{item.title}</p>
        ))}
      </div> */}
      <div>{promptAnswer}</div>
    </div>
  );
}
