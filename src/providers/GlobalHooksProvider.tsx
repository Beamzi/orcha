"use client";

import React, { ReactNode, useState } from "react";

import { globalHooksContext } from "@/context/globalHooks";
import { WebSearchResultType, WebModeSwitchType } from "@/context/globalHooks";

interface Props {
  children: ReactNode;
}

export default function GlobalHooksProvider({ children }: Props) {
  const [instanceId, setInstanceId] = useState<number | undefined>(undefined);
  //these hardcoded ID's are fine as the DB uses index ID's
  const [tempId, setTempId] = useState<number>(7898576);
  const [tempInstanceId, setTempInstanceId] = useState<number>(2534453);
  const [isNoChats, setIsNoChats] = useState(true);
  const [isSearchModeMemory, setIsSearchModeMemory] = useState(false);
  const [webSearchResult, setwebSearchResult] = useState<WebSearchResultType[]>(
    [],
  );
  const [webModeSwitch, setWebModeSwitch] = useState<WebModeSwitchType[]>([]);
  const [isNewChatSelected, setIsNewChatSelected] = useState(true);

  const [showSignOut, setShowSignOut] = useState(false);

  return (
    <globalHooksContext.Provider
      value={{
        instanceId,
        setInstanceId,
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
        isNewChatSelected,
        setIsNewChatSelected,
        showSignOut,
        setShowSignOut,
      }}
    >
      {children}
    </globalHooksContext.Provider>
  );
}
