import React, { useState, useEffect } from "react";

export const useClickOutSideOfNode = (
  containerRef: React.MutableRefObject<HTMLDivElement | null>
) => {
  const [isClicked, setIsClicked] = useState(false);
  const clickOutSideOfNode = (event: MouseEvent) => {
    if (!containerRef.current) return;
    if (!containerRef.current.contains(event.target as Node)) {
      setIsClicked(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", clickOutSideOfNode);
    return () => {
      // Clean up event listener on unmount
      document.removeEventListener("mousedown", clickOutSideOfNode);
    };
  });

  return { isClicked, setIsClicked };
};
