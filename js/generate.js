var nextRoomID = 1;

var getRoomID = function () {
    return nextRoomID++;
};

var processBorderTile = function (x, y) {
    //north wall
    if (y > 0) {
        //if this is an edge, maybe make a door to the next room, otherwise maybe make a new door
        if (mapRooms[y-1][x] instanceof Tile && mapRooms[y][x].id !== mapRooms[y-1][x].id) {
            if (Math.random() > REDUNDANT_DOOR) {
                mapRooms[y][x].directions[NORTH] = 1;
                mapRooms[y-1][x].directions[SOUTH] = 1;
            }
        } else if (!(mapRooms[y-1][x] instanceof Tile) && Math.random() > NEW_DOOR) {
            mapRooms[y][x].directions[NORTH] = 1;
            newDoors.unshift({x:x, y:y, direction: NORTH}); 
        }
    }
    //south wall
    if (mapRooms[y+1][x] instanceof Tile && y < MAP_HEIGHT - 1) {
        if (mapRooms[y][x].id !== mapRooms[y+1][x].id) {
            if (Math.random() > REDUNDANT_DOOR) {
                mapRooms[y][x].directions[SOUTH] = 1;
                mapRooms[y+1][x].directions[NORTH] = 1;
            }
        } else if (!(mapRooms[y+1][x] instanceof Tile) && Math.random() > NEW_DOOR) {
            mapRooms[y][x].directions[SOUTH] = 1;
            newDoors.unshift({x:x, y:y, direction: SOUTH}); 
        }
    }
    //east wall
    if (mapRooms[y][x+1] instanceof Tile && x < MAP_WIDTH - 1) {
        if (mapRooms[y][x].id !== mapRooms[y][x+1].id) {
            if (Math.random() > REDUNDANT_DOOR) {
                mapRooms[y][x].directions[EAST] = 1;
                mapRooms[y][x+1].directions[WEST] = 1;
            }
        } else if (!(mapRooms[y][x+1] instanceof Tile) && Math.random() > NEW_DOOR) {
            mapRooms[y][x].directions[EAST] = 1;
            newDoors.unshift({x:x, y:y, direction: EAST}); 
        }
    }
    //west wall
    if (mapRooms[y][x-1] instanceof Tile && x > 0) {
        if (mapRooms[y][x].id !== mapRooms[y][x-1].id) {
            if (Math.random() > REDUNDANT_DOOR) {
                mapRooms[y][x].directions[WEST] = 1;
                mapRooms[y][x-1].directions[EAST] = 1;
            }
        } else if (!(mapRooms[y][x-1] instanceof Tile) && Math.random() > NEW_DOOR) {
            mapRooms[y][x].directions[WEST] = 1;
            newDoors.unshift({x:x, y:y, direction: WEST}); 
        }
    }
};

var createRoom = function (x, y, direction) {
    var width = Math.floor(Math.random() * 4 + 3),
        height = Math.floor(Math.random() * 4 + 3),
        x0,
        y0,
        landingX,
        landingY,
        ret = [],
        roomID = getRoomID();
    
    switch (direction) {
        case NORTH:
            x0 = x;
            y0 = y - height;
            landingX = x;
            landingY = y - 1;
            break;
        case EAST:
            x0 = x + 1;
            y0 = y;
            landingX = x + 1;
            landingY = y;
            break;
        case SOUTH:
            x0 = x;
            y0 = y + 1;
            landingX = x;
            landingY = y + 1;
            break;
        case WEST:
            x0 = x - width;
            y0 = y;
            landingX = x - 1;
            landingY = y;
            break;
        default:
            return ret;
    };


    if (mapRooms[landingY][landingX] instanceof Tile) {
        return;
    }
    
    //set all tiles in the room to 'open' on all sides
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            mapRooms[y0 + j][x0 + i] = new Tile(roomID, [3, 3, 3, 3]);
        }
    }
    
    //go along walls, mark them.  Possibly as doors
    for (var i = 0; i < width; i++) {
        processBorderTile(x0 + i, y0);
        processBorderTile(x0 + i, y0 + height - 1);
        /*
        if (Math.random() > 0.75) {
            //possibly connect this room to the room above with another door, otherwise build another room
            if (mapRooms[y0 - 1][x0 + i] instanceof Tile) { 
                if (Math.random() > 0.9) {  
                    mapRooms[y0][x0 + i].directions[NORTH] = 1;
                    mapRooms[y0 - 1][x0 + i].directions[SOUTH] = 1;
                } else {
                    mapRooms[y0][x0 + i].directions[NORTH] = 0;  
                }
            } else { 
                ret.push({x:x0 + i, y:y0, direction: NORTH}); 
                mapRooms[y0][x0 + i].directions[NORTH] = 1;
            }
        } else {
            mapRooms[y0][x0 + i].directions[NORTH] = 0;   
        }
        if (Math.random() > 0.75) {
            //possibly connect this room to the room above with another door, otherwise build another room
            if (mapRooms[y0 + height][x0 + i] instanceof Tile && Math.random() > 0.7) {
                mapRooms[y0 + height - 1][x0 + i].directions[SOUTH] = 1;
                mapRooms[y0 + height][x0 + i].directions[NORTH] = 1;
            } else {
                mapRooms[y0 + height - 1][x0 + i].directions[SOUTH] = 1;
                ret.push({x:x0 + i, y:y0 + height - 1, direction: SOUTH});
            }
        } else {
            mapRooms[y0 + height - 1][x0 + i].directions[SOUTH] = 0;
        }
        */
    }
    for (var i = 0; i < height; i++) {
        processBorderTile(x0, y0 + i);
        processBorderTile(x0 + width - 1, y0 + i)
        /*
        if (Math.random() > 0.75) {
            mapRooms[y0 + i][x0].directions[WEST] = 1;
            ret.push({x:x0, y:y0 + i, direction: WEST});
        } else {
            mapRooms[y0 + i][x0].directions[WEST] = 0;
        }
        if (Math.random() > 0.75) {
            mapRooms[y0 + i][x0 + width - 1].directions[EAST] = 1;
            ret.push({x:x0 + width - 1, y:y0 + i, direction: EAST});
        } else {
            mapRooms[y0 + i][x0 + width - 1].directions[EAST] = 0;
        }
        */
    }

    //mark door to previous room
    mapRooms[y0][x0].directions[(direction + 2) % 4] = 1;

    //return rooms for adding
    return ret;
};