const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITESHEETS_INDEX = 5;
var MATERIALS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var NODES_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];
        this.views = [];

        
        this.curView = '';


        this.materialStack = [];
        this.textureStack = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;
        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1)
            return "tag <spritesheets> missing";
        else {
            if (index != SPRITESHEETS_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse textures block
            if ((error = this.parseSpritesheets(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            console.log("tag <animations> missing");
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse nodes block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";
        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }
        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if (rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');
        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        this.views = [];

        let i;
        const nonexistentParameter = true;
        const perspectiveParameters = ["id", "near", "far", "angle"];
        const orthoParameters = ["id", "near", "far", "left", "right", "top", "bottom"];

        let id, near, far, angle, left, right, top, bottom;
        let from, to, up;
        let xFrom, yFrom, zFrom;
        let xTo, yTo, zTo;
        let xUp, yUp, zUp;

        var views = viewsNode.children; // views (Cameras) Array
        var viewsChildren;

        if (views.length == 0) {
            this.onXMLError("No views are defined!");
        }

        for (let view of views) {
            i = 0;
            viewsChildren = view.children;

            // https://www.w3schools.com/xml/dom_nodes_info.asp
            if (view.nodeName == "perspective") {
                // console.log("Found a Perspective View!");

                // main parameters
                id = this.reader.getString(view, perspectiveParameters[i++], nonexistentParameter);
                near = this.reader.getFloat(view, perspectiveParameters[i++], nonexistentParameter);
                far = this.reader.getFloat(view, perspectiveParameters[i++], nonexistentParameter);
                angle = this.reader.getFloat(view, perspectiveParameters[i++], nonexistentParameter);

                // coords
                if (viewsChildren.length != 2) {
                    this.onXMLError("Not a valid view!");
                }

                xFrom = this.reader.getFloat(viewsChildren[0], "x", nonexistentParameter);
                yFrom = this.reader.getFloat(viewsChildren[0], "y", nonexistentParameter);
                zFrom = this.reader.getFloat(viewsChildren[0], "z", nonexistentParameter);

                xTo = this.reader.getFloat(viewsChildren[1], "x", nonexistentParameter);
                yTo = this.reader.getFloat(viewsChildren[1], "y", nonexistentParameter);
                zTo = this.reader.getFloat(viewsChildren[1], "z", nonexistentParameter);

                from = vec3.fromValues(xFrom, yFrom, zFrom);
                to = vec3.fromValues(xTo, yTo, zTo);

                this.views[id] = new CGFcamera(angle * DEGREE_TO_RAD, near, far, from, to);

                // console.log(this.views["defaultCamera"]);
            }

            else if (view.nodeName == "ortho") {
                // console.log("Found an Ortho View!");

                // main parameters
                id = this.reader.getString(view, orthoParameters[i++], nonexistentParameter);
                near = this.reader.getFloat(view, orthoParameters[i++], nonexistentParameter);
                far = this.reader.getFloat(view, orthoParameters[i++], nonexistentParameter);
                left = this.reader.getFloat(view, orthoParameters[i++], nonexistentParameter);
                right = this.reader.getFloat(view, orthoParameters[i++], nonexistentParameter);
                top = this.reader.getFloat(view, orthoParameters[i++], nonexistentParameter);
                bottom = this.reader.getFloat(view, orthoParameters[i++], nonexistentParameter);

                // coords
                if (viewsChildren.length != 3 && viewsChildren.length != 2) {
                    this.onXMLError("Not a valid view!");
                }

                xFrom = this.reader.getFloat(viewsChildren[0], "x", nonexistentParameter);
                yFrom = this.reader.getFloat(viewsChildren[0], "y", nonexistentParameter);
                zFrom = this.reader.getFloat(viewsChildren[0], "z", nonexistentParameter);

                xTo = this.reader.getFloat(viewsChildren[1], "x", nonexistentParameter);
                yTo = this.reader.getFloat(viewsChildren[1], "y", nonexistentParameter);
                zTo = this.reader.getFloat(viewsChildren[1], "z", nonexistentParameter);

                if (viewsChildren.length == 2) {
                    up = vec3.fromValues(0, 1, 0);
                }
                else {
                    xUp = this.reader.getFloat(viewsChildren[2], "x", nonexistentParameter);
                    yUp = this.reader.getFloat(viewsChildren[2], "y", nonexistentParameter);
                    zUp = this.reader.getFloat(viewsChildren[2], "z", nonexistentParameter);
                    up = vec3.fromValues(xUp, yUp, zUp);
                }

                from = vec3.fromValues(xFrom, yFrom, zFrom);    // from "=" position
                to = vec3.fromValues(xTo, yTo, zTo);          // to "=" target

                this.views[id] = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up);

                // console.log(this.views["demoOrtho"]);
            }

        }

        let defaultID = this.reader.getString(viewsNode, "default");
        if (defaultID == null) {
            this.onXMLError("Missing default view id in scene views.");
        }

        if (this.views[defaultID] == null) {
            return "Non existant view ID for default view: " + defaultID;
        }

        this.scene.camera = this.views[defaultID];
        // this.activeView = defaultID;
        this.scene.curView = defaultID;
        this.scene.interface.setActiveCamera(this.scene.camera);

        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {

        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID: " + lightId + ")";

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }
                else
                    return "light " + attributeNames[i] + " undefined for ID: " + lightId;
            }
            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;

        this.textures = [];

        let atLeastOne = false;
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName != "texture") {
                this.onXMLError("unknown tag <" + children[i].nodeName + ">. Ignoring texture");
                continue;
            }

            // Get id of the current material.
            var textureID = this.reader.getString(children[i], 'id');
            if (textureID == null) {
                this.onXMLError("no ID defined for texture. Ignoring texture");
                continue;
            }

            // Checks for repeated IDs.
            if (this.textures[textureID] != null) {
                this.onXMLError("ID must be unique for each texture (conflict: ID: " + textureID + "). Ignoring texture");
                continue;
            }

            // Get path            
            let path = this.reader.getString(children[i], 'path');
            if (path == null) this.onXMLError("unable to parse path for texture with ID: " + textureID + ". Ignoring texture");

            var texture = new CGFtexture(this.scene, path);
            this.textures[textureID] = texture;
            atLeastOne = true;
        }

        if (!atLeastOne) return "at least one texture must be defined on the materials block"; 

        console.log("Parsed textures");
    }
    
    /**
     * Parses the <spritesheets> block. 
     * @param {spritesheets block element} spritesheetsNode
     */
    parseSpritesheets(spritesheetsNode){
        var children = spritesheetsNode.children;

        this.scene.fontTexture = new CGFtexture(this.scene, "./scenes/images/font.png");

        this.spritesheets = [];
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName != "spritesheet") {
                this.onXMLError("unknown tag <" + children[i].nodeName + ">. Ignoring spritesheet");
                continue;
            }

            // Get id of the current spritesheet.
            var spritesheetID = this.reader.getString(children[i], 'id');
            if (spritesheetID == null) {
                this.onXMLError("no ID defined for spritesheet . Ignoring spritesheet ");
                continue;
            }

            // Checks for repeated IDs.
            if (this.spritesheets[spritesheetID] != null) {
                this.onXMLError("ID must be unique for each spritesheet  (conflict: ID: " + spritesheetID + "). Ignoring spritesheet ");
                continue;
            }

            // Get path            
            let path = this.reader.getString(children[i], 'path');
            if (path == null) this.onXMLError("unable to parse path for spritesheet with ID: " + spritesheetID + ". Ignoring spritesheet");

            // Get sizeM            
            let sizeM = this.reader.getString(children[i], 'sizeM');
            if (sizeM == null) this.onXMLError("unable to parse sizeM for spritesheet with ID: " + spritesheetID + ". Ignoring spritesheet");

            // Get sizeN            
            let sizeN = this.reader.getString(children[i], 'sizeN');
            if (sizeN == null) this.onXMLError("unable to parse sizeN for spritesheet with ID: " + spritesheetID + ". Ignoring spritesheet");


            var spritesheet = new MySpriteSheet(this.scene, new CGFtexture(this.scene, path), sizeM, sizeN);
            this.spritesheets[spritesheetID] = spritesheet;
        }
        console.log("Parsed spritesheets");
    }

    /**
     * Create fallback default material (hot pink so error is noticeable)
     */
    generateDefaultMaterial() {
        var materialDefault = new CGFappearance(this.scene);
        materialDefault.setShininess(1);
        materialDefault.setSpecular(1, 0.078, 0.576, 1); // Hot pink, so its noticeable
        materialDefault.setDiffuse(1, 0.078, 0.576, 1);
        materialDefault.setAmbient(1, 0.078, 0.576, 1);
        materialDefault.setEmission(1, 0.078, 0.576, 1);

        // Generates random material ID not currently in use.
        this.defaultMaterialID = "laAIJbskAIn1knSF)82nASdnakj2q"; // Randomly generated sequence to avoid name conflicts

        this.materials[this.defaultMaterialID] = materialDefault;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];
        this.generateDefaultMaterial();

        let atLeastOne = false;
        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName != "material") {
                this.onXMLError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null){
                this.onXMLError("no ID defined for material. Ignoring material");
                continue;
            }

            // Checks for repeated IDs.
            if (this.materials[materialID] != null){
                this.onXMLError("ID must be unique for each material (conflict: ID: " + materialID + "). Ignoring material");
                continue;
            }

            var materialArgs = children[i].children;
            var nodeNames = [];
            for (let j = 0; j < materialArgs.length; j++) nodeNames.push(materialArgs[j].nodeName);
            /**/
            // Shininess
            let shininessIndex = nodeNames.indexOf("shininess");
            let shininess;
            if (shininessIndex == -1) {
                this.onXMLMinorError("no shininess value defined for material with ID: " + materialID + ". Using default value (1)");
                shininess = 1;
            }
            else {
                shininess = this.reader.getFloat(materialArgs[shininessIndex], 'value');
                if (shininess == null){
                    this.onXMLMinorError("unable to parse shininess value for material with ID: " + materialID + ". Using default value (1)");
                    shininess = 1;
                } 
                else if (shininess <= 0) {
                    this.onXMLMinorError("shininess must be positive for material with ID: " + materialID + ". Using default value (1)");
                    shininess = 1;
                }
                else if (isNaN(shininess)) {
                    this.onXMLMinorError("shininess is non numeric value" + ". Using default value (1)");
                    shininess = 1;
                }
            }
            /**/
            /**/
            // Ambient
            let ambientIndex = nodeNames.indexOf("ambient");
            let ambient;
            if (ambientIndex == -1) {
                this.onXMLMinorError("no ambient value defined for material with ID: " + materialID + ". Using default values (hot pink)");
                ambient = this.defaultColor;
            }
            else ambient = this.parseColor(materialArgs[ambientIndex], "material ambient: " + materialID);
            /**/
            /**/
            // Diffuse
            let diffuseIndex = nodeNames.indexOf("diffuse");
            let diffuse;
            if (diffuseIndex == -1) {
                this.onXMLMinorError("no diffuse value defined for material with ID: " + materialID + ". Using default values (hot pink)");
                diffuse = this.defaultColor;
            }
            else diffuse = this.parseColor(materialArgs[diffuseIndex], "material diffuse: " + materialID);
            /**/
            /**/
            // Specular
            let specularIndex = nodeNames.indexOf("specular");
            let specular;
            if (specularIndex == -1) {
                this.onXMLMinorError("no specular value defined for material with ID: " + materialID + ". Using default values (hot pink)");
                specular = this.defaultColor;
            }
            else specular = this.parseColor(materialArgs[specularIndex], "material specular: " + materialID);
            /**/
            /**/
            // Emissive
            let emissiveIndex = nodeNames.indexOf("emissive");
            let emissive;
            if (emissiveIndex == -1) {
                this.onXMLMinorError("no emissive value defined for material with ID: " + materialID + ". Using default values (hot pink)");
                emissive = this.defaultColor;
            }
            else emissive = this.parseColor(materialArgs[emissiveIndex], "material emissive: " + materialID);
            /**/

            var result = new CGFappearance(this.scene);
            result.setShininess(shininess);
            result.setAmbient(ambient[0], ambient[1], ambient[2], ambient[3]);
            result.setDiffuse(diffuse[0], diffuse[1], diffuse[2], diffuse[3]);
            result.setSpecular(specular[0], specular[1], specular[2], specular[3]);
            result.setEmission(emissive[0], emissive[1], emissive[2], emissive[3]);
            this.materials[materialID] = result;
            atLeastOne = true;
        }

        if (!atLeastOne) return "at least one material must be defined on the materials block"; 

        this.log("Parsed materials");
    }

    /**
     * Parses the <animations> block.
     * @param {animations block element} animationsNode 
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        this.animations = [];

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName != "animation") {
                this.onXMLError("unknown tag <" + children[i].nodeName + ">" + ". Ignoring node");
                continue;
            }

            // Get id of the current animation.
            var animID = this.reader.getString(children[i], 'id');
            
            if (animID == null){
                this.onXMLError("no ID defined for animID. Ignoring animation");
                continue;
            }

            // Checks for repeated IDs.
            if (this.animations[animID] != null){
                this.onXMLError("ID must be unique for each animation (conflict: ID: " + animID + "). Ignoring animation.");
                continue;
            }

            var keyframes = [];

            var keyframesXML = children[i].children;

            if (keyframesXML.length < 1){
                this.onXMLError("Animation must have at least one keyframe. Ignoring animation");
                continue;
            }
            
            var previousInstant = null;
            for (let j = 0; j < keyframesXML.length; j++){
                // Get instant of the current keyframe.
                var instant = this.reader.getFloat(keyframesXML[j], 'instant');

                if (instant == null){
                    this.onXMLError("no instant defined for keyframe. Ignoring keyframe");
                    continue;
                }
    
                // Checks for repeated IDs.
                for (var x in keyframes){
                    if (x.instant == instant){
                        this.onXMLError("There mustn't be keyframes at the same instant in an animation (conflict: instant: " + instant + "). Ignoring keyframe.");
                        continue;
                    }
                }

                if (instant < 0) {
                    this.onXMLMinorError("instant must be positive. Ignoring keyframe");
                    continue;
                }
                else if (isNaN(instant)) {
                    this.onXMLMinorError("instant is non numeric value. Ignoring keyframe");
                    continue;
                }
                else if (previousInstant != null && instant < previousInstant){
                    this.onXMLMinorError("instant out of order. Ignoring keyframe");
                    continue;
                }

                var translation;
                var rotation = [];
                var scale;
                var keyframeArgs = keyframesXML[j].children;
                if (keyframeArgs.length != 5){
                    this.onXMLError("Animation keyframe doesn't have right number of transformations (instant = " +  + ")");
                }
                for (let k = 0; k < keyframeArgs.length; k++){
                    if (keyframeArgs[k].nodeName == "translation"){
                        translation = vec3.fromValues(...this.parseCoordinates3D(keyframeArgs[k], "translation"));
                    }
                    else if (keyframeArgs[k].nodeName == "rotation"){
                        let axis = this.reader.getString(keyframeArgs[k], 'axis');
                        let angle = this.reader.getFloat(keyframeArgs[k], 'angle');
                        switch(axis){
                            case 'x':
                                rotation[0] = angle;
                                break;
                            case 'y':
                                rotation[1] = angle;
                                break;
                            case 'z':
                                rotation[2] = angle;
                                break;
                            default:
                                this.onXMLError("Invalid axis on rotation. Ignoring keyframe");
                                continue;
                        }
                    }
                    else if (keyframeArgs[k].nodeName == "scale"){
                        scale = vec3.fromValues(...this.parseCoordinates3DScale(keyframeArgs[k], "scale"));
                    }
                }
                rotation = vec3.fromValues(...rotation);
                let newKeyframe = new KeyFrame(instant, translation, rotation, scale);
                keyframes[j] = newKeyframe;
            }
            // Edge case for when there is only one keyframe
            if (keyframes.length == 1) keyframes[1] = keyframes[0];
            
            var newAnim = new KeyframeAnimation(this.scene, keyframes);
            this.animations[animID] = newAnim;
        }
        console.log("Parsed animations");
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
    parseNodes(nodesNode) {

        var children = nodesNode.children;

        this.nodes = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "node") {
                this.onXMLError("unknown tag <" + children[i].nodeName + ">" + ". Ignoring node");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');

            if (nodeID == null){
                this.onXMLError("no ID defined for nodeID. Ignoring node");
                continue;
            }

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null){
                this.onXMLError("ID must be unique for each node (conflict: ID: " + nodeID + "). Ignoring node.");
                continue;
            }

            grandChildren = children[i].children;

            this.nodes[nodeID] = new MyNode(nodeID, this);

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");
            var animationsIndex = nodeNames.indexOf("animationref");

            // Transformations
            if (transformationsIndex == -1) {
                this.onXMLMinorError("There isn't a transformations tag");
            }
            else { 
                let nodeTransformations = grandChildren[transformationsIndex].children;

                let translX, translY, translZ;
                let rotAxis, rotDegree;
                let scaleX, scaleY, scaleZ;

                for (let k = 0; k < nodeTransformations.length; k++) {

                    switch (nodeTransformations[k].nodeName) {
                        case "translation":
                            translX = this.reader.getFloat(nodeTransformations[k], 'x');
                            translY = this.reader.getFloat(nodeTransformations[k], 'y');
                            translZ = this.reader.getFloat(nodeTransformations[k], 'z');

                            // syntax: translate(out, a, v) -> out: the receiving matrix, a: the matrix to translate, v: vector to translate by
                            // http://glmatrix.net/docs/module-mat4.html
                            mat4.translate(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix, [translX, translY, translZ]);
                            break;

                        case "rotation":
                            rotAxis = this.reader.getString(nodeTransformations[k], 'axis');
                            rotDegree = this.reader.getFloat(nodeTransformations[k], 'angle') * DEGREE_TO_RAD;

                            mat4.rotate(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix, rotDegree, this.axisCoords[rotAxis]);
                            break;

                        case "scale":
                            scaleX = this.reader.getFloat(nodeTransformations[k], "sx");
                            scaleY = this.reader.getFloat(nodeTransformations[k], "sy");
                            scaleZ = this.reader.getFloat(nodeTransformations[k], "sz");

                            mat4.scale(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix, [scaleX, scaleY, scaleZ]);
                            break;

                        default:
                            break;

                    }
                }
            }
            
            // Texture
            var textureID = this.reader.getString(grandChildren[textureIndex], 'id');
            if (textureID == null) this.onXMLError("Coulnd't parse texture");
            if (textureID != "null" && textureID != "clear" && this.textures[textureID] == null) this.onXMLError("Texture id " + textureID + " doesn't exist");

            this.nodes[nodeID].textureID = textureID;

            var texParams = [];
            for (let l = 0; l < grandChildren[textureIndex].children.length; l++) texParams.push(grandChildren[textureIndex].children[l].nodeName);

                if (textureID != "clear"){
                let afs, aft;
                let amplificationIndex = texParams.indexOf('amplification');
                if (amplificationIndex == -1) {
                    this.onXMLMinorError("Each texture block must indicate amplification; Using default values. (ID: " + textureID + ")");
                    afs = 1;
                    aft = 1;
                }
                else {
                    afs = this.reader.getFloat(grandChildren[textureIndex].children[amplificationIndex], 'afs');
                    if (isNaN(afs)) {
                        this.onXMLMinorError("Amplification afs is non numeric value. Using default values. (ID: " + textureID + ")");
                        afs = 1;
                    }
                    if (afs <= 0) {
                        this.onXMLMinorError("Amplification afs must be positive. Using default values. (ID: " + textureID + ")");
                        afs = 1;
                    }

                    aft = this.reader.getFloat(grandChildren[textureIndex].children[amplificationIndex], 'aft');
                    if (isNaN(aft)) {
                        this.onXMLMinorError("Amplification aft is non numeric value. Using default values. (ID: " + textureID + ")");
                        aft = 1;
                    }
                    if (aft <= 0) {
                        this.onXMLMinorError("Amplification aft must be positive. Using default values. (ID: " + textureID + ")");
                        aft = 1;
                    }
                }
                this.nodes[nodeID].afs = afs;
                this.nodes[nodeID].aft = aft;
            }
            
            // Material
            var materialID = this.reader.getString(grandChildren[materialIndex], 'id');
            if (materialID == null) this.onXMLError("Coulnd't parse material");
            if (materialID != "null" && this.materials[materialID] == null) this.onXMLError("Material id " + materialID + " doesn't exist");            

            this.nodes[nodeID].materialID = materialID;

            // Animations
            if (animationsIndex > 0) {
                var animID = this.reader.getString(grandChildren[animationsIndex], 'id');
                if (animID == null) this.onXMLError("Coulnd't parse animation");
                if (animID != "null" && this.animations[animID] == null) this.onXMLError("Animation id " + animID + " doesn't exist"); 
                this.nodes[nodeID].animID = animID;           
            }

            // Descendants
            if (descendantsIndex == -1) {
                this.onXMLError("An intermediate node must have at least one descendant!");
            }

            let nodeDescendants = grandChildren[descendantsIndex].children;
            if (nodeDescendants.length == 0) {
                this.onXMLError("An intermediate node must have at least one descendant!");
            }

            for (let k = 0; k < nodeDescendants.length; k++) {

                if (nodeDescendants[k].nodeName == "noderef") {

                    let noderefElement = this.reader.getString(nodeDescendants[k], "id");

                    this.nodes[nodeID].addChildNode(noderefElement);
                }

                else if (nodeDescendants[k].nodeName == "leaf") {
                    let primType = this.reader.getItem(nodeDescendants[k], "type", ["rectangle", "triangle", "torus", "cylinder", "sphere", "spritetext", "spriteanim"]);

                    if (primType == null) {
                        this.onXMLError("Unknown primitive type!");
                    }

                    let newLeaf = new MyPrimitive(primType, this, nodeDescendants[k]);
                    this.nodes[nodeID].addLeaf(newLeaf);

                    if (primType == "spriteanim"){
                        this.animations[newLeaf.aPrimitive] = newLeaf.aPrimitive;
                    }
                }

                else {
                    this.onXMLError("Unknown descendant type!");
                }
            }

        }
    }

    parseBoolean(node, name, messageError) {
        var boolVal = this.reader.getBoolean(node, name);
        if (!(
            boolVal != null &&
            !isNaN(boolVal) &&
            (boolVal == true || boolVal == false)
        )
        ) {
            this.onXMLMinorError(
                "unable to parse value component " +
                messageError +
                "; assuming 'value = 1'"
            );
            return true;

        }
        return boolVal;
    }
    
    /**
     * Parse the coordinates from a node with ID: id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
        this.onXMLMinorError("unable to parse x-coordinate of the " + messageError);

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
        this.onXMLMinorError("unable to parse y-coordinate of the " + messageError);

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
        this.onXMLMinorError("unable to parse z-coordinate of the " + messageError);

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Exactly the same but for scale vector parameters
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3DScale(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'sx');
        if (!(x != null && !isNaN(x)))
        this.onXMLMinorError("unable to parse x-coordinate of the " + messageError);

        // y
        var y = this.reader.getFloat(node, 'sy');
        if (!(y != null && !isNaN(y)))
        this.onXMLMinorError("unable to parse y-coordinate of the " + messageError);

        // z
        var z = this.reader.getFloat(node, 'sz');
        if (!(z != null && !isNaN(z)))
        this.onXMLMinorError("unable to parse z-coordinate of the " + messageError);

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID: id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R    1, 0.078, 0.576, 1
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1)){
            this.onXMLMinorError("unable to parse R component of the " + messageError + ". Using default value (1)");
            r = 1;
        }

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1)){
            this.onXMLMinorError("unable to parse G component of the " + messageError + ". Using default value (0.078)");
            g = 0.078;
        }

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1)){
            this.onXMLMinorError("unable to parse B component of the " + messageError + ". Using default value (0.576)");
            b = 0.576;
        }

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1)){
            this.onXMLMinorError("unable to parse A component of the " + messageError + ". Using default value (1)");
            a = 1;
        }

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        this.displayNode(this.idRoot);
    }

    displayNode(nodeToDisplayID) {
        let nodeToDisplay = this.nodes[nodeToDisplayID];

        this.scene.multMatrix(nodeToDisplay.transformMatrix);

        // Animations
        if (nodeToDisplay.animID != null) {
            if (!this.animations[nodeToDisplay.animID].active) return;
            this.animations[nodeToDisplay.animID].apply();
        }

        if (nodeToDisplay.materialID != "null") this.materialStack.push(nodeToDisplay.materialID);
        let topOfMatStack = this.materialStack[this.materialStack.length - 1];

        if (nodeToDisplay.textureID != "null") this.textureStack.push(nodeToDisplay.textureID);
        let topofTexStack = this.textureStack[this.textureStack.length - 1];

        for (let leaf = 0; leaf < nodeToDisplay.leaves.length; leaf++) {
            // Material and Texture
            let thisMaterial;
            if (this.materials[topOfMatStack] == null)  thisMaterial = this.materials[this.defaultMaterialID];
            else                                        thisMaterial = this.materials[topOfMatStack];

            nodeToDisplay.leaves[leaf].aPrimitive.updateTexCoords(nodeToDisplay.afs, nodeToDisplay.aft);
            thisMaterial.setTextureWrap("REPEAT", "REPEAT");

            if (this.textures[topofTexStack] != null && this.textures[topofTexStack] != "clear") 
                thisMaterial.setTexture(this.textures[topofTexStack]);
                
            thisMaterial.apply();

            // Display
            nodeToDisplay.leaves[leaf].aPrimitive.display();
        }

        for (let i = 0; i < nodeToDisplay.childNodes.length; i++) {
            this.scene.pushMatrix();
            this.displayNode(nodeToDisplay.childNodes[i]);
            this.scene.popMatrix();
        }

        if (nodeToDisplay.materialID != "null") this.materialStack.pop();
        if (nodeToDisplay.textureID != "null") this.textureStack.pop();
    }
}