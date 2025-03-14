class BoardManager {
  constructor() {
      this.tiles = [];
      this.pieces = [];
      this.subscribers = [];
  }

  initializeBoard(startPieces) {
      this.tiles = this.createTiles();
      this.setStartPieces(startPieces);
      this.notifySubscribers();
  }

  createTiles() {
      // Creates the tiles on the board
      return Array.from({ length: 64 }, (_, index) => ({
          id: index,
          occupied: false,
          piece: null,
      }));
  }

  setStartPieces(pieces) {
      this.pieces = pieces;
      pieces.forEach(piece => {
          const tile = this.tiles.find(t => t.id === piece.startTile);
          if (tile) {
              tile.occupied = true;
              tile.piece = piece;
          }
      });
      this.notifySubscribers();
  }

  movePiece(fromTileId, toTileId) {
      const fromTile = this.tiles.find(t => t.id === fromTileId);
      const toTile = this.tiles.find(t => t.id === toTileId);

      if (fromTile && fromTile.piece && !toTile.occupied) {
          toTile.piece = fromTile.piece;
          toTile.occupied = true;
          fromTile.piece = null;
          fromTile.occupied = false;
          this.notifySubscribers();
      }
  }

  getBoardState() {
      return {
          tiles: this.tiles,
          pieces: this.pieces,
      };
  }

  subscribe(callback) {
      this.subscribers.push(callback);
  }

  notifySubscribers() {
      this.subscribers.forEach(callback => callback(this.getBoardState()));
  }
}

export default new BoardManager();