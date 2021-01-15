// IDEAS
//  - platforms to jump on
//  - double jump with cooldown
//  DONE - make framerate independent


const canvasWidth = 600;
const canvasHeight = 450;
const floorStartHeight = 350;
const gameSpeed = 1;
const textures = {};

// Disable FES
p5.disableFriendlyErrors = true;


let traps = [];
let player;
let floors = [];
let score = 0;
let highScore = 0;
let previousTime;
let time;
let timeDifference;
let framesPassed;
let levelSpeed = 7;
let stars = [];

class Trap {
  constructor(posVar) {
    this.color = [255, 0, 0];
    this.xSize = 50;
    this.ySize = 50;
    this.xPos = canvasWidth + posVar;
    this.yPos = floorStartHeight - this.xSize;
  }

  drawTrap() {
    noStroke();
    fill(this.color);
    image(textures.trap, this.xPos, this.yPos, this.xSize, this.ySize);
  }

  move() {
    this.xPos -= levelSpeed * framesPassed;
  }

  isOnScreen() {
    if (this.xPos + this.xSize > 0) {
      return true;
    }
    return false;
  }
}

class Player {
  constructor() {
    this.playerWidth = 50;
    this.playerHeight = 50;
    this.xPlayer = 50;
    this.yPlayer = floorStartHeight - this.playerHeight;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.maxVelocity = 5;
    this.gravityForce = 1;
    this.jumpForce = 15;
    this.canJump = true;
    this.canDoubleJump = true;
    this.keyClicked = false;
  }

  drawPlayer() {
    noStroke();
    fill(0, 0, 0);
    image(textures.player, this.xPlayer, this.yPlayer);
  }

  jump(type) {
    this.yVelocity -= this.jumpForce;
    if (type == 0) {
      this.canJump = false;
    } else {
      this.canJump = false;
      this.canDoubleJump = false;
    }
  }

  move() {
    this.yPlayer += this.yVelocity * framesPassed;

    this.yVelocity += this.gravityForce * framesPassed;
    if (this.yPlayer + this.playerHeight >= floorStartHeight) {
      this.yVelocity = 0;
      this.yPlayer = floorStartHeight - this.playerHeight;
      this.canJump = true;
      this.canDoubleJump = true;
    }

    // SPACE, ARROW UP, MOUSE PRESS
    if ((keyIsDown(32) || keyIsDown(38) || mouseIsPressed) && this.canJump && this.keyClicked == false) {
      this.jump(0);
      this.keyClicked = true;
    } else {
      this.keyClicked = false;
    }
  }

  collisionCheck() {
    for (let i = 0; i < traps.length; i++) {
      if (this.xPlayer + this.playerWidth > traps[i].xPos && this.yPlayer + this.playerHeight > traps[i].yPos && this.xPlayer < traps[i].xPos) {
        reset();
      }
    }
  }
}

class Floor {
  constructor(xPos, yPos) {
    this.xPos = xPos;
    this.yPos = yPos;
  }

  drawFloor() {
    image(textures.floor, this.xPos, this.yPos);
  }

  incrementPosition() {
    this.xPos -= levelSpeed * framesPassed;
    if (this.xPos <= -canvasWidth) {
      this.xPos = canvasWidth - 60;
    }
  }
}

class Star {
  constructor() {
    this.xPos = Math.floor(Math.random() * canvasWidth);
    this.yPos = Math.floor(Math.random() * canvasHeight);
    this.starSize = Math.floor(Math.random() * 5);
    this.starSpeed = Math.random() + 0.1;
  }

  drawStar() {
    fill(255);
    circle(this.xPos, this.yPos, this.starSize);
  }

  moveStar() {
    this.xPos -= this.starSpeed * levelSpeed * framesPassed;
    if (this.xPos < 0 - this.starSize / 2) {
      this.resetPos();
    }
  }

  resetPos() {
    this.xPos = Math.floor(Math.random() * canvasWidth + canvasWidth);
    this.yPos = Math.floor(Math.random() * canvasHeight);
    this.starSize = Math.floor(Math.random() * 5);
    this.starSpeed = Math.random() + 0.1;
  }
}

function getMS() {
  const d = new Date();
  return d.getTime();
}

// eslint-disable-next-line no-unused-vars
function preload() {
  textures.player = loadImage('assets/textures/player.png');
  textures.trap = loadImage('assets/textures/trap.png');
  textures.floor = loadImage('assets/textures/floor.png');

  pressStartFont = loadFont('fonts/PressStart2P-Regular.ttf');
}

// eslint-disable-next-line no-unused-vars
function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('game');
  frameRate(60);

  reset();
}

function reset() {
  player = new Player();

  floors = [];
  floors.push(new Floor(0, floorStartHeight));
  floors.push(new Floor(0, floorStartHeight));
  floors.push(new Floor(canvasWidth - 50, floorStartHeight));

  stars = [];
  for (let i = 0; i < 30; i++) {
    stars.push(new Star());
  }


  time = getMS();
  previousTime = time;

  traps = [];
  traps.push(new Trap(Math.floor(Math.random() * 1000) + 1));

  if (score > highScore) {
    highScore = Math.floor(score);
  }

  score = 0;
  levelSpeed = 7;
}

// eslint-disable-next-line no-unused-vars
function draw() {
  previousTime = time;
  time = getMS();
  timeDifference = time - previousTime;
  framesPassed = timeDifference / 1000 * 60 * gameSpeed;

  if (traps.length <= 1) {
    traps.push(new Trap(Math.floor(Math.random() * 1000) + 1));
  }

  // console.log(traps);
  background(21);

  for (let i = 0; i < stars.length; i++) {
    stars[i].drawStar();
    stars[i].moveStar();
  }

  for (let i = 0; i < traps.length; i++) {
    traps[i].drawTrap();
    traps[i].move();

    if (!traps[i].isOnScreen()) {
      // console.log('kaas')
      traps.splice(i, 1);
      break;
    }
  }

  floors[0].drawFloor();
  floors[1].drawFloor();
  floors[2].drawFloor();
  floors[1].incrementPosition();
  floors[2].incrementPosition();

  fill(255);
  stroke(0);
  textFont(pressStartFont);
  text('High Score: ' + highScore + ' Score: ' + Math.floor(score), 10, canvasHeight - 10);

  score += 0.3 * framesPassed;
  levelSpeed += 0.0010 * framesPassed;

  player.drawPlayer();
  player.collisionCheck();
  player.move();
}