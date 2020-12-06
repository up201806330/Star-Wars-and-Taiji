/**
 * Unitary element that creates the gameboard and auxiliary board spaces
 */
class MyTile {

    constructor(scene, gameboard, rowCoord, colCoord) {
        this.scene = scene;
        this.piece = null;
        this.gameboard = gameboard;
        // console.log("MyTile constructor");
        this.tile = new MyCylinder(this.scene, 0.5, 0.5, 0.5, 2, 4);
        this.rowCoord = rowCoord;
        this.colCoord = colCoord;
        // this.tile = new MyRectangle(scene, 0, 0, 2, 2);
    }

    setPiece(piece) { this.piece = piece; }

    unsetPiece() { this.piece = null; }

    getPiece() { return this.piece; }

    displayTile() {
        this.scene.pushMatrix();

        // Display Tile Itself
        this.scene.translate(this.rowCoord, 0, this.colCoord);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.rotate(Math.PI/4, 0, 0, 1);

        this.tile.display();

        console.log("Tile display");

        // Display Piece
        if (this.piece != null) {
            this.scene.rotate(Math.PI/4, 0, 0, 1); // rotate because the cylinder base is defined in the XY axis
            this.piece.displayPiece();
        }

        this.scene.popMatrix();
    }
}