/**
 * Game element that occupies tiles
 */
class MyPiece {
    
    constructor(scene, rowW, colW, rowB, colB) {
        this.scene = scene;

        this.rowW = rowW;
        this.colW = colW;
        this.rowB = rowB;
        this.colB = colB;

        console.log([rowW, colW, rowB, colB]);

        this.initPieceMaterials();

        this.blackPart = new MyUnitCubeQuad(scene, this.blackMaterial, this.blackMaterial);
        this.whitePart = new MyUnitCubeQuad(scene, this.whiteMaterial, this.whiteMaterial);
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

    startAnimation(scene, startTime){
        this.generateKeyframes(startTime);
        this.animation = new KeyframeAnimation(scene, this.keyframes);
    }

    generateKeyframes(startTime){
        this.keyframes = [];
        this.keyframes.push(new KeyFrame(startTime,     vec3.fromValues(18,-20,this.rowW-3),          vec3.fromValues(1,1,-90), vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(startTime+0.7, vec3.fromValues(12,-8,this.rowW-3),           vec3.fromValues(1,1,-45), vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(startTime+1.7, vec3.fromValues(0,-1,this.rowW-3),            vec3.fromValues(1,1,0),   vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(startTime+2.7, vec3.fromValues(this.colW-3,-1,this.rowW-3),  vec3.fromValues(1,1,365), vec3.fromValues(1,1,1))); //TODO adjust rotate
        this.keyframes.push(new KeyFrame(startTime+2.8, vec3.fromValues(this.colW-3,-8,this.rowW-3),  vec3.fromValues(1,1,-2),  vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(startTime+2.9, vec3.fromValues(this.colW-3,-23,this.rowW-3), vec3.fromValues(1,1,2),   vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(startTime+3,   vec3.fromValues(this.colW-3,-23,this.rowW-3), vec3.fromValues(1,1,0),   vec3.fromValues(1,1,1)));
    }

    display() { 
        let translation = vec3.fromValues((this.colB-this.colW), 0, (this.rowB-this.rowW));

        this.scene.pushMatrix();
        this.scene.translate(-3 + this.colW,-9.7,-3 + this.rowW);
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

    updateAnimation(now){
        this.animation.updateAnimation(now);
    }
}


// Animation notes

// z constante
// col-3 row-3

// times [t0,          t0+0.7      t0+1.7   t0+2.7           t0+2.8               t0+2.9              t0+3]
// pos   [(18,-20,Z), (12,-8,Z),  (0,-1,Z), (colW-3,-9.7,Z), (colW-3,-9.7,Z), (colW-3,-9.7,Z), (colW-3,-9.7,Z)]