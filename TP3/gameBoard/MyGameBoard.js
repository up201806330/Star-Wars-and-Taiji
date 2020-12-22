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
                this.tiles.push(new MyTile(this.scene, this, {row: j, column: i}));
                this.tiles[this.tiles.length - 1].piece = new MyPiece(this.scene, 'idk type', []);
            }
        }
    }

    addPieceToTile(tile, piece) { tile.setPiece(piece); }

    removePieceFromTile(tile) { tile.unsetPiece(); }  // not applicable

    getPieceFromTile(tile) { tile.getPiece(); }

    getTileByBoardCoords(coordinates) {
        // console.log(this.tiles[0].coordinates);
        
        for (let i = 0; i < this.tiles.length; i++) {
            
            if (this.tiles[i].coordinates.row == coordinates.row && this.tiles[i].coordinates.column == coordinates.column) {
                return this.tiles[i];
            }
            
        }
        console.log("No Tile with these coords:");
        console.log(coordinates);

        return null;
    }

    // movePiece(piece, startingTile, endingTile) {}  // not applicable


    displayGameboard() {
        
        for (let i = 0; i < this.tiles.length; i++) {
            this.scene.registerForPick(i + 1, this.tiles[i]);
            this.tiles[i].displayTile();
        }
    }

}