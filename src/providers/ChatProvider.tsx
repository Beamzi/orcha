"use client";
import React, { ReactNode, useState } from "react";

import { chatContext } from "@/context/chat";
import { ChatType } from "@/context/chat";

interface Props {
  children: ReactNode;
}

export default function ChatProvider({ children }: Props) {
  const [chatHistoryClient, setChatHistoryClient] = useState<ChatType[]>([]);
  return (
    <chatContext.Provider value={{ chatHistoryClient, setChatHistoryClient }}>
      {children}
    </chatContext.Provider>
  );
}
