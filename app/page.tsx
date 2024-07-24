// /App.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  SelectionMode,
  NodeChange,
  Background,
  Controls,
  MiniMap,
  Node,
  NodeMouseHandler,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { initialNodes, nodeTypes } from "@/components/nodes";
import { UtilityBar } from "@/components/utilityBar/utilityBar";
import { useNodesContext } from "@/context/nodesProvider";
import { useSocket } from "@/hooks/usePositionTransfer";
import SetMenu from "@/components/nodeMenu/setMenu";

const panOnDrag = [1, 2];

type ContextMenuProps = {
  id: string;
  top: number | false;
  left: number | false;
  right: number | false;
  bottom: number | false;
};

const App: React.FC = () => {
  const { nodes, setNodes, handleNodesChange } = useNodesContext();
  const { isServerUpdate, emitNodeChange, socket } = useSocket(setNodes);
  const ref = useRef<HTMLDivElement | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuProps | null>(null);

  //updating the position of the nodes sending it to the server
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
  //deleting and creating an node received from the server
  useEffect(() => {
    socket.on("handleOnNodeCreate", (node: Node) => {
      setNodes((prevNodes) => [...prevNodes, node]);
    });

    socket.on("handleOnDeleteNode", (id) => {
      console.log("Deleting node with id:", id); // Debugging log

      setNodes((nodes) => {
        console.log("Nodes before deletion:", nodes);
        const updatedNodes = nodes.filter((node) => node.id !== id);
        console.log("Nodes after deletion:", updatedNodes);
        return updatedNodes;
      });
    });

    return () => {
      socket.off("handleOnNodeCreate");
      socket.off("handleOnDeleteNode");
    };
  }, [setNodes, socket]);
  //updating the node props

  type newProps = {
    id: string;
    size: {
      width: number | null | undefined;
      height: number | null | undefined;
    };
    rotation: number;
  };

  useEffect(() => {
    const handlePropsChange = ({ id, size, rotation }: newProps) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            const updatedNode = {
              ...node,
              width: size.width,
              height: size.height,
              style: {
                ...node.style,
                rotate: `${rotation}deg`,

              },
            };
            return updatedNode;
          }
          return node;
        })
      );
    };

    socket.on("handlePropsChange", handlePropsChange);

    // Clean up the event listener when the component unmounts or re-renders
    return () => {
      socket.off("handlePropsChange", handlePropsChange);
    };
  }, [socket, setNodes]);

  //the context menu for each node to be able to
  const onNodeContextMenu: NodeMouseHandler = useCallback(
    (event, node) => {
      event.preventDefault();

      if (!ref.current) return;
      const pane: DOMRect = ref.current.getBoundingClientRect();

      setContextMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 ? event.clientY : false,
        left: event.clientX < pane.width - 200 ? event.clientX : false,
        right:
          event.clientX >= pane.width - 200
            ? pane.width - event.clientX
            : false,
        bottom:
          event.clientY >= pane.height - 200
            ? pane.height - event.clientY
            : false,
        //setContextMenu,
      });
    },
    [setContextMenu]
  );

  const onPanelClick = useCallback(() => {
    setContextMenu(null);
  }, [setContextMenu]);

  return (
    <div className="h-[100vh]">
      <ReactFlowProvider>
        <ReactFlow
          ref={ref}
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeContextMenu={onNodeContextMenu}
          onPaneClick={onPanelClick}
          fitView
          panOnScroll
          selectionOnDrag
          panOnDrag={panOnDrag}
          selectionMode={SelectionMode.Partial}
        >
          <MiniMap />
          <UtilityBar />
          <Background />
          <Controls />
        </ReactFlow>
        {contextMenu && (
          <SetMenu {...contextMenu} setContextMenu={setContextMenu} />
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default App;
