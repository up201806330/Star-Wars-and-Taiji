class MyGameMove {
    // TODO change tile to geometry
    constructor(tilesArray) {
        this.tilesArray = tilesArray;
        this.tileCoordsArray = [
            [
                tilesArray[0].coordinates.row,
                tilesArray[0].coordinates.column
            ],
            [
                tilesArray[1].coordinates.row,
                tilesArray[1].coordinates.column
            ],
        ]
    }

    getTileCoords() {
        return this.tileCoordsArray;
    }


}