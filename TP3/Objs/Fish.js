class Fish extends PieceTransporter{
    constructor(scene, color){
        super(scene);
        this.obj = new CGFOBJModel(scene, 'Objs/models/fish.obj');
        this.row = 0;

        this.appearance = new CGFappearance(scene);
        this.appearance.setSpecular(1, 1, 1, 1);
        this.appearance.setShininess(120);
        if (color == "white"){
            this.appearance.setAmbient(0.8, 0.8, 0.8, 1);
            this.appearance.setDiffuse(1, 1, 1, 1);
        }else {
            this.appearance.setAmbient(0, 0, 0, 1);
            this.appearance.setDiffuse(0.2, 0.2, 0.2, 1);
        }
    }

    startAnimation(scene, startTime){
        this.generateKeyframes(startTime);
        this.animation = new KeyframeAnimation(scene, this.keyframes);
    }

    generateKeyframes(startTime){
        this.keyframes = [];
        this.keyframes.push(new KeyFrame(startTime,     vec3.fromValues(18,-23,this.row - 3),  vec3.fromValues(1,1,-90), vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(startTime+0.7, vec3.fromValues(12,-8,this.row - 3),   vec3.fromValues(1,1,-45), vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(startTime+1.7, vec3.fromValues(0,-1,this.row - 3),    vec3.fromValues(1,1,0),   vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(startTime+1.9, vec3.fromValues(0,-1,this.row - 3),    vec3.fromValues(1,1,10),  vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(startTime+2.9, vec3.fromValues(-12,-8,this.row - 3),  vec3.fromValues(1,1,45),  vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(startTime+3.6, vec3.fromValues(-18,-23,this.row - 3), vec3.fromValues(1,1,90),  vec3.fromValues(1,1,1)));
    }

    display(){
        this.appearance.apply();
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 0,1,0);
        this.scene.translate(0,0,1);
        this.obj.display();
        this.scene.popMatrix();
    }

    updateAnimation(now){
        this.animation.updateAnimation(now);
    }
}


// Animation notes

// animation(now, row, col, color)
// z stays the same ; depends on placed ROW
// apex of curve on y ; always same
// piece dropped on apex
//

// times [     t0,      t0+0.7,   t0+1.7,   t0+1.9,    t0+2.9,      t0+3.6]
// pos   [(18,-20,Z), (12,-8,Z), (0,-1,Z), (0,-1,Z), (-12,-8,Z), (-18,-20,Z)]