class Plate{
    constructor(scene){
        this.scene = scene;

        this.obj = new CGFOBJModel(scene, 'Objs/models/plate.obj');
        
        this.appearance = new CGFappearance(scene);
        this.appearance.setSpecular(0.2, 0.2, 0.2, 1);
        this.appearance.setShininess(120);
        this.appearance.setAmbient(0.0, 0.26, 0.46, 1);
        this.appearance.setDiffuse(0.3, 0.3, 0.3, 1);
    }
    
    display(){
        this.appearance.apply();
        this.scene.pushMatrix();
        this.scene.translate(3.5,-10,7.5);
        this.scene.scale(0.04,0.04,0.04);
        this.obj.display();
        this.scene.popMatrix();
    }
}