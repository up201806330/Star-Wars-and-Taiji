class MyAnimator{
    constructor(scene){
        this.scene = scene;
        

        this.started = false;
        
        this.primitives = []
        this.whiteFish = new Fish(scene ,"white"); this.primitives.push(this.whiteFish);
        this.blackFish = new Fish(scene, "black"); this.primitives.push(this.blackFish);
        
        this.cannon = new Cannon(scene);                    this.primitives.push(this.cannon);
        this.cannonExplosion = new CannonExplosion(scene);  this.primitives.push(this.cannonExplosion);
        this.pieceExplosion = new PieceExplosion(scene);    this.primitives.push(this.pieceExplosion);

        this.animatingElements = [this.cannon];
    }

    animateMove(move, piece){
        let color = move.playerColor;
        let rowW = move.tileCoordsArray[0].coordinates.row;
        let colW = move.tileCoordsArray[0].coordinates.column;
        let rowB = move.tileCoordsArray[1].coordinates.row;
        let colB = move.tileCoordsArray[1].coordinates.column

        if (this.scene.curScene == "gardenScene"){
            if (color == "black") {
                this.blackFish.row = rowW;
                this.animatingElements = new Array(piece, this.blackFish);
            }
            else if (color == "white"){
                this.whiteFish.row = rowW;
                this.animatingElements = new Array(piece, this.whiteFish);
            }
        }
        else if (this.scene.curScene == "roomScene"){
            this.animatingElements = new Array(piece, this.cannon, this.cannonExplosion);
        }
    
        this.primitives.push(piece);                         // Pushes new piece to primitives to be displayed by the animator
        this.scene.gameOrchestrator.movesStack.push(move);   // Pushes new move to stack of executed moves
        this.scene.gameOrchestrator.piecesStack.push(piece); // Pushes new piece to stack of placed pieces
        move.occupyTiles();                                  // Updates board's tiles to be full
        piece.setCoords(rowW, colW, rowB, colB);             // Updates final coords of the piece that will be placed
    }

    animateUndo(move, piece){
        if (this.scene.curScene == "gardenScene") this.animatingElements = new Array(piece);
        else if (this.scene.curScene == "roomScene") {
            this.pieceExplosion.setCoords(piece);
            this.animatingElements = new Array(this.pieceExplosion, piece);
        }
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
        let h = 49;
        //console.log(this.primitives);
        this.primitives.forEach (element => {
            if (element.animation != null){
                if ((element.animation.currentFrame == -1 && !(element instanceof Cannon)) || // So animating objects (except cannon) don't show before animation starts
                    (this.scene.curScene =='gardenScene' && element instanceof Cannon) ||     // Hides cannon in garden scene
                    (this.scene.curScene =='roomScene' && element instanceof Fish)) return;   // Hides fish in room scene

                this.scene.pushMatrix();
                //console.log(element.rowW, element.animation);
                element.animation.apply(); 

                if (element instanceof MyPiece) {
                    this.scene.registerForPick(h + 1, this.scene.gameOrchestrator.gameboard.pieces[h - 49] ); h++;
                }

                element.display();

                this.scene.popMatrix();
            }
        });
    }
}