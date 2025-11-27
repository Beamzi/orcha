"use client";
import React, { useEffect, useState } from "react";

export default function TestRenderPrompt() {
  const [responseContent, setResponseContent] = useState<string>("");
  const [userPrompt, setUserPrompt] = useState("");
  const [searchResults, setSearchResults] = useState();

  async function getSearch() {
    const request = await fetch("/api/get-search");
    const response = await request.json();
  }

  async function getPrompt() {
    let response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:1b",
        prompt: `please condense this quoted prompt into an efficient websearch '${userPrompt}'`,
        stream: false,
      }),
    });

    let result = await response.json();

    setResponseContent(result.response);
    console.log(result);
  }

  // useEffect(() => {
  //   getPrompt();
  // }, []);

  return (
    <div>
      {/* <form
        className="p-5"
        onSubmit={(e) => {
          e.preventDefault();
          getPrompt();
        }}
      >
        <input
          className="border "
          onChange={(e) => setUserPrompt(e.target.value)}
        ></input>
        <button className="border p-5" type="submit">
          submitPrompt
        </button>
      </form> */}
      <div className="p-5">{responseContent}</div>
    </div>
  );
}
