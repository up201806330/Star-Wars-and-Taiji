/**
 * CylinderBody
 * @constructor
 * @param scene - Reference to MyScene object
 * @param height - height of cylinder
 * @param topR - radius of top circle
 * @param bottomR - radius of bottom circle
 * @param stacks - sections along height
 * @param slices - parts per section
 */
class CylinderBody extends CGFobject {
    constructor(scene, height, topR, bottomR, stacks, slices) {
        super(scene);
        this.height = height;
        this.topR = topR;
        this.bottomR = bottomR;
        this.stacks = stacks;
        this.slices = slices;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        let r = this.bottomR;
        let delta_r = (this.topR - this.bottomR) / this.stacks;
        let delta_rad = 2 * Math.PI / this.slices;
        let delta_z = this.height / this.stacks;
        let m = this.height / (this.bottomR - this.topR);
        let maxheight = (this.bottomR > this.topR) ? this.topR * m + this.height : this.bottomR * m + this.height;
        
        for (let i = 0; i <= this.stacks; i++) {
            for (let j = 0; j <= this.slices; j++) {
                this.vertices.push(
                    r * Math.cos(j * delta_rad),
                    r * Math.sin(j * delta_rad),
                    i * delta_z
                );
                if (Math.abs(this.bottomR - this.topR) < 0.0001) {
                    this.normals.push(
                        Math.cos(j * delta_rad),
                        Math.sin(j * delta_rad),
                        0);
                } else if (this.bottomR > this.topR) {
                    this.normals.push(
                        maxheight * Math.cos(j * delta_rad) / Math.sqrt(Math.pow(this.bottomR, 2) + Math.pow(maxheight, 2)),
                        maxheight * Math.sin(j * delta_rad) / Math.sqrt(Math.pow(this.bottomR, 2) + Math.pow(maxheight, 2)),
                        this.bottomR / Math.sqrt(Math.pow(this.bottomR, 2) + Math.pow(maxheight, 2))
                    );
                } else {
                    this.normals.push(
                        maxheight * Math.cos(j * delta_rad) / Math.sqrt(Math.pow(this.topR, 2) + Math.pow(maxheight, 2)),
                        maxheight * Math.sin(j * delta_rad) / Math.sqrt(Math.pow(this.topR, 2) + Math.pow(maxheight, 2)),
                        this.topR / Math.sqrt(Math.pow(this.topR, 2) + Math.pow(maxheight, 2))
                    );
                }
                this.texCoords.push(j / this.slices, i / this.stacks);

            }
            r = (i + 1) * delta_r + this.bottomR;
        }

        for (let i = 0; i < this.stacks; i++) {
            for (let j = 0; j < this.slices; j++) {
                this.indices.push(
                    i * (this.slices + 1) + j,
                    i * (this.slices + 1) + (j + 1),
                    (i + 1) * (this.slices + 1) + (j + 1)
                );
                this.indices.push(
                    (i + 1) * (this.slices + 1) + (j + 1),
                    (i + 1) * (this.slices + 1) + j,
                    i * (this.slices + 1) + j
                );

            }
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

