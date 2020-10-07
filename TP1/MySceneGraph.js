const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;

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
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;
        // console.log("\t\t\t\t\t\t\tidRoot: " + this.idRoot);

        // Get axis length        
        if(referenceIndex == -1)
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
        // this.onXMLMinorError("To do: Parse views and create cameras.");

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
                id    = this.reader.getString(view, perspectiveParameters[i++], nonexistentParameter);
                near  = this.reader.getFloat(view, perspectiveParameters[i++], nonexistentParameter);
                far   = this.reader.getFloat(view, perspectiveParameters[i++], nonexistentParameter);
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
                to   = vec3.fromValues(xTo, yTo, zTo);

                this.views[id] = new CGFcamera(angle, near, far, from, to);
                
                // console.log(this.views["defaultCamera"]);
            }

            else if (view.nodeName == "ortho") {
                // console.log("Found an Ortho View!");

                // main parameters
                id    = this.reader.getString(view, orthoParameters[i++], nonexistentParameter);
                near  = this.reader.getFloat(view, orthoParameters[i++], nonexistentParameter);
                far   = this.reader.getFloat(view, orthoParameters[i++], nonexistentParameter);
                left  = this.reader.getFloat(view, orthoParameters[i++], nonexistentParameter);
                right = this.reader.getFloat(view, orthoParameters[i++], nonexistentParameter);
                top   = this.reader.getFloat(view, orthoParameters[i++], nonexistentParameter);
                bottom= this.reader.getFloat(view, orthoParameters[i++], nonexistentParameter);

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
                    up   = vec3.fromValues(xUp, yUp, zUp);
                }

                from = vec3.fromValues(xFrom, yFrom, zFrom);    // from "=" position
                to   = vec3.fromValues(xTo, yTo, zTo);          // to "=" target

                this.views[id] = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up);
                
                // console.log(this.views["demoOrtho"]);
            }

        }

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
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

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
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
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

        //For each texture in textures block, check ID and file URL
        this.onXMLMinorError("To do: Parse textures.");
        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialID = this.reader.getString(children[i], 'id');
            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            //Continue here
            this.onXMLMinorError("To do: Parse materials.");
        }

        //this.log("Parsed materials");
        return null;
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
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current node.
            var nodeID = this.reader.getString(children[i], 'id');

            if (nodeID == null)
                return "no ID defined for nodeID";

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            grandChildren = children[i].children;

            this.nodes[nodeID] = new MyNode(nodeID, this);
            // console.log("\t\t\t\t\t\t\t" + this.nodes.length);

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");

            this.onXMLMinorError("To do: Parse nodes.");
            
            // Transformations
            if (transformationsIndex == -1) {
                this.onXMLMinorError("There isn't a transformations tag");
            }

            let nodeTransformations = grandChildren[transformationsIndex].children;

            let translX, translY, translZ;
            let rotAxis, rotDegree;
            let scaleX, scaleY, scaleZ;

            for (let k = 0; k < nodeTransformations.length; k++) {
                console.log("Transformation " + k + ": ");
                console.log(nodeTransformations[k].nodeName);

                switch (nodeTransformations[k].nodeName) {
                    case "translation":
                        translX = this.reader.getFloat(nodeTransformations[k], 'x');
                        translY = this.reader.getFloat(nodeTransformations[k], 'y');
                        translZ = this.reader.getFloat(nodeTransformations[k], 'z');
                        // console.log(translZ);
                        // console.log(this.nodes[nodeID].transformMatrix);

                        // syntax: translate(out, a, v) -> out: the receiving matrix, a: the matrix to translate, v: vector to translate by
                        // http://glmatrix.net/docs/module-mat4.html
                        mat4.translate(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix, [translX, translY, translZ]);
                        // console.log(this.nodes[nodeID].transformMatrix);
                        break;
                    
                    case "rotation":
                        rotAxis = this.reader.getString(nodeTransformations[k], 'axis');
                        rotDegree = this.reader.getFloat(nodeTransformations[k], 'angle') * DEGREE_TO_RAD;

                        // mat4.rotate(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix, rotDegree, rotAxis);
                        mat4.rotate(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix, rotDegree, this.axisCoords[rotAxis]);
                        // console.log("AXIS: " + rotAxis);
                        break;
                    
                    case "scale":
                        scaleX = this.reader.getFloat(nodeTransformations[k], "sx");
                        scaleY = this.reader.getFloat(nodeTransformations[k], "sy");
                        scaleZ = this.reader.getFloat(nodeTransformations[k], "sz");

                        // mat4.scale(dest, dest, vec);
                        mat4.scale(this.nodes[nodeID].transformMatrix, this.nodes[nodeID].transformMatrix, [scaleX, scaleY, scaleZ]);
                        break;
                        
                    default:
                        console.log(nodeTransformations[k].nodeName);
                        break;

                }
            }


            // Material

            // Texture


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
                    // console.log("It's an intermediate node!");

                    let noderefElement = this.reader.getString(nodeDescendants[k], "id");
                    // console.log("HEY " + noderefElement);

                    this.nodes[nodeID].addChildNode(noderefElement);
                }

                else if (nodeDescendants[k].nodeName == "leaf") {
                    // console.log("It's a leaf!");
                    let primType = this.reader.getItem(nodeDescendants[k], "type", ["rectangle", "triangle", "torus", "cylinder", "sphere"]);

                    if (primType == null) {
                        this.onXMLMinorError("Unknown primitive type!");
                    }

                    let newLeaf = new MyPrimitive(primType, this, nodeDescendants[k]);
                    this.nodes[nodeID].addLeaf(newLeaf);
                    // console.log(newLeaf);
                    
                    //console.log(this.nodes[nodeID].leaves[0]);
                    
                }

                else {
                    this.onXMLError("Unknown descendant type!");
                }
            }

            // this.nodes.push(nodeID);

            // console.log(grandChildren[descendantsIndex].children[0].nodeName);
            
            // console.log(nodeDescendants[descendantsIndex].children);

        }
    }


    parseBoolean(node, name, messageError){
        var boolVal = true;
        boolVal = this.reader.getBoolean(node, name);
        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal || 1;
    }
    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
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

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        //To do: Create display loop for transversing the scene graph, calling the root node's display function
       
        // HOW TO TEST:
        // - Erase all of the nodes in the xml files except the "xWingRectangleDefault"
        // - Put it as the root
        // - Uncomment the following 2 lines and a rectangle (square) should appear
        // var currNode = this.nodes["xWingRectangleDefault"]; 
        // currNode.leaves[0].aPrimitive.display();

        // this.nodes[this.idRoot].display();

        // var currNode = this.nodes["rootNode"]; 
        // currNode.leaves[0].aPrimitive.display();

        //console.log("ROOT: ");
        // console.log(this.nodes[this.idRoot]);
        this.displayNode(this.idRoot);

    }

    displayNode(nodeToDisplayID) {
        let nodeToDisplay = this.nodes[nodeToDisplayID];

        this.scene.multMatrix(nodeToDisplay.transformMatrix);

        for (let leaf = 0; leaf < nodeToDisplay.leaves.length; leaf++) {
            nodeToDisplay.leaves[leaf].aPrimitive.display();
        }
        
        for (let i = 0; i < nodeToDisplay.childNodes.length; i++) {
            this.scene.pushMatrix();
            this.displayNode(nodeToDisplay.childNodes[i]);
            this.scene.popMatrix();
        }
    }
}