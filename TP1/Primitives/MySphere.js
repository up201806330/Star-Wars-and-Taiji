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
        this.topHalf = new HalfSphere(scene, stacks, slices);
        this.bottomHalf = new HalfSphere(scene, stacks, slices);
    }

    display(){
        // Scale to radius, display half
        this.scene.pushMatrix();
        this.scene.scale(this.radius, this.radius, this.radius);
        this.topHalf.display();
        this.scene.popMatrix();

        // Scale to radius, flip,  display half
        this.scene.pushMatrix();
        this.scene.scale(this.radius, this.radius, this.radius);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.bottomHalf.display();
        this.scene.popMatrix();
    }

    /**
     * @method updateTexCoords
     * Updates the list of texture coordinates of the rectangle
     * @param {Array} coords - Array of texture coordinates
     */
    updateTexCoords(coords) {
        this.texCoords = [...coords];
        this.updateTexCoordsGLBuffers();
    }
}

