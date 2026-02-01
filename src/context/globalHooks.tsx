"use client";

import { createContext } from "react";

interface Props {
  instanceId: number | undefined;
  setInstanceId: (value: number | undefined) => void;
}

export const globalHooksContext = createContext<Props | undefined>(undefined);
