class TimerDisplay{
    constructor(scene){
        this.scene = scene;

        this.turnLength = 30;
        this.lastT;
        this.counter = this.turnLength;

        this.whiteText = new WhiteText(scene, ""+this.turnLength);
        this.blackText = new BlackText(scene, ""+this.turnLength);
        this.isWhite = false;
        this.geometry = new TableScreen(scene, 2.5);    
    }

    reset(){
        this.counter = this.turnLength;
        this.setText(""+this.turnLength);
        this.lastT = null;
    }

    update(now){
        let deltaT = 0;
        if(this.lastT != null) deltaT = now- this.lastT;
        
        this.lastT = now;
        let nextCounter = this.counter - deltaT;

        if (this.scene.gameOrchestrator.isAnimating()) return; // Clock wont move during animations

        if (nextCounter <= -1){ // Counter reached 00, turn is forcefully ended
            this.scene.gameOrchestrator.nextTurn();
            return;
        }

        
        this.setWhite((nextCounter < 5 && (nextCounter*10)%10>=5)); // Makes last 5 seconds blink
        if (Math.ceil(nextCounter) < this.counter) {                // Updates display only when digit crosses over
            this.setText(((nextCounter < 9)?"0":"") + Math.ceil(nextCounter));
        }

        this.counter = nextCounter;
    }

    setWhite(isWhite){
        this.isWhite = isWhite;
    }

    setText(text){
        this.whiteText.setText(text);
        this.blackText.setText(text);
    }

    display(){
        this.scene.translate(-4.5,-10,-5.3);
        this.scene.rotate(Math.PI/4 - 0.2, 0,1,0);
        this.scene.scale(1,1,1);

        this.scene.pushMatrix()
        this.scene.scale(1.2,1.2,1.2);
        this.geometry.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-55*Math.PI/180, 1,0,0);
        this.scene.translate(0,1,0.1);
        this.scene.scale(1.25,1.25,1.25);
        if (this.isWhite) this.whiteText.display();
        else              this.blackText.display();
        this.scene.popMatrix();
    }
}