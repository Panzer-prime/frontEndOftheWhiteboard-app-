import { ConnectOnSocket } from "@/utils/connectOnSocket";
import { useEffect } from "react";
import { Node } from "reactflow";

export const useNewNodeUpdate = (nodes: Node[]) => {
  const socket = ConnectOnSocket();
  let lastNode = nodes[nodes.length];

  socket.emit("newNodeUpdate", () => {
    
  })

  return;
};
