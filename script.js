const canvas = document.querySelector('canvas')
canvas.height = window.innerHeight - 20
canvas.width = window.innerWidth - 40

let player = {
    x: (canvas.width / 2) ,
    y: canvas.height ,
    width: 50,
    height: 100
}