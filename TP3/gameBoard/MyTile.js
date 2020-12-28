/**
 * Unitary element that creates the gameboard and auxiliary board spaces
 */
class MyTile {

    constructor(scene, gameboard, coordinates) {
        this.scene = scene;
        this.empty = true;
        this.gameboard = gameboard;
        this.tile = new MyUnitCubeQuad(this.scene);
        this.coordinates = coordinates;

    }

    setOccupied() { this.empty = false; }

    unsetOccupied() { this.empty = true; }

    isEmpty() { return this.empty; }

    displayTile() {
        this.scene.pushMatrix();

        this.scene.translate(this.coordinates.row, 0, this.coordinates.column);
        this.scene.translate(-3.0, -9.87, -3.0);
        this.scene.scale(0.95, 0.25, 0.95);     
        
        this.tile.display();

        this.scene.popMatrix();


        // this.scene.pushMatrix();

        // // Display Piece
        // if (this.piece != null) {
        //     this.scene.translate(this.coordinates.row * 0.75, 0.25, this.coordinates.column * 0.75);
        //     this.scene.rotate(Math.PI/2, 1, 0, 0);
        //     this.scene.rotate(Math.PI/4, 0, 0, 1); // rotate because the cylinder base is defined in the XY axis
        //     this.piece.displayPiece();
        // }

        // this.scene.popMatrix();
    }
}