import React, { useRef, useEffect } from "react";
import "./BoardGridStyle.css";
import { renderStartPieces } from "../../modules/pieceModule/PieceUtils";
import boardManager from "../../modules/boardModule/BoardManager";

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
