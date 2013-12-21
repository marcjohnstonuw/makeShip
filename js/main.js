Math.seedrandom('43');
for (var i = 0; i < 10; i++) {
    console.log(Math.random());
}

MAP_WIDTH = 40,
MAP_HEIGHT = 30,
COCKPIT_X = 5,
COCKPIT_Y = 10,
TILE_SIZE = 20;

newDoors = [];

NEW_DOOR = 0.8;
REDUNDANT_DOOR = 0.87;

var roomColors = {
    1: {r: 255, g: 0, b: 0},
    2: {r: 0, g: 255, b: 0},
    3: {r: 120, g: 120, b: 255},
    4: {r: 255, g: 255, b: 0},
    5: {r: 255, g: 0, b: 255},
    6: {r: 0, g: 255, b: 255},
    7: {r: 128, g: 0, b: 0},
    8: {r: 0, g: 128, b: 0},
    9: {r: 60, g: 60, b: 228},
    0: {r: 128, g: 128, b: 128}
}

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
                mapRooms[i][j].id < 10 ? out.push('| ' + mapRooms[i][j].id + ':') : out.push('|' + mapRooms[i][j].id + ':');
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

drawMap = function () {
    var canvas = document.getElementById('mainCanvas');
    if (canvas.getContext){
      var ctx = canvas.getContext('2d');
    }

    for (var i = 0; i < MAP_HEIGHT; i++) {
        for (var j = 0; j < MAP_WIDTH; j++) {
            if (mapRooms[i][j] instanceof Tile) {
                var id = mapRooms[i][j].id % 10;
                ctx.fillStyle = 'rgb(' + roomColors[id].r + ',' + roomColors[id].g + ',' + roomColors[id].b + ')';
                ctx.fillRect(TILE_SIZE * j, TILE_SIZE * i, TILE_SIZE, TILE_SIZE);

                //doors
                if (mapRooms[i][j].directions[NORTH] === DOOR) {
                    ctx.fillStyle = 'orange';
                    ctx.fillRect(TILE_SIZE * j + 2, TILE_SIZE * i, TILE_SIZE - 4, 2);
                } else if (mapRooms[i][j].directions[NORTH] === WALL) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.moveTo(TILE_SIZE * j, TILE_SIZE * i);
                    ctx.lineTo(TILE_SIZE * (j + 1), TILE_SIZE * i);
                    ctx.stroke();
                }

                if (mapRooms[i][j].directions[SOUTH] === DOOR) {
                    ctx.fillStyle = 'orange';
                    ctx.fillRect(TILE_SIZE * j + 2, TILE_SIZE * (i + 1) -2, TILE_SIZE - 4, 2);
                } else if (mapRooms[i][j].directions[SOUTH] === WALL) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.moveTo(TILE_SIZE * j, TILE_SIZE * (i + 1));
                    ctx.lineTo(TILE_SIZE * (j + 1), TILE_SIZE * (i + 1));
                    ctx.stroke();
                }

                if (mapRooms[i][j].directions[WEST] === DOOR) {
                    ctx.fillStyle = 'orange';
                    ctx.fillRect(TILE_SIZE * j, TILE_SIZE * i + 2, 2, TILE_SIZE - 4);
                } else if (mapRooms[i][j].directions[WEST] === WALL) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.moveTo(TILE_SIZE * j, TILE_SIZE * i);
                    ctx.lineTo(TILE_SIZE * j, TILE_SIZE * (i + 1));
                    ctx.stroke();
                }

                if (mapRooms[i][j].directions[EAST] === DOOR) {
                    ctx.fillStyle = 'orange';
                    ctx.fillRect(TILE_SIZE * (j + 1) - 2, TILE_SIZE * i + 2, 2, TILE_SIZE - 4);
                } else if (mapRooms[i][j].directions[EAST] === WALL) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 1;
                    ctx.moveTo(TILE_SIZE * (j + 1), TILE_SIZE * i);
                    ctx.lineTo(TILE_SIZE * (j + 1), TILE_SIZE * (i + 1));
                    ctx.stroke();
                }
            }
            //ctx.strokeStyle = 'rgb(200,200,200)';
            //ctx.rect(20 * j, 20 * i, 20, 20);
            //ctx.stroke();
        }
    }
};

another = function (times) {
    var cond = false;
    while (!cond) {
      if (newDoors.length === 0) break;
        var nextRoom = newDoors.pop();
        cond = createRoom(nextRoom.x, nextRoom.y, nextRoom.direction)
    }
    drawMap();
    if (times > 0) {
        setTimeout(function () {another(times - 1)}, 0);
    } else {
        cleanup();
    }
}

cleanup = function () {
    while (newDoors.length > 0) {
        var door = newDoors.pop();
        mapRooms[door.y][door.x].directions[door.direction] = WALL;
    }
};

printMap();
console.dir(newDoors);


$(document).ready(function () {
    $('#mainCanvas').width(MAP_WIDTH * TILE_SIZE + 20 + 'px')
        .height(MAP_HEIGHT * TILE_SIZE + 20 + 'px');
    //start with cockpit
    mapRooms[COCKPIT_Y][COCKPIT_X] = new Tile(0, [WALL, DOOR, WALL, WALL]);
    createRoom(COCKPIT_X, COCKPIT_Y, EAST);
    another(100);
});