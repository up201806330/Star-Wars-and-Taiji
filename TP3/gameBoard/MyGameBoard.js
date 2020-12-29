/**
 * Stores the set of tiles that composes the entire game board
 */
class MyGameBoard {

    constructor(scene, sideBoardLength) {
        // Create a gameboard instance
        // this.gameboard is unnecessary, right?
        this.scene = scene;
        this.tiles = [];
        this.pieces = new Array();  for(let i = 0 ; i < 24 ; i++) this.pieces.push(new MyPiece(scene));
        this.sideBoardLength = sideBoardLength;

        for(let i = 0; i < this.sideBoardLength; i++) {
            for (let j = 0; j < this.sideBoardLength; j++) {
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
        
        for (var i = 0; i < this.tiles.length; i++) {
            this.scene.registerForPick(i + 1, this.tiles[i]);
            this.tiles[i].displayTile();
        }

        // for (i; i < this.pieces.length + this.tiles.length; i++) { // TODO if we have time
        //     this.scene.registerForPick(i + 1, this.pieces[i - this.tiles.length]);
        // }

        this.scene.clearPickRegistration(); 
    }

    compareCoordinates(coords1, coords2) {
        return (coords1.row == coords2.row && coords1.column == coords2.column);
    }

    nextUnassignedPiece(){
        for (let i = 0 ; i < this.pieces.length ; i++){
            if (!this.pieces[i].assigned) return this.pieces[i];
        }
    }

}