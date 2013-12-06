var createRoom = function (x, y) {
    var width = Math.floor(Math.random() * 4 + 4),
        height = Math.floor(Math.random() * 4 + 4);
    
    //set all tiles in the room to 'open' on all sides
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            mapRooms[y + j][x + i] = new Tile([3, 3, 3, 3]);
        }
    }
    
    //go along walls, mark them
    for (var i = 0; i < width; i++) {
        mapRooms[y][x + i].directions[NORTH] = 0;   
        mapRooms[y + height - 1][x + i].directions[SOUTH] = 0;
    }
    for (var i = 0; i < height; i++) {
        mapRooms[y + i][x].directions[WEST] = 0;
        mapRooms[y + i][x + width - 1].directions[EAST] = 0;
    }
};