"use client";

import { chatContext } from "@/context/chat";
import { chatInstanceContext } from "@/context/chatInstances";
import { globalHooksContext } from "@/context/globalHooks";
import { sessionOrchaContext } from "@/context/session";
import { useContext } from "react";

export function useSessionContext() {
  const sessionContext = useContext(sessionOrchaContext);
  if (!sessionContext) throw new Error("invalid session");
  //   const userSession = sessionContext;
  return sessionContext;
}

export function useChatHistory() {
  const chatHistoryContext = useContext(chatContext);
  if (!chatHistoryContext) throw new Error("chats not loaded");
  return chatHistoryContext;
}

export function useGlobalHooks() {
  const globalHooks = useContext(globalHooksContext);
  if (!globalHooks) throw new Error("globals not loaded");
  return globalHooks;
}

export function useInstances() {
  const instanceContext = useContext(chatInstanceContext);
  if (!instanceContext) throw new Error("instance content not loaded");
  return instanceContext;
}
