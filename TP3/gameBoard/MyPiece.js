/**
 * Game element that occupies tiles
 */
class MyPiece {
    

    constructor(scene, type, holdingTiles) {
        this.scene = scene;
        this.holdingTiles = holdingTiles;
        this.piece = new MyCylinder(this.scene, 0.2, 0.2, 0.2, 2, 4);  // To change to parallelepiped
    }
    
    getType() { return this.type; }

    setType(type) { this.type = type; }

    displayPiece() { this.piece.display(); }
}