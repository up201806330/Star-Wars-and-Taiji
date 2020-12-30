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
    }

    // Handlers
    handleReceivedGameState(scene, data) {
        scene.gameOrchestrator.gameState = data.target.response;
        console.log(scene.gameOrchestrator.gameState);
    }

    handleScoreAndGameOver(scene, data){
        let parts =  data.target.response.substring(1,data.target.response.length-1).split(",");
        scene.whiteScore = parseInt(parts[0]);
        scene.blackScore = parseInt(parts[1]);
        if (parts[1] != "none"){
            scene.gameOver = true;
            scene.gameWinner = parts[1];
        }
    }

    chooseHandler(requestString){
        switch(requestString.substring(0, 4)){
            case "star":
            case "move":
            case "undo":
            case "choo": return this.handleReceivedGameState;
            case "scor": return this.handleScoreAndGameOver;
            default: return null;
        }
    }

}
