/**
 * HalfSphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param stacks - number of stacks
 * @param slices - number of slices
 */
class HalfSphere extends CGFobject {
    constructor(scene, stacks, slices) {
        super(scene);
        this.stacks = stacks;
        this.slices = slices;

        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];


        let theta = 2 * Math.PI / this.slices;
        let fi = 0.5 * Math.PI / this.stacks;

        for (let i = 0; i <= this.stacks; i++) {
            for (let j = 0; j <= this.slices; j++) {
                this.vertices.push(Math.cos(theta * j) * Math.cos(fi * i), Math.sin(theta * j) * Math.cos(fi * i), Math.sin(fi * i));
                this.normals.push(Math.cos(theta * j) * Math.cos(fi * i), Math.sin(theta * j) * Math.cos(fi * i), Math.sin(fi * i));
                //Texs !!
            }
        }

        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                this.indices.push(i * (this.slices + 1) + j, i * (this.slices + 1) + 1 + j, (i + 1) * (this.slices + 1) + j);
                this.indices.push(i * (this.slices + 1) + 1 + j, (i + 1) * (this.slices + 1) + 1 + j, (i + 1) * (this.slices + 1) + j);
            }
        }


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}