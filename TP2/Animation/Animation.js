class Animation{
    constructor(scene, keyframes)
    {
        this.scene = scene;
        this.active=false;
        this.keyframes = keyframes;
    };

    updateAnimation(t) {
        if (!this.active) return;
    };

    apply(){};
}