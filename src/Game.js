import TileMap from "./TileMap.js";

const tileSize=32;
const velocity=2;
const canvas= document.getElementById('gameCanvas');
const ctx=canvas.getContext('2d');
const tileMap= new TileMap(tileSize);
const pacman =tileMap.getPacman(velocity);
const ennemies=tileMap.getEnnemies(velocity);

let gameOver=false;
let gameWin=false;
const gameOverSound=new Audio('../sounds/gameOver.wav');
const gameWinSound=new Audio('../sounds/gameWin.wav');

function gameLoop(){
    tileMap.draw(ctx);
    pacman.draw(ctx,pause(),ennemies);
    ennemies.forEach(enemy=>enemy.draw(ctx,pause(),pacman));
    checkGameOver();
    checkGameWin();

}

function checkGameOver(){
    if(!gameOver){
        gameOver=isGameOver();
       if(gameOver){
        gameOverSound.play();
       }
    }
}
function checkGameWin(){
    if(!gameWin){
        gameWin=tileMap.gameWin();
        if(gameWin){
            gameWinSound.play();
        }

    }
}


function isGameOver(){
    return ennemies.some(ennemy=>!pacman.powerDotIsActive && ennemy.collideWithPacman(pacman));
}

function pause(){
    return !pacman.makeThefirstMove || gameOver || gameWin;
}
tileMap.setCanvasSize(canvas);
setInterval(gameLoop,1000/75);