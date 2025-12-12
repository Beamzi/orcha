"use client";
import PromptBar from "@/components/PromptBar";
import React, { useState } from "react";

export default function StartChat() {
  const [promptQuery, setPromptQuery] = useState("");
  return (
    <div className="">
      <PromptBar promptQuery={promptQuery} />
    </div>
  );
}
