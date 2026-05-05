"use client";

import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { checkHeuristics } from "@/lib/checkHeuristics";
import { chatContext } from "@/context/chat";
import { keywords } from "@/data/keywords";
import { LuCircleArrowUp, LuGlobe, LuRefreshCcw, LuX } from "react-icons/lu";
import { ChatType } from "@/context/chat";
import { ChatInstancesType } from "@/context/chatInstances";
import { sessionOrchaContext } from "@/context/session";
import { globalHooksContext } from "@/context/globalHooks";
import { motion } from "motion/react";
import { input, map } from "motion/react-client";
import {
  useChatHistory,
  useGlobalHooks,
  useSessionContext,
} from "@/hooks/context/contextHooks";

interface Props {
  getWebSearch: () => Promise<void>;
  getChatWithContext: () => Promise<void>;
  promptQuery: string;
  setPromptQuery: (value: string) => void;
  instanceId: number | undefined;
  tempId: number;
  tempInstanceId: number;
  setChatInstancesClient: Dispatch<SetStateAction<ChatInstancesType[]>>;
}

const containerVariants = {
  // hover: { scale: 1.5 },
  tap: { scale: 1.5, transition: { duration: 0.2 } },
};

const getInitAnimate = (isSearchModeMemory: boolean) => {
  return {
    initial: false,
    animate: {
      filter: isSearchModeMemory
        ? [
            "hue-rotate(280deg) brightness(1.5)",
            "hue-rotate(0deg) brightness(1)",
          ]
        : ["hue-rotate(0deg) brightness(1)"],
    },
    transition: { duration: 0.7 },
  };
};
export default function PromptBar({
  getWebSearch,
  getChatWithContext,
  promptQuery,
  setPromptQuery,
  instanceId,
  tempId,
  tempInstanceId,
  setChatInstancesClient,
}: Props) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const modeFocus = useRef<HTMLInputElement>(null);

  const { chatHistoryClient, setChatHistoryClient } = useChatHistory();
  const userSession = useSessionContext();
  const authorId = userSession.id;

  const {
    isNoChats,
    setIsNoChats,
    isSearchModeMemory,
    setIsSearchModeMemory,
    webModeSwitch,
    setWebModeSwitch,
    instanceId: selectedInstanceId,
    isNewChatSelected,
  } = useGlobalHooks();

  const [addSpin, setAddSpin] = useState(0);
  const addSpinRef = useRef(addSpin);

  const currentSwitch = webModeSwitch.find(
    (instance) => instance.instanceIdForWeb === selectedInstanceId,
  );

  return (
    <section className="px-5 pt-5 mb-5 rounded-xl border elevated-bg-grad-thin border-neutral-700">
      <form
        className="h-18 w-full flex justify-center p-2   border border-neutral-700 rounded-xl"
        onSubmit={(e) => {
          e.preventDefault();
          setChatHistoryClient((prev) => [
            ...prev,
            {
              id: tempId,
              prompt: promptQuery,
              instanceId: tempInstanceId,
            },
          ]);
          !instanceId &&
            setChatInstancesClient((prev) => [
              ...prev,
              {
                id: tempInstanceId,
                title: promptQuery,
              },
            ]);

          if (currentSwitch?.isWebInUse || isSearchModeMemory) {
            getWebSearch();
          } else {
            getChatWithContext();
          }

          setPromptQuery("");
          setIsSubmitted(true);
          setIsNoChats(false);
          setAddSpin((prev) => (prev += 360));

          setTimeout(() => setIsSubmitted(false), 800);

          // checkHeuristics(promptQuery, keywords) === true
          //   ? getResult()
          //   : getModelDirect();

          //???????????????
          // isNewChatSelected
        }}
      >
        <input
          id="promptInput"
          ref={modeFocus}
          className=" min-h w-full h-full px-5   bg-neutral-800 outline-none rounded-md"
          onChange={(e) => setPromptQuery(e.target.value)}
          value={promptQuery}
          placeholder="How Can I Help?"
        ></input>
        <div className="flex ml-2 h-full">
          {currentSwitch ? (
            <>
              <motion.button
                {...getInitAnimate(!currentSwitch?.isWebInUse)}
                whileTap="tap"
                onClick={() => {
                  if (currentSwitch) {
                    setWebModeSwitch((prev) =>
                      prev.map((item) =>
                        item.instanceIdForWeb === selectedInstanceId
                          ? { ...item, isWebInUse: false }
                          : item,
                      ),
                    );
                  }
                }}
                type="button"
                className={`border group  transition-all duration-200 ${!currentSwitch?.isWebInUse ? "bg-red-400" : "hover:bg-red-900 duration-300 "}  cursor-pointer flex items-center p-3 mr-2 rounded-xl border-neutral-700 min-w-34`}
              >
                <motion.div
                  animate={{
                    rotate: addSpinRef.current !== addSpin ? addSpin : 0,
                    scale: isSubmitted ? 1.2 : 1,
                  }}
                  transition={{ duration: 1 }}
                  className="mr-2 w-5 h-5"
                >
                  <motion.div variants={containerVariants}>
                    <LuRefreshCcw
                      className={`w-full h-full  ${!currentSwitch?.isWebInUse ? "" : "group-hover:scale-110 duration-300 "}  ${isSubmitted && "stroke-red-900  "} transition-all duration-300`}
                    />
                  </motion.div>
                </motion.div>
                Chat Mode
              </motion.button>
              <motion.button
                {...getInitAnimate(currentSwitch?.isWebInUse)}
                whileTap="tap"
                type="button"
                onClick={() => {
                  setWebModeSwitch((prev) =>
                    prev.map((item) =>
                      item.instanceIdForWeb === selectedInstanceId
                        ? {
                            ...item,
                            isWebInUse: item.isWebInUse ? false : true,
                          }
                        : item,
                    ),
                  );
                  setTimeout(() => modeFocus.current?.focus(), 0);
                }}
                className={`cursor-pointer group transition-all  border min-w-49 flex items-center p-3 mr-2 border-neutral-700 rounded-xl ${currentSwitch?.isWebInUse ? "bg-red-400 duration-300" : "hover:bg-red-900 duration-300"}`}
              >
                <motion.div variants={containerVariants}>
                  <LuGlobe
                    className={`mr-2 w-5 h-5 ${currentSwitch?.isWebInUse ? "" : "group-hover:scale-110 duration-300 "}`}
                  />
                </motion.div>
                Web Search Mode
              </motion.button>
            </>
          ) : (
            <>
              <motion.button
                {...getInitAnimate(!isSearchModeMemory)}
                whileTap="tap"
                onClick={() => {
                  setIsSearchModeMemory(false);
                }}
                type="button"
                className={`border group  transition-all duration-200 ${!isSearchModeMemory ? "bg-red-400" : "hover:bg-red-900  duration-300  "}  cursor-pointer flex items-center p-3 mr-2 rounded-xl  border-neutral-700 min-w-34`}
              >
                <motion.div
                  animate={{
                    rotate: addSpinRef.current !== addSpin ? addSpin : 0,
                    scale: isSubmitted ? 1.2 : 1,
                  }}
                  transition={{ duration: 1 }}
                  className="mr-2 w-5 h-5"
                >
                  <motion.div
                    variants={containerVariants}
                    className="w-full h-full"
                  >
                    <LuRefreshCcw
                      className={`w-full tansition-all h-full  ${isSearchModeMemory ? "group-hover:scale-110" : "  "}  ${isSubmitted && "stroke-red-900  "} transition-all duration-300`}
                    />
                  </motion.div>
                </motion.div>
                <p
                  className={`transition-all ${!isSearchModeMemory ? "" : "group-hover:text-red-400 duration-300"}`}
                >
                  Chat Mode
                </p>
              </motion.button>
              <motion.button
                {...getInitAnimate(isSearchModeMemory)}
                whileTap="tap"
                type="button"
                onClick={() => {
                  setIsSearchModeMemory(isSearchModeMemory ? false : true);
                  setTimeout(() => modeFocus.current?.focus(), 0);
                }}
                className={`${!selectedInstanceId && isSearchModeMemory ? "bg-red-400" : ""} cursor-pointer border min-w-49 group transition-all flex items-center p-3 mr-2 border-neutral-700 rounded-xl ${isSearchModeMemory ? "bg-red-400" : "hover:bg-red-900 "}`}
              >
                <motion.div variants={containerVariants}>
                  <LuGlobe
                    className={`mr-2 w-5 h-5 transitiona-all ${isSearchModeMemory ? "" : "group-hover:scale-110 duration-300"} `}
                  />
                </motion.div>
                <p
                  className={`transition-all ${isSearchModeMemory ? "" : "group-hover:text-red-400 duration-300"}`}
                >
                  Web Search Mode
                </p>
              </motion.button>
            </>
          )}
          <button
            className={`p-2 ${
              promptQuery.length > 0 ? "bg-red-900" : ""
            } mr-2 border border-neutral-700 rounded-md cursor-pointer hover:bg-red-400 transition-all duration-300 group`}
            type="submit"
          >
            <LuCircleArrowUp className="h-5 w-5 group-hover:scale-120 transition-all duration-300" />
          </button>
          <button
            type="button"
            onClick={() => setPromptQuery("")}
            className="p-2 border border-neutral-700 rounded-md  cursor-pointer  hover:bg-red-400 transition-all duration-300 group "
          >
            <LuX className="w-5 h-5 group-hover:scale-120 transition-all duration-300" />
          </button>
        </div>
      </form>
      <div className="flex items-center justify-center py-3"></div>
    </section>
  );
}
