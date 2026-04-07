"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  LuChevronsUpDown,
  LuCirclePlus,
  LuEllipsis,
  LuPanelLeftOpen,
  LuPanelRightOpen,
  LuPlus,
  LuSquarePlus,
} from "react-icons/lu";
import { motion } from "motion/react";
import { chatInstanceContext } from "@/context/chatInstances";
import { globalHooksContext } from "@/context/globalHooks";
import { chatContext } from "@/context/chat";
import { object, select } from "motion/react-client";
import { User } from "next-auth";
import OrcaIcon from "@/svg/OrcaIcon";

//browser wants lowercase sessiondata **don't question it??**
interface Props {
  className: string;
  sessiondata?: User | undefined;
}

export default function Sidebar({ className, sessiondata }: Props) {
  const [expandPanel, setExpandPanel] = useState(true);
  const [openInstanceMenu, setOpenInstanceMenu] = useState(false);
  const [activateNameField, setActivateNameField] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState("");
  const [trueTitle, setTrueTitle] = useState("");
  const [showUserActions, setShowUserActions] = useState(false);

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
    noChats,
    isNoChats,
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

  async function renameChatInstanceAPI() {
    setChatInstancesClient((prev) =>
      prev.map((item) =>
        item.id === instanceId ? { ...item, title: newInstanceName } : item,
      ),
    );
    try {
      const request = await fetch("/api/update-instance", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ title: newInstanceName, id: instanceId }),
      });
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (!newInstanceName) return;
    const timer = setTimeout(() => {
      renameChatInstanceAPI();
    }, 300);

    return () => clearTimeout(timer);
  }, [newInstanceName]);

  return (
    <motion.aside
      initial={{ width: 200 }}
      className={`${className} elevated-bg-grad-vert border flex flex-col justify-between border-neutral-700 rounded-xl mt-5 ml-5 h-[calc(100vh-40px)] min-w-60`}
      animate={{ width: expandPanel ? 200 : 50 }}
    >
      <section>
        {expandPanel ? (
          <div className=" w-full p-5  ">
            <header className="flex w-full flex-1 min-h-0 border-1 p-2 justify-between  border-neutral-700 rounded-xl  bg-neutral-900 items-center">
              <div className="flex justify-center items-center">
                <OrcaIcon color="#f87171" className="ml-1 w-5 h-5 mr-2" />
                <h3 className="">
                  <b>Orcha</b>
                </h3>
              </div>
              <div className="flex">
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    setExpandPanel(expandPanel ? false : true);
                  }}
                >
                  <LuPanelRightOpen className="w-6 h-6" />
                </button>
              </div>
            </header>

            <div className="border border-neutral-700 rounded-xl my-5">
              <button
                onClick={() => {
                  setInstanceId(undefined);
                  isNoChats(true);
                }}
                className="cursor-pointer p-2 flex mr-2 justify-center  align-middle items-center"
              >
                <LuCirclePlus className="w-5 h-5 mr-2 " />
                New Chat
              </button>
            </div>
            <section className="p-2 my-5 border w-full rounded-xl min-h-0 h-full flex-1 bg-neutral-900 border-neutral-700">
              <div className="">
                {chatInstancesClient.map((item) => {
                  return (
                    <div
                      className="flex relative  justify-between h-full"
                      key={item.id}
                    >
                      {activateNameField && instanceId === item.id ? (
                        <input
                          autoFocus={true}
                          placeholder={`${item.title}`}
                          className={`cursor-pointer rounded-md p-1 mr-1 w-full justify-start text-start transition-all duration-200 ${instanceId === item.id && "bg-red-400"}`}
                          value={newInstanceName}
                          onChange={(e) => {
                            setNewInstanceName(
                              instanceId === item.id
                                ? e.target.value
                                : newInstanceName,
                            );
                          }}
                          onClick={() => {
                            setInstanceId(item.id);
                            console.log(selectedInstance?.chatlogs);
                          }}
                        ></input>
                      ) : (
                        <button
                          onClick={() => {
                            isNoChats(false);
                            setActivateNameField(false);
                            setInstanceId(item.id);
                            console.log(selectedInstance?.chatlogs);
                          }}
                          className={`cursor-pointer rounded-md p-1 mr-1 w-full justify-start text-start transition-all duration-200 ${instanceId === item.id && "bg-red-400"}`}
                        >
                          {item.title}
                        </button>
                      )}

                      <button
                        className={`cursor-pointer rounded-md px-1 transitional-all duration-200 ${instanceId === item.id && openInstanceMenu && "bg-red-400"} `}
                        onClick={() => {
                          isNoChats(false);

                          // deleteInstanceAPI(item.id);
                          setInstanceId(item.id);
                          setOpenInstanceMenu(openInstanceMenu ? false : true);
                        }}
                      >
                        <LuEllipsis className={`w-5 h-5 `} />
                      </button>
                      {instanceId === item.id && openInstanceMenu && (
                        <div
                          className={`absolute border  border-neutral-700 top-10 p-2 rounded-xl bg-neutral-900 z-10 -right-2`}
                        >
                          <ul>
                            <li
                              onClick={() => {
                                isNoChats(false);

                                setInstanceId(item.id);
                                setActivateNameField(true);
                                setOpenInstanceMenu(
                                  openInstanceMenu ? false : true,
                                );
                              }}
                              className="hover:bg-red-400 p-2 rounded-md cursor-pointer transition-all duration-200"
                            >
                              Rename Chat
                            </li>

                            <li
                              onClick={() => deleteInstanceAPI(item.id)}
                              className="hover:bg-red-400 p-2 transition-all duration-200 rounded-md cursor-pointer"
                            >
                              Delete Chat
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
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
      </section>

      <section className="border relative border-neutral-700 m-5 rounded-xl bg-neutral-900">
        <div className="p-3 flex justify-between">
          <img
            className="rounded-b-full rounded-t-full w-10 h-10 "
            src={sessiondata?.image ? sessiondata?.image : ""}
          ></img>
          <div className="-ml-5 flex flex-col justify-center">
            <p className="text-sm">{sessiondata?.name}</p>
            <p className="text-neutral-500 text-sm">Free Plan</p>
          </div>
          <button className="ml-2">
            <LuChevronsUpDown
              onClick={() => setShowUserActions(showUserActions ? false : true)}
              className="w-5 h-5 cursor-pointer"
            />
          </button>
          {showUserActions && (
            <div className="absolute border border-neutral-700 -top-5 right-0 z-10 bg-neutral-900 p-2">
              <ul>
                <li>Sign Out</li>
              </ul>
            </div>
          )}
        </div>
      </section>
    </motion.aside>
  );
}
