'use client'
import React, { createContext, useContext, useCallback, ReactNode } from "react";
import { useNodesState, NodeChange, Node } from "reactflow";
import { initialNodes } from "@/components/nodes";

type NodesContextType = {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  handleNodesChange: (changes: NodeChange[]) => void;
};

const NodesContext = createContext<NodesContextType | undefined>(undefined);

export const NodesProvider = ({ children }: { children: ReactNode }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
  }, [onNodesChange]);

  return (
    <NodesContext.Provider value={{ nodes, setNodes, handleNodesChange }}>
      {children}
    </NodesContext.Provider>
  );
};

export const useNodesContext = (): NodesContextType => {
  const context = useContext(NodesContext);
  if (!context) {
    throw new Error("useNodesContext must be used within a NodesProvider");
  }
  return context;
};
