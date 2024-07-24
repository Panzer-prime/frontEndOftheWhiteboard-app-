import { useRef } from "react";
import { Node } from "reactflow";
import { ConnectOnSocket } from "../connectOnSocket";

type CreateElementProps = {
  typeOfNode: string;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  nodes: Node[];
};

let yPos = 100;
let xPos = 0;

const socket = ConnectOnSocket();

export function CreateElement({
  typeOfNode,
  setNodes,
  nodes,
}: CreateElementProps) {
  console.log(nodes);

  yPos += 10;
  xPos += 10;
  const newNode = {
    id: Math.floor(Math.random() * 100000000).toString(),
    type: typeOfNode,
    position: {
      x: xPos,
      y: yPos,
    },
    data: { label: "drag me!" },
  };
  setNodes(() => [...nodes, newNode]);
  socket.emit("handleOnNodeCreate", newNode);
}
