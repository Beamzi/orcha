"use client";
import PromptBar from "@/components/PromptBar";
import TestRenderSearch from "@/components/TestRenderSearch";
import React, { useState } from "react";

export default function StartChat() {
  const [promptQuery, setPromptQuery] = useState("");
  return (
    <div className="">
      <TestRenderSearch />
    </div>
  );
}
