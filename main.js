const canvas = document.getElementById('screen');
let c = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

//keyboard event listener
document.addEventListener("keydown", keyHandler, false);

/** BALL controls */
let dx=2;
let dy=2;
let x = width/2;
let y = height/2;
let radius = 10;

//draw ball
function drawBall(){
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI*2);
    c.fillStyle = "#0095DD";
    c.fill();
    c.closePath();
}

/** PADDLE Controls */
let pHeight = 10;
let pWidth = 75;
let pX = width/2 - pWidth;
let pY = height-(pHeight*2);

//draw Paddle
function drawPaddle(){
    c.beginPath();
    c.fillRect(pX, pY, pWidth, pHeight);
    c.closePath();
}

let move = 20; //paddle movement
function keyHandler(event) {
    let key = event.key;
    switch (key){
        case "ArrowRight":
            pX+=move; //move to the right
            break;
        case "ArrowLeft":
            pX-=move; //move to the left
            break;
        case " ":
            restartGame(); //restart the game
            break;
        case "s":
            animate(); //start the game
            break;
        default:
            break;
    }
}

/** BRICK control */
let brickCount = [3,  5]; //[no. of row, no. of col]
let bWidth = 75;
let bHeight = 20;
let bPadding = 10; //gap between the bricks
let bOffset = [20, 90]; //[top, left] //used to center the bricks
let bricks = [];
for(let i=0; i<brickCount[1]; i++){
    bricks[i] = [];
    for(let j=0; j<brickCount[0]; j++){
        //status: 1-active, 0-dead;
        bricks[i][j] = {x: 0, y: 0, status: 1};
    }
}

//draw bricks
function drawBricks(){
    for(let i=0; i<brickCount[1]; i++){
        for(let j=0; j<brickCount[0]; j++){
            if(bricks[i][j].status == 1){
                let bX = (i*(bWidth+bPadding))+bOffset[1];
                let bY = (j*(bHeight+bPadding))+bOffset[0];
                bricks[i][j].x = bX;
                bricks[i][j].y = bY;
                c.beginPath();
                c.rect(bX, bY, bWidth, bHeight);
                c.fillStyle="#0095dd";
                c.fill();
                c.closePath();
            }
        }
    }
}

// Collision detection  --- buggy
function collisionDetection() {
    for(let i=0; i<brickCount[1]; i++){
        for(let j=0; j<brickCount[0]; j++){
            let brick = bricks[i][j];
            if(brick.status == 1){
                if(x>brick.x && x<brick.x+bWidth && y>brick.y && y<brick.y+bHeight){
                    dy = -dy;
                    brick.status = 0; //kill brick
                    score++;
                }
            }
        }
    }
}


/** GAME Controls */
let gameStop = false;
//Game over screen
function gameOver(){
    c.clearRect(0,0, width, height);
    c.beginPath();
    c.fillStyle = "#eee";
    c.fillRect(0,0, width, height);
    //alert('Game Over', restart);
    c.fillStyle = "red";
    c.font = "60px Comic Sans MS";
    c.fillText("Game Over", width/2, height/2-20);
    c.font = "30px Comic Sans MS";
    c.fillText("Score: "+score, width/2, height/2 + 30);
    c.font = "20px Comic Sans MS";
    c.fillText("Press Space to restart", width/2, height/2 + 80);
    c.textAlign = "center";
    c.closePath();

    gameStop = true;
}

//restart game
function restartGame(){
    gameStop = false;
    document.location.reload();
    clearInterval(interval);
    animate();
}

let score = 0;
//show score
function drawScore(){
    c.font = "60px Arial";
    c.fillStyle = 'rgba(0, 0, 0, 0.5)';//"#0095dd";
    c.fillText(score, 40, 70);
}

// let life = 3;
// function drawLife(livesLeft){
//     c.font = "16px Arial";
//     c.fillStyle = "#0095dd";
//     c.fillText("Lives: "+ livesLeft, width-90, 20);
// }

//draw game
function draw(){
    c.clearRect(0,0, width, height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();

    //check paddle doesn't leave the canvas
    if(pX < 0){
        pX = 0;
    }else if (pX > width-pWidth){
        pX = width-pWidth;
    }

    //bounce ball off the walls and paddle or check if ball is dead
    if(x > width-radius || x < radius){
        dx = -dx;
    }else if (y > height-radius){
        gameOver();
        life--;
     }else  if(y < radius){
        dy = -dy;
    }else if(y > pY-pHeight){
        if(x > pX && x<pX+pWidth ){
            dy = -dy;
        }
    }

    x += dx;
    y += dy;
}

//animating the game
function animate(){
    if(gameStop == true){
        gameOver();
    }else{
        requestAnimationFrame(animate);
        draw();
    }
}

//landing screen
c.clearRect(0,0, width, height);
c.font = "60px Arial";
c.fillStyle = "#0095dd";
c.fillText("Press \"s\" to start", 80, height/2);
c.textAlign = "center";