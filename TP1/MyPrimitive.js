
class MyPrimitive {
    constructor(type, graph, element) {

        this.graph = graph;
        this.aPrimitive;
        
        if (type == "rectangle") {
            console.log("Leaf is: " + type);

            let x1 = this.graph.reader.getString(element, "x1", true);
            let x2 = this.graph.reader.getString(element, "x2", true);
            let y1 = this.graph.reader.getString(element, "y1", true);
            let y2 = this.graph.reader.getString(element, "y2", true);

            this.aPrimitive = new MyRectangle(graph.scene, x1, x2, y1, y2);
        }

    }


}