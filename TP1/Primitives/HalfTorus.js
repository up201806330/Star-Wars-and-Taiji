/**
 * HalfTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - radius of inner-most edge
 * @param outer - radius of outer-most edge
 * @param slices - sections around the inner radius
 * @param loops -  sections around the outer radius
 */
class HalfTorus extends CGFobject {

	// The parametric equations use outer as the distance from center of torus to center of tube, and inner as the radius of the tube
	constructor(scene, inner, outer, slices, loops) {
		super(scene);
		this.slices = slices;
		this.stacks = loops;
		this.outer = outer + inner;
		this.inner = (outer - inner);
		this.initBuffers();
	};

	initBuffers() {
		this.vertices = [];
		this.indices = [];
		this.normals = [];
		this.texCoords = [];

		let inner = this.inner / this.outer; // Like in the sphere, this function will build a unit half torus, that is then scaled to correct radius

		this.dTheta = 2 * Math.PI / this.slices;
		this.theta = this.dTheta;
		this.dFi = Math.acos(inner) / this.stacks;
		this.fi = Math.PI / 2;
		this.zeta = Math.PI / 2; // Only affects z axis, changes 'direction' after middle point of tube
		this.direction = true;

		let n = 0;
		for (let j = 0; j < this.stacks; j++) {
			if (j == this.stacks / 2 - 1) this.direction = false;

			for (let i = 0; i < this.slices; i++) {
				this.vertices.push(Math.sin(this.fi) * Math.cos(this.theta), Math.sin(this.fi) * Math.sin(this.theta), Math.cos(this.zeta));
				this.normals.push(Math.sin(this.fi) * Math.cos(this.theta), Math.sin(this.fi) * Math.sin(this.theta), Math.cos(this.zeta));
				// Texs!!

				this.fi -= this.dFi;
				if (this.direction) this.zeta -= this.dFi;
				else 				this.zeta += this.dFi;

				this.vertices.push(Math.sin(this.fi) * Math.cos(this.theta), Math.sin(this.fi) * Math.sin(this.theta), Math.cos(this.zeta));
				this.normals.push(Math.sin(this.fi) * Math.cos(this.theta), Math.sin(this.fi) * Math.sin(this.theta), Math.cos(this.zeta));
				// Texs!!

				this.theta += this.dTheta;
				this.fi += this.dFi;
				if (this.direction) this.zeta += this.dFi;
				else 				this.zeta -= this.dFi;
			}

			this.fi -= this.dFi;
			if (this.direction) this.zeta -= this.dFi;
			else 				this.zeta += this.dFi;

			for (let i = 0; i < this.slices * 2; i += 2) {
				if (i != this.slices * 2 - 2) {
					this.indices.push(n, n + 2, n + 1);
					this.indices.push(n + 3, n + 1, n + 2);
				}
				else {
					this.indices.push(n - this.slices * 2 + 3, n, n - this.slices * 2 + 2);
					this.indices.push(n, n - this.slices * 2 + 3, n + 1);
				}
				n += 2;
			}
		}

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};