/**
 * Game Orchestrator
 */
class MyGameOrchestrator {
    
    constructor(scene,  holdingTiles) {
        this.scene = scene;
        // this.gameSequence = new MyGameSequence();
        // this.animator = new MyAnimator();
        this.gameboard = new MyGameboard(this.scene, 7);
        // this.theme = new MyScenegraph(…);
        // this.prolog = new MyPrologInterface(…);
    }
    
    orchestrate() {

    }


    display() {
        
    }

}