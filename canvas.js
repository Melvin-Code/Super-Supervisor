/* jshint esversion: 9 */

const canvas = document.querySelector('canvas');
canvas.height = 600;
canvas.width = window.innerWidth  - 40;

let c = canvas.getContext('2d'); //gets the context in 2d

let sheetWidth = 832; //width of spriteSheet
const sheetHeight = 1344; // heigth of spriteSheet

let cols = 7; // number of frames or images are in one animation
let rows = 21; // number of animations

let srcX; // runs vertically trough the sprite sheet creatin the motion 
let srcY; // change wich animation from the sprite sheet is run


steve = {

  jumping:true,
  running: true,
  punching: true,
  height:sheetHeight / rows,
  width:sheetWidth / 13,
  x: canvas.width / 2, // center of the canvas
  x_velocity:10,
  y:canvas.height - sheetHeight / rows,
  y_velocity:4,
  currentFrame: 1 // gives a number tu the first frame in the spritesheet so it can track the frame change

};

let cabinet = new Image();
cabinet.src = 'images/Assets/output-onlinepngtools.png'

let gravity = 1;
let friction = 0.95;

let character = new Image(); // chose the spritesheet image that will be use
character.src = 'images/Player.png';





controller = {

  left:false,
  right:false,
  space:false,
  shiftKey: false,
  m: false,
  keyListener:function(event) {

    var key_state = (event.type == "keydown")?true:false;

    switch(event.keyCode) {

      case 65:// A
        controller.left = key_state;
      break;
      case 37:// left key
        controller.left = key_state;
      break;
      case 32:// space key
        controller.space = key_state;
      break;
      case 68:// D
        controller.right = key_state;
      break;
      case 39:// right key
        controller.right = key_state;
      break;
      case 77:// m key
        controller.m = key_state;
      break;
      case 16:// shift key
        controller.shiftKey = key_state;
      break;

    }

  }

};

loop = function() {

  if (!controller.space && !controller.right && !controller.left && !controller.m && !controller.shiftKey){
    srcY = steve.height * 10;
  }

  if (controller.space && steve.jumping == false) {

    steve.y_velocity -= 30;
    steve.jumping = true;

  }

  if(controller.shiftKey && controller.right){
    srcY = steve.height * 11;
    steve.x_velocity += 1;
  }

  if(controller.shiftKey && controller.left){
    srcY = steve.height * 9;
    steve.x_velocity -= 1;
  }

  if (controller.left) {
 
    srcY = steve.height * 9;
    steve.x_velocity -= 0.5;

  }

  if (controller.right) {
   
    srcY = steve.height * 11;
    steve.x_velocity += 0.5;

  }

  if (controller.m) {
    
    // function updatePunch() { // updates the frame and clears the previous ones from the canvas once a new one has taken its place
    //   c.clearRect(steve.x, steve.y, steve.width, steve.height);
    //   steve.currentFrame = (steve.currentFrame + 3) % cols;
    // let cols = 13
    // srcX = 64 * 6


    srcY = steve.height * 19;
    }

  steve.y_velocity += 2;// gravity
  steve.x += steve.x_velocity;
  steve.y += steve.y_velocity;
  steve.x_velocity *= 0.9;// friction
  steve.y_velocity *= 0.9;// friction

  // if steve is falling below floor line
  if (steve.y > canvas.height - steve.height) {

    steve.jumping = false;
    steve.y = canvas.height - sheetHeight / rows;
    steve.y_velocity = 0;

  }

  // if steve is going off the left of the screen
  if (steve.x < 0 - steve.width) {

    steve.x = canvas.width;

  } else if (steve.x > canvas.width) {// if steve goes past right boundary

    steve.x =  0 - steve.width;

  }

  // call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);

};

function updateFrame() { // updates the frame and clears the previous ones from the canvas once a new one has taken its place
  c.clearRect(steve.x, steve.y, steve.width, steve.height);
  steve.currentFrame = (steve.currentFrame + 1) % cols;
  
  if (!controller.m){
  srcX = steve.currentFrame * steve.width;
  } 
  
  if (controller.m) {
    if (steve.currentFrame !== 6 ){
      steve.currentFrame += 20
    }
    cols = 7
    steve.currentFrame = (steve.currentFrame + 1) % 13;
    srcX = steve.currentFrame * 64
  }
  console.log(steve.currentFrame)
  console.log(srcX)
  
}

function drawObject()  {
  c.drawImage(cabinet, canvas.width / 2, canvas.height - 100, 200, 100)
}
function drawImage() { //draws every frame into te board
  updateFrame();
  c.drawImage(character, srcX, srcY, steve.width, steve.height, steve.x, steve.y -100, steve.width + 100, steve.height + 100);

}

setInterval(function () { // sets the interval between frames
  
  c.clearRect(0,0,canvas.width, canvas.height);
  
  drawImage();
  drawObject()  
}, 100);



window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);