
class MyNode {

    constructor(nodeID, graph) {

        this.nodeID = nodeID;

        this.graph = graph;

        this.leaves = [];

        this.childNodes = [];
    }

    addLeaf(leafToAdd) {
        this.leaves.push(leafToAdd);
    }

    addChildNode(nodeToAdd) {
        this.childNodes.push(nodeToAdd);
    }

}