Math.seedrandom('42');
for (var i = 0; i < 10; i++) {
    console.log(Math.random());
}

MAP_WIDTH = 20,
MAP_HEIGHT = 30,
COCKPIT_X = 5,
COCKPIT_Y = 10;

newDoors = [];

NEW_DOOR = 0.5;
REDUNDANT_DOOR = 0.7;

printMap = function () {
    var out = ['\n   '];
    for (var j = 0; j < MAP_WIDTH; j++) {
        (j < 10) ? out.push('    ' + j + '   |') : out.push('   ' + j + '   |') ;
    }
    out.push('\n  +');
    for (var j = 0; j < MAP_WIDTH; j++) {
        out.push('--------+');
    }
    out.push('\n');
    for (var i = 0; i < MAP_HEIGHT; i++) {
        (i < 10) ? out.push(i + ' ') : out.push(i);
        for (var j = 0; j < MAP_WIDTH; j++) {
            if(mapRooms[i][j] instanceof Tile) {
                out.push('| ' + mapRooms[i][j].id + ':');
                for (var k = 0; k < 4; k++) {
                    out.push(mapRooms[i][j].directions[k]);  
                }
                out.push(' ');
            } else {
                out.push('| X:XXXX ');
            }
        }
        out.push('|\n  +')
        for (var j = 0; j < MAP_WIDTH; j++) {
            out.push('--------+');
        }
        out.push('\n');
    }
    console.log(out.join(''));
};


//initialize array to solid (-1)
var mapRooms = new Array(MAP_HEIGHT);
for (var i = 0; i < MAP_HEIGHT; i++) {
    mapRooms[i] = new Array(MAP_WIDTH);
    for (var j = 0; j < MAP_WIDTH; j++) {
        mapRooms[i][j] = 0;
    }
}

//start with cockpit
mapRooms[COCKPIT_Y][COCKPIT_X] = new Tile(0, [WALL, DOOR, WALL, WALL]);
createRoom(COCKPIT_X, COCKPIT_Y, EAST);
var nextRoom = newDoors.pop();
createRoom(nextRoom.x, nextRoom.y, nextRoom.direction);
var nextRoom = newDoors.pop();
createRoom(nextRoom.x, nextRoom.y, nextRoom.direction);

printMap();
console.dir(newDoors);