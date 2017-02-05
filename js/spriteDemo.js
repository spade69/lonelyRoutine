var canvas=document.getElementById('canvas'),
    context=canvas.getContext('2d'),
    animateButton=document.getElementById('animateButton'),
    //Spritesheet
    spritesheet=new Image(),
    runnerCells=[
        {left:0,top:0,width:47,height:64},
        {left:55,top:0,width:44,height:64},
        {left:107,top:0,width:39,height:64},
        {left:150,top:0,width:46,height:64},
        {left:208,top:0,width:49,height:64},
        {left:265,top:0,width:46,height:64},
        {left:320,top:0,width:42,height:64},
        {left:380,top:0,width:35,height:64},
        {left:425,top:0,width:46,height:64},
    ],
    interval,
    lastAdvance=0,
    paused=false,
    PAGEFLIP_INTERVAL=100,
    //CLOCK
    CLOCK_RADIUS=canvas.width/2-15,
    HOUR_HAND_TRUNCATION=35,
    RADIUS=75,
    //Bomb imagePainter
    bomb=new Sprite('bomb',bombPainter),
    BOMB_LEFT=200,
    BOMB_TOP=80,
    BOMB_WIDTH=180,
    BOMB_HEIGHT=130,

    NUM_EXPLOSION_PAINTERS=9,
    NUM_FUSE_PAINTERS=9,
    bombPainter=new ImagePainter('img/bomb.png'),
    bombNoFusePainter=new ImagePainter('imgsX/bomb-no-fuse.png'),
    fuseBurningPainters=[],
    explosionPainters=[],

    //Animator
    fuseBurningAnimator=new SpriteAnimator(fuseBurningPainters,
        function(){
            bomb.painter=bombNoFusePainter;
        }),
    explosionAnimator=new SpriteAnimator(explosionPainters,
        function(){
            bomb.painter=bombNoFusePainter;
        });

/*    ball=new Sprite('ball',{paint:function(sprite,context){
        context.beginPath();
        context.arc(sprite.left+sprite.width/2,sprite.top+sprite.height/2,
                        RADIUS,0,Math.PI*2,false);
        context.clip();
        context.shadowColor='rgb(0,0,0)';
        context.shadowOffsetX=-4;
        context.shadowOffsetY=-4;
        context.shadowBlur=8;
        context.lineWidth=2;
        context.strokeStyle='rgb(100,100,195)';
        context.fillStyle='rgba(30,144,255,0,0.15)';
        context.fill();
        context.stroke();
    }
});*/

//behaviors
var runInPlace={
    lastAdvance:0,
    PAGEFLIP_INTERVAL:100,
    execute:function(sprite,context,time){
        if(time-this.lastAdvance>this.PAGEFLIP_INTERVAL){
            sprite.painter.advance();
            this.lastAdvance=time;
        }
    }
},
moveLeftToRight={
    lastMove:0,
    execute:function(sprite,context,time){
        if(this.lastMove!==0){ //以速度X逐渐减少left
            sprite.left-=sprite.velocityX*((time-this.lastMove)/1000);
            if(sprite.left<0){
                sprite.left=canvas.width;//reset to canvas.width
            }
        }
        this.lastMove=time;
    }

},
sprite=new Sprite('runner',new SpriteSheetPainter(runnerCells),
        [runInPlace,moveLeftToRight]);

//Painter
var ballPainter={
    paint:function(sprite,context){
        var x=sprite.left+sprite.width/2,
            y=sprite.top+sprite.height/2,
            width=sprite.width,
            height=sprite.height,
            radius=sprite.width/2;

        context.save();
        context.beginPath();
        context.arc(x,y,radius,0,Math.PI*2,false);
        context.clip();
        context.shadowColor='rgb(0,0,0)';
        context.shadowOffsetX=-4;
        context.shadowOffsetY=-4;
        context.shadowBlur=8;

        context.fillStyle='rgba(218,165,32,0.1)';
        context.fill();
        context.lineWidth=2;
        context.strokeStyle='rgb(100,100,195)';
        context.stroke();
        context.restore();
    }
};

var ball=new Sprite('ball',ballPainter);


function drawGrid(color,stepx,stepy){
  //listing omitted for brevity .
  //for a complete listing.
  context.strokeStyle=color;
  context.lineWidth=0.5;

  for(var i=stepx+0.5;i<context.canvas.width;i+=stepx){
    context.beginPath();
    context.moveTo(i,0);
    context.lineTo(i,context.canvas.height); //canvas.height ! vertical line
    context.stroke();
  }

  for(var i=stepy+0.5;i<context.canvas.height;i+=stepy){
    context.beginPath();
    context.moveTo(0,i);
    context.lineTo(context.canvas.width,i);
    context.stroke();
  }

}

function drawHand(loc,isHour){
    var angle=(Math.PI*2)*(loc/60)-Math.PI/2,
        handRadius=isHour?CLOCK_RADIUS-HOUR_HAND_TRUNCATION
                                :CLOCK_RADIUS,
        lineEnd={x:canvas.width/2+Math.cos(angle)*(handRadius-ball.width/2),
                    y:canvas.height/2+Math.sin(angle)*(handRadius-ball.width/2)
                    };
    context.beginPath();
    context.moveTo(canvas.width/2,canvas.height/2)                 ;
    context.lineTo(lineEnd.x,lineEnd.y);
    context.stroke();
    ball.left=canvas.width/2+Math.cos(angle)*handRadius-ball.width/2;
    ball.top=canvas.height/2+Math.sin(angle)*handRadius-ball.width/2;
    ball.paint(context);
}

function drawHands(){
    var date=new Date(),
        hour=date.getHours(); //Date object 's method
    ball.width=20;
    ball.height=20;
    drawHand(date.getSeconds(),false); //second's sprite

    hour=hour>12?hour-12:hour;
    ball.width=35;
    ball.height=35;
    drawHand(date.getMinutes(),false);

    ball.width=50;
    ball.height=50;
    drawHand(hour*5+(date.getMinutes()/60)*5); //hour

    ball.width=10;
    ball.height=10;
    ball.left=canvas.width/2-ball.width/2;
    ball.top=canvas.height/2-ball.height/2;
    ballPainter.paint(ball,context);
}

function drawClockFace(){
    context.beginPath();
    context.arc(canvas.width/2,canvas.height/2,CLOCK_RADIUS
                    ,0,Math.PI*2,false);
    context.save();
    context.strokeStyle='rgba(0,0,0,0.2)';
    context.stroke();
    context.restore();
}

function drawClock(){
    drawClockFace();
    drawHands();
}




//SpriteSheet
function drawBackground(){
    var STEP_Y=12,
        i=context.canvas.height;
    while(i>STEP_Y*4){ //
        context.beginPath();
        context.moveTo(0,i);
        context.lineTo(context.canvas.width,i);
        i-=STEP_Y;
    }
}

function pauseAnimation(){
    animateButton.value='Animate';
    paused=true;
}

function startAnimation(){
    animateButton.value='Pause';
    paused=false;
    lastAdvance= +new Date();
    window.requestNextAnimationFrame(animateSheet)
}

//Normall animate
function animate(){
    context.clearRect(0,0,canvas.width,canvas.height);
    drawGrid('lightgray',10,10);
    drawClock();
    window.requestNextAnimationFrame(animate);
}

//绘制背景以及页面上面的精灵表，再绘制精灵
//animateSheet方法判断当前这一帧的持续时间是否已经超过了
//PAGEFLIP_INTERVAL 毫秒，如果是的话就切换到下一帧。
//最后程序向window对象请求在浏览器绘制下一帧的时候再次
//调用animateSheet()
function animateSheet(time){
    if(!paused){
        context.clearRect(0,0,canvas.width,canvas.height);
        drawBackground();
        context.drawImage(spritesheet,0,0);
        sprite.paint(context);
        if(time-lastAdvance>PAGEFLIP_INTERVAL){
            sprite.painter.advance();//sprite. painter
            lastAdvance=time;
        }
        window.requestNextAnimationFrame(animateSheet);//loop
    }
}

function animateX(time){
    context.clearRect(0,0,canvas.width,canvas.height);
    drawBackground();
    context.drawImage(spritesheet,0,0);
    sprite.update(context,time);
    sprite.paint(context);
    window.requestNextAnimationFrame(animateX);
}

//Bomb animate
function animateBomb(now){
    context.clearRect(0,0,canvas.width,canvas.height);
    bomb.paint(context);
    window.requestNextAnimationFrame(animateBomb);
}

//Bomb function
function resetBombNoFuse(){
    bomb.painter=bombNoFusePainter;
}


//Event handler
animateButton.onclick=function(e){
    if(animateButton.value==='Animate') 
        startAnimation();
    else
        pauseAnimation();
}

animateButton.onclick=function(e){
    if(bomb.animating) //not now..
        return;
    //Burn fuse for 2seconds
    fuseBurningAnimator.start(bomb,2000);
    //Wait for 3 s ,then explode for 1 second
    setTimeout(function(){
        explosionAnimator.start(bomb,1000);
        //wait for 2s then reset to the original bomb image
        setTimeout(function(){
            bomb.painter=bombPainter;
        },2000);
    },3000);
};

//intialization
context.lineWidth=0.5;
context.strokeStyle='rgba(0,0,0,0.2)';
context.shadowColor='rgba(0,0,0,0.5)';
context.shadowOffsetX=2;
context.shadowOffsetY=2;
context.shadowBlur=4;
context.stroke();

//Bomb
bomb.left=BOMB_LEFT;
bomb.top= BOMB_TOP;
bomb.width=BOMB_WIDTH;
bomb.height=BOMB_HEIGHT;

for(var i=0;i<NUM_FUSE_PAINTERS;++i){
    fuseBurningPainters.push(new ImagePainter('imgsX/fuse-0'+i+'.png'));
}

for(var i=0;i<NUM_EXPLOSION_PAINTERS;++i){
    explosionPainters.push(new ImagePainter('imgsX/explosion-0'+i+'.png'));
}

//window.requestNextAnimationFrame(animate);
//
window.requestNextAnimationFrame(animateBomb);
//drawGrid('lightgray',10,10);

//spritesheet initialization
spritesheet.src='img/running-sprite-sheet.png';
spritesheet.onload=function(e){
    context.drawImage(spritesheet,0,0);
};
sprite.velocityX=50;
sprite.left=200;
sprite.top=100;
context.strokeStyle='lightgray';
context.lineWidth=0.5;
//drawBackground();
window.requestNextAnimationFrame(animateX);