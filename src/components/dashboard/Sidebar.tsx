"use client";

import React, { useContext, useState } from "react";
import { LuPanelLeftOpen, LuPanelRightOpen } from "react-icons/lu";
import { motion } from "motion/react";
import { chatInstanceContext } from "@/context/chatInstances";

interface Props {
  className: string;
}

export default function Sidebar({ className }: Props) {
  const [expandPanel, setExpandPanel] = useState(false);

  const context = useContext(chatInstanceContext);
  if (!context) throw new Error("context not loaded");

  const { chatInstancesClient, setChatInstancesClient } = context;

  async function deleteInstanceAPI(instanceId: number) {
    try {
      const request = await fetch("/api/delete-instance", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ instanceId: instanceId }),
      });

      setChatInstancesClient((prev) =>
        prev.filter((obj) => obj.id !== instanceId),
      );
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
            <button
              className="p-2 cursor-pointer"
              onClick={() => {
                setExpandPanel(expandPanel ? false : true);
              }}
            >
              <LuPanelRightOpen className="w-6 h-6" />
            </button>
          </div>
          <div>
            {chatInstancesClient.map((item) => (
              <div className="flex justify-between px-2" key={item.id}>
                <p>{item.title}</p>
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    deleteInstanceAPI(item.id);
                  }}
                >
                  X
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
