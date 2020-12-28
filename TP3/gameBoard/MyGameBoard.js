/**
 * Stores the set of tiles that composes the entire game board
 */
class MyGameBoard {

    constructor(scene, sideBoardLength) {
        // Create a gameboard instance
        // this.gameboard is unnecessary, right?
        this.scene = scene;
        this.tiles = [];
        this.pieces = []; // <-- maybe use this instead of associating piece with tile?
        this.sideBoardLength = sideBoardLength;

        for(let i = 0; i < this.sideBoardLength; i++) {
            for (let j = 0; j < this.sideBoardLength; j++) {
                console.log("Row:", i);
                console.log("Col:", j);
                this.tiles.push(new MyTile(this.scene, this, {row: i, column: j}));
                // this.tiles[this.tiles.length - 1].piece = new MyPiece(this.scene, 'idk type', []);
            }
        }
    }

    addPieceToTile(tile, piece) { tile.setPiece(piece); }

    getPieceFromTile(tile) { tile.getPiece(); }

    getTileByBoardCoords(coordinates) {
        
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.compareCoordinates(this.tiles[i].coordinates, coordinates)) return this.tiles[i];
        }
        
        console.log("No Tile with these coords:");
        console.log(coordinates);

        return null;
    }


    display() {
        // console.log("display gameboard");
        
        for (let i = 0; i < this.tiles.length; i++) {
            this.scene.registerForPick(i + 1, this.tiles[i]);
            this.tiles[i].displayTile();
        }

        this.scene.clearPickRegistration();

        for (let i = 0; i < this.pieces.length; i++) {
            this.pieces[i].displayPiece();
        }
    }

    compareCoordinates(coords1, coords2) {
        return (coords1.row == coords2.row && coords1.column == coords2.column);
    }

}