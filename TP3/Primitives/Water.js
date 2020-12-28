class Water{
    constructor(scene){
        this.scene = scene;
        this.geometry = new MyCylinder(scene, 0.1, 38, 38, 40, 40);
        this.texture = new CGFtexture(scene, "./scenes/images/water.jpg");
        this.map = new CGFtexture(scene, "./scenes/images/noise.jpg")

        this.shader = new CGFshader(scene.gl, "./shaders/water.vert", "./shaders/water.frag");
        this.shader.setUniformsValues({uSampler: this.texture});
        this.shader.setUniformsValues({uSampler2: this.map});
        this.shader.setUniformsValues({timeFactor: 0});
        this.shader.setUniformsValues({normScale: 6.0}); 
    }

    updateShader(t){
        this.shader.setUniformsValues({ timeFactor: t % 1000 })
    }

    display(){
        //this.scene.setActiveShaderSimple(this.shader);
        this.scene.pushMatrix();
        this.scene.translate(0, -16, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.texture.bind();
        this.geometry.display();
        this.scene.popMatrix();
        //this.scene.setActiveShaderSimple(this.scene.defaultShader)
    }
}