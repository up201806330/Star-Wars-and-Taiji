/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius - radius of sphere
 * @param slices - sections along radius
 * @param stacks - parts per section
 */
class MySphere extends CGFobject {

    constructor(scene, radius, stacks, slices) {
        super(scene);
        this.radius = radius;
        this.stacks = stacks;
        this.slices = slices;

        this.initBuffers();
    }

    initBuffers(){
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (let i = 0; i <= this.slices; i++) {
            let phi = 2* i * Math.PI / this.slices;
            let sinPhi = Math.sin(phi);
            let cosPhi = Math.cos(phi);

            for (let j = 0; j <= this.stacks; j++) {
                let theta = j * Math.PI / this.stacks;
                let sinTheta = Math.sin(theta);
                let cosTheta = Math.cos(theta);

                let x = this.radius * cosPhi * sinTheta;
                let y = this.radius *  sinPhi * sinTheta;
                let z = this.radius * cosTheta;

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);
                this.texCoords.push(1 - (i / this.slices), 1 - (j / this.stacks));
            }
        }

        for (let j = 0; j < this.stacks; j++) {
            for (let i = 0; i < this.slices; i++) {
                let first = (j * (this.slices + 1)) + i;
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
}

