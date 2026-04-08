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

interface Props {
  getResult: () => Promise<void>;
  getModelDirect: () => Promise<void>;
  getChatWithContextTest: () => Promise<void>;
  promptQuery: string;
  setPromptQuery: (value: string) => void;
  instanceId: number | undefined;
  tempId: number;
  setTempId: Dispatch<SetStateAction<number>>;
  setTempInstanceId: Dispatch<SetStateAction<number>>;
  tempInstanceId: number;
  setChatInstancesClient: Dispatch<SetStateAction<ChatInstancesType[]>>;
}

export default function PromptBar({
  getResult,
  getModelDirect,
  getChatWithContextTest,
  promptQuery,
  setPromptQuery,
  instanceId,
  tempId,
  setTempId,
  setTempInstanceId,
  tempInstanceId,
  setChatInstancesClient,
}: Props) {
  const context = useContext(chatContext);

  if (!context) {
    throw new Error("context not loaded");
  }

  const { chatHistoryClient, setChatHistoryClient } = context;

  const sessionContext = useContext(sessionOrchaContext);
  if (!sessionContext) throw new Error("invalid session");

  const userSession = sessionContext;
  const authorId = userSession.id;

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [addSpin, setAddSpin] = useState(0);
  const addSpinRef = useRef(addSpin);

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
              instanceId: instanceId ? instanceId : tempInstanceId,
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

          // getModelDirect();
          getChatWithContextTest();
          setPromptQuery("");
          setIsSubmitted(true);

          setAddSpin((prev) => (prev += 360));

          setTimeout(() => setIsSubmitted(false), 800);

          // checkHeuristics(promptQuery, keywords) === true
          //   ? getResult()
          //   : getModelDirect();
        }}
      >
        <input
          className=" min-h w-full h-full px-5   bg-neutral-800 outline-none rounded-md"
          onChange={(e) => setPromptQuery(e.target.value)}
          value={promptQuery}
          placeholder="How Can I Help?"
        ></input>
        <div className="flex ml-2 h-full ">
          <button
            className={`p-2 ${
              promptQuery.length > 0 ? "bg-red-400" : ""
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
      <div className="flex items-center justify-center py-3">
        <button
          className={`border bg-red-400  flex p-3 mr-2 rounded-xl border-neutral-700`}
        >
          <motion.div
            animate={{
              rotate: addSpinRef.current !== addSpin ? addSpin : 0,
              scale: isSubmitted ? 1.2 : 1,
            }}
            transition={{ duration: 1 }}
            className="mr-2 w-5 h-5"
          >
            <LuRefreshCcw
              className={`w-full h-full ${isSubmitted && "stroke-red-900"} transition-all duration-300`}
            />
          </motion.div>
          Chat Mode
        </button>
        <button className="border flex p-3 ml-2 border-neutral-700 rounded-xl">
          <LuGlobe className="mr-2 w-5 h-5" />
          Web Search Mode
        </button>
      </div>
    </section>
  );
}
