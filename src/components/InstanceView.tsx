"use client";

import { chatInstanceContext } from "@/context/chatInstances";
import { globalHooksContext } from "@/context/globalHooks";
import React, { useContext, useEffect, useRef, useState } from "react";
import TestRenderSearch from "./CoreRequestChain";
import { chatContext, ChatType } from "@/context/chat";
import remarkGfm from "remark-gfm";

import Markdown from "react-markdown";
import OrcaIcon from "@/svg/OrcaIcon";
import { sessionOrchaContext } from "@/context/session";
import { delay, motion } from "motion/react";
import { LuRefreshCcw } from "react-icons/lu";
import CoreRequestChain from "./CoreRequestChain";

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
  const context = useContext(chatInstanceContext);
  if (!context) throw new Error("context not loaded");
  const { chatInstancesClient, setChatInstancesClient } = context;

  const globalHooks = useContext(globalHooksContext);
  if (!globalHooks) throw new Error("globalHooks not loaded");

  const {
    instanceId,
    setInstanceId,
    tempId,
    tempInstanceId,
    isNoChats,
    setIsNoChats,
    isWebSearchMode,
    webSearchResult,
    webModeSwitch,
    setWebModeSwitch,
    setwebSearchResult,
  } = globalHooks;

  const chatHistoryContext = useContext(chatContext);
  if (!chatHistoryContext) throw new Error("context not loaded");

  const { chatHistoryClient, setChatHistoryClient } = chatHistoryContext;

  const usersession = useContext(sessionOrchaContext);
  if (!usersession) throw new Error("session invalid");

  const userFirstName = usersession?.name?.split(" ").shift();

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

  useEffect(() => {
    warmUpRequest();
  }, []);

  const currentSwitch = webModeSwitch.find(
    (instance) => instance.instanceIdForWeb === instanceId,
  );

  const chatMarkup = (obj: ChatType) => {
    return (
      <div key={obj.id}>
        <div className="border-b my-5 border-neutral-700">
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
      <main
        onClick={() => console.log(selectedInstance)}
        className="flex w-[calc(100vw-260px)] px-5 "
      >
        <div className="flex items-center w-full flex-col h-screen">
          <div className="relative flex-1 w-full min-h-0 mb-5 mt-5">
            {/* vignette overlays */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-neutral-900 to-transparent z-10 rounded-t-xl"
              style={{ top: "1px", left: "1px", right: "1px" }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-900 to-transparent z-10 rounded-b-xl"
              style={{ bottom: "1px", left: "1px", right: "1px" }}
            />

            <div className="h-full w-full flex">
              <div className="flex elevated-bg-grad-thin flex-1 w-1/2 h-full px-7 overflow-y-scroll rounded-xl border border-neutral-700 p-2.5">
                <div className={`h-full w-full `}>
                  {instanceId &&
                    selectedInstance?.chatlogs?.map((obj) => chatMarkup(obj))}
                  {instanceId ? (
                    selectedChat.map((obj, index) => chatMarkup(obj))
                  ) : (
                    <>
                      <div className="h-full w-1/2">
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
                              <OrcaIcon color="#d4d4d4" className="w-25 h-25" />
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
              </div>

              {/* ${webSearchResult.length > 0 ? "w-1/2" : "w-20"} */}
              <motion.div
                animate={{
                  width:
                    webSearchResult.length > 0 &&
                    isWebSearchMode &&
                    currentSwitch?.isWebInUse
                      ? "50%"
                      : "80px",
                }}
                className={`flex flex-col  overflow-y-scroll border border-neutral-700 bg-neutral-900  w-20 h-full rounded-xl ml-5`}
              >
                {webSearchResult.length > 0 &&
                  isWebSearchMode &&
                  currentSwitch?.isWebInUse &&
                  webSearchResult.map((item) => {
                    return (
                      <div
                        className="flex-col border-b m-7 border-neutral-700"
                        key={item.title}
                      >
                        <div className="flex items-start">
                          <img
                            className="mr-2 rounded-lg border-neutral-700 bg-neutral-300 h-10 border-2 min-w-10"
                            src={item.profile.img}
                          />
                          <div className="-mt-1">
                            <h3 className="border-b border-neutral-700 pb-2">
                              {item.title}
                            </h3>
                            <div className="flex items-top ">
                              <div
                                className="py-2"
                                dangerouslySetInnerHTML={{
                                  __html: `${item.description}`,
                                }}
                              ></div>
                              {item.thumbnail && (
                                <div className="flex-col mt-3 ml-5">
                                  <img
                                    style={{ objectFit: "cover" }}
                                    className="min-h-20 min-w-30  rounded-lg border border-neutral-700 "
                                    src={item.thumbnail?.src}
                                  ></img>
                                  <p className="pt-1 text-right">
                                    {item.profile.name}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                <p></p>
              </motion.div>
            </div>
          </div>

          <CoreRequestChain instanceId={instanceId} />
        </div>
      </main>
    </>
  );
}
