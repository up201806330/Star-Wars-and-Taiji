
class MyPrimitive {

    constructor(type, graph, element) {

        this.graph = graph;
        this.aPrimitive;
        
        if (type == "rectangle") {
            console.log("Leaf is: " + type);

            let x1 = this.graph.reader.getFloat(element, "x1", true);
            let x2 = this.graph.reader.getFloat(element, "x2", true);
            let y1 = this.graph.reader.getFloat(element, "y1", true);
            let y2 = this.graph.reader.getFloat(element, "y2", true);

            this.aPrimitive = new MyRectangle(this.graph.scene, x1, y1, x2, y2);
            // o problema é que tinha posto x1,x2,y1,y2 em vez de x1,y1,x2,y2
        }

    }

}