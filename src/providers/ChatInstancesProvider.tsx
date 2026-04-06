"use client";

import { chatInstanceContext } from "@/context/chatInstances";
import { ReactNode, useState } from "react";
import { ChatInstancesType } from "@/context/chatInstances";

interface Props {
  chatInstances: ChatInstancesType[];
  children: ReactNode;
}

export default function ChatInstancesProvider({
  chatInstances,
  children,
}: Props) {
  const [chatInstancesClient, setChatInstancesClient] =
    useState<ChatInstancesType[]>(chatInstances);
  return (
    <chatInstanceContext.Provider
      value={{ chatInstancesClient, setChatInstancesClient }}
    >
      {children}
    </chatInstanceContext.Provider>
  );
}
