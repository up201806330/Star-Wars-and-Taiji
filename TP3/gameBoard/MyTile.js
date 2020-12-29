/**
 * Unitary element that creates the gameboard and auxiliary board spaces
 */
class MyTile {

    static topMaterialSelected = null;
    static sideMaterial = null;
    constructor(scene, gameboard, coordinates, material) {
        this.scene = scene;
        this.empty = true;
        this.gameboard = gameboard;
        this.coordinates = coordinates;

        this.isSelected = false;
        this.isOccupied = false;

        this.initCubeMaterials();
        this.material = material || this.sideMaterial;

        this.geometry = new MyUnitCubeQuad(this.scene, this.material, this.material);
    }

    setOccupied() { this.empty = false; }

    unsetOccupied() { this.empty = true; }

    isEmpty() { return this.empty; }

    displayTile() {
        this.scene.pushMatrix();

        this.scene.translate(this.coordinates.column, 0, this.coordinates.row);
        this.scene.translate(-3.0, -9.87, -3.0);
        this.scene.scale(0.98, 0.25, 0.98);     
        
        if (this.isSelected) this.geometry.changeMaterial(MyTile.topMaterialSelected);
        else { this.geometry.changeMaterial(this.material); }

        this.geometry.display();

        this.scene.popMatrix();

    }

    initCubeMaterials(){
        if (MyTile.topMaterialSelected == null){
            MyTile.topMaterialSelected = new CGFappearance(this.scene);
            MyTile.topMaterialSelected.setAmbient(0.1, 0.1, 0.1, 1);
            MyTile.topMaterialSelected.setDiffuse(0.0, 0.9, 0.9, 1);
            MyTile.topMaterialSelected.setSpecular(0.1, 0.1, 0.1, 1);
            MyTile.topMaterialSelected.setShininess(10.0);
            MyTile.topMaterialSelected.loadTexture('./scenes/images/plastic.jpg');
            MyTile.topMaterialSelected.setTextureWrap('REPEAT', 'REPEAT');
        }

        if (MyTile.sideMaterial == null){
            MyTile.sideMaterial = new CGFappearance(this.scene);
            MyTile.sideMaterial.setAmbient(0.1, 0.1, 0.1, 1);
            MyTile.sideMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
            MyTile.sideMaterial.setSpecular(0.1, 0.1, 0.1, 1);
            MyTile.sideMaterial.setShininess(10.0);
        }
    }
}