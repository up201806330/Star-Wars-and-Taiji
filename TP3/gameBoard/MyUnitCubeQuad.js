/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyUnitCubeQuad extends CGFobject {
    constructor(scene) {
        super(scene);
        this.quad = new MyQuad(this.scene);

        this.initCubeMaterials();
    }

    initCubeMaterials(){
        this.materialBottom = new CGFappearance(this.scene);
        this.materialBottom.setAmbient(0.1, 0.1, 0.1, 1);
        this.materialBottom.setDiffuse(0.9, 0.9, 0.9, 1);
        this.materialBottom.setSpecular(0.1, 0.1, 0.1, 1);
        this.materialBottom.setShininess(10.0);
        // this.materialBottom.loadTexture('images/mineBottom.png');
        this.materialBottom.setTextureWrap('REPEAT', 'REPEAT');

        this.materialTop = new CGFappearance(this.scene);
        this.materialTop.setAmbient(0.1, 0.1, 0.1, 1);
        this.materialTop.setDiffuse(0.9, 0.9, 0.9, 1);
        this.materialTop.setSpecular(0.1, 0.1, 0.1, 1);
        this.materialTop.setShininess(10.0);
        this.materialTop.loadTexture('./gameBoard/tile-border-3.png');
        this.materialTop.setTextureWrap('REPEAT', 'REPEAT');

        this.materialSide = new CGFappearance(this.scene);
        this.materialSide.setAmbient(0.1, 0.1, 0.1, 1);
        this.materialSide.setDiffuse(0.9, 0.9, 0.9, 1);
        this.materialSide.setSpecular(0.1, 0.1, 0.1, 1);
        this.materialSide.setShininess(10.0);
        // this.materialSide.loadTexture('images/mineSide.png');
        this.materialSide.setTextureWrap('REPEAT', 'REPEAT');

        //this.bottomMaterial = new CGFtexture(this.scene,'images/mineBottom.png');
        //this.topMaterial = new CGFtexture(this.scene,'images/mineTop.png');
        //this.sideMaterial = new CGFtexture(this.scene,'images/mineSide.png')
    }

    display() {
        
        // ZX face (higher Y)
        this.scene.pushMatrix();
        //this.scene.setLightBlue();
        this.scene.rotate(90*Math.PI/180,1,0,0);
        this.scene.translate(0, 0, -0.5);
        this.scene.scale(1, 1, -1); // Needed because texture was inside the cube
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        this.materialTop.apply();
        this.quad.display();
        this.scene.popMatrix();

        // ZX face (lower Y)
        this.scene.pushMatrix();
        //this.scene.setLightBlue();
        this.scene.rotate(90*Math.PI/180,1,0,0);
        this.scene.translate(0, 0, 0.5);
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        this.materialBottom.apply();
        this.quad.display();
        this.scene.popMatrix();

        // XY face (lower Z)
        this.scene.pushMatrix();
        //this.scene.setLightBlue();
        this.scene.translate(0, 0, -0.5);
        this.scene.scale(1, 1, -1); // Needed because texture was inside the cube
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
        this.materialSide.apply();
        this.quad.display();
        this.scene.popMatrix();
        
        // XY face (higher Z)
        this.scene.pushMatrix();
        //this.scene.setLightBlue();
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
        this.scene.popMatrix();

        // ZY face (lower X)
        this.scene.pushMatrix();
        //this.scene.setLightBlue();
        this.scene.rotate(90*Math.PI/180,0,1,0);
        this.scene.translate(0, 0, -0.5);
        this.scene.scale(1, 1, -1); // Needed because texture was inside the cube
        this.quad.display();
        this.scene.popMatrix();

        // ZY face (higher X)
        this.scene.pushMatrix();
        //this.scene.setLightBlue();
        this.scene.rotate(90*Math.PI/180,0,1,0);
        this.scene.translate(0, 0, 0.5);
        this.quad.display();
        this.scene.popMatrix();
    }
}