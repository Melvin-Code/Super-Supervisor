/* jshint esversion: 9 */
const canvas = document.querySelector('canvas');
canvas.height = window.innerHeight - 20;
canvas.width = window.innerWidth - 40;

ctx = canvas.getContext('2d');//gets the context in 2d

var x = 0; // sets the horizontal position of the player
var y = 0; // sets the vertical position of the player
var srcX; // runs vertically trough the sprite sheet creatin the motion 
var srcY; // change wich animation from the sprite sheet is run

const sheetWidth = 832; //width of spriteSheet
const sheetHeight = 1344; // heigth of spriteSheet

var cols = 7;  // number of frames or images are in one animation
var rows = 21; // number of animations

var width = sheetWidth / 13; // width from the spritesheet that is shown
var height = sheetHeight / rows; // heigth of the spritesheet that is shown

var character = new Image(); // chose the spritesheet image that will be use
character.src = 'images/Player.png'; 
var currentFrame = 1; // gives a number tu the first frame in the spritesheet so it can track the frame change

function updateFrame() { // updates the frame and clears the previous ones from the canvas once a new one has taken its place
  currentFrame = (currentFrame + 1) % cols;

  srcX = currentFrame * width;
  srcY = 64; // ps you can chose which animation is shown from here or the variable above but do it only from one since it could create conflicts
  ctx.clearRect(x, y, width, height);
}
    

function drawImage() { //draws every frame into te board
  updateFrame();
  ctx.drawImage(character, srcX, srcY, width, height, x, y, width, height);

}

setInterval(function () { // sets the interval between frmes
  drawImage();
}, 100);