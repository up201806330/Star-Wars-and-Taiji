class Plane extends CGFobject {
    constructor(scene, uDivisions, vDivisions) {
        super(scene);
        this.uDivisions = uDivisions;
        this.vDivisions = vDivisions;

        this.createSurface();
    }

    createSurface() {
        this.nurbsSurface = new CGFnurbsSurface(
            1, // degree on U: 2 control vertexes U
            1, // degree on V: 2 control vertexes on V
           [	// U = 1
               [ // V = 0..1;
                    [ 0.5, 0.0, -0.5, 1],
                    [ 0.5, 0.0,  0.5, 1]
                   
               ],
               // U = 0
               [ // V = 0..1
                    [-0.5, 0.0, -0.5, 1],
                    [-0.5, 0.0,  0.5, 1]							 
               ]
           ]
        );

        this.nurbsObject = new CGFnurbsObject(this.scene, this.uDivisions, this.vDivisions, this.nurbsSurface);
    }

    updateTexCoords(afs, aft) {}

    display() { this.nurbsObject.display(); }

}