var WALL = 0,
    DOOR = 1,
    OBJECT = 2,
    OPEN = 3;
    
var NORTH = 0,
    EAST = 1,
    SOUTH = 2,
    WEST = 3;

var Tile = function (directions) {
    if (arguments.length > 0) {
        this.directions = directions;
    } else {
        this.directions = [0, 0, 0, 0];
    }
};