"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  ReactFlow,
  SelectionMode,
  NodeChange,
  Background,
  Controls,
  MiniMap
} from "reactflow";
import "reactflow/dist/style.css";
import { initialNodes, nodeTypes } from "@/components/nodes";
import { UtilityBar } from "@/components/utilityBar/utilityBar";
import { useNodesContext } from "@/context/nodesProvider";
import { useSocket } from "@/hooks/usePositionTransfer";

const panOnDrag = [1, 2];

const App = () => {
  const { nodes, setNodes, handleNodesChange } = useNodesContext();
  const { isServerUpdate, emitNodeChange, socket } = useSocket(setNodes);

  const onNodesChange = (changes: NodeChange[]) => {
    if (isServerUpdate.current) {
      isServerUpdate.current = false;
      return;
    }
    handleNodesChange(changes);
    const changedNode = changes[0];
    if (changedNode && "position" in changedNode && changedNode.position) {
      const updatedNode = {
        id: changedNode.id,
        xPos: changedNode.position.x,
        yPos: changedNode.position.y,
        source: socket.id,
      };
      emitNodeChange(updatedNode);
    }
  };

  return (
    <div className="h-[100vh]">
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        fitView
        panOnScroll
        selectionOnDrag
        panOnDrag={panOnDrag}
        selectionMode={SelectionMode.Partial}
      >
        <MiniMap/>
        <UtilityBar />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default App;
