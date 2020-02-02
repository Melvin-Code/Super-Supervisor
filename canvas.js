/* jshint esversion: 9 */

const canvas = document.querySelector('canvas');
canvas.height = window.innerHeight - 600;
canvas.width = window.innerWidth - 40;

ctx = canvas.getContext('2d'); //gets the context in 2d




let x = canvas.width / 2; //horizontal position of the player
let y = 0; //vertical position of the player

let dx = 5; //horizontal velocity of the player
let dy = 0; //vertical velocity of the player
let gravity = 1;
let friction = 0.95;


let srcX; // runs vertically trough the sprite sheet creatin the motion 
let srcY; // change wich animation from the sprite sheet is run

const sheetWidth = 832; //width of spriteSheet
const sheetHeight = 1344; // heigth of spriteSheet

let cols = 7; // number of frames or images are in one animation
let rows = 21; // number of animations

let width = sheetWidth / 13; // width from the spritesheet that is shown
let height = sheetHeight / rows; // heigth of the spritesheet that is shown
y = canvas.height - height;
let character = new Image(); // chose the spritesheet image that will be use
character.src = 'images/Player.png';

let currentFrame = 1; // gives a number tu the first frame in the spritesheet so it can track the frame change


//movement
let rightPressed, leftPressed, spacePressed;

function keyDownHandler(event){
  if(event.keyCode === 39 || event.keyCode === 68){
      rightPressed = true;
  }
  else if(event.keyCode === 37 || event.keyCode === 65){
      leftPressed = true;
  } else if(event.keyCode === 32){

    if(y > (canvas.height - 80)){
      y -= 20;
    }
  }
}

function keyUpHandler(event){
  if(event.keyCode === 39 || event.keyCode === 68){
      rightPressed = false;
  }
  else if(event.keyCode === 37 || event.keyCode === 65){
      leftPressed = false;
  } else if(event.keyCode === 32){
      y = canvas.height - height;
  }
}


document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);


function updateFrame() { // updates the frame and clears the previous ones from the canvas once a new one has taken its place
  ctx.clearRect(x, y, width, height);
  currentFrame = (currentFrame + 1) % cols;

  srcX = currentFrame * width;
  
}


function drawImage() { //draws every frame into te board
  updateFrame();
  ctx.drawImage(character, srcX, srcY, width, height, x, y, width, height);

}

setInterval(function () { // sets the interval between frames
  
  ctx.clearRect(0,0,canvas.width, canvas.height);
  drawImage();
  if(rightPressed){
    srcY = height * 11;
    drawImage();
    x += dx;
  }
  else if(leftPressed){
    srcY = height * 9;
    drawImage();
    x -= dx;
  }

  if(y + height > canvas.height){
    dy = -dy * friction;
  } else { dy += 10;}
  
    
}, 100);