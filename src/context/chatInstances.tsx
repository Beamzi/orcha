"use  client";

import { createContext, Dispatch, SetStateAction } from "react";
import { ChatType } from "./chat";

export interface ChatInstancesType {
  id: number;
  title: string | null;
  chatlogs: ChatType[];
  keywords: string | null;
  authorId: number;
  author: { id: number };
  createdAt: Date;
}

export interface ChatInstancesContextType {
  chatInstancesClient: ChatInstancesType[];
  setChatInstancesClient: Dispatch<SetStateAction<ChatInstancesType[]>>;
}

export const chatInstanceContext =
  createContext<ChatInstancesContextType | null>(null);
