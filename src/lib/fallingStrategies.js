/**
 * Date 2017/2/18
 * Author Jason
 * [fallingStrategies description]
 * 
 */
var fallingStrategies={
    tapSpeedingFalling:function(sprite,fps){
        sprite.top+=sprite.velocityY/fps;///this.fps;
        //falling equation
        //console.log(sprite.velocityY);
        sprite.velocityY=(GRAVITY_FORCE)*
            (fallingAnimationTimer.getElapsedTime()/1000) + TAP_VELOCITY;
        // console.log(sprite.velocityY);
        if(sprite.top>canvas.height){
            stopFalling(sprite);
        }      
    },
    normalFalling:function(sprite,fps){
        sprite.top+=sprite.velocityY/fps;
        sprite.velocityY=(GRAVITY_FORCE)*
                        (fallingAnimationTimer.getElapsedTime()/1000);
        if(sprite.top>canvas.height){
            stopFalling(sprite);
        }
    }
}