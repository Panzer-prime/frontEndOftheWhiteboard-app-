import React, { use, useEffect, useRef, useState } from "react";
import { NodeProps } from "reactflow";
import { ConnectOnSocket } from "@/utils/sockets/connectOnSocket";

const socket = ConnectOnSocket();

export function PositionLoggerNode({ xPos, yPos, data, selected }: NodeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const x = `${Math.round(xPos)}px`;
  const y = `${Math.round(yPos)}px`;

  return (
    <div
      className={`node w-full h-full rounded-lg border-2 ${
        selected ? "border-blue-800" : "border-black"
      } bg-white p-5 box-border`}
    >
      <div>
        {x} {y}
      </div>
    </div>
  );
}
