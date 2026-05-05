"use client";

import React, { ReactNode, useState } from "react";

import { globalHooksContext } from "@/context/globalHooks";
import { WebSearchResultType, WebModeSwitchType } from "@/context/globalHooks";

interface Props {
  children: ReactNode;
}

export default function GlobalHooksProvider({ children }: Props) {
  const [instanceId, setInstanceId] = useState<number | undefined>(undefined);
  const [forceInstance, setForceInstance] = useState(false);
  const [tempId, setTempId] = useState<number>(7898576);
  const [tempInstanceId, setTempInstanceId] = useState<number>(2534453);
  const [isNoChats, setIsNoChats] = useState(true);
  const [isSearchModeMemory, setIsSearchModeMemory] = useState(false);
  const [webSearchResult, setwebSearchResult] = useState<WebSearchResultType[]>(
    [],
  );

  const [webModeSwitch, setWebModeSwitch] = useState<WebModeSwitchType[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [isNewChatSelected, setIsNewChatSelected] = useState(true);

  // const [tempId, setTempId] = useState<number>(() =>
  //   Math.floor(Math.random() * 15204),
  // );
  // const [tempInstanceId, setTempInstanceId] = useState<number>(() =>
  //   Date.now(),
  // );

  return (
    <globalHooksContext.Provider
      value={{
        instanceId,
        setInstanceId,
        forceInstance,
        setForceInstance,
        tempId,
        tempInstanceId,
        setTempId,
        setTempInstanceId,
        isNoChats,
        setIsNoChats,
        isSearchModeMemory,
        setIsSearchModeMemory,
        webSearchResult,
        setwebSearchResult,
        webModeSwitch,
        setWebModeSwitch,
        isStreaming,
        setIsStreaming,
        isNewChatSelected,
        setIsNewChatSelected,
      }}
    >
      {children}
    </globalHooksContext.Provider>
  );
}
