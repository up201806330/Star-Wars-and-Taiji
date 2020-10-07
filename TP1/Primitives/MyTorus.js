/**
 * MyTorus
 * @constructor
 * @param scene - Reference to MyScene object
 * @param inner - radius of inner-most edge 
 * @param outer - radius of outer-most edge
 * @param slices - sections around the inner radius
 * @param loops -  sections around the outer radius
 */
class MyTorus extends CGFobject
{
	constructor(scene, inner, outer, slices, loops)
	{	
		super(scene);
		this.outer = outer+inner; 
	    this.half1 = new HalfTorus(scene,inner, outer, slices, loops);
	    this.half2 = new HalfTorus(scene,inner, outer, slices, loops);
	};
    
    display()
    {
        this.scene.pushMatrix();
            this.scene.scale(this.outer, this.outer, 0.5*this.outer); // To correct unit half torus' to actual scale
            this.half1.display();
        this.scene.popMatrix();
        this.scene.pushMatrix();
            this.scene.rotate(Math.PI, 1, 0, 0);
            this.scene.scale(this.outer, this.outer, 0.5*this.outer);
            this.half2.display();
        this.scene.popMatrix();
    };
};