
class MyNode {

    constructor(nodeID, graph) {

        this.nodeID = nodeID;

        this.graph = graph;

        this.leaves = [];
    }

    addLeaf(leafToAdd) {
        this.leaves.push(leafToAdd);
    }

}