class Patch extends CGFobject {
    constructor(scene, uPoints, vPoints, uDivisions, vDivisions, controlPoints) {
        super(scene);
        this.uPoints = uPoints;
        this.vPoints = vPoints;
        this.uDivisions = uDivisions;
        this.vDivisions = vDivisions;
        this.controlPoints = controlPoints;

        this.createSurface();
    }

    createSurface() {
        this.nurbsSurface = new CGFnurbsSurface(
            this.uPoints - 1, // degree on U
            this.vPoints - 1, // degree on V
           this.controlPoints
        );

        this.nurbsObject = new CGFnurbsObject(this.scene, this.uDivisions, this.vDivisions, this.nurbsSurface);
    }

    updateTexCoords(afs, aft) {}

    display() { this.nurbsObject.display(); }

}