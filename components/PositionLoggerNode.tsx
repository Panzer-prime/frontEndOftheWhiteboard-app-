import React, { use, useEffect, useRef, useState } from "react";
import {
  Handle,
  Position,
  useReactFlow,
  NodeResizer,
  useUpdateNodeInternals,
} from "reactflow";
import { drag } from "d3-drag";
import { select } from "d3-selection";
import { NodeProps, ResizeParams } from "reactflow";
import { useClickOutSideOfNode } from "@/hooks/useClickOutSideOfNode";
import { ConnectOnSocket } from "@/utils/connectOnSocket";
import { emit } from "process";

const socket = ConnectOnSocket();

export function PositionLoggerNode({
  xPos,
  yPos,
  data,
  id,
  sourcePosition = Position.Left,
  targetPosition = Position.Right,
  selected,
}: NodeProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rotateHandler = useRef<HTMLDivElement | null>(null);
  const { isClicked, setIsClicked } = useClickOutSideOfNode(containerRef);

  const updateNodeInternals = useUpdateNodeInternals();
  const [rotation, setRotation] = useState(0);

  const [size, setSize] = useState({ width: 0, height: 0 });

  const x = `${Math.round(xPos)}px`;
  const y = `${Math.round(yPos)}px`;

  useEffect(() => {
    if (!rotateHandler.current) return;

    const selection = select<Element, unknown>(rotateHandler.current);
    const dragHandler = drag<Element, unknown>().on("drag", (evt) => {
      const dx = evt.x - 100;
      const dy = evt.y - 100;
      const rad = Math.atan2(dx, dy);
      const deg = rad * (180 / Math.PI);
      setRotation(180 - deg);
      updateNodeInternals(id);
    });

    selection.call(dragHandler);
  }, [id, updateNodeInternals]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    resizeObserver.observe(node);

    return () => {
      resizeObserver.unobserve(node);
    };
  }, []);

  useEffect(() => {
    socket.emit("handlePropsChange", { id, size, rotation });
  }, [size, rotation, id]);
  console.log(rotation, "here is the rotation size");
  console.log(size.width, size.height, rotation, " size of the node");

  const style = {
    borderColor: isClicked ? "blue-200" : "black",
    transform: `rotate(${rotation}deg)`,
  };

  return (
    <div
      style={style}
      className="node w-full h-full rounded-lg border border-black bg-white p-5 box-border "
      onClick={() => setIsClicked((clicked) => !clicked)}
      ref={containerRef}
    >
      <NodeResizer isVisible={selected} />
      <div className="relative">
        <div
          className="rotateHandle absolute w-2.5 h-2.5 bg-blue-700 left-1/2 top-[-30px] rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-alias after:content-[]"
          ref={rotateHandler}
          style={{ display: selected ? "block" : "none" }}
        >
          <div className="rotateHandle-after absolute w-px h-7.5 bg-blue-700 left-1 top-1.25"></div>
        </div>
      </div>
      <div>
        {x} {y}
      </div>
      <Handle position={sourcePosition} type="source" />
      <Handle position={targetPosition} type="target" />
    </div>
  );
}
