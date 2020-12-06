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
    
    getType() {
        return this.type; // or just "this" ?
    }

    setType(type) { this.type = type; }

    displayPiece() { this.piece.display(); }
}