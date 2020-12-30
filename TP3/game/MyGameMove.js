class MyGameMove {
    constructor(tileCoordsArray, playerColor) {
        this.tileCoordsArray = tileCoordsArray;
        this.playerColor = playerColor;
    }

    toString(){
        return "["+this.tileCoordsArray[0].toString()+","+this.tileCoordsArray[1].toString()+"]";
    }
}