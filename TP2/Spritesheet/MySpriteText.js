class MySpriteText{
    constructor(scene, text){
        this.scene = scene;
        this.text = text;
        this.texture = new CGFtexture(scene, "./scenes/images/font.png");
        // Cenas da spritesheet default da font, hardcoded aqui
        this.spritesheet = new MySpriteSheet(scene, this.texture, 16, 16);
        this.geometries = [];
        let initialX = -text.length / 2;
        for (let i = 0 ; i < text.length ; i++){
            this.geometries[i] = new MyRectangle(scene, initialX + i, -0.5, initialX + i + 1, 0.5);
        }
    }

    getCharacterPosition(character){
        if (character.charCodeAt() >= 32 && character.charCodeAt() <= 239){
            return character.charCodeAt();
        }
        else return 32;
    }

    display(){
        for (let i = 0 ; i < this.text.length ; i++) {
            this.spritesheet.activateCellP(this.getCharacterPosition(this.text[i]));
            this.geometries[i].display();
            this.scene.setActiveShader(this.scene.defaultShader)
        }
    }

    updateTexCoords(afs, aft) {
        // this.geometry.texCoords = [
		// 	0, 1/16,
		// 	this.text.length * 1/16, 1/16,
		// 	0, 0,
		// 	this.text.length * 1/16, 0
		// ];

		// this.geometry.updateTexCoordsGLBuffers();
    }
}