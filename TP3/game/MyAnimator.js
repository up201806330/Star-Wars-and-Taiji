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

    animateMove(color, row, col){
        if (color == "black") {
            var newPiece = new MyPiece(this.scene);
            this.animatingElements = new Array(this.primitives["blackFish"] /*, piece */);
        }
        else {
            this.animatingElements = new Array(this.primitives["whiteFish"] /*, piece */);
        }
    }

    update(now){
        if (this.animatingElements == null) {
            return;
        }

        else if (!this.started){
            this.animatingElements.forEach (element => element.startAnimation(now, row));
        } 

        else if (this.animatingElements[0].animation.ended){
            this.animatingElements = null;
        }

        else {
            this.animatingElements.forEach (element => element.updateAnimation(now));
        }
    }

    display(){

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