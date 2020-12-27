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
        this.lightsFolder.open();

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

        // let cameraKey = {};
        // let keys = Object.keys(graph.views);
        // for (let key of keys) {
        //     cameraKey[key] = key;
        // }
        // this.gui.add(graph, 'activeView', cameraKey).name("Camera").onChange(console.log("HI"));
        
        this.gui.add(this.scene, 'curView', Object.keys(this.scene.graph.views)).name("View Points").onChange((val) => {
            this.scene.camera = this.scene.graph.views[val];
            this.setActiveCamera(this.scene.camera);
        });
    
    }

    addScenesInterface() {
        // this.gui.add(this.scene.graph, "curScene", [ "skybox1", "skybox2"] ).name("Scene");
        this.gui.add(this.scene, 'curScene', this.scene.sceneIds).name('Scene').onChange(() => {this.scene.changeGraph();});
    }

}