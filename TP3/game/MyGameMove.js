class MyGameMove {
    constructor(tileCoordsArray, playerColor) {
        this.tileCoordsArray = tileCoordsArray;
        this.playerColor = playerColor;
    }

    toString(){
        return "["+this.tileCoordsArray[0].toString()+","+this.tileCoordsArray[1].toString()+"]";
    }

    occupyTiles(){
        this.tileCoordsArray[0].isOccupied = true;
        this.tileCoordsArray[0].setOccupied();
        this.tileCoordsArray[1].isOccupied = true;
        this.tileCoordsArray[1].setOccupied();
    }

    unoccupyTiles(){
        this.tileCoordsArray[0].isOccupied = false;
        this.tileCoordsArray[0].unsetOccupied();
        this.tileCoordsArray[1].isOccupied = false;
        this.tileCoordsArray[1].unsetOccupied();
    }
}