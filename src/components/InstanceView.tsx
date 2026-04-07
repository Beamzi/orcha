"use client";

import { chatInstanceContext } from "@/context/chatInstances";
import { globalHooksContext } from "@/context/globalHooks";
import React, { useContext, useEffect, useRef } from "react";
import TestRenderSearch from "./TestRenderSearch";
import { chatContext, ChatType } from "@/context/chat";
import remarkGfm from "remark-gfm";

import { createRoot } from "react-dom/client";
import Markdown from "react-markdown";

const markdownRenderer = (response: string | null | undefined) => {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        ul: ({ children }) => (
          <ul className="list-disc pl-6 my-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 my-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="my-1 text-neutral-400">{children}</li>
        ),
        p: ({ children }) => (
          <p className="py-2 text-neutral-100">{children}</p>
        ),
      }}
    >
      {response}
    </Markdown>
  );
};

export default function InstanceView({}) {
  const context = useContext(chatInstanceContext);
  if (!context) throw new Error("context not loaded");
  const { chatInstancesClient, setChatInstancesClient } = context;

  const globalHooks = useContext(globalHooksContext);
  if (!globalHooks) throw new Error("globalHooks not loaded");

  const { instanceId, setInstanceId, tempId, tempInstanceId } = globalHooks;

  const chatHistoryContext = useContext(chatContext);
  if (!chatHistoryContext) throw new Error("context not loaded");

  const { chatHistoryClient, setChatHistoryClient } = chatHistoryContext;

  const selectedInstance = chatInstancesClient.find(
    (instance) => instance.id === instanceId,
  );

  const selectedChat = chatHistoryClient.filter(
    (instance) => instance.instanceId === instanceId,
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistoryClient, selectedInstance?.chatlogs]);

  const chatMarkup = (obj: ChatType) => {
    return (
      <div key={obj.id}>
        <div className="border-b my-5 border-neutral-700">
          <p className="my-5 text-lg text-red-400">{obj.prompt}</p>
        </div>
        <div className="ml-2 my-5">{markdownRenderer(obj.response)}</div>
      </div>
    );
  };
  return (
    <>
      <main className="flex w-[calc(100vw-260px)] px-5 ">
        <div className="flex items-center w-full  flex-col h-screen">
          <div className="relative flex-1 w-full     min-h-0 mb-5 mt-5  ">
            {/* vignette overlays */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-neutral-900 to-transparent z-10 rounded-t-xl"
              style={{ top: "1px", left: "1px", right: "1px" }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-900 to-transparent z-10 rounded-b-xl"
              style={{ bottom: "1px", left: "1px", right: "1px" }}
            />
            <div className="flex flex-col w-full elevated-bg-grad-2 flex-1 w-full h-full px-7 overflow-y-scroll rounded-xl border border-neutral-700 p-2.5">
              {instanceId &&
                selectedInstance?.chatlogs?.map((obj) => chatMarkup(obj))}
              {instanceId ? (
                selectedChat.map((obj, index) => chatMarkup(obj))
              ) : (
                <div>
                  {chatHistoryClient.map(
                    (obj) =>
                      obj.instanceId === tempInstanceId && chatMarkup(obj),
                  )}
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
          <TestRenderSearch instanceId={instanceId} />
        </div>
      </main>
    </>
  );
}
