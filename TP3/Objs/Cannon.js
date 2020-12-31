class Cannon extends PieceTransporter{
    constructor(scene){
        super(scene);
        this.obj = new CGFOBJModel(scene, 'Objs/models/Cannon.obj');
        
        this.appearance = new CGFappearance(scene);
        this.appearance.setSpecular(0.2, 0.2, 0.2, 1);
        this.appearance.setShininess(120);
        this.appearance.setAmbient(0.5, 0.5, 0.5, 1);
        this.appearance.setDiffuse(0.2, 0.2, 0.3, 1);

        // So cannon starts out in scene
        var keyframe = []; 
        keyframe.push(new KeyFrame(0, vec3.fromValues(0,0,0), vec3.fromValues(0,0,0), vec3.fromValues(1,1,1)));
        this.animation = new KeyframeAnimation(scene, keyframe);
    }

    startAnimation(scene){
        this.generateKeyframes();
        this.animation = new KeyframeAnimation(scene, this.keyframes);
    }

    generateKeyframes(){
        this.keyframes = [];
        this.keyframes.push(new KeyFrame(0,    vec3.fromValues(0,0,0),   vec3.fromValues(0,0,0),  vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(0.2,  vec3.fromValues(0,0,0),   vec3.fromValues(0,0,0),  vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(0.21, vec3.fromValues(-3,2,-3), vec3.fromValues(-4,0,4), vec3.fromValues(1,1,1)));
        this.keyframes.push(new KeyFrame(0.9,  vec3.fromValues(0,0,0),   vec3.fromValues(0,0,0),  vec3.fromValues(1,1,1)));
    }

    display(){
        this.scene.pushMatrix();
        this.appearance.apply();
        this.scene.translate(-20,-13,-20);
        this.scene.rotate(5*Math.PI/4, 0,1,0);
        this.scene.scale(0.2,0.2,0.2);
        this.obj.display();
        this.scene.popMatrix();
    }

    updateAnimation(now){
        this.animation.updateAnimation(now);
    }
}


// Animation notes

// 