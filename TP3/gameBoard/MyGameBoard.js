/**
 * Stores the set of tiles that composes the entire game board
 */
class MyGameBoard {

    constructor(scene, sideBoardLength) {
        this.scene = scene;
        this.tiles = [];
        this.pieces = [];
        
        this.sideBoardLength = sideBoardLength;

        this.initTileMaterials();

        for(let m = 0; m < 24; m++) this.pieces.push(new MyPiece(this.scene));

        for(let i = 0; i < this.sideBoardLength; i++) {
            for (let j = 0; j < this.sideBoardLength; j++) {
                this.tiles.push(new MyTile(this.scene, {row: i, column: j}, ((i+j)%2)?this.darkTile:this.lightTile));
            }
        }
    }

    addPieceToTile(tile, piece) { tile.setPiece(piece); }

    getPieceFromTile(tile) { tile.getPiece(); }

    getTileByBoardCoords(coordinates) {
        
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.compareCoordinates(this.tiles[i].coordinates, coordinates)) return this.tiles[i];
        }
        
        console.log("No Tile with coords:" + coordinates);

        return null;
    }

    initTileMaterials(){
        this.darkTile = new CGFappearance(this.scene);
        this.darkTile.setAmbient(0.1, 0.36, 0.56, 1);
        this.darkTile.setDiffuse(0.4, 0.4, 0.4, 1);
        this.darkTile.setSpecular(0.1, 0.1, 0.1, 1);
        this.darkTile.setShininess(10.0);
        this.darkTile.loadTexture('./scenes/images/plastic.jpg');
        this.darkTile.setTextureWrap('REPEAT', 'REPEAT');
        
        this.lightTile = new CGFappearance(this.scene);
        this.lightTile.setAmbient(0.2, 0.46, 0.66, 1);
        this.lightTile.setDiffuse(0.9, 0.9, 0.9, 1);
        this.lightTile.setSpecular(0.1, 0.1, 0.1, 1);
        this.lightTile.setShininess(10.0);
        this.lightTile.loadTexture('./scenes/images/plastic.jpg');
        this.lightTile.setTextureWrap('REPEAT', 'REPEAT');
    }

    display() {
        for (var i = 0; i < this.tiles.length; i++) {
            this.scene.registerForPick(i + 1, this.tiles[i]);
            this.tiles[i].displayTile();
        }

        for (i; i < this.pieces.length + this.tiles.length; i++) {
            this.scene.registerForPick(i + 1, this.pieces[i - this.tiles.length]);
        }

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