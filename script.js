const canvas = document.querySelector('canvas')
canvas.height = window.innerHeight - 20
canvas.width = window.innerWidth - 40


ctx = canvas.getContext('2d')

var x = 0
var y = 0
var srcX;
var srcY;

const sheetWidth = 832
const sheetHeight = 1344

var cols = 7
var rows = 21

var width = sheetWidth / 13
var height = sheetHeight / rows

var character = new Image()
character.src = 'images/player.png'
var currentFrame = 0
  function updateFrame() {
    currentFrame = ++currentFrame % cols

    srcX = currentFrame * width
    srcY = 64
    ctx.clearRect(x, y, width, height)
      }
      

  function drawImage() {
    updateFrame()
    ctx.drawImage(character, srcX, srcY, width, height, x, y, width, height)

  }
  console.log(drawImage)

  setInterval(function () {
    drawImage()
    }, 100);