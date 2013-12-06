var createRoom = function (x, y, direction) {
    var width = Math.floor(Math.random() * 4 + 4),
        height = Math.floor(Math.random() * 4 + 4),
        x0,
        y0;
    
    switch (direction) {
        case NORTH:
            x0 = x;
            y0 = y - height;
            break;
        case EAST:
            x0 = x + 1;
            y0 = y;
            break;
        case SOUTH:
            x0 = x;
            y0 = y + 1;
            break;
        case WEST:
            x0 = x - width;
            y0 = y;
            break;
        default:
            return;
    };
    
    //set all tiles in the room to 'open' on all sides
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            mapRooms[y0 + j][x0 + i] = new Tile([3, 3, 3, 3]);
        }
    }
    
    //go along walls, mark them
    for (var i = 0; i < width; i++) {
        mapRooms[y0][x0 + i].directions[NORTH] = 0;   
        mapRooms[y0 + height - 1][x0 + i].directions[SOUTH] = 0;
    }
    for (var i = 0; i < height; i++) {
        mapRooms[y0 + i][x0].directions[WEST] = 0;
        mapRooms[y0 + i][x0 + width - 1].directions[EAST] = 0;
    }
};