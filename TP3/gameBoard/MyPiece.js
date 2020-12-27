/**
 * Game element that occupies tiles
 */
class MyPiece {
    
    constructor(scene, holdingTiles) {
        this.scene = scene;
        this.holdingTiles = holdingTiles;
        this.piece = new MyCylinder(this.scene, 0.2, 0.2, 0.2, 2, 4);  // To change to parallelepiped
    }

    displayPiece() { this.piece.display(); }
}