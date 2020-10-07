
class MyPrimitive {

    constructor(type, graph, element) {

        this.graph = graph;
        this.aPrimitive;
        
        // console.log("Leaf is: " + type);
        
        if (type == "rectangle") {

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

        else if (type == "cylinder") {
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

        else {
            console.log("Not Implemented!");
        }

    }

}