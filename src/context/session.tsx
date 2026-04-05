"use client";

import { createContext } from "react";
import { User } from "next-auth";

export const sessionOrchaContext = createContext<User | undefined>(undefined);
