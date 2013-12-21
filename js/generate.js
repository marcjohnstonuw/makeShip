var nextRoomID = 1;

var getRoomID = function () {
    return nextRoomID++;
};

roomDimensionsUpRight = function (x, y, width, height) {
    var ret = {
        width: Math.min(MAP_WIDTH - x, width),
        height: Math.min(y + 1, height)
    };
    for (var i = 0; i < ret.height; i++) {
        if (mapRooms[y - i][x] instanceof Tile) {
            ret.height = i;
            break;
        }
        for (var j = 1; j < ret.width; j++) {
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
        width: Math.min(MAP_WIDTH - x, width),
        height: Math.min(MAP_HEIGHT - y, height)
    };
    for (var i = 0; i < ret.height; i++) {
        if (mapRooms[y + i][x] instanceof Tile) {
            ret.height = i;
            break;
        }
        for (var j = 0; j < ret.width; j++) {
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
        width: Math.min(MAP_WIDTH - x, width),
        height: Math.min(MAP_HEIGHT - y, height)
    };
    for (var i = 0; i < ret.width; i++) {
        if (mapRooms[y][x + i] instanceof Tile) {
            ret.width = i;
            break;
        }
        for (var j = 0; j < ret.height; j++) {
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
        width: Math.min(x + 1, width),
        height: Math.min(MAP_HEIGHT - y, height)
    };
    for (var i = 0; i < ret.width; i++) {
        if (mapRooms[y][x - i] instanceof Tile) {
            ret.width = i;
            break;
        }
        for (var j = 0; j < ret.height; j++) {
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
        if (mapRooms[y-1][x] instanceof Tile) {
            if (mapRooms[y][x].id !== mapRooms[y-1][x].id) {
                if (Math.random() > REDUNDANT_DOOR) {
                    mapRooms[y][x].directions[NORTH] = mapRooms[y-1][x].directions[SOUTH] = DOOR;
                } else {
                    mapRooms[y][x].directions[NORTH] = mapRooms[y-1][x].directions[SOUTH] = WALL;
                }
            }
        } else {
            if (Math.random() > NEW_DOOR) {
                mapRooms[y][x].directions[NORTH] = DOOR;
                newDoors.unshift({x:x, y:y, direction: NORTH}); 
            } else {
                mapRooms[y][x].directions[NORTH] = WALL;
            }
        }
    } else {
        mapRooms[y][x].directions[NORTH] = WALL;
    }
    //south wall
    if (y < MAP_HEIGHT - 1) {
        if (mapRooms[y+1][x] instanceof Tile) {
            if (mapRooms[y][x].id !== mapRooms[y+1][x].id) {
                if (Math.random() > REDUNDANT_DOOR) {
                    mapRooms[y][x].directions[SOUTH] = mapRooms[y+1][x].directions[NORTH] = DOOR;
                } else {
                    mapRooms[y][x].directions[SOUTH] = mapRooms[y+1][x].directions[NORTH] = WALL;
                }
            }
        } else { 
            if (Math.random() > NEW_DOOR) {
                mapRooms[y][x].directions[SOUTH] = DOOR;
                newDoors.unshift({x:x, y:y, direction: SOUTH}); 
            } else {
                mapRooms[y][x].directions[SOUTH] = WALL;
            }
        }
    } else {
        mapRooms[y][x].directions[SOUTH] = WALL;
    }
    //east wall
    if (x < MAP_WIDTH - 1) {
        if (mapRooms[y][x+1] instanceof Tile) {
            if (mapRooms[y][x].id !== mapRooms[y][x+1].id) {
                if (Math.random() > REDUNDANT_DOOR) {
                    mapRooms[y][x].directions[EAST] = mapRooms[y][x+1].directions[WEST] = DOOR;
                } else {
                    mapRooms[y][x].directions[EAST] = mapRooms[y][x+1].directions[WEST] = WALL;
                }
            }
        } else {
            if (Math.random() > NEW_DOOR) {
                mapRooms[y][x].directions[EAST] = DOOR;
                newDoors.unshift({x:x, y:y, direction: EAST}); 
            } else {
                mapRooms[y][x].directions[EAST] = WALL;
            }
        }
    } else {
        mapRooms[y][x].directions[EAST] = WALL;
    }
    //west wall
    if (x > 0) {
        if (mapRooms[y][x-1] instanceof Tile) {
            if (mapRooms[y][x-1].id !== mapRooms[y][x].id) {
                if (Math.random() > REDUNDANT_DOOR) {
                    mapRooms[y][x].directions[WEST] = mapRooms[y][x-1].directions[EAST] = DOOR;
                } else {
                    mapRooms[y][x].directions[WEST] = mapRooms[y][x-1].directions[EAST] = WALL;
                }
            }
        } else {
            if (Math.random() > NEW_DOOR) {
                mapRooms[y][x].directions[WEST] = DOOR;
                newDoors.unshift({x:x, y:y, direction: WEST}); 
            } else {
                mapRooms[y][x].directions[WEST] = WALL;
            }
        }
    } else {
        mapRooms[y][x].directions[WEST] = WALL;
    }
};

createRoom = function (x, y, direction) {

    if (x === 0 && direction === WEST || x === MAP_WIDTH - 1 && direction === EAST
            || y === 0 && direction === NORTH || y === MAP_HEIGHT - 1 && direction  === SOUTH) {
        return false;
    }

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
            x0 = x;
            y0 = y - height;
            landingX = x;
            landingY = y - 1;
            break;
        case EAST:
            var roomDim = roomDimensionsRightDown(x + 1, y, width, height);
            height = roomDim.height;
            width = roomDim.width;
            x0 = x + 1;
            y0 = y;
            landingX = x + 1;
            landingY = y;
            break;
        case SOUTH:
            var roomDim = roomDimensionDownRight(x, y + 1, width, height);
            width = roomDim.width;
            height = roomDim.height;
            x0 = x;
            y0 = y + 1;
            landingX = x;
            landingY = y + 1;
            break;
        case WEST:
            var roomDim = roomDimensionsLeftDown(x - 1, y, width, height);
            width = roomDim.width;
            height = roomDim.height;
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
    console.log('creating room, x:' + x + ' y:' + y + ' direction:' + direction + ' ID:' + roomID)
    
    //set all tiles in the room to 'open' on all sides
    for (var i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            mapRooms[y0 + j][x0 + i] = new Tile(roomID, [3, 3, 3, 3]);
        }
    }
    
    //go along walls, mark them.  Possibly as doors
    if (width === 1 && height === 1) {
        processBorderTile(x0, y0);
    }
    else if (height === 1) {
        for (var i = 0; i < width; i++) {
            processBorderTile(x0 + i, y0);
        }
    }
    else if (width === 1) {
        for (var i = 0; i < height; i++) {
            processBorderTile(x0, y0 + i);
        }
    } else {
        for (var i = 0; i < width; i++) {
            processBorderTile(x0 + i, y0);
            if (height > 1) {
                processBorderTile(x0 + i, y0 + height - 1);
            }
        }
        for (var i = 0; i < height; i++) {
            processBorderTile(x0, y0 + i);
            if (width > 1) {
                processBorderTile(x0 + width - 1, y0 + i)
            }
        }
    }

    //mark door to previous room
    mapRooms[landingY][landingX].directions[(direction + 2) % 4] = DOOR;
    mapRooms[y][x].directions[direction] = DOOR;

    //return rooms for adding
    return true;
};