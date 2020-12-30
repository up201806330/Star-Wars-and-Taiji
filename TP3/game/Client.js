class Client{

    constructor(scene){
        this.scene = scene;
    }

    // vv All requests vv
    //   start_game
    //   move(Gs,Move)
    //   undo_move(Gs,Move)
    //   choose_move(Gs,Color,Difficulty)
    //   score_and_game_over(Gs) Res = [WhiteScore, BlackScore, WhoWhon]

    makeRequest(requestString, port) {
        var requestPort = port || 8081;
        var request = new XMLHttpRequest();
        request.open("GET", "http://localhost:" + requestPort + "/" + requestString, true);
    
        request.onload = data => this.chooseHandler(requestString)(this.scene, data);   
        request.onerror = function () { console.log("Error waiting for response"); };
    
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        request.send();

        this.scene.gameOrchestrator.processingRequest = true;
    }

    // Handlers
    handleReceivedGameState(scene, data) {
        scene.gameOrchestrator.gameState = data.target.response;
        //console.log(scene.gameOrchestrator.gameState);

        scene.gameOrchestrator.processingRequest = false;
    }

    handleScoreAndGameOver(scene, data){
        let parts =  data.target.response.substring(1,data.target.response.length-1).split(",");
        scene.whiteScore = parseInt(parts[0]);
        scene.blackScore = parseInt(parts[1]);
        if (parts[1] != "none"){
            scene.gameOver = true;
            scene.gameWinner = parts[1];
        }

        scene.gameOrchestrator.processingRequest = false;
    }

    handleReceivedMove(scene, data){
        scene.gameOrchestrator.gameState = data.target.response;
        scene.gameOrchestrator.nextTurn();
        
        scene.gameOrchestrator.processingRequest = false;
    }

    handleReceivedAIMove(scene, data){
        if (data.status == 400){
            console.log("Error with AI Move");
            return;
        }

        var parts = data.target.response.substring(1,data.target.response.length-1).split(",");
        var whiteTile = scene.gameOrchestrator.gameboard.getTileByBoardCoords({row:parts[0], column: parts[1]});
        var blackTile = scene.gameOrchestrator.gameboard.getTileByBoardCoords({row:parts[2], column: parts[3]});
        var move = new MyGameMove([whiteTile, blackTile], scene.gameOrchestrator.currColor);
        var piece = scene.gameOrchestrator.gameboard.nextUnassignedPiece();

        scene.gameOrchestrator.move(move, piece);
        
        //scene.gameOrchestrator.processingRequest = false;
    }

    chooseHandler(requestString){
        switch(requestString.substring(0, 4)){
            case "star":
            case "undo": return this.handleReceivedGameState;
            case "move": return this.handleReceivedMove;
            case "choo": return this.handleReceivedAIMove;
            case "scor": return this.handleScoreAndGameOver;
            default: return null;
        }
    }

}
