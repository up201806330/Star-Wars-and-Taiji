class Water extends Animation{
    constructor(scene){
        super(scene);
        this.geometry = new MyCylinder(scene, 0.1, 38, 38, 10, 10);
        this.texture = new CGFtexture(scene, "./scenes/images/water3.jpg");
        this.appearance = new CGFappearance(scene);
		this.appearance.setAmbient(0.5, 0.5, 0.5, 1);
		this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);
        this.appearance.setTexture(this.texture);
		this.appearance.setTextureWrap('REPEAT', 'REPEAT');

        this.shader = new CGFshader(scene.gl, "./shaders/water.vert", "./shaders/water.frag");
        this.shader.setUniformsValues({timeFactor: 0});

        console.log(this);
    }

    apply(){}

    updateTexCoords(afs, aft) {}

    updateAnimation(t){
        this.shader.setUniformsValues({ timeFactor: t % 1000 });
    }

    display(){
        this.scene.pushMatrix();
        this.appearance.apply();
        this.scene.setActiveShaderSimple(this.shader);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.geometry.display();
        this.scene.popMatrix();
        this.scene.setActiveShaderSimple(this.scene.defaultShader)
    }
}