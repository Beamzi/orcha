"use client";

import { createContext, Dispatch, SetStateAction } from "react";

interface Props {
  instanceId: number | undefined;
  setInstanceId: (value: number | undefined) => void;
  forceInstance: boolean;
  setForceInstance: (value: boolean) => void;
  tempId: number;
  tempInstanceId: number;
  setTempId: Dispatch<SetStateAction<number>>;
  setTempInstanceId: Dispatch<SetStateAction<number>>;
}

export const globalHooksContext = createContext<Props | undefined>(undefined);
