class Crate {
    constructor(scene){
        this.scene = scene;
        this.obj = new CGFOBJModel(scene, 'Objs/models/box_OBJ.obj');
        
        this.appearance = new CGFappearance(scene);
        this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(100);
        this.appearance.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.appearance.setDiffuse(0.17, 0.36, 0.22, 1);
        // this.appearance.loadTexture('./scenes/images/fishW.png');
        // this.appearance.setTextureWrap('REPEAT', 'REPEAT');
    }

    updateTexCoords(afs, aft) {}

    display(){
        this.scene.pushMatrix();
        this.appearance.apply();
        
        this.scene.scale(0.5,0.5,0.6);
        // this.scene.rotate(-Math.PI/2, 0,1,0);
        this.obj.display();
        this.scene.popMatrix();
    }
}