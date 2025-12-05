import ChatProvider from "@/providers/ChatProvider";
import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface Props {
  children: ReactNode;
}

export default function Dashboard({ children }: Props) {
  return (
    <ChatProvider>
      <div className=" w-full relative">
        <Sidebar className="absolute border h-full bg-neutral-800" />
        <main className="w-full">{children}</main>
      </div>
    </ChatProvider>
  );
}
