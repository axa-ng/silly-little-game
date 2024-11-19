
const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d')
const keys = {w:{pressed: false}, a:{pressed: false}, s:{pressed: false}, d:{pressed: false}}

//Game Dimension -----------------------------------------------------------
canvas.width = 1265
canvas.height = 576

//Declaring images
c.fillStyle = "white"
c.fillRect(-50,-50,canvas.width,canvas.height)

const image = new Image()
image.src = './img/map.png'

const object = new Image()
object.src = './img/nezuko_icon.png'

const victory = new Image()
victory.src = './img/yaki_onigiri.png'

 //Sprite Object --------------------------------------------------------
class Sprite{
    constructor({position,image, height, width}){
        this.position = position
        this.image = image
        this.height = height
        this.width = width
    }
    draw(){
        c.drawImage(this.image,
            this.position.x, this.position.y, this.width, this.height)
        //context.drawImage(playerImage, 0, 0, 48, 68, 500, 185, 48, 68)
    }
}
const background = new Sprite({position:{x:0, y:0}, image: image, height: 576, width:1265})
//const player = new Sprite({position: {x: 0, y:73}, image: object, height: 38, width: 35})
const trophy = new Sprite({position: {x: 1225, y:445}, image: victory, height: 45, width: 45})
const player = new Sprite({position: {x: 30, y:20}, image: object, height: 35, width: 35})

//Map Boundaries --------------------------------------------------------
const collisionsMap = []//convert collisions array into 2d array
for (let i = 0; i < collisions.length; i +=70){
    collisionsMap.push(collisions.slice(i,70+i))//make rows of 70s
}
class Boundary{ //creating wall obj/bricks
    static width = 18.1 //tile dimmension
    static height = 14.4
    constructor({position}){
        this.position = position
        this.width = 15 //brick dimmension
        this.height = 15
    }
    draw(){
        c.fillStyle = 'rgba(255, 0, 0, 0)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}
const boundaries =[]//for each 1 in collisionsMap array, convert into a Boundary obj stored in boundaries
collisionsMap.forEach((row, i) => {
    row.forEach((symbol,j) => {
        if (symbol === 1){
            boundaries.push(new Boundary({position: {x: j*Boundary.width, y: i*Boundary.height} }) )
        }
    })
})

//Detects Collision between 2 Objs
function rectangleCollision({rectangle1, rectangle2}){
    return((rectangle1.position.x + rectangle1.width >= rectangle2.position.x) && 
    (rectangle1.position.x <= rectangle2.position.x + rectangle2.width) &&
    (rectangle1.position.y <= rectangle2.position.y + rectangle2.height) &&
    (rectangle1.position.y + rectangle1.height >= rectangle2.position.y))
}

//Players Movement with keys
function playerMovement(){
    let moving = true
    if (keys.w.pressed){
       for (let i = 0; i < boundaries.length; i++){
        const boundary = boundaries[i]
        if (rectangleCollision({rectangle1: player, rectangle2: {...boundary,position: {x:boundary.position.x,y:boundary.position.y +3}}}))   
            {
                console.log('colliding')
                moving = false
                break
            } 
        }
        if (moving){
            player.position.y = player.position.y - 3
        }
    } else if (keys.s.pressed){
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (rectangleCollision({rectangle1: player, rectangle2: {...boundary,position: {x:boundary.position.x,y:boundary.position.y -3}}}))   
                {
                    console.log('colliding')
                    moving = false
                    break
                }
        }
            if (moving){
                player.position.y = player.position.y + 3
            }
    } else if (keys.a.pressed){
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (rectangleCollision({rectangle1: player, rectangle2: {...boundary,position: {x:boundary.position.x+3,y:boundary.position.y}}}))   
                {
                    console.log('colliding')
                    moving = false
                    break
                }
        }
            if (moving){
                player.position.x = player.position.x - 3
            }
    } else if (keys.d.pressed){
        for (let i = 0; i < boundaries.length; i++){
            const boundary = boundaries[i]
            if (rectangleCollision({rectangle1: player, rectangle2: {...boundary,position: {x:boundary.position.x-3,y:boundary.position.y}}}))   
                {
                    console.log('colliding')
                    moving = false
                    break
                }
        }
            if (moving){
                player.position.x = player.position.x + 3
            }
    }
}

//Obj Display + Movement AKA. Animation -------------------------------------------------------------------------------
function animate(){
    window.requestAnimationFrame(animate)
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    trophy.draw()
    player.draw()
    playerMovement()
    if (rectangleCollision({rectangle1:player, rectangle2: trophy})){
        let finalQ = document.getElementById('pop_quiz');
        finalQ.classList.add("open-Q");
    }

}
animate()

//Detecting keys movement-------------------------------------------------------------
window.addEventListener('keydown', (e)=> {
    switch(e.key){
        case 'w':
            keys.w.pressed = true
           // movables.forEach((movable) => {movable.position.y +=10})
            break
        case 'a':
            keys.a.pressed = true
           // movables.forEach((movable) => {movable.position.x +=10})
            break
        case 's':
            keys.s.pressed = true
           // movables.forEach((movable) => {movable.position.y -=10})
            break
        case 'd':
            keys.d.pressed = true
          // movables.forEach((movable) => {movable.position.x -=10})
            break
    }
})
window.addEventListener('keyup', (e)=> {
    switch(e.key){
        case 'w':
            keys.w.pressed = false
           // movables.forEach((movable) => {movable.position.y +=10})
            break
        case 'a':
            keys.a.pressed = false
           // movables.forEach((movable) => {movable.position.x +=10})
            break
        case 's':
            keys.s.pressed = false
           // movables.forEach((movable) => {movable.position.y -=10})
            break
        case 'd':
            keys.d.pressed = false
          // movables.forEach((movable) => {movable.position.x -=10})
            break
    }
})


//AI chaser
