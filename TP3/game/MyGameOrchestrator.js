/**
 * Game Orchestrator
 */
class MyGameOrchestrator {
    
    constructor(scene) {
        this.scene = scene;
        // this.gameSequence = new MyGameSequence();
        // this.animator = new MyAnimator();
        this.gameboard = new MyGameBoard(scene, 7);
        // this.theme = new MyScenegraph(…);
        this.client = new Client();
        // this.gameState = ...;
    }
    
    update(time) {
        // this.animator.update(time);
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
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                        
                        let row = Math.floor( (customId - 1) / 7);
                        let col = (customId - 1) % 7;
                        console.log("aka row: " + row + " col: " + col);					
                    }
                }
                pickResults.splice(0, pickResults.length);
            }
        }
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
        
        // this.animator.display();
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