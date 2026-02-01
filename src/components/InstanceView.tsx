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
  const { instanceId, setInstanceId } = globalHooks;

  const chatHistoryContext = useContext(chatContext);
  if (!chatHistoryContext) throw new Error("context not loaded");
  const { chatHistoryClient, setChatHistoryClient } = chatHistoryContext;

  const selectedInstance = chatInstancesClient.filter(
    (instance) => instance.id === instanceId,
  );

  const selectedChat = chatHistoryClient.filter(
    (instance) => instance.id !== instanceId,
  );
  return (
    <>
      <main onClick={() => console.log(selectedChat)}>
        <div className="flex flex-col h-screen border">
          <div className="flex flex-col flex-1 min-h-0 overflow-y-scroll border p-2.5 ">
            {selectedInstance[0]?.chatlogs.map((obj) => (
              <div key={obj.id}>
                <p>{obj.prompt}</p>
                <p>{obj.response}</p>
              </div>
            ))}
            {/* <div>{modelSearchSum}</div> */}
            <hr></hr>
            {selectedChat.map((item, index) => (
              <div className="flex flex-col" key={item.id}>
                <p>{item.prompt}</p>
                <p>{item.response}</p>
              </div>
            ))}
          </div>
          <TestRenderSearch instanceId={instanceId} />
        </div>
      </main>
    </>
  );
}
