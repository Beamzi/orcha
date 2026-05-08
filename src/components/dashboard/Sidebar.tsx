"use client";

import { useEffect, useRef, useState } from "react";
import {
  LuChevronsUpDown,
  LuCirclePlus,
  LuEllipsis,
  LuPanelLeftOpen,
} from "react-icons/lu";
import { motion } from "motion/react";
import { User } from "next-auth";
import OrcaIcon from "@/svg/OrcaIcon";
import {
  useChatHistory,
  useGlobalHooks,
  useInstances,
} from "@/hooks/context/contextHooks";
import { getInitAnimate } from "@/lib/init-animate";
import { tapVariants } from "@/lib/init-animate";
import { createPortal } from "react-dom";
import { signOut } from "next-auth/react";

interface Props {
  className: string;
  sessiondata?: User | undefined;
}

export default function Sidebar({ className, sessiondata }: Props) {
  const [expandPanel, setExpandPanel] = useState(true);
  const [openInstanceMenu, setOpenInstanceMenu] = useState(false);
  const [activateNameField, setActivateNameField] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState("");
  const [showUserActions, setShowUserActions] = useState(false);
  const { chatInstancesClient, setChatInstancesClient } = useInstances();
  const { setChatHistoryClient } = useChatHistory();
  const {
    instanceId,
    setInstanceId,
    setIsNoChats,
    setWebModeSwitch,
    setIsNewChatSelected,
    showSignOut,
    setShowSignOut,
  } = useGlobalHooks();

  const [clickPos, setClickPos] = useState(0);
  const chatInstancesReversed = [...chatInstancesClient].reverse();
  const switches = chatInstancesClient
    .map((instance) => [{ instanceIdForWeb: instance.id, isWebInUse: false }])
    .flat();

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!newInstanceName) return;
    const timer = setTimeout(() => {
      renameChatInstanceAPI();
    }, 300);

    return () => clearTimeout(timer);
  }, [newInstanceName]);

  useEffect(() => {
    setWebModeSwitch(switches);
  }, []);

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

  return (
    <motion.aside
      initial={{ width: 200 }}
      className={`${className} elevated-bg-grad-vert border relative flex flex-col justify-between border-neutral-700 rounded-xl mt-5 ml-5 h-[calc(100vh-40px)] min-w-70`}
      animate={{ width: expandPanel ? 200 : 50 }}
    >
      <section className="">
        {expandPanel ? (
          <div className=" w-full p-5  ">
            <header className="flex w-full flex-1 min-h- border p-3.5 justify-between  border-neutral-700 rounded-xl  bg-neutral-900 items-center">
              <div className="flex justify-center items-center max-h-20 min-h-5">
                <OrcaIcon color="#f87171" className="ml-1 w-5 h-5 mr-2" />
                <h3 className="text-xl">
                  <b>Orcha</b>
                </h3>
              </div>
              <div className="flex"></div>
            </header>
            <div className=" my-5 ">
              <motion.button
                {...getInitAnimate(!instanceId)}
                whileTap="tap"
                onClick={() => {
                  setIsNewChatSelected(true);
                  setInstanceId(undefined);
                  setIsNoChats(true);
                }}
                className={`cursor-pointer group p-2 transition-all duration-200 border border-neutral-700 rounded-xl h-full  w-full flex mr-2 justify-left align-middle items-center`}
              >
                <div
                  className={`flex transition-all items-center p-2 rounded-lg w-full ${!instanceId ? "bg-red-400 " : "hover:bg-red-900 duration-300"} `}
                >
                  <motion.div
                    variants={tapVariants}
                    className="flex items-center"
                  >
                    <LuCirclePlus className="w-5 h-5  mr-2 ml-0.5 " />
                  </motion.div>
                  <p
                    className={` transition-all ${!instanceId ? "" : "group-hover:text-red-400 duration-300"}`}
                  >
                    New Chat
                  </p>
                </div>
              </motion.button>
            </div>
            {chatInstancesClient.length > 0 && (
              <section className=" py-2 border  w-full rounded-xl  h-full  bg-neutral-900 border-neutral-700">
                <div
                  className={`overflow-y-auto max-h-[calc(100vh-340px)] ${chatInstancesClient.length > 10 && "mr-2"}`}
                >
                  {chatInstancesReversed.map((item, index) => {
                    return (
                      <div
                        ref={menuRef}
                        className={`flex ${index > 0 ? "mt-2" : ""} mx-2  transition-all duration-200 text-neutral-350 rounded-md ${instanceId === item.id ? "bg-red-400" : "hover:bg-red-900"} relative justify-between h-full`}
                        key={item.id}
                      >
                        {activateNameField && instanceId === item.id ? (
                          <input
                            onKeyDown={(e) =>
                              e.key === "Enter" && setActivateNameField(false)
                            }
                            autoFocus={true}
                            placeholder={`${item.title}`}
                            className={`cursor-pointer rounded-md bg-neutral-900 p-1 mr-1 w-full justify-start text-start transition-all duration-200 ${instanceId === item.id && ""}`}
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
                            }}
                          ></input>
                        ) : (
                          <button
                            id={`instance${index}`}
                            onClick={() => {
                              setIsNoChats(false);
                              setActivateNameField(false);
                              setInstanceId(item.id);
                            }}
                            className={`cursor-pointer rounded-md p-1 pl-2 mr-1  truncate w-full justify-start text-start transition-all duration-200 ${instanceId === item.id && "bg-red-400"}`}
                          >
                            {item.title}
                          </button>
                        )}

                        <button
                          className={`cursor-pointer rounded-md px-1 transitional-all   duration-200 ${instanceId === item.id && openInstanceMenu && " "} `}
                          onClick={(e) => {
                            setIsNoChats(false);
                            setClickPos(e.clientY);
                            // deleteInstanceAPI(item.id);
                            setInstanceId(item.id);
                            setOpenInstanceMenu(
                              openInstanceMenu ? false : true,
                            );
                          }}
                        >
                          <LuEllipsis
                            className={`w-5 h-5 hover:scale-120 transitional-all duration-200 `}
                          />
                        </button>
                        {instanceId === item.id &&
                          openInstanceMenu &&
                          createPortal(
                            <div
                              style={{ top: clickPos - 20, left: 248 }}
                              className={`absolute border  border-neutral-700 w-50 p-2 rounded-xl bg-neutral-900 z-100 -right-2`}
                            >
                              <ul>
                                <li
                                  onClick={() => {
                                    setIsNoChats(false);
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
                                  onClick={() => {
                                    setIsNewChatSelected(false);
                                    setInstanceId(undefined);
                                    setOpenInstanceMenu(
                                      openInstanceMenu ? false : true,
                                    );
                                    deleteInstanceAPI(item.id);
                                    setIsNoChats(true);
                                  }}
                                  className="hover:bg-red-400 p-2 transition-all duration-200 rounded-md cursor-pointer"
                                >
                                  Delete Chat
                                </li>
                              </ul>
                            </div>,
                            document.body,
                          )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
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
            <section className="h-full"></section>
          </motion.div>
        )}
      </section>
      <section
        className={`border absolute bottom-0 w-[calc(280px-43px)] border-neutral-700 my-5 ml-5 rounded-xl bg-neutral-900`}
      >
        <div className="p-3 flex justify-between">
          <img
            className="rounded-b-full rounded-t-full w-10 h-10 "
            src={sessiondata?.image ? sessiondata?.image : ""}
          ></img>
          <div className="-ml-13 flex flex-col justify-center">
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
            <div className="absolute  -top-10 -right-2 z-10  ">
              <ul>
                <li
                  className="cursor-pointer transition-all duration-200 bg-neutral-900 hover:bg-red-900 p-3 border border-neutral-700  rounded-xl"
                  onClick={() => {
                    setShowSignOut(showSignOut ? false : true);
                    setShowUserActions(false);
                  }}
                >
                  Sign Out
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>
      {showSignOut && (
        <div className="fixed m-0 -translate-1/2 top-1/2 left-1/2 shadow-2xl bg-neutral-900 border boeder-neutral-700 rounded-xl  z-1000 p-10 min-w-100 flex flex-col items-center justify-center ">
          <h3>Are you sure you want to sign out?</h3>
          <button
            className="border cursor-pointer transition-all duration-200 hover:bg-red-900 border-neutral-700 bg-neutral-900 p-3 rounded-xl m-2"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>
      )}
    </motion.aside>
  );
}
