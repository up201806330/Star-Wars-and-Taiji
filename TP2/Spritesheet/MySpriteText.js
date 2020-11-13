class MySpriteText{
    constructor(scene, text){
        this.scene = scene;
        this.text = text;
        // Cenas da spritesheet default da font, hardcoded aqui
        this.spritesheet = new MySpriteSheet(scene, scene.fontTexture, 16, 6);
        this.geometries = [];
        let initialX = -text.length / 2;
        for (let i = 0 ; i < text.length ; i++){
            this.geometries[i] = new MyRectangle(scene, initialX + i, -0.5, initialX + i + 1, 0.5);
        }
    }

    getCharacterPosition(character){
        if (character.charCodeAt() >= 32 && character.charCodeAt() <= 127){
            return (character.charCodeAt() - 32);
        }
        else return 0;
    }

    display(){
        for (let i = 0 ; i < this.text.length ; i++) {
            this.spritesheet.activateCellP(this.getCharacterPosition(this.text[i]));
            this.geometries[i].display();
            this.scene.setActiveShader(this.scene.defaultShader)
        }
    }

    updateTexCoords(afs, aft) {}
}