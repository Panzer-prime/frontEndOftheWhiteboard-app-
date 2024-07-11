import type { NodeProps } from "reactflow";


import React, { useEffect } from "react";
import { Handle, Position } from "reactflow";



export function PositionLoggerNode({ xPos, yPos, data, id }: NodeProps) {
  const x = `${Math.round(xPos)}px`;
  const y = `${Math.round(yPos)}px`;


  //useTransferData({ xPos:Math.round( xPos), yPos: Math.round(yPos), id: id});

  return (
    <div className="react-flow__node-default" >
      <div>
        {x} {y}
      </div>
      
    </div>
  );
}
