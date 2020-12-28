/**
 * Game element that occupies tiles
 */
class MyPiece {
    
    constructor(scene, rowW, colW, rowB, colB) {
        this.scene = scene;
        this.blackPart = new MyUnitCubeQuad(scene);
        this.whitePart = new MyUnitCubeQuad(scene);

        this.rowW = rowW;
        this.colW = colW;
        this.rowB = rowB;
        this.colB = colB;

        this.blackMaterial = new CGFappearance(scene);
        this.blackMaterial.setSpecular(1, 1, 1, 1);
        this.blackMaterial.setShininess(120);
        this.blackMaterial.setAmbient(0, 0, 0, 1);
        this.blackMaterial.setDiffuse(0.2, 0.2, 0.2, 1);
        this.whiteMaterial = new CGFappearance(scene);
        this.whiteMaterial.setSpecular(1, 1, 1, 1);
        this.whiteMaterial.setShininess(120);
        this.whiteMaterial.setAmbient(0.8, 0.8, 0.8, 1);
        this.whiteMaterial.setDiffuse(1, 1, 1, 1);
    }

    display() { 
        let translation = vec3.fromValues((this.colB-this.colW), 0, (this.rowB-this.rowW));

        this.scene.pushMatrix();
        this.scene.translate(-3,-9.7,-3);
        this.scene.scale(0.95,0.14,0.95);

        this.scene.pushMatrix();
        this.scene.translate(...translation);
        this.blackMaterial.apply();
        this.blackPart.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.whiteMaterial.apply();
        this.whitePart.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}