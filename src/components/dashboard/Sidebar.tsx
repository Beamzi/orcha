"use client";

import React, { useState } from "react";
import { LuPanelLeftOpen, LuPanelRightOpen } from "react-icons/lu";
import { motion } from "motion/react";

interface Props {
  className: string;
}

export default function Sidebar({ className }: Props) {
  const [expandPanel, setExpandPanel] = useState(false);
  return (
    <motion.aside
      initial={{ width: 50 }}
      className={`${className} origin-left`}
      animate={{ width: expandPanel ? 200 : 50 }}
    >
      {expandPanel ? (
        <div className="border- w-full ">
          <div className="flex w-full border justify-between items-center">
            <h3 className="p-2">Orcha</h3>
            <button
              className="p-2 cursor-pointer"
              onClick={() => {
                setExpandPanel(expandPanel ? false : true);
              }}
            >
              <LuPanelRightOpen className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <motion.div className="w-full h-full  ">
          <div className="">
            <motion.button
              onClick={() => {
                setExpandPanel(expandPanel ? false : true);
              }}
              className="p-2 cursor-pointer"
            >
              {!expandPanel ? <LuPanelLeftOpen className="w-6 h-6" /> : ""}
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
}
