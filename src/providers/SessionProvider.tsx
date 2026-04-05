"use client";
import { sessionOrchaContext } from "@/context/session";

import { User } from "next-auth";
import React, { ReactNode } from "react";

interface sessionAndChildren {
  userSession: User | undefined;
  children: ReactNode;
}

export default function SessionProvider({
  userSession,
  children,
}: sessionAndChildren) {
  return (
    <sessionOrchaContext.Provider value={userSession}>
      {children}
    </sessionOrchaContext.Provider>
  );
}
