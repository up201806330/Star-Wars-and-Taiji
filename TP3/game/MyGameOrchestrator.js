/**
 * Game Orchestrator
 */
class MyGameOrchestrator {
    
    constructor(scene) {
        this.scene = scene;

        this.selectedTiles = [];
        this.empties = [];

        this.client = new Client(scene);
        this.gameboard = new MyGameBoard(scene, 7);
        this.score = new ScoreDisplay(scene);
        this.message = new MessageDisplay(scene);

        // GameState and game flow flags
        this.gameState = null;
        this.movesStack = [];
        this.piecesStack = [];

        this.whiteScore = 0;
        this.blackScore = 0;

        this.currTurn = 'p1';
        this.currColor;
        
        this.AILevel = '2';
        this.gamemode = 'pve';

        // this.gameSequence = new MyGameSequence();

        this.animator = new MyAnimator(scene);
    }
    
    update(now) {
        this.animator.update(now);
    }

    orchestrate() { 
        if (this.animator.animatingElements == null && !this.processingRequest){
            if (this.outdatedMessage) {
                this.score.updateScore(this.whiteScore, this.blackScore);

                if (this.gameWinner != null){
                    this.message.setText(this.gameWinner.charAt(0).toUpperCase() + this.gameWinner.slice(1) + " Wins", this.gameWinner == 'white')
                }
                else {
                    this.message.setText(this.turnInString(), this.currColor == 'white');
                }

                this.outdatedMessage = false;
            }

            if (((this.gamemode == 'pve' && this.currTurn == 1) || this.gamemode == 'eve') && this.gameWinner == null && this.gameState != null){
                console.log("Computer turn");
                console.log(this.whiteScore, this.blackScore);
                this.aiMove();
            }
        }
    }
    
    managePick(pickMode, pickResults) {
        if (pickMode == false) {
            if (pickResults != null && pickResults.length > 0) {
                for (var i = 0; i < pickResults.length; i++) {
                    var obj = pickResults[i][0];
                    if (obj) {
                        var customId = pickResults[i][1];
                        this.onTileSelected(obj, customId, pickResults);
                    }
                }
                pickResults.splice(0, pickResults.length);
            }
        }
    }

    onTileSelected(obj, customId, pickResults) {
        if (this.gameState == null){
            console.log("Game hasnt started yet, cant select");
            return;
        }

        if (this.animator.animatingElements!=null){
            console.log("Animation in progress, cant select");
            return;
        }
        
        if ((this.gamemode == 'pve' && this.currTurn == 1) || this.gamemode == 'eve'){
            console.log("Not players turn, cant select");
            return;
        }

        if (this.gameWinner != null){
            console.log("Game has ended, cant select");
            return;
        }

        if (obj instanceof MyTile) {
            
            if (obj.isEmpty()) {

                switch (this.selectedTiles.length) {
                    case 0:
                        //console.log("Selecting First One!", customId);

                        this.selectedTiles[0] = obj;
                        obj.setOccupied();

                        this.empties = this.getEmptyAdjacents(customId, pickResults);

                        for (let i = 0; i < this.empties.length; i++) { this.empties[i].isSelected = true; }
                        break;
                    
                    case 1:
                        if (this.containsObject(obj, this.empties)) {
                            //console.log("Selecting Second One!");
                            this.selectedTiles[1] = obj;
                            obj.setOccupied();
                            
                            // console.log("Selected Tiles Array:");
                            // console.log(this.selectedTiles);
                            var gameMove = new MyGameMove((this.currColor == 'white') ? this.selectedTiles : this.selectedTiles.reverse(), this.currColor);
                            var gamePiece = this.gameboard.nextUnassignedPiece();
                            this.move(gameMove, gamePiece);

                            this.selectedTiles = [];
                            this.clearAdjacentHighlights();
                        }
                        else {
                            this.selectedTiles[0].unsetOccupied();
                            this.selectedTiles = [];
                            this.clearAdjacentHighlights();
                            console.log("Resetting selection!");
                        }
                        break;
                }
            }
            else {
                console.log("Occupied Tile!"); 
                if (this.selectedTiles.length != 0) this.selectedTiles[0].unsetOccupied();
                this.selectedTiles = [];
                this.clearAdjacentHighlights();
                 console.log("Resetting selection!");
            }

        }
        else {
            if (this.selectedTiles.length != 0) this.selectedTiles[0].unsetOccupied();
            this.selectedTiles = [];
            this.clearAdjacentHighlights();
            console.log("Resetting selection!");
        }
    }

    containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }
    
        return false;
    }

    clearAdjacentHighlights() {
        for (let tileIndex = 0; tileIndex < this.gameboard.tiles.length; tileIndex++) {
            this.gameboard.tiles[tileIndex].isSelected = false;
        }
    }

    // function to get empty adjacents of 1st tile selected
    getEmptyAdjacents(customId, pickResults) {
        let emptyAdjacents = [];

        let foundTile;

        let indexId = customId - 1;
        // console.log(indexId);

        // check row up
        let checkUpId = indexId - 7;
        if (checkUpId >= 0) {
            foundTile = this.gameboard.getTileByBoardCoords({row: Math.floor(checkUpId / 7), column: checkUpId % 7});
            if (foundTile != null && foundTile.empty) emptyAdjacents.push(foundTile);
        }

        let checkDownId = indexId + 7;
        if (checkDownId < 49) {
            foundTile = this.gameboard.getTileByBoardCoords({row: Math.floor(checkDownId / 7), column: checkDownId % 7});
            if (foundTile != null && foundTile.empty) emptyAdjacents.push(foundTile);
        }

        let checkRightId = indexId + 1;
        if ( Math.floor(checkRightId / 7) == Math.floor(indexId / 7) ) {
            foundTile = this.gameboard.getTileByBoardCoords({row: Math.floor(checkRightId / 7), column: checkRightId % 7});
            if (foundTile != null && foundTile.empty) emptyAdjacents.push(foundTile);
        }

        let checkLeftId = indexId - 1;
        if ( Math.floor(checkLeftId / 7) == Math.floor(indexId / 7) ) {
            foundTile = this.gameboard.getTileByBoardCoords({row: Math.floor(checkLeftId / 7), column: checkLeftId % 7});
            if (foundTile != null && foundTile.empty) emptyAdjacents.push(foundTile);
        }

        // console.log("Size: ", emptyAdjacents);
        return emptyAdjacents;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.graph.displayScene();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.defaultAppearance.apply();
        this.gameboard.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.score.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.message.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.animator.display();
        this.scene.popMatrix();
    }

    chooseStartingTurn(){ // TODO animation with this
        this.currTurn = Math.round(Math.random());
        this.currColor = "white";
        console.log(this.turnInString());
    }
    
    turnInString(){
        switch(this.currTurn){
            case 0:
                if (this.gamemode == 'pvp') return ' Player 1 ';
                else if (this.gamemode == 'pve') return '  Player  ';
                else if (this.gamemode == 'eve') return 'Computer 1';
                break;
            case 1:
                if (this.gamemode == 'pvp') return ' Player 2 ';
                else if (this.gamemode == 'pve') return ' Computer ';
                else if (this.gamemode == 'eve') return 'Computer 2';
                break;
            default:
                break;
        }
    }

    nextTurn(){
        if (this.currColor == 'white')  this.currColor = 'black';
        else                            this.currColor = 'white';

        this.currTurn = (this.currTurn + 1) % 2;
        this.outdatedMessage = true;
    }

    // Prolog functions
    startGame(){
        this.client.makeRequest("start_game");
        this.piecesStack.forEach(element => element.unsetCoords());
        this.gameboard.tiles.forEach(element => element.unsetOccupied());
        this.chooseStartingTurn();
        this.outdatedMessage = true;
        this.gameWinner = null;
    }
    
    move(move, piece){
        console.log(move, piece);
        if (this.gameState != null) {
            this.client.makeRequest("move("+this.gameState+","+move.toString()+")");
            this.animator.animateMove(move, piece);
            this.movesStack.push(move);
            this.piecesStack.push(piece);
            move.occupyTiles();
        }
        else console.log("Can't send request to prolog: Move");
    }

    undoMove(){
        if (this.gameState != null && this.animator.animatingElements==null) {
            let othersMove = this.movesStack.pop();
            let move = this.movesStack.pop();
            this.movesStack.push(othersMove);
            this.client.makeRequest("undo_move(" + this.gameState + "," + move.toString() + ")");
            let othersPiece = this.piecesStack.pop();
            this.piecesStack.pop().unsetCoords();
            this.piecesStack.push(othersPiece);
            
            move.tileCoordsArray[0].unsetOccupied();
            move.tileCoordsArray[1].unsetOccupied();
        }
        else console.log("Can't send request to prolog: Undo Move");
    }

    aiMove(){
        if (this.gameState != null && this.currColor != null && this.AILevel != null && this.gameWinner == null) this.client.makeRequest("choose_move("+this.gameState+","+this.currColor+","+this.AILevel+")");
        else console.log("Can't send request to prolog: AI Move");
    }

    scoreAndGameOver(){
        if (this.gameState != null) this.client.makeRequest("score_and_game_over("+this.gameState+")");
    }
}