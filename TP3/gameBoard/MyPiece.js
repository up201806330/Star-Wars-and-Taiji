/**
 * Game element that occupies tiles
 */
class MyPiece {
    
    constructor(scene) {
        this.scene = scene;
        this.assigned = false;

        this.initPieceMaterials();

        this.blackPart = new MyUnitCubeQuad(scene, this.blackMaterial, this.blackMaterial);
        this.whitePart = new MyUnitCubeQuad(scene, this.whiteMaterial, this.whiteMaterial);
    }

    setCoords(rowW, colW, rowB, colB){
        this.rowW = rowW;
        this.colW = colW;
        this.rowB = rowB;
        this.colB = colB;
        this.assigned = true;
    }

    initPieceMaterials() {
        this.blackMaterial = new CGFappearance(this.scene);
        this.blackMaterial.setSpecular(1, 1, 1, 1);
        this.blackMaterial.setShininess(120);
        this.blackMaterial.setAmbient(0, 0, 0, 1);
        this.blackMaterial.setDiffuse(0.2, 0.2, 0.2, 1);

        this.whiteMaterial = new CGFappearance(this.scene);
        this.whiteMaterial.setSpecular(1, 1, 1, 1);
        this.whiteMaterial.setShininess(120);
        this.whiteMaterial.setAmbient(0.8, 0.8, 0.8, 1);
        this.whiteMaterial.setDiffuse(1, 1, 1, 1);
    }

    startAnimation(scene){
        this.generateKeyframes();
        this.animation = new KeyframeAnimation(scene, this.keyframes);
    }

    generateKeyframes(){
        this.keyframes = [];
        let willRotateByX = (this.rowW == this.rowB)? 1:0;
        let willRotateByZ = (this.colW == this.colB)? 1:0;
        this.keyframes.push(new KeyFrame(0,   vec3.fromValues(18,-40,this.rowW-3),           vec3.fromValues(0,0,-90), vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(0.7, vec3.fromValues(8.5,-5,this.rowW-3),            vec3.fromValues(0,0,-45), vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(1.7, vec3.fromValues(-4.5,-2,this.rowW-3),             vec3.fromValues(0,0,10),                                 vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(2.7, vec3.fromValues(this.colW-3,-9.7,this.rowW-3), vec3.fromValues(365*willRotateByX,0,365*willRotateByZ), vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(2.8, vec3.fromValues(this.colW-3,-9.7,this.rowW-3), vec3.fromValues(-2*willRotateByX,0,-2*willRotateByZ),   vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(2.9, vec3.fromValues(this.colW-3,-9.7,this.rowW-3), vec3.fromValues(2*willRotateByX,0,2*willRotateByZ),     vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(3,   vec3.fromValues(this.colW-3,-9.7,this.rowW-3), vec3.fromValues(0,0,0),                                 vec3.fromValues(1,1,1)));
    }

    display() { 
        if (!this.assigned) return;

        let blackOffset = vec3.fromValues((this.colB-this.colW), 0, (this.rowB-this.rowW));

        this.scene.pushMatrix();
        // this.scene.translate(-3 + this.colW,-9.7,-3 + this.rowW);
        this.scene.scale(0.95,0.14,0.95);

        this.scene.pushMatrix();
        this.scene.translate(...blackOffset);
        this.blackMaterial.apply();
        this.blackPart.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.whiteMaterial.apply();
        this.whitePart.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }

    updateAnimation(now){
        if (!this.assigned) return;  //--------------------------------pro peixe tb???
        this.animation.updateAnimation(now);
    }
}


// Animation notes

// z constante
// col-3 row-3

// times [t0,          t0+0.7      t0+1.7   t0+2.7           t0+2.8               t0+2.9              t0+3]
// pos   [(18,-20,Z), (12,-8,Z),  (0,-1,Z), (colW-3,-9.7,Z), (colW-3,-9.7,Z), (colW-3,-9.7,Z), (colW-3,-9.7,Z)]