"use client";

import React, { Dispatch, SetStateAction } from "react";
import { createContext } from "react";

export interface chatHistoryType {
  id?: string;
  model?: string;
  user?: string;
}

interface contextType {
  chatHistoryClient: chatHistoryType[];
  setChatHistoryClient: Dispatch<SetStateAction<chatHistoryType[]>>;
}

export const chatContext = createContext<contextType | undefined>(undefined);
