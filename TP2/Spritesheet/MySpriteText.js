class MySpriteText{
    constructor(scene, text){
        this.scene = scene;
        this.text = text;
        this.texture = new CGFtexture(scene, "./scenes/images/font.png");
        // Cenas da spritesheet default da font, hardcoded aqui
        this.spritesheet = new MySpriteSheet(scene, this.texture, 16, 16);

        this.geometry = new MyRectangle(scene, -text.length / 2, -0.5, text.length / 2, 0.5);
    }

    getCharacterPosition(character){
        if (character.charCodeAt() >= 32 && character.charCodeAt() <= 239){
            return character.charCodeAt();
        }
        else return 32;
    }

    display(){
        // for (let i = 0 ; i < this.text ; i++) {
        //     this.spritesheet.activateCellP(this.getCharacterPosition(this.text[i]));
        //     this.geometry.display();
        //     this.scene.setActiveShader(this.scene.defaultShader)
        // }
        this.texture.bind();
        this.geometry.display();

    }

    updateTexCoords(afs, aft) {
        this.geometry.texCoords = [
			0, 1/16,
			this.text.length * 1/16, 1/16,
			0, 0,
			this.text.length * 1/16, 0
		];

		this.geometry.updateTexCoordsGLBuffers();
    }
}