// src/hooks/useSocket.ts

import { useEffect, useState, useRef } from 'react';
import { ConnectOnSocket } from '../utils/connectOnSocket';
import { Node } from 'reactflow';

type CardPositionProps = {
  xPos: number;
  yPos: number;
  id: string;
  source?: string;
};

export const useSocket = (setNodes: React.Dispatch<React.SetStateAction<Node[]>>) => {
  const socket = ConnectOnSocket();
  const [data, setData] = useState<CardPositionProps | null>(null);
  const isServerUpdate = useRef(false);

  useEffect(() => {
    socket.on('handleCardPosition', (cardPosition: CardPositionProps) => {
      if (cardPosition.source === socket.id) return;

      isServerUpdate.current = true;
      setData(cardPosition);
      console.log('Data received from server:', cardPosition);
    });

    return () => {
      socket.off('handleCardPosition');
    };
  }, [socket]);

  useEffect(() => {
    if (data) {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === data.id) {
            return {
              ...node,
              position: {
                x: data.xPos,
                y: data.yPos,
              },
            };
          }
          return node;
        })
      );
    }
  }, [data, setNodes]);

  const emitNodeChange = (changedNode: CardPositionProps) => {
    socket.emit('updateCardPosition', changedNode);
  };

  return { isServerUpdate, emitNodeChange , socket};
};
