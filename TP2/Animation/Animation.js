class Animation{
    constructor(scene, keyframes) {
        this.scene = scene;
        this.active=false;
        this.keyframes = keyframes;
        this.elapsedTime = 0;
        this.currentFrame = -1;
        this.currentFrameDuration = 0;

        this.transformMatrix = mat4.create();
    };

    updateAnimation(t) { // TODO Better to "sum up" elapsed time here or pass it as argument (now from XMLscene)
        if (t == null) return;

        this.elapsedTime += t;

        // Frame switching
        if (!this.active){ // Hasn't started yet
            if (this.elapsedTime >= this.keyframes[0].instant){
                this.active = true;
                this.currentFrame++;
                this.currentFrameDuration = this.keyframes[this.currentFrame + 1].instant - this.keyframes[this.currentFrame].instant;
            }
            else return;
        }
        else if (this.currentFrame >= 0){ // Has started
            if (this.currentFrame == this.keyframes.length - 2) { // Has ended, won't update anything from here on
                return;
            }
            else {
                if (this.elapsedTime >= this.keyframes[this.currentFrame + 1].instant){ // Has to switch to next frame
                    this.currentFrame++;
                    this.currentFrameDuration = this.keyframes[this.currentFrame + 1].instant - this.keyframes[this.currentFrame].instant;
                }
            }
        }

        // Interpolations
        let percentage;
        if (this.currentFrameDuration != 0) percentage = (this.elapsedTime - this.keyframes[this.currentFrame].instant) / (this.currentFrameDuration); 
        else percentage = 1;
        var translation = vec3.create(); 
        vec3.lerp(translation, this.keyframes[this.currentFrame].translation, this.keyframes[this.currentFrame + 1].translation, percentage);
        var rotation = vec3.create();   
        vec3.lerp(rotation, this.keyframes[this.currentFrame].rotation,       this.keyframes[this.currentFrame + 1].rotation, percentage);
        var scale = vec3.create();    
        vec3.lerp(scale, this.keyframes[this.currentFrame].scale,             this.keyframes[this.currentFrame + 1].scale, percentage);

        mat4.translate(this.transformMatrix, this.transformMatrix, translation);
        mat4.rotate(this.transformMatrix, this.transformMatrix, rotation[0] * DEGREE_TO_RAD, [1,0,0]);
        mat4.rotate(this.transformMatrix, this.transformMatrix, rotation[1] * DEGREE_TO_RAD, [0,1,0]);
        mat4.rotate(this.transformMatrix, this.transformMatrix, rotation[2] * DEGREE_TO_RAD, [0,0,1]);
        mat4.scale(this.transformMatrix, this.transformMatrix, scale);
    };

    apply(){
        this.scene.multMatrix(this.transformMatrix);
    };
}