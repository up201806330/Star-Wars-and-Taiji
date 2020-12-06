/**
 * Stores the set of tiles that composes the entire game board
 */
class MyGameBoard {

    constructor(scene, sideBoardLength) {
        // Create a gameboard instance
        // this.gameboard is unnecessary, right?
        this.scene = scene;
        this.tiles = []; // 1 list or list of lists ?
        this.sideBoardLength = sideBoardLength;
    }

    addPieceToTile(tile, piece) { tile.setPiece(piece); }

    removePieceFromTile(tile) { tile.unsetPiece(); }  // not applicable

    getPieceFromTile(tile) { tile.getPiece(); }

    getTileByBoardCoords(rowCoord, colCoord) { /* TODO based on this.tiles representation */ }

    movePiece(piece, startingTile, endingTile) {}  // not applicable


    display() {
        for (let tile in tiles) {
            tile.displayTile();
        }
    }

}