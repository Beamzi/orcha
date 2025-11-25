"use client";
import React, { useEffect, useState } from "react";

export default function TestRenderPrompt() {
  const [responseContent, setResponseContent] = useState<string>("");

  async function getPrompt() {
    let response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:1b",
        prompt: "is the sky blue?",
        stream: false,
      }),
    });

    let result = await response.json();

    setResponseContent(result.response);
    console.log(result);
  }

  useEffect(() => {
    getPrompt();
  }, []);

  return <div>{responseContent}</div>;
}
