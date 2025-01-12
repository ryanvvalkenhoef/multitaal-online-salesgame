import React from "react";
import "../Board/BoardGridStyle.css";
import { renderStartPieces } from "../Piece/pieceFunctions";

export const Tile = ({
  position,
  tileClass,
  index,
  renderStartPieces,
  startPieces,
  selectedPawn,
}) => {
  return <div key={index} className={tileClass} data-pos={position}></div>;
};
