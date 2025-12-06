import ChatProvider from "@/providers/ChatProvider";
import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { getChatInstances } from "@/lib/queries/getChat";
import ChatInstancesProvider from "@/providers/ChatInstancesProvider";

interface Props {
  children: ReactNode;
}

export default async function Dashboard({ children }: Props) {
  const chatInstances = await getChatInstances();
  return (
    <ChatProvider>
      <ChatInstancesProvider chatInstances={chatInstances}>
        <div className=" w-full relative">
          <Sidebar className="absolute border h-full bg-neutral-800" />
          <main className="w-full">{children}</main>
        </div>
      </ChatInstancesProvider>
    </ChatProvider>
  );
}
