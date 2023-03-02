import MovingDirection from "./MovingDirection.js";

export default class Ennemies{
    constructor(x,y,tileSize,velocity,tilemap){
        this.x=x;
        this.y=y;
        this.velocity=velocity;
        this.tilemap=tilemap;
        this.tileSize=tileSize;


        this.movingDirection=Math.floor(Math.random()* Object.keys(MovingDirection).length);

        this.directionTimerDefault=this.#random(1,3);

        this.directionTimer=this.directionTimerDefault;

        this.scaredAboutExpireDefaultTimer=10;
        this.scaredAboutExpire=this.scaredAboutExpireDefaultTimer;


       this.#loadImages();
    }

    draw(ctx,pause,pacman){
        if(!pause){
        this.#move();
        this.#changeDirection();
        }

        this.#setImages(ctx, pacman);
    }

    collideWithPacman(pacman){
        const size=this.tileSize/2;

        if(
            this.x< pacman.x +size&&
            this.x+ size> pacman.x &&
            this.y<pacman.y +size &&
            this.y +size >pacman.y
        ){
            return true
        }else{
            return false;
        }

    }

    #move(){
        if(!this.tilemap.didCollissionEnvironnment(this.x,this.y,this.movingDirection)){
            
            switch(this.movingDirection){
                case MovingDirection.up:
                    this.y-=this.velocity;
                break;

                case MovingDirection.down:
                    this.y+=this.velocity;
                break;

                case MovingDirection.left:
                    this.x-=this.velocity;
                break;

                case MovingDirection.right:
                    this.x+=this.velocity;
                break;

            }
        }
    }

    #setImages(ctx,pacman){
        if(pacman.powerDotIsActive){
            this.#setImageGhostsWhenPowerDotIsActive(pacman);
        }
        else{
            this.image=this.normalGhost;
        }
    ctx.drawImage(this.image,this.x,this.y,this.tileSize,this.tileSize);

    }
    
    #setImageGhostsWhenPowerDotIsActive(pacman){
        if(pacman.powerDotWillExpires){
            this.scaredAboutExpire --;
            if(this.scaredAboutExpire===0){
                this.scaredAboutExpire=this.scaredAboutExpireDefaultTimer;
                if(this.image=== this.scaredGhost){
                    this.image=this.scaredGhost2;
                }
                else{
                    this.image=this.scaredGhost;
                }

            }

        }
        else{
            this.image=this.scaredGhost;
        }
    }

    #changeDirection(){
        this.directionTimer--;
        let newMoveDirection=null;
        if(this.directionTimer===0){
            this.directionTimer=this.directionTimerDefault;
            newMoveDirection=Math.floor(Math.random()* Object.keys(MovingDirection).length);
        }
        if(newMoveDirection!== null && this.movingDirection!== newMoveDirection ){
          if(Number.isInteger(this.x/this.tileSize)&& Number.isInteger(this.y/this.tileSize)){
            if(!this.tilemap.didCollissionEnvironnment(this.x,this.y,newMoveDirection)){
                this.movingDirection=newMoveDirection;
            }
          }
        }
    }

    #random(min,max){
        return Math.floor(Math.random()* (max-min+1))+min;

    }

    #loadImages(){
        this.normalGhost=new Image();
        this.normalGhost.src="../images/ghost.png";

        this.scaredGhost=new Image();
        this.scaredGhost.src="../images/scaredGhost.png";

        this.scaredGhost2= new Image();
        this.scaredGhost2.src="../images/scaredGhost2.png";

        this.image=this.normalGhost;
    }
}