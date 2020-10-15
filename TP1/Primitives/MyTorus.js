/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - radius of inner-most edge 
 * @param outer - radius of outer-most edge
 * @param slices - sections around the inner radius
 * @param loops -  sections around the outer radius
 */
class MyTorus extends CGFobject {
	constructor(scene, inner, outer, slices, loops) {
		super(scene);
		this.outer = outer;
		this.inner = inner;
		this.slices = slices;
		this.loops = loops;

		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];
		
		for (let i = 0; i <= this.loops; i++) {
			let theta = 2 * i * Math.PI / this.loops;
			let sinT = Math.sin(theta);
			let cosT = Math.cos(theta);

			for (let j = 0; j <= this.slices; j++) {
				let phi = 2 * j * Math.PI / this.slices;
				let sinP = Math.sin(phi);
				let cosP = Math.cos(phi);

				let x = (this.outer + (this.inner * cosT)) * cosP;
				let y = (this.outer + (this.inner * cosT)) * sinP
				let z = this.inner * sinT;

				this.vertices.push(x, y, z);
				this.normals.push(x, y, z);
				this.texCoords.push(1 - (i / this.loops), 1 - (j / this.slices));
			}
		}

		for (let i = 0; i < this.loops; i++) { // Seems to work??
			for (let j = 0; j < this.slices; j++) {
				let first = (i * (this.slices + 1)) + j;
				let second = first + this.slices + 1;
	
				this.indices.push(first, second + 1, second);
				this.indices.push(first, first + 1, second + 1);
			}
		}	

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}


	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(afs, aft) {

		this.updateTexCoordsGLBuffers();
	}
};