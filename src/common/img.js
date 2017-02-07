import * as gv from './global.js';
let canvas=gv.canvas,
    context=gv.context,
    offscreenCanvas=gv.offscreenCanvas,
    offscreenContext=gv.offscreenContext,
   image=new Image(),
/*    scaleOutput=document.getElementById('scaleOutput'),
    scaleSlider=document.getElementById('scaleSlider'),
    scale=scaleSlider.value,
    scale=1.0, //initialize*/
//getimage data
    imageData=context.getImageData(0,0,canvas.width,canvas.height),
    imagedataOffscreen,
    interval=null,
    index=0,
    magnifyRectangle={},
    value;

const MINIMUM_SCALE=1.0,
    MAXIMUM_SCALE=3.0,
    LENS_RADIUS=canvas.width/5,
    magnifyingGlassX = 512,
    magnifyingGlassY = 340,
    magnifyingGlassRadius=120,
    magnificationScale=1.2;
//Function
function drawScaled(scale){
  var w=canvas.width,
      h=canvas.height,
      sw=w*scale,
      sh=h*scale;
  //Clear the canvas, and draw the image scaled to canvas size
  //Draw the watermark on top of the image
  context.clearRect(0,0,canvas.width,canvas.height);
  context.drawImage(image,0,0,canvas.width,canvas.height);
  //Draw the watermark
  drawWatermark();
  //Finally
  context.drawImage(canvas,0,0,canvas.width,canvas.height,
                  -sw/2+w/2,-sh/2+h/2,sw,sh);

}


function drawScaledX(scale){
  var w=canvas.width,
      h=canvas.height,
      sw=w*scale,
      sh=h*scale;
  context.drawImage(offscreenCanvas,0,0,offscreenCanvas.width,
                    offscreenCanvas.height,-sw/2+w/2,-sh/2+h/2,sw,sh) ;
}

function drawWatermark(){
  var lineOne='Copyright',
      lineTwo='Acme Inc.',
      textMetrics,
      FONT_HEIGHT=128;
  context.save();
  context.fillStyle='rgba(100,140,230,0.5)';
  context.strokeStyle='yellow';
  context.shadowColor='rgba(50,50,50,1.0)';
  context.shadowOffsetX=5;
  context.shadowOffsetY=5;
  context.shadowBlur=10;

  context.font=FONT_HEIGHT+'px Arial';
  textMetrics=context.measureText(lineOne);//measure the text width
  context.globalAlpha=0.6;
  context.translate(canvas.width/2,canvas.height/2-FONT_HEIGHT/2);
  context.fillText(lineOne,-textMetrics.width/2,0);
  context.strokeText(lineOne,-textMetrics.width/2,0);

  textMetrics=context.measureText(lineTwo);
  context.fillText(lineTwo,-textMetrics.width/2,FONT_HEIGHT);
  context.strokeText(lineTwo,-textMetrics.width/2,FONT_HEIGHT);
  context.restore();
}

//filter
function drawInBlackAndWhite(){
  var data=undefined,i=0;
  imageData=context.getImageData(0,0,canvas.width,canvas.height);
  data=imageData.data;
  for(i=0;i<data.length-4;i+=4){
    let average=(data[i]+data[i+1]+data[i+2])/3;
    data[i]=average;
    data[i+1]=average;
    data[i+2]=average;
  }
  context.putImageData(imageData,0,0);
}

function drawOriginalImage(image) {
  context.drawImage(image,0,0,image.width,image.height,
                    0,0,canvas.width,canvas.height);
}

function drawLenses(leftLensLocation,rightLensLocation){
  context.save();
  context.beginPath();
  context.arc(leftLensLocation.x,leftLensLocation.y,LENS_RADIUS,
              0,Math.PI*2,false);
  context.stroke();
  moveTo(rightLensLocation.x,rightLensLocation.y);
  context.arc(rightLensLocation.x,rightLensLocation.y,LENS_RADIUS,
              0,Math.PI*2,false);
  context.stroke();
  context.clip();
  context.drawImage(offscreenCanvas,0,0,canvas.width,canvas.height);
  context.restore();

}


function drawWire(center){
  context.beginPath();
  context.moveTo(center.x-LENS_RADIUS/4,center.y-LENS_RADIUS/2);
  context.quadraticCurveTo(center.x,center.y-LENS_RADIUS+20,
                          center.x+LENS_RADIUS/4,center.y-LENS_RADIUS/2);
  context.stroke();
}


function drawConnectors(center){
  context.beginPath();
  context.fillStyle="silver";
  context.strokeStyle='rgba(0,0,0,0.4)';
  context.lineWidth=2;
  context.arc(center.x-LENS_RADIUS/4,center.y-LENS_RADIUS/2,
              4,0,Math.PI*2,false);
  context.fill();
  context.stroke();
  context.beginPath();
  context.arc(center.x+LENS_RADIUS/4,center.y-LENS_RADIUS/2,4,0,Math.PI*2,false);
  context.fill();
  context.stroke();
}


//animate
function increaseTransparency(steps){
  var alpha,currentAplpha,step,length=imageData.data.length;
  for(var i=3;i<length;i+=4){//For every alpha component
    alpha=imagedataOffscreen.data[i];
    if(alpha>0){
      currentAplpha=imageData.data[i];
      step=Math.ceil(alpha/steps);
      if(currentAplpha+step<=alpha){//Not at original alpha yet
        imageData.data[i]+=step; //Increase transparency
      }else{
        imageData.data[i]=alpha; //
      }
    }
  }
}

function fadeIn(context,imagedata,steps,millisecondsPerStep){
  var frame=0;
  for(var i=3;i<imagedata.data.length;i+=4){//For every alpha
    imagedata.data[i]=0;
  }
  interval=setInterval(function(){ //Every milliseconds Per step
    frame++;
    if(frame>steps){
      clearInterval(interval);
    }else{
      increaseTransparency(imagedata,steps);
      context.putImageData(imagedata,0,0);
    }
  },millisecondsPerStep);
}

function fadeOut(context,imagedata,x,y,steps,millisecondsPerStep){
  var frame=0,length=imagedata.data.length;
  interval=setInterval(function(){//once every millisecond per step
    frame++;
    if(frame>steps){//Animation is over
      clearInterval(interval); //end animation
      animationComplete(); //put picture back in 1s
    }else{
      increaseTransparency(imagedata,steps);
      context.putImageData(imagedata,x,y);
    }
  },millisecondsPerStep);
}

//magnifier
function drawMagnifyingGlass(mouse){
  var scaledMagnifyRectangle=null;
  magnifyingGlassX=mouse.x;
  magnifyingGlassY=mouse.y;
  calculateMagnifyRectangle(mouse);
  imageData=context.getImageData(magnifyRectangle.x,magnifyRectangle.y,
                                magnifyRectangle.width,magnifyRectangle.height);
  context.save();
  scaledMagnifyRectangle={
    width:magnifyRectangle.width * magnificationScale,
    height:magnifyRectangle.height * magnificationScale
  };
  setClip();
  context.drawImage(canvas,magnifyRectangle.x,magnifyRectangle.y,
                    magnifyRectangle.width,magnifyRectangle.height,
                    magnifyRectangle.x+magnifyRectangle.width/2-scaledMagnifyRectangle.width/2,
                    magnifyRectangle.y+magnifyRectangle.height/2-scaledMagnifyRectangle.height/2,
                    scaledMagnifyRectangle.width,scaledMagnifyRectangle.height);
  context.restore();
  drawMagnifyingGlassCircle(mouse);
}

function setClip(){
  context.beginPath();
  context.arc(magnifyingGlassX,magnifyingGlassY,magnifyingGlassRadius,0,Math.PI*2,false);
  context.clip();
}

function drawMagnifyingGlassCircle(mouse) {
   context.save();
   context.lineWidth = 3;
   context.strokeStyle = 'rgba(0, 0, 255, 0.3)';

   context.shadowColor = 'rgba(0, 0, 155, 1)';
   context.shadowOffsetX = '-10';
   context.shadowOffsetY = '-10';
   context.shadowBlur = '20';

   context.beginPath();
   context.arc(mouse.x, mouse.y,
               magnifyingGlassRadius, 0, Math.PI*2, false);
   context.clip();
   context.shadowColor = 'cornflowerblue';
   context.strokeStyle = 'skyblue';
   context.stroke();

   context.beginPath();
   context.lineWidth = 1;
   context.strokeStyle = 'rgba(100, 149, 240, 0.7)';
   context.arc(mouse.x, mouse.y,
               magnifyingGlassRadius-1, 0, Math.PI*2, false);
   context.stroke();

   context.beginPath();
   context.strokeStyle = 'rgba(100, 149, 240, 0.5)';
   context.lineWidth = 2;
   context.arc(mouse.x, mouse.y,
               magnifyingGlassRadius-1, 0, Math.PI*2, false);
   context.stroke();

   context.beginPath();
   context.strokeStyle = 'rgba(255, 255, 0, 0.3)';
   context.lineWidth = 1;
   context.arc(mouse.x, mouse.y,
               magnifyingGlassRadius-3, 0, Math.PI*2, false);
   context.stroke();

   context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
   context.shadowColor = 'rgba(0, 0, 0, 0.8)';
   context.shadowOffsetX = '10';
   context.shadowOffsetY = '10';
   context.shadowBlur = '20';
   context.lineWidth = 4;
   context.stroke();

   context.lineWidth = 2;
   context.strokeStyle = 'silver';
   context.shadowColor = 'goldenrod';
   context.stroke();

   context.restore();
}

function calculateMagnifyRectangle(mouse) { 
   var top,
       left,
       bottom,
       right;
   
   magnifyRectangle.x = mouse.x - magnifyingGlassRadius;
   magnifyRectangle.y = mouse.y - magnifyingGlassRadius;
   magnifyRectangle.width = magnifyingGlassRadius*2 + 2*context.lineWidth;
   magnifyRectangle.height = magnifyingGlassRadius*2 + 2*context.lineWidth;

   top = magnifyRectangle.y;
   left = magnifyRectangle.x;
   bottom = magnifyRectangle.y + magnifyRectangle.height;
   right = magnifyRectangle.x + magnifyRectangle.width;
   
   if (left < 0) {
      magnifyRectangle.width += left;
      magnifyRectangle.x = 0;
   }
   else if (right > canvas.width) {
      magnifyRectangle.width -= right - canvas.width;
   }

   if (top < 0) {
      magnifyRectangle.height += magnifyRectangle.y;
      magnifyRectangle.y = 0;
   }
   else if (bottom > canvas.height) {
      magnifyRectangle.height -= bottom - canvas.height;
   }
}


function drawDemo(url){
    context.fillStyle='cornflowerblue';
    imagedataOffscreen=offscreenContext.getImageData(0,0,canvas.width,canvas.height);
    let glassSize=10;
    let scale=1.0;
    let center = {
         x: canvas.width/2,
         y: canvas.height/2
       },
       leftLensLocation = {
         x: center.x - LENS_RADIUS - 10,
         y: center.y
       },
       rightLensLocation = {
         x: center.x + LENS_RADIUS + 10,
         y: center.y
       }
    offscreenCanvas.width=canvas.width;
    offscreenCanvas.height=canvas.height;
    image.src=url;
    image.onload=function(e){
      context.drawImage(image,0,0,canvas.width,canvas.height);
      offscreenContext.drawImage(image,0,0,canvas.width,canvas.height);
      /*drawWatermark(context);
      drawWatermark(offscreenContext);
      drawOriginalImage(image);
      drawScaled(0.5);*/
      drawInBlackAndWhite();
      drawLenses(leftLensLocation,rightLensLocation);
      drawWire(center);
      drawConnectors(center);
      //increaseTransparency(23);
      
      //fadeIn(context,imagedataOffscreen,50,1000/60);
      fadeOut(context,imagedataOffscreen,50,1000/60);
    }
}

export {
    drawScaled,
    drawScaledX,
    drawWatermark,
    drawInBlackAndWhite,
    drawOriginalImage, //equals to drawInColor
    drawLenses,
    drawWire,
    drawConnectors,
    increaseTransparency,
    fadeIn,
    fadeOut,
    drawMagnifyingGlass,
    setClip,
    drawMagnifyingGlassCircle,
    calculateMagnifyRectangle,
    drawDemo
}

/*
sunglassButton.onclick=function(){
  if(sunglassesOn){
    sunglassButton.value='Sunglass';
    drawOriginalImage();
    sunglassesOn=false;
  }else{
    sunglassButton.value='Orignal picture';
    putSunglassesOn(); sunglassOn=true;
  }
};

//Event handler of scale slider
scaleSlider.onchange=function(e){
  scale=e.target.value;
  if(scale<MINIMUM_SCALE) scale=MINIMUM_SCALE;
  else if(scale>MAXIMUM_SCALE) scale=MAXIMUM_SCALE;
  drawScaled();
  drawScaleText();
}


*/











