
class MyPrimitive {

    constructor(type, graph, element) {

        this.graph = graph;
        this.aPrimitive;
        
        // console.log("Leaf is: " + type);
        
        if (type == "rectangle"){

            let x1 = this.graph.reader.getFloat(element, "x1", true);
            let y1 = this.graph.reader.getFloat(element, "y1", true);
            let x2 = this.graph.reader.getFloat(element, "x2", true);
            let y2 = this.graph.reader.getFloat(element, "y2", true);

            this.aPrimitive = new MyRectangle(this.graph.scene, x1, y1, x2, y2);

        }

        else if (type == "triangle"){
            let x1 = this.graph.reader.getFloat(element, "x1", true);
            let y1 = this.graph.reader.getFloat(element, "y1", true);
            let x2 = this.graph.reader.getFloat(element, "x2", true);
            let y2 = this.graph.reader.getFloat(element, "y2", true);
            let x3 = this.graph.reader.getFloat(element, "x3", true);
            let y3 = this.graph.reader.getFloat(element, "y3", true);

            this.aPrimitive = new MyTriangle(this.graph.scene, x1, y1, x2, y2, x3, y3);
            
        }

        else if (type == "sphere"){
            let radius = this.graph.reader.getFloat(element, "radius", true);
            let stacks = this.graph.reader.getFloat(element, "stacks", true);
            let slices = this.graph.reader.getFloat(element, "slices", true);

            this.aPrimitive = new MySphere(this.graph.scene, radius, stacks, slices);
        }

        else if (type == "cylinder"){
            let height = this.graph.reader.getFloat(element, "height", true);
            let topRadius = this.graph.reader.getFloat(element, "topRadius", true);
            let bottomRadius = this.graph.reader.getFloat(element, "bottomRadius", true);
            let stacks = this.graph.reader.getFloat(element, "stacks", true);
            let slices = this.graph.reader.getFloat(element, "slices", true);

            this.aPrimitive = new MyCylinder(this.graph.scene, height, topRadius, bottomRadius, stacks, slices);
        }

        else if (type == "torus"){
            let inner = this.graph.reader.getFloat(element, "inner", true);
            let outer = this.graph.reader.getFloat(element, "outer", true);
            let slices = this.graph.reader.getFloat(element, "slices", true);
            let loops = this.graph.reader.getFloat(element, "loops", true);

            this.aPrimitive = new MyTorus(this.graph.scene, inner, outer, slices, loops);
        }

        else if (type == "spritetext"){
            let text = this.graph.reader.getString(element, "text", true);

            this.aPrimitive = new MySpriteText(this.graph.scene, text);
        }

        else if (type == "spriteanim"){
            let ssid = this.graph.reader.getString(element, "ssid", true);
            let spritesheet = this.graph.spritesheets[ssid];
            if (spritesheet == null) {
                this.graph.onXMLError("Spritesheet id " + ssid + " doesn't exist. Default spritesheet assigned");
                let texture = new CGFtexture(this.graph.scene, "./scenes/images/missing.jpg");
                let spritesheet = new MySpriteSheet(this.graph.scene, texture, 2, 1);

                this.aPrimitive = new MySpriteAnimation(this.graph.scene, spritesheet, 1, 0, 1);
                return;
            }
            else {
                let startCell = this.graph.reader.getInteger(element, "startCell", true);
                let endCell = this.graph.reader.getInteger(element, "endCell", true);
                let duration = this.graph.reader.getFloat(element, "duration", true);
                
                this.aPrimitive = new MySpriteAnimation(this.graph.scene, spritesheet, duration, startCell, endCell);
            }
        }

        else if (type == "plane"){
            let npartsU = this.graph.reader.getInteger(element, "npartsU", true);
            let npartsV = this.graph.reader.getInteger(element, "npartsV", true);

            this.aPrimitive = new Plane(this.graph.scene, npartsU, npartsV);
        }

        else if (type == "patch"){
            let npointsU = this.graph.reader.getInteger(element, "npointsU", true);
            let npointsV = this.graph.reader.getInteger(element, "npointsV", true);
            let npartsU = this.graph.reader.getInteger(element, "npartsU", true);
            let npartsV = this.graph.reader.getInteger(element, "npartsV", true);

            let pointsElement = element.children;
            let allPoints = [];
            for (let i = 0 ; i < pointsElement.length ; i++){
                if (pointsElement[i].nodeName == "controlpoint")
                    allPoints.push([...this.graph.parseCoordinates3D(pointsElement[i], "patch control point n" + i), 1]);     
            }

            if (npointsU * npointsV != allPoints.length){
                this.graph.onXMLError("Patch doesnt have correct number of points or nPoint variables (npointsU:" + npointsU + " ; npointsV:" + npointsV + " ; Number of control points: " + allPoints.length);
                this.aPrimitive = new MyRectangle(this.graph.scene, -0.5, -0.5, 0.5, 0.5);
                return;
            }

            let pointIndex = 0;
            let organizedPoints = [];
            for (let u = 0 ; u < npointsU ; u++){
                var set = [];
                for (let v = 0 ; v < npointsV ; v++){
                    set.push(allPoints[pointIndex++]);
                }
                organizedPoints.push(set);
            }
            
            this.aPrimitive = new Patch(this.graph.scene, npointsU, npointsV, npartsU, npartsV, organizedPoints)
        }

        else if (type == "defbarrel"){
            let base = this.graph.reader.getFloat(element, "base", true);
            let middle = this.graph.reader.getFloat(element, "middle", true);
            let height = this.graph.reader.getFloat(element, "height", true);
            let slices = this.graph.reader.getInteger(element, "slices", true);
            let stacks = this.graph.reader.getInteger(element, "stacks", true);
            let angle = this.graph.reader.getFloat(element, "angle", true);

            this.aPrimitive = new Defbarrel(this.graph.scene, base, middle, height, slices, stacks, angle);
        }

        else {
            this.graph.onXMLMinorError("Primitive Not Implemented!");
        }

    }
}