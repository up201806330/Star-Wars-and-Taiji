class MyAnimator{
    constructor(scene){
        this.scene = scene;

        this.animatingElements = null;
        this.started = false;
        
        this.primitives = []
        this.primitives["blackFish"] = new Fish(scene, "black");
        this.primitives["whiteFish"] = new Fish(scene ,"white");
        // white ship
        // black ship
    }

    animateMove(gameMove){
        let color = gameMove.playerColor;
        let rowW = gameMove.tileCoordsArray[0].coordinates.row;
        let colW = gameMove.tileCoordsArray[0].coordinates.column;
        let rowB = gameMove.tileCoordsArray[1].coordinates.row;
        let colB = gameMove.tileCoordsArray[1].coordinates.column

        var newPiece = new MyPiece(this.scene, rowW, colW, rowB, colB);
        this.primitives.push(newPiece);
        if (color == "black") {
            this.primitives["blackFish"].row = rowW;
            this.animatingElements = new Array(this.primitives["blackFish"], newPiece);
        }
        else {
            this.primitives["whiteFish"].row = rowW;
            this.animatingElements = new Array(this.primitives["whiteFish"], newPiece);
        }
    }

    update(now){
        if (this.animatingElements == null) {
            return;
        }

        else if (!this.started){
            this.animatingElements.forEach (element => element.startAnimation(this.scene, now));
            //this.started = true;
        } 

        else if (this.animatingElements[0].animation.ended){
            this.animatingElements = null;
            //this.started = false;
        }

        else {
            this.animatingElements.forEach (element => element.updateAnimation(now));
        }
    }

    display(){
        //console.log(this.primitives);
        this.scene.pushMatrix();
        this.primitives.forEach (element => {
            if (element.animation != null){
                element.animation.apply(); 
                element.display();
            }
        });
        this.scene.popMatrix();
        
    }
}