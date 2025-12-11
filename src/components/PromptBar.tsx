"use client";

import React, { Dispatch, SetStateAction, useContext } from "react";
import { checkHeuristics } from "@/lib/checkHeuristics";
import { chatContext } from "@/context/chat";
import { keywords } from "@/data/keywords";
import { LuCircleArrowUp, LuX } from "react-icons/lu";
import { ChatType } from "@/context/chat";

interface Props {
  getResult: () => Promise<void>;
  getModelDirect: () => Promise<void>;
  promptQuery: string;
  setPromptQuery: (value: string) => void;
}

export default function PromptBar({
  getResult,
  getModelDirect,
  promptQuery,
  setPromptQuery,
}: Props) {
  let tempId = 36437;
  let tempInstanceId = 36437;
  const context = useContext(chatContext);

  if (!context) {
    throw new Error("context not loaded");
  }

  const { chatHistoryClient, setChatHistoryClient } = context;

  return (
    <form
      className="h-full w-full flex justify-center px-2.5 py-2.5 border-1"
      onSubmit={(e) => {
        e.preventDefault();
        checkHeuristics(promptQuery, keywords) === true
          ? getResult()
          : getModelDirect();

        setChatHistoryClient((prev) => [
          ...prev,
          { id: tempId, prompt: promptQuery, instanceId: tempInstanceId },
        ]);
      }}
    >
      <input
        className="border min-h-21 w-full h-full px-5 bg-neutral-800 outline-none"
        onChange={(e) => setPromptQuery(e.target.value)}
        value={promptQuery}
        placeholder="How Can I Help?"
      ></input>
      <div className="flex flex-col ml-2 h-full">
        <button
          type="button"
          onClick={() => setPromptQuery("")}
          className="p-2 border bg-neutral-800 cursor-pointer hover:bg-teal-700 transition-all duration-300 group "
        >
          <LuX className="w-5 h-5 group-hover:scale-120 transition-all duration-300" />
        </button>
        <button
          className={`p-2 ${
            promptQuery.length > 0 ? "bg-teal-700" : "bg-neutral-800"
          }  mt-2 border cursor-pointer hover:bg-teal-500 transition-all duration-300 group`}
          type="submit"
        >
          <LuCircleArrowUp className="h-5 w-5 group-hover:scale-120 transition-all duration-300" />
        </button>
      </div>
    </form>
  );
}
