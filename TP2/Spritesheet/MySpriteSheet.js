class MySpriteSheet{
    constructor(texture, sizeM, sizeN){
        this.texture = texture;
        this.sizeM = sizeM;
        this.sizeN = sizeN;
    }

    activateCellMN(m, n){
    }

    activateCellP(p){
        this.activateCellMN(p%this.sizeM, Math.floor(p/this.sizeM));
    }
}