class MyAnimator{
    constructor(scene, curScene){
        this.scene = scene;
        this.curScene = curScene;

        this.animatingElements = null;
        this.started = false;
        
        this.primitives = []
        this.whiteFish = new Fish(scene ,"white"); this.primitives.push(this.whiteFish);
        this.blackFish = new Fish(scene, "black"); this.primitives.push(this.blackFish);
        
        // white ship
        // black ship
    }

    animateMove(gameMove, newPiece){
        let color = gameMove.playerColor;
        let rowW = gameMove.tileCoordsArray[0].coordinates.row;
        let colW = gameMove.tileCoordsArray[0].coordinates.column;
        let rowB = gameMove.tileCoordsArray[1].coordinates.row;
        let colB = gameMove.tileCoordsArray[1].coordinates.column

        console.log(this.curScene);
        if (color == "black") {
            if (this.currScene == "gardenScene"){
                this.blackFish.row = rowW;
                this.animatingElements = new Array(this.blackFish, newPiece);
            }
            else if (this.curScene == "roomScene"){
            }
        }
        else {
            if (this.curScene == "gardenScene"){
                this.whiteFish.row = rowW;
                this.animatingElements = new Array(this.whiteFish, newPiece);
            }
            else if (this.curScene == "roomScene"){
            }
        }
        newPiece.setCoords(rowW, colW, rowB, colB);
        this.primitives.push(newPiece);
        
        // console.log(this.animatingElements);
        //console.log(this.primitives);
    }

    update(now){
        if (this.animatingElements == null) {
            return;
        }

        else if (!this.started){
            this.animatingElements.forEach (element => element.startAnimation(this.scene));
            this.started = true;
            console.log("started");
        } 

        else if (this.animatingElements[1].animation.ended){
            console.log(this.animatingElements);
            this.animatingElements = null;
            this.started = false;
            console.log("ended");
        }

        else {
            this.animatingElements.forEach (element => element.updateAnimation(now));
            console.log("updating");
        }
    }

    display(){
        //console.log(this.primitives);
        this.primitives.forEach (element => {
            if (element.animation != null && element.animation.currentFrame != -1){
                this.scene.pushMatrix();
                //console.log(element.rowW, element.animation);
                element.animation.apply(); 
                element.display();
                this.scene.popMatrix();
            }
        });
        
    }
}