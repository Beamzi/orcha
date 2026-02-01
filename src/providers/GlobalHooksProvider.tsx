"use client";

import React, { ReactNode, useState } from "react";

import { globalHooksContext } from "@/context/globalHooks";

interface Props {
  children: ReactNode;
}

export default function GlobalHooksProvider({ children }: Props) {
  const [instanceId, setInstanceId] = useState<number | undefined>(undefined);

  return (
    <globalHooksContext.Provider value={{ instanceId, setInstanceId }}>
      {children}
    </globalHooksContext.Provider>
  );
}
