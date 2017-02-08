/**
 * Collision detection
 * 
 * Date 2017/2/8
 * Author Jason
 */

//priori collision detection
let ballWithHitLedge=function(ledge){
    let spriteRight=sprite.left+sprite.width,
        ledgeRight=ledge.left+ledge.width,
        spriteBottom=sprite.top+sprite.height,
        nextSpriteBottomEstimate=spriteBottom+sprite.velocityY/fps;
    return spriteRight>ledge.left&&
            sprite.left <ledgeRight &&
            spriteBottom<ledge.top &&
            nextSpriteBottomEstimate>ledge.top;        
},
//posteriori collision detection
//
isBallInBucket=function(bucketCenter){
    let ballCenter={x:ball.left+BALL_RADIUS,
                        y:ball.top+BALL_RADIUS},
    distance=Math.sqrt(Math.pow(bucketCenter.x-ballCenter.y,2)+
                                Math.pow(bucketCenter.y-ballCenter.y,2));
    return distance<BALL_RADIUS+bucketHitRaduis;
},

handleEdgeCollisions=function(){
    l
}




