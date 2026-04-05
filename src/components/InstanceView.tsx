"use client";

import { chatInstanceContext } from "@/context/chatInstances";
import { globalHooksContext } from "@/context/globalHooks";
import React, { useContext } from "react";
import TestRenderSearch from "./TestRenderSearch";
import { chatContext } from "@/context/chat";

// interface Props {
//   instanceId: number | undefined;
//   setInstanceId: (value: number | undefined) => void;
// }

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

  // const selectedInstance = chatInstancesClient.filter(
  //   (instance) => instance.id === instanceId,
  // );

  const selectedInstance = chatInstancesClient.find(
    (instance) => instance.id === instanceId,
  );

  const selectedChat = chatHistoryClient.filter(
    (instance) => instance.instanceId === instanceId,
  );

  return (
    <>
      <main className="flex justify-center items-center">
        <div className="flex items-center max-w-1/2 min-w-1/2 flex-col h-screen border">
          <div className="flex flex-col flex-1 w-full min-h-0 overflow-y-scroll border p-2.5">
            {instanceId &&
              selectedInstance?.chatlogs.map((obj) => (
                <div key={obj.id}>
                  <p>{obj.prompt}</p>
                  <p>{obj.response}</p>
                </div>
              ))}
            {/* <div>{modelSearchSum}</div> */}
            <hr></hr>
            {instanceId ? (
              selectedChat.map((item, index) => (
                <div className="flex flex-col" key={item.id}>
                  <p>{item.prompt}</p>
                  <p>{item.response}</p>
                </div>
              ))
            ) : (
              <div>
                {chatHistoryClient.map(
                  (item) =>
                    item.instanceId === tempInstanceId && (
                      <div key={item.id + 55}>
                        <p>{item.prompt}</p>
                        <p>{item.response}</p>
                      </div>
                    ),
                )}
              </div>
            )}
          </div>
          <TestRenderSearch instanceId={instanceId} />
        </div>
      </main>
    </>
  );
}

// chatHistoryClient
//                     .filter(
//                       (chat) => chat.instanceId !== tempInstanceId
//                     )
//                     .map((item) => (
//                       <div key={item.id + 1}>
//                         <p>{item.prompt}</p>
//                         <p>{item.response}</p>
//                       </div>
//                     ))
