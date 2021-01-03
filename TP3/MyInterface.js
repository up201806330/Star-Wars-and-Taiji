/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        this.lightsFolder = this.gui.addFolder("Lights");
        // folder hierarchy with .close() in functions
        this.taijiFolder = this.gui.addFolder("Taiji");
        this.taijiFolder.open();

        this.mainMenuFolder = this.taijiFolder.addFolder("Main Menu");
        this.actionsFolder = this.taijiFolder.addFolder("Actions");

        this.mainMenuFolder.add(this.scene, 'start').name('Start game!');
        this.mainMenuFolder.add(this.scene, 'currAILevel', this.scene.AILevels).name('A.I. Level').onChange(() => {this.scene.changeAILevel();});
        this.mainMenuFolder.add(this.scene, 'currGamemode', this.scene.gamemodes).name('Gamemode').onChange(() => {this.scene.changeGamemode();});
        this.mainMenuFolder.open();

        this.actionsFolder.add(this.scene, 'undo').name('Undo');
        this.actionsFolder.add(this.scene, 'movie').name('Movie');
        this.gui.add(this.scene, 'zoomIn').name('Zoom');
        this.gui.add(this.scene, 'lockUnlockCamera').name('Lock/Unlock View');

        this.initKeys();

        return true;
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    };

    initLightsInterface(lights) {

        // for each light source
        for (let lightId in lights) {

            // if the light source has parameters associated
            if (lights[lightId] !== undefined) {
                // console.log(lights[lightId]);
                // console.log(lights[lightId][0]); // ---> if enable="0" returns "1" !?!?!?

                // true -> light enabled, false -> light disabled
                this.scene.lightsStatus[lightId] = (lights[lightId][0] !== true) ? false : true;
                // console.log(this.scene.lightsStatus[lightId]);

                // adds light source to the gui
                this.lightsFolder.add(this.scene.lightsStatus, lightId);
            }
        }
    };

    initCamerasInterface() {

        this.viewChangerGui = this.gui.add(this.scene, 'curView', Object.keys(this.scene.graph.views)).name("View Points")
        
        this.viewChangerGui.onChange(() => {this.scene.changeView();});
    }

    addScenesInterface() {
        
        this.sceneChangerGui = this.gui.add(this.scene, 'curScene', this.scene.sceneIds).name('Scene')
        
        this.sceneChangerGui.onChange(() => {this.scene.changeGraph();});
    }

}