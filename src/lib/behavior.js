/**
 * Behavior Object 
 *  Define all behavior of a sprite here
 * Author Jason
 * Date 2017/2/5
 */
import AnimationTimer from './animationTimer.js';

const ANIMATION_DURATION=3900,
    RIGHT = 1,
    LEFT = 2,
    BALL_RADIUS  = 25,
    LEDGE_LEFT   = 62,
    LEDGE_TOP    = 275,
    LEDGE_WIDTH  = canvas.width-(LEDGE_LEFT*2),
    LEDGE_HEIGHT = 12;
let arrow=LEFT,
    linear=AnimationTimer.makeLinear(1),
    easeIn=AnimationTimer.makeEaseIn(1),
    easeOut=AnimationTimer.makeEaseOut(1),
    easeInOut=AnimationTimer.makeEaseInOut(1),
    elastic=AnimationTimer.makeElastic(5),
    bounce=AnimationTimer.makeBounce(5);
let animationTimer=new AnimationTimer(ANIMATION_DURATION,linear);



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
fallOnLedge={
    ballWillHitLedge:function(sprite,ledge){
        let spriteRight=sprite.left+sprite.width,
            ledgeRight=ledge.left+ledge.width,
            spriteBottom=sprite.top+sprite.height,
            nextSpriteBottomEstimate=spriteBottom+sprite.velocityY/fps;
            //外接矩形 碰撞检测
        return spriteRight>ledge.left&&
                sprite.left<ledgeRight&&
                spriteBottom<ledge.top&&
                nextSpriteBottomEstimate>ledge.top;
    },
    execute:function(sprite,context,time){
        if(isBallFalling()){
            ledges.
        }
    }
},

moveBall={
    lastTime:undefined,
    resetBall:function(sprite){
        sprite.left=LEDGE_LEFT- BALL_RADIUS;
        sprite.top=LEDGE_TOP-BALL_RADIUS*2;
    },
    isBallOnLedge:function(sprite){
          return sprite.left + 2*BALL_RADIUS > LEDGE_LEFT &&
          sprite.left < LEDGE_LEFT + LEDGE_WIDTH;
    },
    updateBallPosition:function(elapsed,sprite){
        if(arrow===LEFT) sprite.left-=sprite.velocityX*(elapsed/1000);
        else
            sprite.left+=sprite.velocityX*(elapsed/1000);
    },
    execute:function(sprite,context,time){
        if(animationTimer.isRunning()){
            let animationElapsed=animationTimer.getElapsedTime(),
                elapsed;
            if(this.lastTime!==undefined){
                elapsed=animationElapsed-this.lastTime;
                this.updateBallPosition(elapsed,sprite);

                if(isBallOnLedge(sprite)){
                    if(animationTimer.isOver()){
                        animationTimer.stop();
                    }
                }
                else{
                    animationTimer.stop();
                    this.resetBall();
                }
            }//this.lastTime
        }//
    }
}

export {runInPlace,moveRightToLeft,moveBall};