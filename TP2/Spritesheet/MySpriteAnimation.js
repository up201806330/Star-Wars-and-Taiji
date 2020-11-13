class MySpriteAnimation extends Animation{
    constructor(scene, spritesheet, duration, startCell, endCell){
        super(scene, true);
        this.scene = scene;
        this.spritesheet = spritesheet;
        this.duration = duration;
        this.startCell = startCell % (this.spritesheet.sizeM * this.spritesheet.sizeN);
        this.endCell = endCell % (this.spritesheet.sizeM * this.spritesheet.sizeN);
        this.geometry = new MyRectangle(scene, -0.5, -0.5, 0.5, 0.5);

        this.currentCell = startCell;
    }

    updateAnimation(nowT) {
        //console.log(this.currentCell);
        //console.log(Math.floor(nowT%this.duration/this.duration*(this.endCell - this.startCell + 1) + this.startCell));
        let newCell = Math.floor(nowT%this.duration/this.duration*(this.endCell - this.startCell + 1) + this.startCell);
        if (newCell != this.currentCell) this.currentCell = newCell;  
    }

    apply(){}

    updateTexCoords(afs, aft) {}

    display(){
        this.spritesheet.activateCellP(this.currentCell);
        this.geometry.display();
        this.scene.setActiveShader(this.scene.defaultShader)
    }
}