/**
 * MyTriagle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 * @param x3 - x coordinate corner 3
 * @param y3 - y coordinate corner 3
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2, x3, y3) {
		super(scene);
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y2, 0,	//1
			this.x3, this.y3, 0,	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
        ]; 

        // Vector calculations
        this.v1 = [this.x1, this.y1, 0], this.v2 = [this.x2, this.y2, 0], this.v3 = [this.x3, this.y3, 0];

        let v12 = vec3.create();
        vec3.sub(v12, this.v2, this.v1);
        let v13 = vec3.create();
        vec3.sub(v13, this.v3, this.v1);

        let N = vec3.create();
        vec3.cross(N, v12, v13);
        vec3.normalize(N, N);

		//Facing Z positive
		this.normals = [
			N[0], N[1], N[2],
            N[0], N[1], N[2],
            N[0], N[1], N[2]
		];
		
		/*
		Texture coords (s,t)
		+----------> s
        |
        |
		|
		v
        t
        */

		this.texCoords = [
			0, 1,
			1, 1,
			0, 0,
			1, 0
		]
		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(afs, aft) {
		//		v3
		//	  c    b
		//   v1	 a v2

		let distA = Math.sqrt(Math.pow(this.v2[0] - this.v1[0], 2) + Math.pow(this.v2[1] - this.v1[1], 2) + Math.pow(this.v2[2] - this.v1[2], 2));
		let distB = Math.sqrt(Math.pow(this.v3[0] - this.v2[0], 2) + Math.pow(this.v3[1] - this.v2[1], 2) + Math.pow(this.v3[2] - this.v2[2], 2));
		let distC = Math.sqrt(Math.pow(this.v1[0] - this.v3[0], 2) + Math.pow(this.v1[1] - this.v3[1], 2) + Math.pow(this.v1[2] - this.v3[2], 2));
		let cosAlpha = (Math.pow(distA, 2) - Math.pow(distB, 2) + Math.pow(distC, 2)) / (2 * distA * distC);
		let sinAlpha = Math.sqrt(1 - Math.pow(cosAlpha, 2));
		let alpha = Math.acos(cosAlpha);
		let T3x = distC * cosAlpha / afs;
		let T3y = distC * sinAlpha / aft;
		this.texCoords = [
			T3x, T3y,
			distA / afs, 1,
			0, 0
		];

		this.updateTexCoordsGLBuffers();
	}
}

