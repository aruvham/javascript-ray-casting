// Ray Casting
// aruvham

var worldMap = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,0,0,1],
                [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
                [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
                [1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,1],
                [1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,1,1,1,1],
                [1,0,0,0,0,0,0,0,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
                [1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
                [1,0,0,1,1,1,0,0,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,0,0,0,1,1,1,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

var mapWidth = worldMap[0].length, // in blocks
    mapHeight = worldMap.length;   // in blocks

var screenWidth = 320, // px
    screenHeight = 240;// px

var FOV = 60, // degrees
    resolution = 2, // px
    numberOfRays = screenWidth / resolution;

function setup() {
  createCanvas(640, 240);
  minimap = new Minimap(0, 0, 10);
  player = new Player(150, 170);
}

function draw() {
  noStroke();
  background(255);
  fill(255);
  rect(320,0,320,240);
  fill(0);
  rect(320,0,320,120);
  fill(200);
  rect(320,120,320,120);

  minimap.draw();
  castRays();
  player.update();
  player.draw();
}

function castRays() {
  var angleStep = FOV / numberOfRays; // 60 / 80 = 0.75
  var radianStep = (angleStep / 180) * PI // 0.013
  var initialAngle = player.dir - (0.5 * FOV / 180) * PI;
  stroke(0);

  for(var i = 0; i < numberOfRays; i++) {

    // make sure angle is between 0 and 2PI rads
    var newAngle = initialAngle + (radianStep * i);
    if(newAngle < 0) newAngle = (2 * PI) + newAngle;
    var distance = castSingleRay(newAngle);
    stroke("#FFF1A7");
    line(player.x, player.y, player.x + distance[0] * cos(newAngle), player.y + distance[0] * sin(newAngle));

    // render
    var z = (distance[0]/10);
    var z = z * cos(player.dir - newAngle);
    var wallHeight = 240/z;
    if(wallHeight > 240) wallHeight = 240;

    fill("#01A1A1");
    stroke("#01A1A1");
    if(distance[1] == 0 || distance[1] == 1) {
          fill("#016666");
          stroke("#016666");
    }
    rect(320 + i * resolution, 120-(0.5 * wallHeight), resolution, wallHeight);
  }
}

function castSingleRay(angle) {
  // Moving right/left? up/down? Determined by
  // which quadrant the angle is in
  var right = angle > (3 * PI / 2) || (angle >= 0 && angle < PI / 2);
  var up = angle > PI && angle < 2 * PI;

  // HORIZONTAL WALL COLLISIONS
  var hCol = horizontalCollision(up, angle);
  var vCol = verticalCollision(right, angle);
  return (hCol[0] < vCol[0]) ? hCol : vCol;
}

function horizontalCollision(up, angle) {
  var x = floor(player.gridX);
  var y = up ? floor(player.gridY) : floor(player.gridY) + 1;
  var aY = y * minimap.scale;
  var aX = player.x - (player.y - aY) / tan(angle);
  var dX = minimap.scale / tan(angle);
  var dY = minimap.scale;
  var distance = [1000, 0]; // arbitrary large number
  var i = 0;

  // moving up
  if(up) {
    // while inside the map
    while((aY - i * dY) >= minimap.y) {
      // cordinate positions
      var posX = aX - i * dX;
      var posY = aY - i * dY;
      // grid positions
      var gX = floor(posX / minimap.scale);
      var gY = (posY/ minimap.scale) - 1;

      if((gX < mapWidth) && (gY >= 0) && worldMap[gY][gX] != 0) {
        distance = [dist(player.x, player.y, posX, posY), 0];
        break;
      }
      i++;
    }
    // moving down
  } else {
    while((aY + i * dY) <= minimap.y + mapHeight * minimap.scale) {
      var posX = aX + i * dX;
      var posY = aY + i * dY;
      var gX = floor(posX / minimap.scale);
      var gY = (posY)/ minimap.scale;

      if((gX < mapWidth) && (gY >= 0) && worldMap[gY][gX] != 0) {
        distance = [dist(player.x, player.y, posX, posY), 1];
        break;
      }
      i++;
    }
  }
  return distance;
}

function verticalCollision(right, angle) {
  var x = right ? floor(player.gridX) + 1: floor(player.gridX);
  var y = floor(player.gridY);
  var aX = x * minimap.scale;
  var aY = player.y + (aX - player.x) * tan(angle);
  var dY = minimap.scale * tan(angle);
  var dX = minimap.scale;

  var distance = [1000, 0]; // arbitrary large number
  var i = 0;
  fill(255, 0, 255);

  // moving right
  if(right) {
    // while inside the map
    while((aX + i * dX) <= minimap.x + mapWidth * minimap.scale) {
      // cordinate positions
      var posX = aX + i * dX;
      var posY = aY + i * dY;
      // grid positions
      var gX = posX / minimap.scale;
      var gY = floor(posY/ minimap.scale);

      if((gX < mapWidth) && (gY >= 0) && (gY < mapHeight) && worldMap[gY][gX] != 0) {

        distance = [dist(player.x, player.y, posX, posY), 2];
        break;
      }
      i++;
    }
  } else {
    // while inside the map
    while((aX - i * dX) >= minimap.x) {
      // cordinate positions
      var posX = aX - i * dX;
      var posY = aY - i * dY;
      // grid positions
      var gX = (posX / minimap.scale) - 1;
      var gY = floor(posY/ minimap.scale);

      if((gX >= 0) && (gY >= 0) && (gY < mapHeight) && worldMap[gY][gX] != 0) {
        distance = [dist(player.x, player.y, posX, posY), 3];
        break;
      }
      i++;
    }
  }
  return distance;
}

function Player(x, y) {
  this.x = x + minimap.x;
  this.y = y + minimap.y;
  this.gridX = this.x / minimap.scale;
  this.gridY = this.y / minimap.scale;
  this.dir = 0; // angle
  this.rot = 0;
  this.speed = 0;
  this.moveSpeed = 1;
  this.rotSpeed = 2.5 * PI/180;
  this.radius = 4;

  this.draw = function() {
    var squareSize = (2 * this.radius) * (2 * this.radius);
    squareSize /= 2;
    squareSize = sqrt(squareSize);
    fill(255, 0, 0);
    stroke(255, 0, 0);
    rectMode(CENTER);
    rect(this.x, this.y, squareSize, squareSize);
    rectMode(CORNER);
  }

  this.update = function() {
    // so player angle is always between 0 and 2PI rads
    this.dir += (this.rot > 0) ? this.rot * this.rotSpeed : 2 * PI + this.rot * this.rotSpeed;
    this.dir %= 2 * PI;
    newX = this.x + this.speed * this.moveSpeed * cos(this.dir);
    newY = this.y + this.speed * this.moveSpeed * sin(this.dir);

    if(!this.collision(newX, newY)) {
      this.x = newX;
      this.y = newY;
    }

    this.gridX = this.x / minimap.scale;
    this.gridY = this.y / minimap.scale;
  }

  this.collision = function(newX, newY) {
    if(newX - this.radius < minimap.x ||
       newX + this.radius > minimap.x + mapWidth * minimap.scale ||
       newY - this.radius < minimap.y ||
       newY + this.radius > minimap.y + mapHeight * minimap.scale) {
      return true;
    }
    return worldMap[floor((newY - minimap.y) / minimap.scale)][floor((newX - minimap.x) / minimap.scale)] != 0;
  }
}

function Minimap(x, y, scale) {
  this.x = x;
  this.y = y;
  this.scale = scale; // in pixels

  this.draw = function() {
    fill(255);
    noStroke();
    rect(this.x, this.y, mapWidth * this.scale, mapHeight * this.scale);

    fill(200);
    for(y = 0; y < mapHeight; y++) {
      for(x = 0; x < mapWidth; x++) {
        if(worldMap[y][x] != 0) {
          rect(this.x + x * this.scale, this.y + y * this.scale, this.scale, this.scale);
        }
      }
    }
  }

  this.drawGrid = function() {
    stroke(0);
    for(x = 0; x <= mapWidth; x++) {
      line(this.x + x * this.scale, this.y, this.x + x * this.scale, this.y + mapHeight * this.scale);
    }
    for(y = 0; y <= mapHeight; y++) {
      line(this.x, this.y + y * this.scale, this.x + mapWidth * this.scale, this.y + y * this.scale);
    }
  }
}

function keyPressed() {
  if(keyCode == UP_ARROW) player.speed = 1;
  if(keyCode == DOWN_ARROW) player.speed = -1;
  if(keyCode == LEFT_ARROW) player.rot = -1;
  if(keyCode == RIGHT_ARROW) player.rot = 1;
}

function keyReleased() {
  if(keyCode == UP_ARROW || keyCode == DOWN_ARROW) player.speed = 0;
  if(keyCode == LEFT_ARROW || keyCode == RIGHT_ARROW) player.rot = 0;
}

window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
