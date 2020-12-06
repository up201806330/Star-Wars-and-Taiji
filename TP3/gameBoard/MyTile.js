/**
 * Unitary element that creates the gameboard and auxiliary board spaces
 */
class MyTile {

    constructor(scene, gameboard) {
        this.scene = scene;
        this.piece = null;
        this.gameboard = gameboard;
        this.tile = new MyCylinder(this.scene, 0.5, 0.5, 0.5, 2, 4);
    }

    setPiece(piece) { this.piece = piece; }

    unsetPiece() { this.piece = null; }

    getPiece() { return this.piece; }

    displayTile() {
        this.scene.pushMatrix();

        // Display Tile Itself
        this.tile.display();

        // Display Piece
        if (this.piece != null) {
            this.scene.rotate(Math.PI/4, 0, 0, 1); // rotate because the cylinder base is defined in the XY axis
            this.piece.displayPiece();
        }

        this.scene.popMatrix();
    }
}