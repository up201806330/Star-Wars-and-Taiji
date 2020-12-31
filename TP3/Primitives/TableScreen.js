class TableScreen{
    constructor(scene, length){
        this.scene = scene;
        this.length = length;

        this.rect1 = new MyRectangle(scene, -this.length/2, 0, this.length/2, 1.75);
        this.rect2 = new MyRectangle(scene, -this.length/2, 0, this.length/2, 1.004);
        this.tri1 = new MyTriangle(scene, 0,0,-1.434,1.004,-1.434,0);
        this.tri2 = new MyTriangle(scene, 0,0,-1.434,0,-1.434,1.004);

        this.appearence = new CGFappearance(this.scene);
        this.appearence.setSpecular(1, 1, 1, 1);
        this.appearence.setShininess(120);
        this.appearence.setAmbient(0.0, 0.16, 0.36, 1);
        this.appearence.setDiffuse(0.1, 0.1, 0.1, 1);
        this.appearence.loadTexture('./scenes/images/plastic.jpg');
        this.appearence.setTextureWrap('REPEAT', 'REPEAT');
    }

    display(){
        this.appearence.apply();
        this.scene.pushMatrix();
        this.scene.translate(0,0,-1.43);
        this.scene.rotate(Math.PI, 0,1,0);
        this.rect2.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(-this.length/2,0,0);
        this.scene.rotate(-Math.PI/2, 0,1,0);
        this.tri1.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(this.length/2,0,0);
        this.scene.rotate(-Math.PI/2, 0,1,0);
        this.tri2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-55*Math.PI/180, 1,0,0);
        this.rect1.display();
        this.scene.popMatrix();
    }
}