class MySpriteSheet{
    constructor(scene, texture, sizeM, sizeN){
        this.scene = scene;
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        this.shader = new CGFshader(scene.gl, "./Spritesheet/sprite.vert", "./Spritesheet/sprite.frag");
    }

    activateCellMN(m, n){
        //console.log(m + " ; " + n);
        let coords = vec2.fromValues(m, n);
        this.shader.setUniformsValues({texCoords: coords});
        this.shader.setUniformsValues({u_texture: this.texture});
        this.scene.setActiveShader(this.shader);
        this.texture.bind();
    }

    activateCellP(p){
        this.activateCellMN(p%this.sizeM, Math.floor(p/this.sizeM));
    }
}