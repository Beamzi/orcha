"use client";

import { createContext, Dispatch, SetStateAction } from "react";

export interface WebSearchResultType {
  description: string;
  title: string;
  thumbnail: { src: string | undefined };
  profile: { img: string | undefined; name: string | undefined };
  url: string;
}

export interface WebModeSwitchType {
  instanceIdForWeb: number | undefined;
  isWebInUse: boolean;
}

interface Props {
  instanceId: number | undefined;
  setInstanceId: (value: number | undefined) => void;
  forceInstance: boolean;
  setForceInstance: (value: boolean) => void;
  tempId: number;
  tempInstanceId: number;
  setTempId: Dispatch<SetStateAction<number>>;
  setTempInstanceId: Dispatch<SetStateAction<number>>;
  isNoChats: boolean;
  setIsNoChats: (value: boolean) => void;
  isWebSearchMode: boolean;
  setIsWebSearchMode: (value: boolean) => void;
  webSearchResult: WebSearchResultType[];
  setwebSearchResult: Dispatch<SetStateAction<WebSearchResultType[]>>;
  webModeSwitch: WebModeSwitchType[];
  setWebModeSwitch: Dispatch<SetStateAction<WebModeSwitchType[]>>;
}

export const globalHooksContext = createContext<Props | undefined>(undefined);
