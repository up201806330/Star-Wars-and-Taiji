class MySpriteSheet{
    constructor(scene, texture, sizeM, sizeN){
        this.scene = scene;
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;

        this.shader = new CGFshader(scene.gl, "./Spritesheet/sprite.vert", "./Spritesheet/sprite.frag");
        this.shader.setUniformsValues({u_texture: this.texture});
        let mn = vec2.fromValues(this.sizeM, this.sizeN);
        this.shader.setUniformsValues({size: mn});
    }

    activateCellMN(m, n){
        //console.log(m + " ; " + n);
        //console.log(this.texture);
        let coords = vec2.fromValues(m, n);
        this.shader.setUniformsValues({texCoords: coords});
    }

    activateCellP(p){
        //console.log(this.sizeM + "    " + p%this.sizeM + " " +  Math.floor(p/this.sizeM))
        this.activateCellMN(p%this.sizeM, Math.floor(p/this.sizeM));
    }
}