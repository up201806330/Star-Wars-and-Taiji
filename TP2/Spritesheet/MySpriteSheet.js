class MySpriteSheet{
    constructor(scene, texture, sizeM, sizeN){
        this.scene = scene;
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        this.shader = new CGFshader(scene.gl, "./Spritesheet/sprite.vert", "./Spritesheet/sprite.frag");
    }

    activateCellMN(m, n){
        console.log("X: " + m + " ; Y: " + n);
        let coords = vec2.fromValues(m, n);
        this.shader.setUniformValues({texCoords: coords});
        this.scene.setActiveShader(this.shader);
    }

    activateCellP(p){
        this.activateCellMN(p%this.sizeM, Math.floor(p/this.sizeM));
    }
}