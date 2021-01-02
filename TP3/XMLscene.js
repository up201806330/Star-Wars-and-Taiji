/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;

        this.lightsStatus = [];
        this.curView = "";

        this.curScene = 'gardenScene';
        this.sceneIds = { 'Room': 'roomScene', 'Garden': 'gardenScene' };

        this.currAILevel = '2';
        this.AILevels = { 'Easy': '1', 'Medium': '2', 'Hard':'3' };
        
        this.currGamemode = 'pve';
        this.gamemodes = { 'Player vs Player' : 'pvp', 'Player vs Computer' : 'pve', 'Computer vs Computer' : 'eve' };

        this.zoomInCounter = 0;
        this.zoomOutCounter = 0;
        this.zoomedIn = false;
        this.targetY = -10;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.first = true;
        this.sceneInited = false;

        this.initCameras();

        this.start = function() {
            this.gameOrchestrator.startGame();
            this.interface.mainMenuFolder.close();
            this.interface.actionsFolder.open();
        }

        this.undo = function() {
            this.gameOrchestrator.undoMove();
        }

        this.movie = function() {
            this.gameOrchestrator.movie();
        }

        this.zoomIn = function() {
            if (this.zoomOutCounter != 0 || this.zoomInCounter != 0) return;
            if (this.zoomedIn) this.zoomOutCounter = 10;
            else this.zoomInCounter = 10;
        }

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(30);

        this.loadingProgressObject=new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress=0;

        this.defaultAppearance = new CGFappearance(this);

        this.gameOrchestrator = new MyGameOrchestrator(this);

        this.setPickEnabled(true);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);

                this.lights[i].setVisible(true);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        this.initLights();

        // After graph has loaded, add each light source / camera to the interface
        
        if (this.first) { // not to duplicate elements of the gui
            this.first = false;
            this.interface.addScenesInterface();
            this.interface.initLightsInterface(this.graph.lights);
            this.interface.initCamerasInterface(this.graph);
        }
        
        this.sceneInited = true;

        // let foundTile = this.gameboard.getTileByBoardCoords({row: 6, column: 7});
        // if (foundTile != null) console.log(foundTile.coordinates);
        // else console.log("Not Found!");
        
        // this.gameboard.display();

        this.setUpdatePeriod(100);
    }


    /**
     * Updates lights enabled status
     */
    lightsUpdate() {
        let i = 0;

        // for each light id
        for (let lightId in this.lightsStatus) {
            
            // checks its status (true -> enabled, false -> disabled)
            if (this.lightsStatus[lightId]) {
                this.lights[i].enable();
                this.lights[i].setVisible(true);
            }
            else {
                this.lights[i].disable();
                this.lights[i].setVisible(false);
            }

            this.lights[i].update();
            i++;
        }
    }

    /**
     * Called every 100ms, updates all animations based on time elapsed
     * @param {current instant} t 
     */
    update(t) {
        var now  = t/1000.0;

        if (this.sceneInited) {
            for(var animation in this.graph.animations){
                this.graph.animations[animation].updateAnimation(now);
            }

            if (this.zoomInCounter > 0) {
                this.camera.zoom(3);
                this.targetY -= 2.6;
                this.camera.setTarget(vec3.fromValues(0, this.targetY, -15));
                
                this.zoomInCounter--;
                if (this.zoomInCounter == 0) this.zoomedIn = true;
            }
            else if (this.zoomOutCounter > 0) {
                this.camera.zoom(-3);
                this.targetY += 2.6;
                this.camera.setTarget(vec3.fromValues(0, this.targetY, -15));

                this.zoomOutCounter--;
                if (this.zoomOutCounter == 0) this.zoomedIn = false;
            }
            
            this.gameOrchestrator.update(now);
            this.gameOrchestrator.orchestrate();
        }
    }

    /**
     * Displays the scene.
     */
    display() {

        this.gameOrchestrator.managePick(this.pickMode, this.pickResults);
        
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        this.lightsUpdate();

        if (this.sceneInited) {
            // Draw axis
            // this.axis.display();
 
            this.defaultAppearance.apply();
            
            this.gameOrchestrator.display();

            // Displays the scene (MySceneGraph function).
            // this.graph.displayScene();
        }
        else {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    changeGraph(){
        this.sceneInited = false; // fixed error in console

        // this.interface.gui.remove(this.interface.lightsFolder);
        this.interface.lightsFolder.close();

        this.first = false;

        this.zoomedIn = false;
        this.zoomInCounter = 0;
        this.zoomOutCounter = 0;
        this.targetY = -10;


        this.graph = new MySceneGraph(this.curScene + '.xml', this);
    }
    
    changeAILevel(){
        this.gameOrchestrator.AILevel = this.currAILevel;
    }

    changeGamemode(){
        this.gameOrchestrator.gamemode = this.currGamemode;
    }
}