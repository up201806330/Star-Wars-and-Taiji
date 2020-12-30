class MyAnimator{
    constructor(scene){
        this.scene = scene;

        this.started = false;
        
        this.primitives = []
        this.whiteFish = new Fish(scene ,"white"); this.primitives.push(this.whiteFish);
        this.blackFish = new Fish(scene, "black"); this.primitives.push(this.blackFish);
        
        this.cannon = new Cannon(scene);                    this.primitives.push(this.cannon);
        this.cannonExplosion = new CannonExplosion(scene);  this.primitives.push(this.cannonExplosion);

        this.animatingElements = [this.cannon];
    }

    animateMove(gameMove, newPiece){
        let color = gameMove.playerColor;
        let rowW = gameMove.tileCoordsArray[0].coordinates.row;
        let colW = gameMove.tileCoordsArray[0].coordinates.column;
        let rowB = gameMove.tileCoordsArray[1].coordinates.row;
        let colB = gameMove.tileCoordsArray[1].coordinates.column

        if (this.scene.curScene == "gardenScene"){
            if (color == "black") {
                this.blackFish.row = rowW;
                this.animatingElements = new Array(newPiece, this.blackFish);
            }
            else if (color == "white"){
                this.whiteFish.row = rowW;
                this.animatingElements = new Array(newPiece, this.whiteFish);
            }
        }
        else if (this.scene.curScene == "roomScene"){
            this.animatingElements = new Array(newPiece, this.cannon, this.cannonExplosion);
        }
    
        newPiece.setCoords(rowW, colW, rowB, colB);
        this.primitives.push(newPiece);
        
        // console.log(this.animatingElements);
        // console.log(this.primitives);
    }

    update(now){
        if (this.animatingElements == null) {
            return;
        }

        else if (!this.started){
            this.animatingElements.forEach (element => element.startAnimation(this.scene));
            this.started = true;
        } 

        else if (this.animatingElements[0].animation.ended){
            this.animatingElements = null;
            this.started = false;
        }

        else {
            this.animatingElements.forEach (element => element.updateAnimation(now));
        }
    }

    display(){
        //console.log(this.primitives);
        this.primitives.forEach (element => {
            if (element.animation != null){
                if (element.animation.currentFrame == -1 && !(element instanceof Cannon)) return;
                if (this.scene.curScene =='gardenScene' && element instanceof Cannon) return;
                if (this.scene.curScene =='roomScene' && element instanceof Fish) return;
                this.scene.pushMatrix();
                //console.log(element.rowW, element.animation);
                element.animation.apply(); 
                element.display();
                this.scene.popMatrix();
            }
        });
    }
}