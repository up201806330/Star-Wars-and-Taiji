class Defbarrel extends CGFobject {
    constructor(scene, base, middle, height, uDivisions, vDivisions) {
        super(scene);
        this.base = base;
        this.middle = middle;
        this.height = height;
        this.uDivisions = uDivisions;
        this.vDivisions = vDivisions;

        this.createSurface();
    }

    createSurface() {
        let r = this.base;
        let R = this.middle;
        let L = this.height;
        let h = 4 / 3 * r;
        let H = 4 / 3 * (R - r);
        
        this.nurbsSurface = new CGFnurbsSurface(
            3, // degree on U: 4
            3, // degree on V: 4
           [	   	
               // U = 0
               [ // V = 0..3
                    [ r, 0, 0, 1],
                    [ r + H, 0.0,         H / Math.tan(Math.PI / 6), 1],
                    [ r + H, 0.0,         L - (H / Math.tan(Math.PI / 6)), 1],
                    [ r, 0, L, 1]    
              ],
               // U = 1
               [ // V = 0..3
                    [ r, h, 0, 1],
                    [ r + H, 4/3*(H + r), H / Math.tan(Math.PI / 6), 1],
                    [ r + H, 4/3*(H + r), L - (H / Math.tan(Math.PI / 6)), 1],
                    [ r, h, L, 1]
               ],
               // U = 2
               [ // V = 0..3
                    [-r, h, 0, 1],
                    [-r - H, 4/3*(H + r), H / Math.tan(Math.PI / 6), 1],
                    [-r - H, 4/3*(H + r), L - (H / Math.tan(Math.PI / 6)), 1],
                    [-r, h, L, 1]       
               ],
               // U = 3
               [ // V = 0..3
                    [-r, 0, 0, 1],
                    [-r - H, 0.0,         H / Math.tan(Math.PI / 6), 1],
                    [-r - H, 0.0,         L - (H / Math.tan(Math.PI / 6)), 1],
                    [-r, 0, L, 1]
               ]
           ]
        );

        this.nurbsObject = new CGFnurbsObject(this.scene, this.uDivisions, this.vDivisions, this.nurbsSurface);
    }

    updateTexCoords(afs, aft) {}

    display() { 
        this.nurbsObject.display();
        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.nurbsObject.display();
        this.scene.popMatrix();
    }

}


/*
this.nurbsSurface = new CGFnurbsSurface(
            3, // degree on U: 4
            3, // degree on V: 4
           [	
               // U = 0
               [ // V = 0..3
                    [-r, 0, 0, 1],
                    [-r, h, 0, 1],
                    [ r, h, 0, 1],
                    [ r, 0, 0, 1]  
               ],
               // U = 1
               [ // V = 0..3
                   [-r - H, 0.0,         H / Math.tan(Math.PI / 6), 1],
                   [-r - H, 4/3*(H + r), H / Math.tan(Math.PI / 6), 1],
                   [ r + H, 4/3*(H + r), H / Math.tan(Math.PI / 6), 1],
                   [ r + H, 0.0,         H / Math.tan(Math.PI / 6), 1]
               ],
               // U = 2
               [ // V = 0..3
                   [-r - H, 0.0,         L - (H / Math.tan(Math.PI / 6)), 1],
                   [-r - H, 4/3*(H + r), L - (H / Math.tan(Math.PI / 6)), 1],
                   [ r + H, 4/3*(H + r), L - (H / Math.tan(Math.PI / 6)), 1],
                   [ r + H, 0.0,         L - (H / Math.tan(Math.PI / 6)), 1]
               ],	
               // U = 3
               [ // V = 0..3
                    [-r, 0, L, 1],
                    [-r, h, L, 1],
                    [ r, h, L, 1],
                    [ r, 0, L, 1]    
               ]
           ]
        );
        */