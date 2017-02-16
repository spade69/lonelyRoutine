/**
 * Behavior Object 
 *  Define all behavior of a sprite here
 * Author Jason
 * Date 2017/2/5
 */
import AnimationTimer from './animationTimer.js';
import * as GB from '../common/global' ;
import Event from './observer.js';
const ANIMATION_DURATION=GB.ANIMATION_DURATION,
    PUSH_ANIMATION_DURATION=GB.PUSH_ANIMATION_DURATION,
    RIGHT=GB.RIGHT,
    LEFT=GB.LEFT,
    GRAVITY_FORCE=GB.GRAVITY_FORCE,
    TAP_FORCE=GB.TAP_FORCE,
    TAP_VELOCITY=GB.TAP_VELOCITY,
    PLATFORM_HEIGHT_IN_METERS=GB.PLATFORM_HEIGHT_IN_METERS,
    BALL_RADIUS=GB.BALL_RADIUS;

let canvas=GB.canvas,
    arrow=LEFT,
    LEDGE_LEFT   = 280,
    LEDGE_TOP    = 55,
    LEDGE_WIDTH  = 50,
    LEDGE_HEIGHT = 12,
    linear=AnimationTimer.makeLinear(1),
    easeIn=AnimationTimer.makeEaseIn(1),
    easeOut=AnimationTimer.makeEaseOut(1),
    easeInOut=AnimationTimer.makeEaseInOut(1),
    elastic=AnimationTimer.makeElastic(5),
    bounce=AnimationTimer.makeBounce(5),
       // AnimationTimers....................................................
    animationTimer=new AnimationTimer(ANIMATION_DURATION,linear),
    pushAnimationTimer    = new AnimationTimer(PUSH_ANIMATION_DURATION),
    fallingAnimationTimer = new AnimationTimer()
   // pixelsPerMeter=(canvas.height-LEDGE_TOP)/PLATFORM_HEIGHT_IN_METERS

;



let runInPlace={
    lastAdvance:0.0,
    // body... 
    // passing context means that you can use this to do sth draw or others.
    execute:function(sprite,context){
        let lastAdvance=this.lastAdvance;//this bind to runInPlace object
        let elapsed=animationTimer.getElapsedTime();
        if(lastAdvance===0){ //Skip first time
            lastAdvance=elapsed;
        }
        else if(lastAdvance!==0&&elapsed-lastAdvance>PAGE_FILP_INTERVAL){
            sprite.painter.advance();
            lastAdvance=elapsed;
        }
    }
},

moveRightToLeft={
    lastMove:0,
    reset:function(){
        this.lastMove=0;
    },

    execute:function(sprite,context,time){
        //
        let elapsed=animationTimer.getElapsedTime(),
            advanceElapsed=elapsed-this.lastMove;
        if(this.lastMove===0){//skip first time
            this.lastMove=elapsed;
        }else{
            sprite.left-=(advanceElapsed/1000)*sprite.velocityX;
            this.lastMove=elapsed;
        }
    }

},
//intialize first ,then new Sprite adding behavior to it.
fallOnLedge={
    ledgeRect:[
        {left:0,top:0,width:0,height:0,color:undefined},
        {left:0,top:0,width:0,height:0,color:undefined},
        {left:0,top:0,width:0,height:0,color:undefined},
        {left:0,top:0,width:0,height:0,color:undefined}
    ],
    ballWillHitLedge:function(sprite,ledge){
        let fps=sprite.fps;
        let spriteRight=sprite.left+sprite.width,
            ledgeRight=ledge.left+ledge.width,
            spriteBottom=sprite.top+sprite.height*2, //here is sprite.height*2!!! not so accureately!
            nextSpriteBottomEstimate=spriteBottom+sprite.velocityY/fps;
            //外接矩形 碰撞检测
        return spriteRight>ledge.left&&
                sprite.left<ledgeRight&&
                spriteBottom<ledge.top&&
                nextSpriteBottomEstimate>ledge.top;
    },
    isOnLedge:function(sprite,ledge){
        return sprite.left > ledge.left &&
            (sprite.left+sprite.width) < ledge.left+ ledge.width;
    },
    execute:function(sprite,context,time){
        if(isBallFalling()){
            this.ledgeRect.forEach((ledge)=>{
                //Use this object directly~
                //if Hit happens!
                if(fallOnLedge.ballWillHitLedge(sprite,ledge)){
                    //console.log(compareColor(sprite,ledge));
                    if(compareColor(sprite,ledge)){
                        fallingAnimationTimer.stop();
                        sprite.top=ledge.top-2*sprite.height;
                        //console.log('falling',ledge,sprite);
                        //console.log('hit and color equals');
                        sprite.velocityY=0;
                        sprite.tapTimes=0;
                    } //else {}
                }
            });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        }else {
            this.ledgeRect.forEach((ledge)=>{
                if(fallOnLedge.isOnLedge(sprite,ledge)){
                    if(!compareColor(sprite,ledge)){
                        //sprite.velocityY=300;
                        console.log('trap');
                        trapFalling(sprite);
                    }
                }
            });
    
        }
    }
},

//业务逻辑也包含在这个里面了，如何竖直上抛和检测小球碰撞
//检测
moveGravity={
    lastFrameTime:undefined,
    trap:false,
    // isBallOnLedge:function(sprite){
    //       return sprite.left + 2*BALL_RADIUS > LEDGE_LEFT &&
    //       sprite.left < LEDGE_LEFT + LEDGE_WIDTH;
    // },
    execute:function(sprite,context,time){
        let now=+new Date(),fps=sprite.fps;
        if(this.lastFrameTime==undefined){
            this.lastFrameTime=now;
            return;
        }

        Event.listen('OneTap',()=>{
            startFalling(sprite);
            this.lastFrameTime=now;

        });

        if(isBallFalling()){
            sprite.top+=sprite.velocityY/fps;///this.fps;
            //falling equation
            sprite.velocityY=(GRAVITY_FORCE)*
                (fallingAnimationTimer.getElapsedTime()/1000) + TAP_VELOCITY;
           // console.log(sprite.velocityY);
            if(sprite.top>canvas.height){
                stopFalling(sprite);
            }  
        }else{
            if(this.trap){
                sprite.top+=sprite.velocityY/fps;
                this.trap=false;
                if(sprite.top>canvas.height){
                    stopFalling(sprite);
                }  
            }
        }
    }
};

//All behavior helper function for  my game
function isBallFalling(){
    return fallingAnimationTimer.isRunning();
}

//ballSprite behavior
function startFalling(ballSprite){
    fallingAnimationTimer.start();
    //ballSprite.velocityX=0;
    ballSprite.velocityY=0;

}

function trapFalling(sprite){
    //fallingAnimationTimer.start();
    sprite.velocityY=300;
    moveGravity.trap=true;
}

function stopFalling(sprite){
    reset(sprite);
}

function reset(sprite){
    fallingAnimationTimer.stop();
    pushAnimationTimer.stop();
    sprite.left=0; //0?
    sprite.top=canvas.height;//
    sprite.velocityY=0;
}

//Juding/compare color
function compareColor(sprite,ledge){
    let arrColors=sprite.color,flag=false;
    //console.log(arrColors);
    arrColors.forEach((item)=>{
       // console.log(item,ledge.color);
        if(item===ledge.color)//contains color of ledge.color
            flag=true;
    });

    return flag;
}
export {runInPlace,moveRightToLeft,moveGravity,fallOnLedge};