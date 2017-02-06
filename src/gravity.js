/**
 *
 * Author Jason
 * Date 2017/2/5
 */
//moveBall is a behavior -- an object with an execute(sprite,context,time)
//method that's attached to the ball sprite executes the moveBall
var GRAVITY_FORCE = 9.81,  // 9.81 m/s / s
    RIGHT = 1,
    LEFT = 2,
    ARROW_MARGIN = 10,
    BALL_RADIUS   = 23,
    LEDGE_LEFT   = 280,
    LEDGE_TOP    = 55,
    LEDGE_WIDTH  = 50,
    LEDGE_HEIGHT = 12,
    PLATFORM_HEIGHT_IN_METERS=10,
    pixelsPerMeter=(canvas.height-LE),
    arrow=LEFT;
var moveBall={
    lastFrameTime:undefined,
    execute:function(sprite,context,time){
        var now=+new Date();
        if(this.lastFrameTime==undefined){
            this.lastFrameTime=now;
            return;
        }
        if(pushAnimationTimer.isRunning()){
            if(arrow===LEFT) sprite.left-=sprite.velocityX/fps;
            else sprite.left+=sprite.velocityX/fps;

            if(isBallOnLedge()){
                if()
            }
        }
    }
}
,
lob={ //modified to class . Object
    lastTime:0,
    GRAVITY_FORCE:9.81,
    applyGravity:function(elapsed){
        ball.velocityX=(this.GRAVITY_FORCE*elapsed)-
                            (launchVelocity*Math.sin(launchAngle));
    },
    updateBallPosition:function (updateDelta){
        ball.left+=ball.velocityX*(updateDelta)*pixelsPerMeter;
        ball.top+=ball.velocityY*(updateDelta)*pixelsPerMeter;
    },
    checkForThreePointer:function(){
        if(ball.top<0)
            this.threePointer=true;
    },
    checkBallBounds:function(){
        if(ball.top>canvas.height||ball.left>canvas.width){
            reset();
        }
    },
    execute:function(ball,context,time){
        var updateDelta,elapsedFlightTime;
        if(this.ballInFlight){
            elapsedFrameTime=(time-this.lastTime)/1000;
            elapsedFlightTime=(time-)/1000;
            this.applyGravity(elapsedFlightTime);

            this.updateBallPosition(elapsedFrameTime);
            this.checkForThreePointer();
            this.checkBallBounds();
        }
        this.lastTime=time;
    }
},
swing={
    GRAVITY_FORCE:32,
    ROD_LENGTH:0.8,
    execute:function(pendulum,context,time){
        pendulum.angle=pendulum.initialAngle*Math.cos(
                        Math.sqrt(this.GRAVITY_FORCE/this.ROD_LENGTH)*
                        elapsedTime);
        pendulum.weightX=pendulum.x+Math.sin(pendulum.angle)*pendulum.rodLength;
        pendulum.weightY=pendulum.y+Math.cos(pendulum.angle)*pendulum.rodLength;
    }
}

//Behavior functions
//
function pushBallLeft(pushAnimationTimer,arrow,LEFT){
    if(pushAnimationTimer.isRunning()){
        pushAnimationTimer.stop();
    }
    arrow=LEFT;
    pushAnimationTimer.start();
}

function isBallOnLedge(){
    return ball.left+BALL_RADIUS>LEDGE_LEFT&&
            ball.left<LEDGE_LEFT+LEDGE_WIDTH;
}