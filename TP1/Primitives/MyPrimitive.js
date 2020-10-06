
class MyPrimitive {

    constructor(type, graph, element) {

        this.graph = graph;
        this.aPrimitive;
        
        console.log("Leaf is: " + type);
        
        if (type == "rectangle") {

            let x1 = this.graph.reader.getFloat(element, "x1", true);
            let y1 = this.graph.reader.getFloat(element, "y1", true);
            let x2 = this.graph.reader.getFloat(element, "x2", true);
            let y2 = this.graph.reader.getFloat(element, "y2", true);

            this.aPrimitive = new MyRectangle(this.graph.scene, x1, y1, x2, y2);
            // o problema é que tinha posto x1,x2,y1,y2 em vez de x1,y1,x2,y2
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
            //height, topR, bottomR, stacks, slices
            let height = this.graph.reader.getFloat(element, "height", true);
            let topRadius = this.graph.reader.getFloat(element, "topRadius", true);
            let bottomRadius = this.graph.reader.getFloat(element, "bottomRadius", true);
            let stacks = this.graph.reader.getFloat(element, "stacks", true);
            let slices = this.graph.reader.getFloat(element, "slices", true);

            this.aPrimitive = new MyCylinder(this.graph.scene, height, topRadius, bottomRadius, stacks, slices);
        }

        else {
            console.log("Not Implemented!");
        }

    }

}