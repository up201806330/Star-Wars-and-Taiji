class PieceExplosion extends PieceTransporter{
    constructor(scene){
        super(scene);
        this.sphere = new MySphere(scene, 2, 10, 10);
        
        this.appearance = new CGFappearance(scene);
        this.appearance.setSpecular(1, 1, 1, 1);
        this.appearance.setShininess(120);
        this.appearance.setAmbient(0.9, 0.9, 0.9, 1);
        this.appearance.setDiffuse(0.9, 0.9, 0.9, 1);
        this.appearance.loadTexture('./scenes/images/explosion.jpg');
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');
    }

    setCoords(piece){
        this.col = (piece.colW + piece.colB)/2 + 0.5;
        this.row = (piece.rowW + piece.rowB)/2 + 0.5;
    }

    startAnimation(scene){
        this.generateKeyframes();
        this.animation = new KeyframeAnimation(scene, this.keyframes);
    }

    generateKeyframes(){
        this.keyframes = [];
        this.keyframes.push(new KeyFrame(0,   vec3.fromValues(this.col - 3,-9.7,this.row - 3), vec3.fromValues(0,0,0), vec3.fromValues(0,0,0)));
        this.keyframes.push(new KeyFrame(0.3, vec3.fromValues(this.col - 3,-9.7,this.row - 3), vec3.fromValues(0,0,0), vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(0.6, vec3.fromValues(this.col - 3,-9.7,this.row - 3), vec3.fromValues(0,0,0), vec3.fromValues(0,0,0)));
        this.keyframes.push(new KeyFrame(1, vec3.fromValues(this.col - 3,-9.7,this.row - 3), vec3.fromValues(0,0,0), vec3.fromValues(0,0,0)));
    }

    display(){
        this.scene.pushMatrix();
        this.appearance.apply();
        this.sphere.display();
        this.scene.popMatrix();
    }

    updateAnimation(now){
        this.animation.updateAnimation(now);
    }
}