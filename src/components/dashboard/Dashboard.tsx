import ChatProvider from "@/providers/ChatProvider";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Dashboard({ children }: Props) {
  return (
    <div className="">
      <ChatProvider>{children}</ChatProvider>
    </div>
  );
}
