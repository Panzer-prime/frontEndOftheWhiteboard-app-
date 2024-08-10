// /components/ContextMenu.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useReactFlow } from "reactflow";
import { ConnectOnSocket } from "@/utils/sockets/connectOnSocket";
import { Roboto_Mono } from "next/font/google";

type SetContextMenuProps = {
  id: string;
  top: number | false;
  left: number | false;
  right: number | false;
  bottom: number | false;
};

interface ContextMenuProps extends SetContextMenuProps {
  setContextMenu: React.Dispatch<
    React.SetStateAction<SetContextMenuProps | null>
  >;
  [key: string]: any;
}

const { socket } = ConnectOnSocket();

const ContextMenu: React.FC<ContextMenuProps> = ({
  id,
  top,
  left,
  right,
  bottom,
  setContextMenu,
  ...props
}) => {
  const { setNodes } = useReactFlow();
  const ref = useRef<HTMLDivElement | null>(null);
  const deleteNode = useCallback(() => {
    socket.emit("handleOnDeleteNode", { id: id });
    console.log(id, ": id of the node that is gonna deleted ");
    setNodes((nodes) => {
      console.log(nodes);
      return nodes.filter((node) => node.id !== id);
    });
    setContextMenu(null);
  }, [id, setNodes, setContextMenu]);

  const style = {
    position: "absolute" as "absolute",
    ...(top !== false && { top }),
    ...(left !== false && { left }),
    ...(right !== false && { right }),
    ...(bottom !== false && { bottom }),
  };

  return (
    <div
      style={style}
      className="bg-white w-52 flex flex-col box-shadow-2xl shadow-slate-700 items-center border-2 border-slate-800 rounded-md font-bold"
      {...props}
      ref={ref}
    >
      <p style={{ margin: "0.5em" }}>node: {id}</p>
      <button onClick={deleteNode}>delete</button>
    </div>
  );
};

export default ContextMenu;
