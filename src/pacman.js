import MovingDirection from "./MovingDirection.js";

export default class Pacman {
    constructor(x,y,tilesize,velocity,tileMap){
        this.x=x;
        this.y=y;
        this.tilesize=tilesize;
        this.velocity=velocity;
        this.tileMap=tileMap;

        this.currentMovingDirection=null;
        this.requestedMovingDirection=null;

        this.pacmanAnimationTimerDefault=10;
        this.pacmanAnimationtimer=null;
        
        this.pacmanRotation=this.Rotation.right;
        
        this.makeThefirstMove=false;
        
        this.powerDotIsActive=false;
        this.powerDotWillExpires=false;

        this.wakaSound=new Audio('../sounds/waka.wav');
        this.powerDotSound=new Audio('../sounds/power_dot.wav');
        this.eatGhostSound=new Audio('../sounds/eat_ghost.wav');
        this.timers=[];


        document.addEventListener("keydown",this.#keyDown)
        this.#loadPacmanImage();
    }

    Rotation={
        right:0,
        down:1,
        left:2,
        up:3

    }

    draw(ctx,pause,ennemies){
     if(!pause){
        this.#move();  
     }
     this.#animate();
     this.#eatDot();
     this.#eatPowerDot();
     this.#eatGhost(ennemies);
    
    const size= this.tilesize/2;
    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.pacmanRotation *90 *Math.PI)/180);
   
    ctx.drawImage(this.pacmanImages[this.pacmanIndex],
        -size,
        -size,
        this.tilesize,
        this.tilesize
        );

    ctx.restore();


    //   ctx.drawImage(this.pacmanImages[this.pacmanIndex],
    //     this.x,
    //     this.y,
    //     this.tilesize,
    //     this.tilesize
    //     );

    }
    #keyDown=(event)=>{
        //up
        if(event.keyCode==38){
            if(this.currentMovingDirection== MovingDirection.down)
             this.currentMovingDirection=MovingDirection.up;
            this.requestedMovingDirection=MovingDirection.up;
            
            this.makeThefirstMove=true;

        }
        
        //down
        if(event.keyCode==40){
            if(this.currentMovingDirection== MovingDirection.up)
            this.currentMovingDirection=MovingDirection.down;
           this.requestedMovingDirection=MovingDirection.down;

           this.makeThefirstMove=true;
        }

        //left
        if(event.keyCode==37){
            if(this.currentMovingDirection== MovingDirection.right)
            this.currentMovingDirection=MovingDirection.left;
           this.requestedMovingDirection=MovingDirection.left;

           this.makeThefirstMove=true;
        }

        //right
        if(event.keyCode==39){
            if(this.currentMovingDirection== MovingDirection.left)
            this.currentMovingDirection=MovingDirection.right;
           this.requestedMovingDirection=MovingDirection.right;

           this.makeThefirstMove=true;
        }

    }

    #move(){
        if(this.currentMovingDirection !== this.requestedMovingDirection){
            if(Number.isInteger(this.x/this.tilesize) && Number.isInteger(this.y/this.tilesize)){
                if(!this.tileMap.didCollissionEnvironnment(this.x,this.y,this.requestedMovingDirection))
                 this.currentMovingDirection=this.requestedMovingDirection;
            }
        }

        if(this.tileMap.didCollissionEnvironnment(this.x,this.y,this.requestedMovingDirection)){
            this.pacmanAnimationtimer=null;
            this.pacmanIndex=1;
            return;
        }
        else if(this.currentMovingDirection !==null && this.pacmanAnimationtimer==null ){
            this.pacmanAnimationtimer=this.pacmanAnimationTimerDefault;
        } 
        
        switch(this.currentMovingDirection){
            case MovingDirection.up:
                this.y-= this.velocity;
                this.pacmanRotation=this.Rotation.up;
            break;
            
            case MovingDirection.down:
                this.y+= this.velocity;
                this.pacmanRotation=this.Rotation.down;
            break;
            
            case MovingDirection.left:
                this.x-= this.velocity;
                this.pacmanRotation=this.Rotation.left;
            break;
            
            case MovingDirection.right:
             this.x+= this.velocity;
             this.pacmanRotation=this.Rotation.right;
            break;
        }
    }
    #loadPacmanImage(){
        const pacamnImage0=new Image();
        pacamnImage0.src='../images/pac0.png';

        const pacamnImage1=new Image();
        pacamnImage1.src='../images/pac1.png';
        
        const pacamnImage2=new Image();
        pacamnImage2.src='../images/pac2.png';
        
        const pacamnImage3=new Image();
        pacamnImage3.src='../images/pac1.png';

        this.pacmanImages=[
            pacamnImage0,
            pacamnImage1,
            pacamnImage2,
            pacamnImage3

        ];
        
        this.pacmanIndex=0;
    }

    #animate(){
        if(this.pacmanAnimationtimer==null){
            return;
        }
        this.pacmanAnimationtimer--;
        if(this.pacmanAnimationtimer==0){
            this.pacmanAnimationtimer=this.pacmanAnimationTimerDefault;
            this.pacmanIndex++;
            if(this.pacmanIndex==this.pacmanImages.length){
                this.pacmanIndex=0;


            }
        }
    }

    #eatDot(){
        if(this.tileMap.eatDot(this.x,this.y) && this.makeThefirstMove){
            this.wakaSound.play();
        }
    }

    #eatPowerDot(){
        if(this.tileMap.eatPowerDot(this.x,this.y)){
            this.powerDotSound.play();
            this.powerDotIsActive=true;

            this.powerDotWillExpires=false;
            this.timers.forEach(timer=>clearTimeout(timer));
            this.timers=[];

            let powerDotTimer=setTimeout(()=>{
                this.powerDotIsActive=false;
                this.powerDotWillExpires=false;

            },1000*6);

            this.timers.push(powerDotTimer);

            let powerDotTimerWillExpired=setTimeout(()=>{
                this.powerDotWillExpires=true;

            },1000*3);

            this.timers.push(powerDotTimerWillExpired);


        }
    }

    #eatGhost(ennemies){
        if(this.powerDotIsActive){
            const collideEnnemies=ennemies.filter(ennemy=>ennemy.collideWithPacman(this));
            collideEnnemies.forEach(ennemy=>{
                ennemies.splice(ennemies.indexOf(ennemy),1);
                this.eatGhostSound.play();                
            });

        }
    }
}
