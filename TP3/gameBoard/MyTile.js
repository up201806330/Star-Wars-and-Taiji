/**
 * Unitary element that creates the gameboard and auxiliary board spaces
 */
class MyTile {

    constructor(scene, gameboard, coordinates) {
        this.scene = scene;
        this.empty = true;
        this.gameboard = gameboard;
        this.coordinates = coordinates;

        this.isSelected = false;
        this.isOccupied = false;

        this.initCubeMaterials();

        this.geometry = new MyUnitCubeQuad(this.scene, this.sideMaterial, this.topMaterial);
    }

    setOccupied() { this.empty = false; }

    unsetOccupied() { this.empty = true; }

    isEmpty() { return this.empty; }

    displayTile() {
        this.scene.pushMatrix();

        this.scene.translate(this.coordinates.row, 0, this.coordinates.column);
        this.scene.translate(-3.0, -9.87, -3.0);
        this.scene.scale(0.95, 0.25, 0.95);     
        
        if (this.isSelected) this.geometry.changeMaterial(this.topMaterialSelected);
        else if (this.isOccupied) this.geometry.changeMaterial(this.topMaterialOccupied);
        else { this.geometry.changeMaterial(this.topMaterial); }

        this.geometry.display();

        this.scene.popMatrix();

    }

    initCubeMaterials(){
        this.topMaterial = new CGFappearance(this.scene);
        this.topMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.topMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.topMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.topMaterial.setShininess(10.0);
        // this.materialTop.loadTexture('./gameBoard/tile-border-2.png');
        // this.materialTop.setTextureWrap('REPEAT', 'REPEAT');

        this.topMaterialSelected = new CGFappearance(this.scene);
        this.topMaterialSelected.setAmbient(0.1, 0.1, 0.1, 1);
        this.topMaterialSelected.setDiffuse(0.0, 0.9, 0.9, 1);
        this.topMaterialSelected.setSpecular(0.1, 0.1, 0.1, 1);
        this.topMaterialSelected.setShininess(10.0);

        this.topMaterialOccupied = new CGFappearance(this.scene);
        this.topMaterialOccupied.setAmbient(0.1, 0.1, 0.1, 1);
        this.topMaterialOccupied.setDiffuse(0.0, 0.0, 0.9, 1);
        this.topMaterialOccupied.setSpecular(0.1, 0.1, 0.1, 1);
        this.topMaterialOccupied.setShininess(10.0);

        this.sideMaterial = new CGFappearance(this.scene);
        this.sideMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.sideMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.sideMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.sideMaterial.setShininess(10.0);
    }
}