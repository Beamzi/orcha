import ChatProvider from "@/providers/ChatProvider";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { getChatInstances } from "@/lib/queries/getChatInstances";
import ChatInstancesProvider from "@/providers/ChatInstancesProvider";
import GlobalHooksProvider from "@/providers/GlobalHooksProvider";
import { auth } from "../../../auth";
import SessionProvider from "@/providers/SessionProvider";

interface Props {
  children: ReactNode;
}

export default async function Dashboard({ children }: Props) {
  const session = await auth();

  const chatInstances = await getChatInstances();
  return (
    <SessionProvider userSession={session?.user}>
      <ChatProvider>
        <ChatInstancesProvider chatInstances={chatInstances}>
          <GlobalHooksProvider>
            <div className="flex">
              <Sidebar className="" sessiondata={session?.user}></Sidebar>
              <main>{children}</main>
            </div>
          </GlobalHooksProvider>
        </ChatInstancesProvider>
      </ChatProvider>
    </SessionProvider>
  );
}
