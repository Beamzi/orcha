"use client";

import React, { useState } from "react";

interface resultProps {
  title: string;
  url: string;
}

export default function TestRenderSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<resultProps[]>([]);

  async function getResult() {
    let request = await fetch("/api/get-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ searchQuery: searchQuery }),
    });
    const response = await request.json();
    setSearchResult(response.searchResponse.web.results);
    console.log(response);
  }

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
      <div>
        {searchResult.map((item) => (
          <p key={item.url}>{item.title}</p>
        ))}
      </div>
    </div>
  );
}
