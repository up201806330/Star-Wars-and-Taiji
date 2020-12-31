class ScoreDisplay{
    constructor(scene){
        this.scene = scene;

        this.whitePart = new WhiteText(scene, "White 00");
        this.blackPart = new BlackText(scene, "00 Black");
        this.geometry = new TableScreen(scene, 18);

    }

    updateScore(whiteScore, blackScore){
        this.whitePart.setText("White " + ((whiteScore < 10) ? "0" : "") + whiteScore);
        this.blackPart.setText(((blackScore < 10) ? "0" : "") + blackScore + " Black");
    }

    display(){
        
        this.scene.translate(-4,-10,-4.8);
        this.scene.rotate(Math.PI/4 - 0.2, 0,1,0);
        this.scene.scale(0.4,0.4,0.4);

        this.scene.pushMatrix();
        this.geometry.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-55*Math.PI/180, 1,0,0);
        this.scene.translate(-4.5,0.876,0.1);
        this.whitePart.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-55*Math.PI/180, 1,0,0);
        this.scene.translate(4.5,0.876,0.1);
        this.blackPart.display();
        this.scene.popMatrix();
    }
}