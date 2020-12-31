class MySpriteText{
    constructor(scene, text, fontPath){
        this.scene = scene;
        this.text = text;
        this.initialX = -text.length / 2 ;
        this.fontTexture = new CGFtexture(this.scene, fontPath);
        this.spritesheet = new MySpriteSheet(scene, this.fontTexture || scene.fontTexture, 16, 6);
        this.geometry = new MyRectangle(scene, 0, -0.5, 1, 0.5);
    }

    getCharacterPosition(character){
        if (character.charCodeAt() >= 32 && character.charCodeAt() <= 127){
            return (character.charCodeAt() - 32);
        }
        else return 0;
    }

    setText(text){
        this.text = text;
    }

    display(){
        this.scene.setActiveShaderSimple(this.spritesheet.shader);
        this.spritesheet.texture.bind();
        for (let i = 0 ; i < this.text.length ; i++) {
            this.spritesheet.activateCellP(this.getCharacterPosition(this.text[i]));
            this.scene.pushMatrix();
            this.scene.translate(this.initialX + i, 0, 0);
            this.geometry.display();
            this.scene.popMatrix();
        }
        this.scene.setActiveShaderSimple(this.scene.defaultShader)
    }

    updateTexCoords(afs, aft) {}
}