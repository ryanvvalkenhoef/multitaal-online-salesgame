import React, { useRef, useEffect } from "react";
import "./BoardGridStyle.css";
import { renderStartPieces } from "../../modules/pieceModule/PieceUtils";

export const Tile = ({
  position,
  tileClass,
  index,
  renderStartPieces,
  startPieces,
  selectedPawn,
}) => {
  const tileRef = useRef(null);

  useEffect(() => {
    if (tileRef.current) {
      console.log("Tile data-pos:", tileRef.current.getAttribute("data-pos"));
    }
  }, []);

  return <div ref={tileRef} key={index} className={tileClass} data-pos={position}></div>;
};
