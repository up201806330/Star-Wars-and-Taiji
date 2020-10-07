/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param height - height of cylinder
 * @param topR - radius of top circle
 * @param bottomR - radius of bottom circle
 * @param stacks - sections along height
 * @param slices - parts per section
 */
class MyCylinder extends CGFobject {
	constructor(scene, height, topR, bottomR, stacks, slices) {
        super(scene);
        
        this.height = height;
        this.topR = topR;
        this.bottomR = bottomR;

        this.body = new CylinderBody(scene, height, topR, bottomR, stacks, slices);
        this.topLid = new CylinderLid(scene, slices);
        this.bottomLid = new CylinderLid(scene, slices);

	}
	
	display(){
        this.scene.pushMatrix();
        this.body.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, this.height);
        this.scene.scale(this.topR, this.topR, 0);
        this.topLid.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.scale(this.bottomR, this.bottomR, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.bottomLid.display();
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

