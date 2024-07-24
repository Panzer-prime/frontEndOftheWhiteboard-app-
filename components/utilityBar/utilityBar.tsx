import React from "react";
import { Panel } from "reactflow";
import { useNodesContext } from "@/context/nodesProvider";
import { CreateElement } from "@/utils/createElements/createElements";

export const UtilityBar = () => {
  const { nodes, setNodes } = useNodesContext();

  const handleCreateElement = (NodeType: string) => {
    CreateElement({ typeOfNode: NodeType, setNodes, nodes });
  };
  return (
    <Panel position="top-left">
      <div className="flex flex-row gap-x-4">
        <button
          className="bg-red-400 p-2 rounded-md text-white font-bold "
          onClick={() => handleCreateElement("position-logger")}
        >
          click to add elements
        </button>
        <button
          className="bg-red-400 p-2 rounded-md text-white font-bold "
          onClick={() => handleCreateElement("position-logger")}
        >
          click to add elements
        </button>
        <button
          className="bg-red-400 p-2 rounded-md text-white font-bold "
          onClick={() => handleCreateElement("position-logger")}
        >
          click to add elements
        </button>
        <button
          className="bg-red-400 p-2 rounded-md text-white font-bold "
          onClick={() => handleCreateElement("")}
        >
          click to add
        </button>
      </div>
    </Panel>
  );
};
