"use client";

import React, { useContext, useState } from "react";
import { LuPanelLeftOpen, LuPanelRightOpen, LuPlus } from "react-icons/lu";
import { motion } from "motion/react";
import { chatInstanceContext } from "@/context/chatInstances";
import { globalHooksContext } from "@/context/globalHooks";
import { chatContext } from "@/context/chat";
import { object } from "motion/react-client";

interface Props {
  className: string;
}

export default function Sidebar({ className }: Props) {
  const [expandPanel, setExpandPanel] = useState(true);

  const context = useContext(chatInstanceContext);
  if (!context) throw new Error("context not loaded");

  const { chatInstancesClient, setChatInstancesClient } = context;

  const contextChat = useContext(chatContext);
  if (!contextChat) throw new Error("chats not loaded");

  const { chatHistoryClient, setChatHistoryClient } = contextChat;

  const globalHooks = useContext(globalHooksContext);

  if (!globalHooks) throw new Error("globalHooks not loaded");

  const {
    instanceId,
    setInstanceId,
    forceInstance,
    setForceInstance,
    tempId,
    tempInstanceId,
    setTempId,
    setTempInstanceId,
  } = globalHooks;

  const selectedInstance = chatInstancesClient.find(
    (instance) => instance.id === instanceId,
  );

  async function deleteInstanceAPI(instanceId: number) {
    setChatInstancesClient((prev) =>
      prev.filter((obj) => obj.id !== instanceId),
    );

    setChatHistoryClient((prev) =>
      prev.filter((obj) => obj.instanceId !== instanceId),
    );

    try {
      const request = await fetch("/api/delete-instance", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ instanceId: instanceId }),
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <motion.aside
      initial={{ width: 200 }}
      className={`${className}  bg-neutral-900 h-screen min-w-60 `}
      animate={{ width: expandPanel ? 200 : 50 }}
    >
      {expandPanel ? (
        <div className=" w-full p-5  ">
          <header className="flex w-full flex-1 min-h-0 border-1 p-2 justify-between  border-neutral-700 rounded-xl  bg-neutral-900 items-center">
            <h3 className="">Orcha</h3>
            <div className="flex">
              <button
                onClick={() => {
                  setInstanceId(undefined);
                }}
                className="cursor-pointer mr-1"
              >
                <LuPlus className="w-5 h-5" />
              </button>
              <button
                className=" cursor-pointer"
                onClick={() => {
                  setExpandPanel(expandPanel ? false : true);
                }}
              >
                <LuPanelRightOpen className="w-6 h-6" />
              </button>
            </div>
          </header>
          <section className="p-2 my-5 border w-full rounded-xl min-h-0 h-full flex-1 bg-neutral-900 border-neutral-700">
            <div className="">
              {chatInstancesClient.map((item) => (
                <div className="flex justify-between h-full" key={item.id}>
                  <button
                    className={` cursor-pointer w-full justify-start text-start  ${instanceId === item.id && "bg-red-400"}`}
                    onClick={() => {
                      setInstanceId(item.id);
                      console.log(selectedInstance?.chatlogs);
                    }}
                  >
                    {item.title}
                  </button>
                  <button
                    className="cursor-pointer border  "
                    onClick={() => {
                      deleteInstanceAPI(item.id);
                    }}
                  >
                    x
                  </button>
                  {/* {instanceId} */}
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <motion.div className="w-full h-full flex  ">
          <header className="bg-neutral-900  p-2 border border-neutral-700 rounded-xl">
            <motion.button
              onClick={() => {
                setExpandPanel(expandPanel ? false : true);
              }}
              className=" cursor-pointer"
            >
              {!expandPanel ? <LuPanelLeftOpen className="w-5 h-5" /> : ""}
            </motion.button>
          </header>
          <section className="h-full  "></section>
        </motion.div>
      )}
    </motion.aside>
  );
}
