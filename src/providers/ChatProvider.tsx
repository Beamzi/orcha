"use client";
import React, { ReactNode, useState } from "react";

import { chatContext } from "@/context/chat";
import { chatHistoryType } from "@/context/chat";

interface Props {
  children: ReactNode;
}

export default function ChatProvider({ children }: Props) {
  const [chatHistoryClient, setChatHistoryClient] = useState<chatHistoryType[]>(
    []
  );
  return (
    <chatContext.Provider value={{ chatHistoryClient, setChatHistoryClient }}>
      {children}
    </chatContext.Provider>
  );
}
