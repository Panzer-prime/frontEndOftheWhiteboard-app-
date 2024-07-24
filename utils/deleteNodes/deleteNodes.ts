import { Node } from "reactflow";

type DeleteElementProps = {
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  deletedNode: Node;
};

function deleteNodes({ deletedNode, setNodes }: DeleteElementProps) {
  setNodes((prevNodes) => {
    return prevNodes.filter((node) => node.id !== deletedNode.id);
  });
}
