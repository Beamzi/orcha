"use client";

import React, { ReactNode, useState } from "react";

import { globalHooksContext } from "@/context/globalHooks";

interface Props {
  children: ReactNode;
}

export default function GlobalHooksProvider({ children }: Props) {
  const [instanceId, setInstanceId] = useState<number | undefined>(undefined);

  const [forceInstance, setForceInstance] = useState(false);

  // const [tempId, setTempId] = useState<number>(() =>
  //   Math.floor(Math.random() * 15204),
  // );
  // const [tempInstanceId, setTempInstanceId] = useState<number>(() =>
  //   Date.now(),
  // );

  const [tempId, setTempId] = useState<number>(7898576);
  const [tempInstanceId, setTempInstanceId] = useState<number>(2534453);
  const [noChats, isNoChats] = useState(false);

  return (
    <globalHooksContext.Provider
      value={{
        instanceId,
        setInstanceId,
        forceInstance,
        setForceInstance,
        tempId,
        tempInstanceId,
        setTempId,
        setTempInstanceId,
        noChats,
        isNoChats,
      }}
    >
      {children}
    </globalHooksContext.Provider>
  );
}
