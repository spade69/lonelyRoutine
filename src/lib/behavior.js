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
    fallingAnimationTimer = new AnimationTimer(),
   // pixelsPerMeter=(canvas.height-LEDGE_TOP)/PLATFORM_HEIGHT_IN_METERS
   tap=false,
   Stack=[]
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
    //top width height will not change ,these are fixed 
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
            //此处的碰撞检测包含了3种情况，sprite在ledge的左边缘上，但还没超出
            //sprite在ledge的右边缘上，但还没超出，
            //sprite整体在ledge里面。 后面的identify会判断出来
        return spriteRight>ledge.left&&
                sprite.left<ledgeRight&&
                spriteBottom<ledge.top&&
                nextSpriteBottomEstimate>ledge.top;
    },
    isOnLedge:function(sprite,ledge){
        let spriteRight=sprite.left+sprite.width,
            ledgeRight=ledge.left+ ledge.width;
            //console.log(ledge.top,sprite.top,sprite.height);
        return sprite.left > ledge.left &&
            spriteRight < ledgeRight&&(sprite.top+2*sprite.height===ledge.top)
            ;
    },
    execute:function(sprite,context,time){
        if(isBallFalling()){
            let ledgeArr=this.ledgeRect;
            for(let len=this.ledgeRect.length,i=0;i<len;i++){
                //Use this object directly~
                //if Hit happens!
                if(fallOnLedge.ballWillHitLedge(sprite,ledgeArr[i])){
                    //console.log(i);
                    //detectRange decides the true, real index of this hitLedge！
                    //决定了真正要比较的ledge的下标！
                    let index=detectRange(sprite,ledgeArr[i],ledgeArr);
                    //console.log(index);
                    if(compareColor(sprite,ledgeArr[index])){
                        fallingAnimationTimer.stop();
                        sprite.top=ledgeArr[i].top-2*sprite.height;
                        //console.log('falling',ledge,sprite);
                        //console.log('hit and color equals');
                        sprite.velocityY=0;
                        sprite.tapTimes=0;
                    } else {                       
                        if(!sprite.trap) {//默认是false
                             limitAndFalling(sprite,ledgeArr[i]);
                        //sprite.trap===true表示游戏结束了
                            trapFalling(sprite);
                        }
                    }
                }
            }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        }else {
            let ledgeArr=this.ledgeRect;
            for(let len=this.ledgeRect.length,i=0;i<len;i++){
                //再次启动游戏，在更新了sprite的left和top之后，但是我startNewGame还没更新
                //所有的数据。 
                if(fallOnLedge.isOnLedge(sprite,ledgeArr[i])){
                    if(!compareColor(sprite,ledgeArr[i])&&ledgeArr[i].color!=undefined
                        &&sprite.color.length!==0){
                        //sprite.velocityY=300;
                        if(!sprite.trap){
                            limitAndFalling(sprite,ledgeArr[i]);
                            trapFalling(sprite);
                        }
                    }
                }
            }
    
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

        if(isBallFalling()){
            if(Stack.length===0){
                //判断小球速度是否为0
                if(tap){
                    tapSpeedingFalling(sprite,fps);
                }
                else{
                    let fixedPosition=fallOnLedge.ledgeRect[0].top;
                    if(sprite.velocityY>=0&&(sprite.top+2*sprite.height)<fixedPosition)
                        normalFalling(sprite,fps);
                }
            }
            else{
                restoreSprite(sprite);
            }
        }else{
            if(this.trap){
                sprite.top+=sprite.velocityY/fps;
                this.trap=false;
                if(sprite.top>canvas.height){
                    stopFalling(sprite);
                }  
            }//trap
        }//else
    }//execute
};

//All behavior helper function for  my game
function restoreSprite(sprite){
    let tmpSprite;//Pop最外层的
    tmpSprite=Stack.pop();
    sprite.top=tmpSprite.top;
    sprite.velocityY=tmpSprite.velocityY;
    fallingAnimationTimer.start();
    tap=false;
    while(tmpSprite.length>0){
        Stack.pop();
    }
}


function tapSpeedingFalling(sprite,fps){
    sprite.top+=sprite.velocityY/fps;///this.fps;
    //falling equation
    //console.log(sprite.velocityY);
    sprite.velocityY=(GRAVITY_FORCE)*
        (fallingAnimationTimer.getElapsedTime()/1000) + TAP_VELOCITY;
    // console.log(sprite.velocityY);
    if(sprite.top>canvas.height){
        stopFalling(sprite);
    }      
}
//处理上升阶段的暂停
function tapEaseFalling(sprite,fps){

}

function normalFalling(sprite,fps){
    sprite.top+=sprite.velocityY/fps;
    sprite.velocityY=(GRAVITY_FORCE)*
                    (fallingAnimationTimer.getElapsedTime()/1000);
    if(sprite.top>canvas.height){
        stopFalling(sprite);
    }
}

function storeSprite(sprite){
    Stack.push(sprite);
}

function isBallFalling(){
    return fallingAnimationTimer.isRunning();
}

//ballSprite behavior
function startFalling(ballSprite){
    fallingAnimationTimer.start();
    //ballSprite.velocityX=0;
    ballSprite.velocityY=0; //a specific value
    tap=true;
}

function trapFalling(sprite){
    sprite.velocityY=700;
    sprite.color=[];
    sprite.top=1000;
    sprite.left=1000;
    moveGravity.trap=true;
    //结束游戏的事件
    sprite.trap=true;
    Event.trigger('EndGame');//trigger event!
    //stopFalling(sprite);
    
}

function limitAndFalling(sprite,ledge){
    let spriteRight=sprite.left+sprite.width,
        ledgeRight=ledge.left+ledge.width;
    if(sprite.left<=ledge.left){
        sprite.left=ledge.left;
    }
    else if(spriteRight>=ledgeRight){
        sprite.left=ledgeRight-sprite.width;
    }

}

function stopFalling(sprite){
    reset(sprite);
}

function PauseHandler(sprite){
    let fixedPosition=fallOnLedge.ledgeRect[0].top,
        spritePosition=sprite.top+sprite.height*2;
    if(spritePosition<fixedPosition){
        fallingAnimationTimer.stop();
        //pause=true;
        storeSprite(sprite);
    }
}

function RecoverHandler(){
    fallingAnimationTimer.start();
   // pause=false;
}


function reset(sprite){
    fallingAnimationTimer.stop();
    pushAnimationTimer.stop();
    // if(sprite.top>canvas.height)
    // canvas.height:900 
    sprite.left=-1000; //0?
    sprite.top=-1000;//
    sprite.velocityY=0;
}

//Juding/compare color
function compareColor(sprite,ledge){
    let arrColors=sprite.color,flag=false;
    //console.log(arrColors);

    for(let i=0,len=arrColors.length;i<len;i++){
        //console.log(arrColors[i],ledge.color);
        if(arrColors[i]===ledge.color&&ledge.color!=undefined)//contains color of ledge.color
        { 
            flag=true;
            return flag;
        }
    }

    return flag;
}

function detectRange(sprite,ledge,ledgeArr){
    //ledge: current ledge, ledgeArr contains all the ledges 
    //we need to compare current ledge and next ledge
    //Normally ballHitLedge only happens on the second or third   rect
    //I've tested ,always return index===1. 
    //We don't know the hitLedge is on the left side of the sprite or
    //the right side. so we need to identify. 
    let index=ledgeArr.indexOf(ledge),
        ledgeRight=ledge.left+ledge.width,
        spriteRight=sprite.left+sprite.width,
        leftWidth,
        rightWidth;
    let flag=identify(sprite,ledge);
    index=1;
    //supposed index===1
    if(flag===0){
        return index;
    }
    //flag===1 means on the right side , -1 means on the left side 
    leftWidth=(flag===1)?(ledge.width-(sprite.left-ledge.left)):
                                    (ledge.left-sprite.left);
    rightWidth=(flag===1)?(spriteRight-ledgeRight):
                                (ledge.width-(ledgeRight-spriteRight));
    
    if(flag===1){
        //Math.max(leftWidth,rightWidth);//return the larger number
        return (leftWidth>rightWidth)?(index-1):(index);
    }else{
        return (leftWidth>rightWidth)?(index):(index+1);
    }
}

function identify(sprite,ledge){
    let ledgeRight=ledge.left+ledge.width,
        spriteRight=sprite.left+sprite.width;
    if(ledge.left<=sprite.left&&ledgeRight>=spriteRight){
        //completely inside the ledge!
        return 0;
    }else if(ledgeRight>spriteRight&&ledge.left>sprite.left){
        //over the range of left side ,超出左边边缘了。但仍然算碰撞到
        return -1;
    }else{
        //超出右边边缘了，但仍然是属于碰撞
        return 1;
    }
}

export {
    runInPlace,moveRightToLeft,moveGravity,fallOnLedge,
    RecoverHandler,
    PauseHandler,
    startFalling
};