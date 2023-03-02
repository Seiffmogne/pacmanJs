import Pacman from './pacman.js';
import MovingDirection from './MovingDirection.js';
import Ennemies from './Enemy.js';

export default class TileMap{
    constructor(tileSize){  
        this.tileSize=tileSize;
        this.yellowDot=new Image();


        this.yellowDot.src='../images/yellowDot.png';
        this.wall=new Image();

        this.wall.src='../images/wall.png';

        this.pinkDot=new Image();
        this.pinkDot.src="../images/pinkDot.png"
        
        this.powerDot=this.pinkDot;

        this.timerDotAnimationDefault=60;
        this.timerAnimationDot=this.timerDotAnimationDefault;

    }

    //1-wall
    //0-dot
    //4 pacMAn
    //5-Blank space;
    //6-Ennemies
    //7 Pink dot

    map = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 7, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 6, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 7, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 6, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 7, 1, 0, 1],
        [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ];

    draw(ctx){
       for(let row=0; row< this.map.length ; row++){
         for(let column =0; column<this.map[row].length; column++){
            let tile=this.map[row][column];
            if(tile===1){
                this.#drawWall(ctx,column,row,this.tileSize);
            }
            else if(tile===0){
                this.#drawDot(ctx,column,row,this.tileSize);
            }
            else if(tile===7){
                this.#drawPinkDot(ctx,column,row,this.tileSize);

            }
            else{
                this.#drawBlank(ctx,column,row, this.tileSize);
            }
            // ctx.strokeStyle="yellow";
            // ctx.strokeRect(
            //  column*this.tileSize,
            //  row*this.tileSize,
            //  this.tileSize,
            //  this.tileSize
            //  )
         }
       }

    }

    #drawDot(ctx,column,row,size){
        ctx.drawImage(this.yellowDot,column*this.tileSize,row*this.tileSize,size,size);
    }

    #drawPinkDot(ctx ,column,row,size){
        this.timerAnimationDot--;
        if(this.timerAnimationDot===0){
            this.timerAnimationDot=this.timerDotAnimationDefault;
            if(this.powerDot==this.pinkDot){
                this.powerDot= this.yellowDot;
            }else{
                this.powerDot=this.pinkDot;
            }
        }
        ctx.drawImage(this.powerDot,column*size,row*size,size,size);

    }

    #drawWall(ctx,column,row,size){
        ctx.drawImage(this.wall,column*this.tileSize,row*this.tileSize,size,size)


    }

    #drawBlank(ctx,column,row,size){
        ctx.fillStyle="black";
        ctx.fillRect(column*this.tileSize ,row*this.tileSize,size,size);


    }

    #dotsLeft(){
        return this.map.flat().filter(tile=> tile===0).length;
    }
    getPacman(velocity){
        for(let row=0; row<this.map.length;row++){
            for(let column=0;column<this.map[row].length;column++){
                let tile=this.map[row][column];
                if(tile===4){
                    this.map[row][column]=0;
                    return new Pacman(column*this.tileSize,
                        row*this.tileSize,
                        this.tileSize,
                        velocity,
                        this);
            

                }
            }
        }
    }

    getEnnemies(velocity){
        const ennemies= [];

        for(let row=0; row<this.map.length;row++){
            for(let column=0;column<this.map[row].length;column++){
                let tile=this.map[row][column];
                if(tile===6){
                    this.map[row][column]=0;
                    ennemies.push(new Ennemies(column*this.tileSize,
                        row*this.tileSize,
                        this.tileSize,
                        velocity,
                        this));
            

                }
            }
        }
        return ennemies;

    }

    setCanvasSize(canvas){
        canvas.width=this.map[0].length *this.tileSize;
        canvas.height=this.map.length * this.tileSize;

    }

    didCollissionEnvironnment(x,y,direction){
        if(direction==null){
            return;
        }

        if(Number.isInteger(x/this.tileSize)&& Number.isInteger(y/this.tileSize)){
            let column=0;
            let row=0;
            let nextColumn=0;
            let nextRow=0;


            switch(direction){
                case MovingDirection.right:
                    nextColumn=x+this.tileSize;
                    column=nextColumn/this.tileSize;
                    row=y/this.tileSize;
                break;

                case MovingDirection.left:
                    nextColumn=x-this.tileSize;
                    column=nextColumn/this.tileSize;
                    row=y/this.tileSize;
                break;

                case MovingDirection.up:
                    nextRow=y - this.tileSize;
                    row=nextRow / this.tileSize;
                    column= x / this.tileSize;
                break;

                case MovingDirection.down:
                    nextRow=y + this.tileSize;
                    row=nextRow /this.tileSize;
                    column=x /this.tileSize;
            }
        const tile=this.map[row][column];
            if(tile===1){
                return true;
            }
        }
        return false;
    }

    gameWin(){
     return this.#dotsLeft()===0;
    }

    eatDot(x,y){
     const row=y/this.tileSize;
     const column=x/this.tileSize;

     if(Number.isInteger(row)&& Number.isInteger(column)){
        if(this.map[row][column]===0){
            this.map[row][column]=5;
            return true;

        }
     }
     return false;

    }

    eatPowerDot(x,y){
        const row=y/this.tileSize;
     const column=x/this.tileSize;

     if(Number.isInteger(row)&& Number.isInteger(column)){
        if(this.map[row][column]===7){
            this.map[row][column]=5;
            return true;

        }
     }
     return false;

    }
}