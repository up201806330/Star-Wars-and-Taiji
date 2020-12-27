/**
 * Unitary element that creates the gameboard and auxiliary board spaces
 */
class MyTile {

    constructor(scene, gameboard, coordinates) {
        this.scene = scene;
        this.piece = null;
        this.gameboard = gameboard;
        this.tile = new MyCylinder(this.scene, 0.5, 0.5, 0.5, 2, 4);
        // this.tile = new MyRectangle(this.scene, 0, 0, 1, 1);
        this.coordinates = coordinates;
        this.rowCoord = coordinates.row;
        this.colCoord = coordinates.column;
        // this.tile = new MyRectangle(scene, 0, 0, 2, 2);
    }

    setPiece(piece) { this.piece = piece; }

    unsetPiece() { this.piece = null; }

    getPiece() { return this.piece; }

    displayTile() {
        this.scene.pushMatrix();

        // Display Tile Itself

        // for the rectangle temporary representation
        // this.scene.translate(this.rowCoord, 0, this.colCoord);
        // this.scene.translate(0, 0, 1);
        // this.scene.rotate(-Math.PI/2, 1, 0, 0);
        // this.scene.scale(0.95, 0.95, 1);


        this.scene.translate(this.coordinates.row * 0.75, 0, this.coordinates.column * 0.75);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        
        
        this.tile.display();

        this.scene.popMatrix();
        this.scene.pushMatrix();

        // Display Piece
        if (this.piece != null) {
            this.scene.translate(this.coordinates.row * 0.75, 0.25, this.coordinates.column * 0.75);
            this.scene.rotate(Math.PI/2, 1, 0, 0);
            this.scene.rotate(Math.PI/4, 0, 0, 1); // rotate because the cylinder base is defined in the XY axis
            this.piece.displayPiece();
        }

        this.scene.popMatrix();
    }
}