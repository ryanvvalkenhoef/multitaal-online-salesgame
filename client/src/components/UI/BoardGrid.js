import { useEffect, useState } from "react";
import boardManager from "@/managers/BoardManager";
import TileComponent from "./TileComponent";

const BoardGrid = () => {
    const [boardState, setBoardState] = useState({ tiles: [], pieces: [] });

    useEffect(() => {
        
    }, []);

    const handleTileClick = (tileId) => {
    };

    return (
    );
};

export default BoardGrid;