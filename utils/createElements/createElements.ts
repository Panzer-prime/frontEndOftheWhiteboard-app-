import { useRef } from "react";
import { Node } from "reactflow";

type CreateElementProps = {
  typeOfNode: string;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  nodes: Node[];
};
let yPos = 100;
let xPos = 0;
export function CreateElement({
  typeOfNode,
  setNodes,
  nodes,
}: CreateElementProps) {
  console.log(nodes);

  yPos += 10;
  xPos += 10;

  setNodes(() => [
    ...nodes,
    {
      id: Math.floor(Math.random() * 100000).toString(),
      type: typeOfNode,
      position: {
        x: xPos,
        y: yPos,
      },
      data: { label: "drag me!" },
    },
  ]);

  console.log(nodes);
}
