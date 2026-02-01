import ChatProvider from "@/providers/ChatProvider";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { getChatInstances } from "@/lib/queries/getChatInstances";
import ChatInstancesProvider from "@/providers/ChatInstancesProvider";
import GlobalHooksProvider from "@/providers/GlobalHooksProvider";

interface Props {
  children: ReactNode;
}

export default async function Dashboard({ children }: Props) {
  const chatInstances = await getChatInstances();
  return (
    <ChatProvider>
      <ChatInstancesProvider chatInstances={chatInstances}>
        <GlobalHooksProvider>
          <Sidebar className="absolute border h-full bg-neutral-800"></Sidebar>
          <main>{children}</main>
        </GlobalHooksProvider>
      </ChatInstancesProvider>
    </ChatProvider>
  );
}
