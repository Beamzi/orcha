"use client";

import React, { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

export interface ChatType {
  id: number;
  response?: string | null;
  prompt?: string | null;
  instanceId: number;
}

interface ContextType {
  chatHistoryClient: ChatType[];
  setChatHistoryClient: Dispatch<SetStateAction<ChatType[]>>;
}

export const chatContext = createContext<ContextType | undefined>(undefined);
