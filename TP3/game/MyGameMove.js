class MyGameMove {
    constructor(tileCoordsArray, playerColor) {
        this.tileCoordsArray = tileCoordsArray;
        this.playerColor = playerColor;
    }

    toString(){
        return "["+this.tileCoordsArray[0].toString()+","+this.tileCoordsArray[1].toString()+"]";
    }

    occupyTiles(){
        console.log(this.tileCoordsArray);
        this.tileCoordsArray[0].isOccupied = true;
        this.tileCoordsArray[0].setOccupied();
        this.tileCoordsArray[1].isOccupied = true;
        this.tileCoordsArray[1].setOccupied();
    }
}