Math.seedrandom('42');
for (var i = 0; i < 10; i++) {
    console.log(Math.random());
}

var MAP_WIDTH = 20,
    MAP_HEIGHT = 20,
    COCKPIT_X = 5,
    COCKPIT_Y = 10;

//initialize array to solid (-1)
var mapRooms = new Array(MAP_HEIGHT);
for (var i = 0; i < MAP_HEIGHT; i++) {
    mapRooms[i] = new Array(MAP_WIDTH);
    for (var j = 0; j < MAP_WIDTH; j++) {
        mapRooms[i][j] = 0;
    }
}

//start with cockpit
mapRooms[COCKPIT_Y][COCKPIT_X] = new Tile([WALL, DOOR, WALL, WALL]);
var newDoors = createRoom(COCKPIT_X, COCKPIT_Y, EAST);

var printMap = function () {
    var out = ['\n   '];
    for (var j = 0; j < MAP_WIDTH; j++) {
        (j < 10) ? out.push('   ' + j + '  |') : out.push('  ' + j + '  |') ;
    }
    out.push('\n  +');
    for (var j = 0; j < MAP_WIDTH; j++) {
        out.push('------+');
    }
    out.push('\n');
    for (var i = 0; i < MAP_HEIGHT; i++) {
        (i < 10) ? out.push(i + ' ') : out.push(i);
        for (var j = 0; j < MAP_WIDTH; j++) {
            if(mapRooms[i][j] instanceof Tile) {
                out.push('| ');
                for (var k = 0; k < 4; k++) {
                    out.push(mapRooms[i][j].directions[k]);  
                }
                out.push(' ');
            } else {
                out.push('| XXXX ');
            }
        }
        out.push('|\n  +')
        for (var j = 0; j < MAP_WIDTH; j++) {
            out.push('------+');
        }
        out.push('\n');
    }
    console.log(out.join(''));
};
printMap();
console.dir(newDoors);