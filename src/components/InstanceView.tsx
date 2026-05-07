"use client";

import { globalHooksContext, WebSearchResultType } from "@/context/globalHooks";
import React, { useContext, useEffect, useRef, useState } from "react";
import TestRenderSearch from "./CoreRequestChain";
import { chatContext, ChatType } from "@/context/chat";
import remarkGfm from "remark-gfm";

import Markdown from "react-markdown";
import OrcaIcon from "@/svg/OrcaIcon";
import { delay, motion, useReducedMotion } from "motion/react";
import { LuRefreshCcw } from "react-icons/lu";
import CoreRequestChain from "./CoreRequestChain";
import {
  useChatHistory,
  useGlobalHooks,
  useInstances,
  useSessionContext,
} from "@/hooks/context/contextHooks";
import {
  getViewportRevealVariants,
  defaultViewport,
} from "@/lib/viewport-reveal";

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

async function warmUpRequest() {
  try {
    const request = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:1b",
        prompt: "getting warmer",
        stream: false,
      }),
    });
  } catch (e) {
    console.error(e);
  }
}

export default function InstanceView({}) {
  const { chatInstancesClient, setChatInstancesClient } = useInstances();
  const { chatHistoryClient, setChatHistoryClient } = useChatHistory();
  const prefersReducedMotion = useReducedMotion();
  const { container: containerVariants, item: itemVariants } =
    getViewportRevealVariants(prefersReducedMotion);

  const {
    instanceId,
    tempInstanceId,
    isNoChats,
    webSearchResult,
    webModeSwitch,
    isStreaming,
    setIsStreaming,
    isNewChatSelected,
    setIsNewChatSelected,
    isSearchModeMemory,
  } = useGlobalHooks();

  const userSession = useSessionContext();

  const userFirstName = userSession?.name?.split(" ").shift();

  const selectedInstance = chatInstancesClient.find(
    (instance) => instance.id === instanceId,
  );

  const selectedChat = chatHistoryClient.filter(
    (instance) => instance.instanceId === instanceId,
  );

  const streamingChat = chatHistoryClient.filter(
    (chat) => chat.instanceId === tempInstanceId,
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistoryClient, selectedInstance?.chatlogs]);

  useEffect(() => {
    warmUpRequest();
  }, []);

  const currentSwitch = webModeSwitch.find(
    (instance) => instance.instanceIdForWeb === instanceId,
  );

  const getOverlay = (top: string, bottom: string) => {
    const shared =
      "pointer-events-none absolute inset-x-0  h-16  from-neutral-900 to-transparent z-10";
    return (
      <>
        <div
          className={`${shared} ${top} `}
          style={{ top: "1px", left: "1px", right: "1px" }}
        />
        <div
          className={`${shared} ${bottom} `}
          style={{ bottom: "1px", left: "1px", right: "1px" }}
        />
      </>
    );
  };

  const searchResultMarkup = (obj: WebSearchResultType, index: number) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        className="flex-col border-b m-7 border-neutral-800"
        key={obj.title}
      >
        <div className="flex items-start">
          <img
            className="mr-2 rounded-lg border-neutral-700 bg-neutral-300 h-10 border-2 min-w-10"
            src={obj.profile.img}
          />
          <div className="-mt-1">
            <h3 className="border-b border-neutral-800 pb-2">{obj.title}</h3>
            <div className="flex items-top ">
              {/* Brave API returns pre-formatted HTML in description field */}
              <div
                className="py-2"
                dangerouslySetInnerHTML={{
                  __html: `${obj.description}`,
                }}
              ></div>
              {obj.thumbnail && (
                <div className="flex-col mt-3 ml-5">
                  <img
                    style={{ objectFit: "cover" }}
                    className="min-h-20 min-w-30  rounded-lg border border-neutral-700 "
                    src={obj.thumbnail?.src}
                  ></img>
                  <p className="pt-1 text-right">{obj.profile.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const chatMarkup = (obj: ChatType) => {
    return (
      <div className="" key={obj.id}>
        <div className="border-b my-5 border-neutral-800">
          <p className="my-5 text-lg text-red-400">{obj.prompt}</p>
        </div>
        {!obj.response ? (
          <motion.div
            className="ml-2 w-5 h-5 "
            animate={{ rotate: [0, 720] }}
            transition={{ duration: 2 }}
          >
            <LuRefreshCcw className="w-full h-full stroke-neutral-300" />
          </motion.div>
        ) : (
          <div className="ml-2 my-5">{markdownRenderer(obj.response)}</div>
        )}
      </div>
    );
  };

  return (
    <>
      <main className="flex w-[calc(100vw-260px)] px-5 ">
        <div className="flex items-center w-full flex-col h-screen">
          <div className="relative flex-1 w-full min-h-0 mb-5 mt-5">
            <div className="h-full w-full flex">
              <div className="w-full h-full relative flex-1 p-2 elevated-bg-grad-thin border-neutral-700 border rounded-xl">
                {getOverlay(
                  "top-0 bg-gradient-to-b rounded-t-xl",
                  "bottom-0 bg-gradient-to-t rounded-b-xl",
                )}
                <motion.div
                  className={`flex elevated-bg-grad-thin   h-full px-7  overflow-y-scroll  p-2.5`}
                >
                  <div className={`h-full w-full `}>
                    {instanceId &&
                      selectedInstance?.chatlogs?.map((obj) => chatMarkup(obj))}
                    {instanceId ? (
                      <>
                        <div className="">
                          {selectedChat.map((obj, index) => (
                            <div className="" key={obj.id}>
                              {chatMarkup(obj)}
                            </div>
                          ))}
                          {chatHistoryClient.map(
                            (obj) =>
                              obj.instanceId === tempInstanceId &&
                              chatMarkup(obj),
                          )}
                        </div>
                        <div className="pb-2"></div>
                        {!isStreaming && <div className="pb-20"></div>}
                      </>
                    ) : (
                      <>
                        <div className="h-full w-full">
                          {isNoChats ? (
                            <div className="flex flex-col justify-center items-center w-full h-full">
                              <motion.p
                                animate={{ opacity: [0, 1] }}
                                transition={{ duration: 0.8 }}
                                className="text-xl pb-2"
                              >{`Hi ${userFirstName}, shall we get started?`}</motion.p>
                              <motion.div
                                animate={{ opacity: [0, 1] }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className=""
                              >
                                <OrcaIcon
                                  color="#d4d4d4"
                                  className="w-25 h-25"
                                />
                              </motion.div>
                            </div>
                          ) : (
                            chatHistoryClient.map(
                              (obj) =>
                                obj.instanceId === tempInstanceId &&
                                chatMarkup(obj),
                            )
                          )}
                        </div>
                      </>
                    )}

                    <div ref={bottomRef} />
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ width: "80px" }}
                animate={{
                  width:
                    (webSearchResult.length > 0 && currentSwitch?.isWebInUse) ||
                    (!currentSwitch &&
                      webSearchResult.length > 0 &&
                      isSearchModeMemory)
                      ? "50%"
                      : "80px",
                }}
                className={`flex flex-col elevated-bg-grad-vert overflow-hidden h-full ml-5  relative border border-neutral-700 rounded-xl`}
              >
                <div className="p-2 h-full flex flex-col">
                  {getOverlay(
                    "top-0 bg-gradient-to-b rounded-t-xl",
                    "bottom-0 bg-gradient-to-t  rounded-b-xl",
                  )}
                  <div
                    className="w-full h-full 
                  flex flex-col overflow-y-scroll"
                  >
                    {isNewChatSelected}
                    {webSearchResult.length > 0 &&
                      currentSwitch?.isWebInUse &&
                      webSearchResult.map((obj, index) => {
                        return searchResultMarkup(obj, index);
                      })}
                    {!currentSwitch &&
                      webSearchResult.length > 0 &&
                      isSearchModeMemory &&
                      webSearchResult.map((obj, index) => {
                        return searchResultMarkup(obj, index);
                      })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <CoreRequestChain instanceId={instanceId} />
        </div>
      </main>
    </>
  );
}
