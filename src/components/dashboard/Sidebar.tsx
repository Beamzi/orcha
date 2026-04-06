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
  const [expandPanel, setExpandPanel] = useState(false);

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
      initial={{ width: 50 }}
      className={`${className} origin-left`}
      animate={{ width: expandPanel ? 200 : 50 }}
    >
      {expandPanel ? (
        <div className="border- w-full ">
          <div className="flex w-full border justify-between items-center">
            <h3 className="p-2">Orcha</h3>
            <div>
              <button
                onClick={() => {
                  setInstanceId(undefined);
                }}
                className="cursor-pointer"
              >
                <LuPlus className="w-5 h-5" />
              </button>
              <button
                className="p-2 cursor-pointer"
                onClick={() => {
                  setExpandPanel(expandPanel ? false : true);
                }}
              >
                <LuPanelRightOpen className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="">
            {chatInstancesClient.map((item) => (
              <div className="flex justify-between" key={item.id}>
                <button
                  className={`px-2 cursor-pointer w-full justify-start text-start  ${instanceId === item.id && "bg-red-400"}`}
                  onClick={() => {
                    setInstanceId(item.id);
                    console.log(selectedInstance?.chatlogs);
                  }}
                >
                  {item.title}
                </button>
                <button
                  className="cursor-pointer px-1 border  "
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
        </div>
      ) : (
        <motion.div className="w-full h-full  ">
          <div className="">
            <motion.button
              onClick={() => {
                setExpandPanel(expandPanel ? false : true);
              }}
              className="p-2 cursor-pointer"
            >
              {!expandPanel ? <LuPanelLeftOpen className="w-6 h-6" /> : ""}
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
}
