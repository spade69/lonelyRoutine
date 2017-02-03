var canvas=document.getElementById('canvas'),
    context=canvas.getContext('2d'),
    offscreenCanvas=document.createElement('canvas'),
    offscreenContext=offscreenCanvas.getContext('2d'),
    paused=true,
    discs=[
      {
        x:150,
        y:250,
        lastX:150,
        lastY:250,
        velocityX:-3.2,
        velocityY:3.5,
        radius:25,
        innerColor:'rgba(255,255,0,1)',
        middleColor:'rgba(255,255,0,0.7)',
        outerColor:'rgba(255,255,0,0.5)',
        strokeStyle:'gray',
      },
      {
        x:50,
        y:50,
        lastX:50,
        lastY:150,
        velocityX:2.2,
        velocityY:2.5,
        radius:25,
        innerColor:'rgba(100,145,0,1)',
        middleColor:'rgba(100,145,0,0.7)',
        outerColor:'rgba(100,145,0,0.5)',
        strokeStyle:'blue',
      },
      {
        x:150,
        y:75,
        lastX:150,
        lastY:75,
        velocityX:1.2,
        velocityY:1.5,
        radius:25,
        innerColor:'rgba(255,0,0,1)',
        middleColor:'rgba(255,0,0,0.7)',
        outerColor:'rgba(255,0,0,0.5)',
        strokeStyle:'orange',


      },

    ],
    numDiscs=discs.length,
    lastTime=0,
    lastFpsUpdateTime=0,
    lastFpsUpdate={time:0,value:0},
    animationButton=document.getElementById('animateButton'),
    tree=new Image(),
    nearTree=new Image(),
    grass=new Image(),
    grass2=new Image(),
    sky=new Image(),
    fps=60,
    skyOffset=0,
    grassOffset=0,
    treeOffset=0,
    nearTreeOffset=0,
    SKY_VELOCITY=8,
    TREE_VELOCITY=20,
    GRASS_VELOCITY=75,
    FAST_TREE_VELOCITY=40,
//Gesture
    animating=false,
    dragging=false,
    mousedown=null,
    mouseup=null
    ;

//Function
//
function drawBackground(){ //Ruled paper
  var STEP_Y=12,
      TOP_MARGIN=STEP_Y*4,
      LEFT_MARGIN=STEP_Y*3,
      i=context.canvas.height;
  //
  context.strokeStyle='lightgray';
  context.lineWidth=0.5;
  while(i>TOP_MARGIN){
    context.beginPath();
    context.moveTo(0,i);
    context.lineTo(context.canvas.width,i);
    context.stroke();
    i-=STEP_Y;
  }
  //Vertical line
  context.strokeStyle='rgba(100,0,0,0.3)';
  context.lineWidth=1;
  context.beginPath();
  context.moveTo(LEFT_MARGIN,0);
  context.lineTo(LEFT_MARGIN,context.canvas.height);
  context.stroke();
}


function update(){
  var disc=null;
  for(var i=0;i<numDiscs;i++){
    disc=discs[i];
    //超出X轴范围
    if(disc.x+disc.velocityX+disc.radius>context.canvas.width||
      disc.x+disc.velocityX-disc.radius<0)
      disc.velocityX=-disc.velocityX;
    //超出Y轴范围
    if(disc.y+disc.velocityY+disc.radius>context.canvas.height||
      disc.y+disc.velocityY-disc.radius<0)
      disc.velocityY=-disc.velocityY;
    //normally
    disc.x+=disc.velocityX;
    disc.y+=disc.velocityY;

  }
}

function draw(){
  var disc=discs[i];
  for(var i=0;i<numDiscs;++i){
    disc=discs[i];
    //radial shape
    gradient=context.createRadialGradient(disc.x,disc.y,0,disc.x,disc.y,disc.radius);
    gradient.addColorStop(0.3,disc.innerColor);
    gradient.addColorStop(0.5,disc.middleColor);
    gradient.addColorStop(1.0,disc.outerColor);
    context.save();
    context.beginPath();
    context.arc(disc.x,disc.y,disc.radius,0,Math.PI*2,false);
    context.fillStyle=gradient;
    context.strokeStyle=disc.strokeStyle;
    context.fill();
    context.stroke();
    context.restore();
  }

}


//calculate fps
function calculateFps(){
  var now=(+new Date),
      fps=1000/(now-lastTime);
  lastTime=now;
  return fps;
}

//drawDisc
function drawDiscBackground(disc){
  context.save();
  context.beginPath();
  context.arc(disc.lastX,disc.lastY,disc.radius+1,0,Math.PI*2,false);
  context.clip();
  eraseBackground();
  drawBackground();
  context.restore();
}


function drawDiscBackgroundOff(context,disc){
  var x=disc.lastX,
      y=disc.lastY,
      r=disc.radius,
      w=r*2,
      h=r*2;
  context.save();
  context.beginPath();
  context.arc(x,y,r+1,0,Math.PI*2,false);
  context.clip();
  eraseBackground();
  context.drawImage(offscreenCanvas,x-r,y-r,w,h,x-r,y-r,w,h);
  context.restore();

}

function eraseBackground(){
  context.clearRect(0,0,canvas.width,canvas.height);
}

//Animation
function animate(time){
  var fps=0;
  if(time==undefined){
    time=+new Date();
  }
  if(!paused){
    context.clearRect(0,0,canvas.width,canvas.height);
    drawBackground();
    update(time);
    draw();
    fps=calculateFps();
    //once per second update the frame rate
    if(now-lastFpsUpdateTime>1000){
      lastFpsUpdateTime=now;
      lastFpsUpdate=fps;
    }
//    window.requestNextAnimationFrame(animate);
    context.fillStyle='cornflowerblue';
    context.fillText=(lastFpsUpdate.toFixed()+'fps',50,58);
  }

}

function animateFps(time){
  context.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();
  update();
  draw();
  context.fillStyle='cornflowerblue';
  context.fillText(calculateFps().toFixed()+'fps',20,60);
  window.requestNextAnimationFrame(animateFps);
}

//window.requestNextAnimationFrame(animateFps);

//Framerate timebased
function updateTimeBased(time){
  var disc=null,
      elapsedTime=time-lastTime,deltaX,deltaY;
  for(var i=0;i<discs.length;i++){
    disc=discs[i];
    deltaX=disc.velocityX*(elapsedTime/1000);
    deltaY=disc.velocityY*(elapsedTime/1000);
    if(disc.x+deltaX+disc.radius>context.canvas.width||
        disc.x+deltaX-disc.radius<0){
          disc.velocityX=-disc.velocityX;
          deltaX=-deltaX;
        }
    if(disc.y+deltaY+disc.radius>context.canvas.height||
        disc.y+deltaY-disc.radius<0)
      disc.velocityY=-disc.velocityY;
      deltaY=-deltaY;
  }
  disc.x=disc.x+deltaX;
  disc.y=disc.y+deltaY;
}
//roll
function drawRoll(){
  context.save();
  skyOffset=skyOffset<canvas.width?skyOffset+SKY_VELOCITY/fps:0;
  context.save();
  context.translate(-skyOffset,0);
  context.drawImage(sky,0,0);
  context.drawImage(sky,sky.width-2,0);
  context.restore();
}

//draw multiple layer  rolling multiple layer.
function drawMultipleLayer(){
  context.save();
  skyOffset=skyOffset<canvas.width?skyOffset+SKY_VELOCITY/fps:0;
  grassOffset=grassOffset<canvas.width?grassOffset+GRASS_VELOCITY/fps:0;
  treeOffset=treeOffset<canvas.width?treeOffset+TREE_VELOCITY/fps:0;
  nearTreeOffset=nearTreeOffset<canvas.width?nearTreeOffset+FAST_TREE_VELOCITY/fps:0;

  context.save();
  context.translate(-skyOffset,0);
  context.drawImage(sky,0,0);
  context.drawImage(sky,sky.width-2,0);
  context.restore();

  context.save();
  context.translate(-treeOffset,0);
  context.drawImage(tree,100,240);
  context.drawImage(tree,1100,240);
  context.drawImage(tree,400,240);
  context.drawImage(tree,1400,240);
  context.drawImage(tree,700,240);
  context.drawImage(tree,1700,240);
  context.restore();

  context.save();
  context.translate(-nearTreeOffset,0);
  context.drawImage(nearTree,250,220);
  context.drawImage(nearTree,1250,220);
  context.drawImage(nearTree,800,220);
  context.drawImage(nearTree,1800,220);
  context.restore();

  context.save();
  context.translate(-grassOffset,0);
  context.drawImage(grass,0,canvas.height-grass.height);
  context.drawImage(grass,grass.width-5,canvas.height-grass.height);
  context.drawImage(grass2,0,canvas.height-grass2.height);
  context.drawImage(grass2,grass2.width,canvas.height-grass2.height);
  context.restore();
}

function animateLayer(now){
  if(now===undefined){
    now=+new Date;

  }
  fps=calculateFps(now);
  if(!paused){
    eraseBackground();
    drawMultipleLayer();

  }
  requestNextAnimationFrame(animateLayer);//passing callback (itself)
}

//Gesture
function didThrow(){
  var elapsedTime=mouseup.time-mousedown.time;
  var elapsedMotion=Math.abs(mouseup.x-mousedown.x)+
                    Math.abs(mouseup.y-mousedown.y);
  return (elapsedMotion/elapsedTime*10)>3;
}

//Event handler
animateButton.onclick=function(e){
  paused=paused?false:true;
  if(paused){
    animateButton.value='Animate';
  }else{
    window.requestNextAnimationFrame(animate);
    animateButton.value='Pause';
  }
};

canvas.onmousedown=function(e){
  var mouse=windowToCanvas(e.clientX,e.clientY);
  mousedown={x:mouse.x,y:mouse.y,time:(new Date).getTime()};
  e.preventDefault();
  if(animating){//stop current animation
    animating=false;
    clearInterval(animationLoop);
    eraseMagnifyGlass();
  }else{
    dragging=true; //start dragging
    context.save();
  }
};

canvas.onmousemove=function(e){
  if(dragging){
    eraseMagnifyGlass();
    drawMagnifyingGlass(windowToCanvas());
  }
}

canvas.onmouseup=function(e){

}

context.font='48px Helvetica';
/*
tree.src='smalltree.png';
nearTree.src='tree.png';
grass.src='grass.png';
grass2.src='grass2.png';
sky.src='sky.png';
sky.onload=function(e){
  drawMultipleLayer();
};

requestNextAnimationFrame(animateLayer);
*/

