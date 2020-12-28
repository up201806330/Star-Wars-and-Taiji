/**
 * Game Orchestrator
 */
class MyGameOrchestrator {
    
    constructor(scene) {
        this.scene = scene;

        // TODO state for statemachine

        this.selectedTiles = [];
        this.empties = [];

        // this.gameSequence = new MyGameSequence();
        // this.animator = new MyAnimator();
        this.gameboard = new MyGameBoard(scene, 7);
        // this.theme = new MyScenegraph(…);
        this.client = new Client();
        // this.gameState = ...;

        this.animator = new MyAnimator(scene);
        // this.movesStack
    }
    
    update(now) {
        this.animator.update(now);
    }

    orchestrate() { 
        
    }
    

    managePick(pickMode, pickResults) {
        if (pickMode == false) {
            if (pickResults != null && pickResults.length > 0) {
                for (var i = 0; i < pickResults.length; i++) {
                    var obj = pickResults[i][0];
                    if (obj) {
                        var customId = pickResults[i][1];
                        // console.log("CustomId", customId);
                        // console.log("Obj", obj);
                        this.onTileSelected(obj, customId, pickResults);
                    }
                }
                pickResults.splice(0, pickResults.length);
            }
        }
    }

    onTileSelected(obj, customId, pickResults) {

        if (obj instanceof MyTile) {
            
            if (obj.isEmpty()) {

                switch (this.selectedTiles.length) {
                    case 0:
                        console.log("Selecting First One!", customId);

                        this.selectedTiles[0] = obj;
                        obj.setOccupied();

                        this.empties = this.getEmptyAdjacents(customId, pickResults);

                        for (let i = 0; i < this.empties.length; i++) { this.empties[i].isSelected = true; }
                        break;
                    
                    case 1:
                        if (this.containsObject(obj, this.empties)) {
                            console.log("Selecting Second One!");
                            this.selectedTiles[1] = obj;
                            obj.setOccupied();

                            this.selectedTiles[0].isOccupied = true;
                            this.selectedTiles[1].isOccupied = true;

                            let gameMove = new MyGameMove(this.selectedTiles);
                            // process gameMove

                            this.selectedTiles = [];
                            this.clearAdjacentHighlights();
                        }
                        else {
                            this.selectedTiles[0].unsetOccupied();
                            this.selectedTiles = [];
                            this.clearAdjacentHighlights();
                            console.log("Resetting selection!"); }

                        break;
                }
            }
            else { console.log("Occupied Tile!"); }

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

    // this.selectTiles = [[1,2],[2,3],[3,4]]
    // onSelected(obj, customId) {

    //     if(this.nSelected == 0) -> branco
    //     else this.nSelected == 1 -> preto this.nSelected = 0

    // }

    // function to get empty adjacents of 1st tile selected
    getEmptyAdjacents(customId, pickResults) {
        let emptyAdjacents = [];

        let foundTile;

        let indexId = customId - 1;
        console.log(indexId);

        // check row up
        let checkUpId = indexId - 7;
        if (checkUpId >= 0) {
            foundTile = this.gameboard.getTileByBoardCoords({row: checkUpId % 7, column: Math.floor(checkUpId / 7)});
            if (foundTile != null && foundTile.empty) emptyAdjacents.push(foundTile);
        }

        let checkDownId = indexId + 7;
        if (checkDownId < 49) {
            foundTile = this.gameboard.getTileByBoardCoords({row: checkDownId % 7, column: Math.floor(checkDownId / 7)});
            if (foundTile != null && foundTile.empty) emptyAdjacents.push(foundTile);
        }

        let checkRightId = indexId + 1;
        if ( Math.floor(checkRightId / 7) == Math.floor(indexId / 7) ) {
            foundTile = this.gameboard.getTileByBoardCoords({row: checkRightId % 7, column: Math.floor(checkRightId / 7)});
            if (foundTile != null && foundTile.empty) emptyAdjacents.push(foundTile);
        }

        let checkLeftId = indexId - 1;
        if ( Math.floor(checkLeftId / 7) == Math.floor(indexId / 7) ) {
            foundTile = this.gameboard.getTileByBoardCoords({row: checkLeftId % 7, column: Math.floor(checkLeftId / 7)});
            if (foundTile != null && foundTile.empty) emptyAdjacents.push(foundTile);
        }

        console.log("Size: ", emptyAdjacents);
        return emptyAdjacents;
    }

    findObjUsingCustomId(checkUpId, pickResults) {
        console.log(pickResults);
        for (let i = 0; i < pickResults.length; i++) {
            let obj = pickResults[i][0];
            if (obj) {
                let id = pickResults[i][1];
                console.log("ids: ", id);

                // if (id == checkUpId) return obj;
            }
        }
        return null;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.graph.displayScene();
        this.scene.popMatrix();
        // this.theme.display(); <--

        this.scene.pushMatrix();
        this.scene.defaultAppearance.apply();
        this.gameboard.display();
        this.scene.popMatrix();
        
        this.animator.display();
    }

    // vv All requests vv
    //   start_game
    //   move(Gs, Move)
    //   undo_move(Gs, Move)
    //   choose_move(Gs, Color, Difficulty)
    //   score_and_game_over(Gs)

    sendRequest(requestString){
        this.client.getPrologRequest(requestString, 
            function(data){
                handleReply(requestString, data.target.response);
            },
            function(data){
                console.log("Error sending request to prolog");
            });
    }

    handleReply(requestString, reply){
        
    }
}