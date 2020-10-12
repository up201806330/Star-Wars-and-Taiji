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

        for (let j = 0; j <= this.stacks; j++) {
            for (let i = 0; i <= this.slices; i++) {
                this.vertices.push(Math.cos(theta * i) * Math.cos(fi * j), Math.sin(theta * i) * Math.cos(fi * j), Math.sin(fi * j));
                this.normals.push(Math.cos(theta * i) * Math.cos(fi * j), Math.sin(theta * i) * Math.cos(fi * j), Math.sin(fi * j));
                this.texCoords.push(j / this.stacks, i / this.slices);
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