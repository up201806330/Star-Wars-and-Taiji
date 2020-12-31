class MessageDisplay{
    constructor(scene){
        this.scene = scene;

        this.whiteText = new WhiteText(scene, "  Taiji   ");
        this.blackText = new BlackText(scene, "  Taiji   ");
        this.isWhite = false;
        this.geometry = new TableScreen(scene, 10);

    }

    setText(text, isWhite){
        this.isWhite = isWhite;
        if (isWhite) this.whiteText.setText(text);
        else         this.blackText.setText(text);
    }

    display(){
        this.scene.translate(4.0,-10,-4.4);
        this.scene.rotate(-Math.PI/4 + 0.2, 0,1,0);
        this.scene.scale(0.55,0.55,0.55);

        this.scene.pushMatrix()
        this.scene.scale(1.2,1.2,1.2);
        this.geometry.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-55*Math.PI/180, 1,0,0);
        this.scene.translate(0,1,0.1);
        this.scene.scale(1.1,1.1,1.1);
        if (this.isWhite) this.whiteText.display();
        else              this.blackText.display();
        this.scene.popMatrix();
    }
}