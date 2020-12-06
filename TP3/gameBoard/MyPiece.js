/**
 * Game element that occupies tiles
 */
class MyPiece {
    
    // Ideas:
    // type -> color
    // tile -> index of tile list
    constructor(scene, type, holdingTile) {
        this.scene = scene;
        this.type = type;
        this.holdingTile = holdingTile;
        this.piece = new MyCylinder(this.scene, 0.5, 0.5, 0.5, 2, 4);  // To change to parallelepiped
    }

    
    getPiece() {
        return this.piece; // or just "this" ?
    }

    setPiece(type, holdingTile) {
        this.type = type;
        this.holdingTile = holdingTile;
    }

    displayPiece() {
        this.piece.display();
    }
}