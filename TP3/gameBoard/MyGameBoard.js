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

        for(let i = 0; i < this.sideBoardLength; i++) {
            for (let j = 0; j < this.sideBoardLength; j++) {
                this.tiles.push(new MyTile(this.scene, this, j, i));
            }
        }
    }

    addPieceToTile(tile, piece) { tile.setPiece(piece); }

    removePieceFromTile(tile) { tile.unsetPiece(); }  // not applicable

    getPieceFromTile(tile) { tile.getPiece(); }

    getTileByBoardCoords(rowCoord, colCoord) { /* TODO based on this.tiles representation */ }

    movePiece(piece, startingTile, endingTile) {}  // not applicable


    displayGameboard() {
        
        for (let i = 0; i < this.tiles.length; i++) {
            this.scene.registerForPick(i + 1, this.tiles[i]);
            this.tiles[i].displayTile();
        }
    }

}