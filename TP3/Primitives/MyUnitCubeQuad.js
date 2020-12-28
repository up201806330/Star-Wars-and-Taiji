/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyUnitCubeQuad extends CGFobject {
    constructor(scene, sideMaterial, topMaterial) {
        super(scene);
        this.quad = new MyQuad(this.scene);
        this.sideMaterial = sideMaterial;
        this.topMaterial = topMaterial;
    }

    changeMaterial(newTopMaterial) {
        this.topMaterial = newTopMaterial;
    }


    display() {
        
        // ZX face (higher Y)
        this.scene.pushMatrix();
        this.scene.rotate(90*Math.PI/180,1,0,0);
        this.scene.translate(0, 0, -0.5);
        this.scene.scale(1, 1, -1); // Needed because texture was inside the cube
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        this.topMaterial.apply();
        this.quad.display();
        this.scene.popMatrix();

        // ZX face (lower Y)
        this.scene.pushMatrix();
        this.scene.rotate(90*Math.PI/180,1,0,0);
        this.scene.translate(0, 0, 0.5);
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        this.sideMaterial.apply();
        this.quad.display();
        this.scene.popMatrix();

        // XY face (lower Z)
        this.scene.pushMatrix();
        //this.scene.setLightBlue();
        this.scene.translate(0, 0, -0.5);
        this.scene.scale(1, 1, -1); // Needed because texture was inside the cube
        this.quad.display();
        this.scene.popMatrix();
        
        // XY face (higher Z)
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
        this.scene.popMatrix();

        // ZY face (lower X)
        this.scene.pushMatrix();
        this.scene.rotate(90*Math.PI/180,0,1,0);
        this.scene.translate(0, 0, -0.5);
        this.scene.scale(1, 1, -1); // Needed because texture was inside the cube
        this.quad.display();
        this.scene.popMatrix();

        // ZY face (higher X)
        this.scene.pushMatrix();
        this.scene.rotate(90*Math.PI/180,0,1,0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
        this.scene.popMatrix();
    }
}