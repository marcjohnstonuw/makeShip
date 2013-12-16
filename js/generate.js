var nextRoomID = 1;

var getRoomID = function () {
    return nextRoomID++;
};

var getMaxRoomHeight = function (x, y, width, height, up) {
    var direction = up ? -1 : 1;
    for (var i = 0; Math.abs(i) < height; i = i + direction) {
        for (var j = 0; j < width; j++) {
            if (mapRooms[y + i][x + j] instanceof Tile) {
                return Math.abs(i);   
            }
        }
    }
    return height;
};

var getMaxRoomWidth = function (x, y, width, height, right) {
    var direction = right ? 1 : -1;
    for (var i = 0; Math.abs(i) <= width; i = i + direction) {
        for (var j = 0; j < height; j++) {
            if (mapRooms[y + j][x + i] instanceof Tile) {
                return Math.abs(i);
            }
        }
    }
    return width;
};

roomDimensionsUpRight = function (x, y, width, height) {
    var ret = {
        width: width,
        height: height
    };
    for (var i = 0; i < height; i++) {
        if (mapRooms[y - i][x] instanceof Tile) {
            ret.height = i;
            break;
        }
        for (var j = 1; j < width; j++) {
            if (mapRooms[y - i][x + j] instanceof Tile) {
                ret.width = Math.min(ret.width, j);
                break;
            }
        }
    }
    return ret;
};

roomDimensionDownRight = function (x, y, width, height) {
    var ret = {
        width: width,
        height: height
    };
    for (var i = 0; i < height; i++) {
        if (mapRooms[y + i][x] instanceof Tile) {
            ret.height = i;
            break;
        }
        for (var j = 0; j < width; j++) {
            if (mapRooms[y + i][x + j] instanceof Tile) {
                ret.width = Math.min(ret.width, j);
                break;
            }
        }
    }
    return ret;
};

roomDimensionsRightDown = function (x, y, width, height) {
    var ret = {
        width: width,
        height: height
    };
    for (var i = 0; i < width; i++) {
        if (mapRooms[y][x + i] instanceof Tile) {
            ret.width = i;
            break;
        }
        for (var j = 0; j < height; j++) {
            if (mapRooms[y + j][x + i] instanceof Tile) {
                ret.height = Math.min(ret.height, j);
                break;
            }
        }
    }
    return ret;
};

roomDimensionsLeftDown = function (x, y, width, height) {
    var ret = {
        width: width,
        height: height
    };
    for (var i = 0; i < width; i++) {
        if (mapRooms[y][x - i] instanceof Tile) {
            ret.width = i;
            break;
        }
        for (var j = 0; j < height; j++) {
            if (mapRooms[y + j][x - i] instanceof Tile) {
                ret.height = Math.min(ret.height, j);
                break;
            }
        }
    }
    return ret;
}

var processBorderTile = function (x, y) {
    //north wall
    if (y > 0) {
        //if this is an edge, maybe make a door to the next room, otherwise maybe make a new door
        if (mapRooms[y-1][x] instanceof Tile && mapRooms[y][x].id !== mapRooms[y-1][x].id) {
            if (Math.random() > REDUNDANT_DOOR) {
                mapRooms[y][x].directions[NORTH] = mapRooms[y-1][x].directions[SOUTH] = 1;
            }
        } else if (!(mapRooms[y-1][x] instanceof Tile) && Math.random() > NEW_DOOR) {
            mapRooms[y][x].directions[NORTH] = 1;
            newDoors.unshift({x:x, y:y, direction: NORTH}); 
        }
    }
    //south wall
    if (y < MAP_HEIGHT - 1) {
        if (mapRooms[y+1][x] instanceof Tile && mapRooms[y][x].id !== mapRooms[y+1][x].id) {
            if (Math.random() > REDUNDANT_DOOR) {
                mapRooms[y][x].directions[SOUTH] = mapRooms[y+1][x].directions[NORTH] = 1;
            }
        } else if (!(mapRooms[y+1][x] instanceof Tile) && Math.random() > NEW_DOOR) {
            mapRooms[y][x].directions[SOUTH] = 1;
            newDoors.unshift({x:x, y:y, direction: SOUTH}); 
        }
    }
    //east wall
    if (x < MAP_WIDTH - 1) {
        if (mapRooms[y][x+1] instanceof Tile && mapRooms[y][x].id !== mapRooms[y][x+1].id) {
            if (Math.random() > REDUNDANT_DOOR) {
                mapRooms[y][x].directions[EAST] = mapRooms[y][x+1].directions[WEST] = 1;
            }
        } else if (!(mapRooms[y][x+1] instanceof Tile) && Math.random() > NEW_DOOR) {
            mapRooms[y][x].directions[EAST] = 1;
            newDoors.unshift({x:x, y:y, direction: EAST}); 
        }
    }
    //west wall
    if (x > 0) {
        if (mapRooms[y][x-1] instanceof Tile && mapRooms[y][x-1].id !== mapRooms[y][x].id) {
            if (Math.random() > REDUNDANT_DOOR) {
                mapRooms[y][x].directions[WEST] = mapRooms[y][x-1].directions[EAST] = 1;
            }
        } else if (!(mapRooms[y][x-1] instanceof Tile) && Math.random() > NEW_DOOR) {
            mapRooms[y][x].directions[WEST] = 1;
            newDoors.unshift({x:x, y:y, direction: WEST}); 
        }
    }
};

createRoom = function (x, y, direction) {
    console.log('creating room, x:' + x + ' y:' + y + ' direction:' + direction)
    var width = Math.floor(Math.random() * 4 + 3),
        height = Math.floor(Math.random() * 4 + 3),
        x0,
        y0,
        landingX,
        landingY,
        ret = [];
    
    switch (direction) {
        case NORTH:
            var roomDim = roomDimensionsUpRight(x, y - 1, width, height);
            width = roomDim.width;
            height = roomDim.height;
            //width = getMaxRoomWidth(x, y - 1, width, height, true);
            //height = getMaxRoomHeight(x, y - 1, width, height, true);
            x0 = x;
            y0 = y - height;
            landingX = x;
            landingY = y - 1;
            break;
        case EAST:
            var roomDim = roomDimensionsRightDown(x + 1, y, width, height);
            height = roomDim.height;
            width = roomDim.width;
            //height = getMaxRoomHeight(x + 1, y, width, height, false);
            //width = getMaxRoomWidth(x + 1, y, width, height, true);
            x0 = x + 1;
            y0 = y;
            landingX = x + 1;
            landingY = y;
            break;
        case SOUTH:
            var roomDim = roomDimensionDownRight(x, y + 1, width, height);
            width = roomDim.width;
            height = roomDim.height;
            //height = getMaxRoomHeight(x, y + 1, width, height, false);
            //width = getMaxRoomWidth(x, y + 1, width, height, true);
            x0 = x;
            y0 = y + 1;
            landingX = x;
            landingY = y + 1;
            break;
        case WEST:
            var roomDim = roomDimensionsLeftDown(x - 1, y, width, height);
            width = roomDim.width;
            height = roomDim.height;
            //width = getMaxRoomWidth(x - 1, y, width, height, false);
            x0 = x - width;
            y0 = y;
            landingX = x - 1;
            landingY = y;
            break;
        default:
            return false;
    };

    if (mapRooms[landingY][landingX] instanceof Tile) {
        return false;
    }


    roomID = getRoomID();
    
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
    }
    for (var i = 0; i < height; i++) {
        processBorderTile(x0, y0 + i);
        processBorderTile(x0 + width - 1, y0 + i)
    }

    //mark door to previous room
    mapRooms[landingY][landingX].directions[(direction + 2) % 4] = 1;

    //return rooms for adding
    return true;
};