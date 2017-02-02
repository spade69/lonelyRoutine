var canvas=document.getElementById('canvas'),
    context=canvas.getContext('2d'),
    image=new Image(),
    scaleOutput=document.getElementById('scaleOutput'),
    scaleSlider=document.getElementById('scaleSlider'),
    scale=scaleSlider.value,
    scale=1.0, //initialize
    MINIMUM_SCALE=1.0,
    MAXIMUM_SCALE=3.0,
    sunglassButton=document.getElementById('sunglassButton')  ,
    sunglassesOn=false,
    sunglassFilter=new Worker('sunglassFilter.js'),
    LENS_RADIUS=canvas.width/5,

    offscreenCanvas=document.createElement('canvas'),
    offscreenContext=offscreenCanvas.getContext('2d'),
//getimage data
    imageData=context.getImageData(0,0,canvas.width,canvas.height),
    data=imageData.data,
    imagedataOffscreen,
    interval=null,
    length=imageData.data.length,
    width=imageData.width,
    index=0,
    value;

//Function
function drawScaled(){
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


function drawScaledX(){
  var w=canvas.width,
      h=canvas.height,
      sw=w*scale,
      sh=h*scale;
  context.drawImage(offscreenCanvas,0,0,offscreenCanvas.width,
                    offscreenCanvas.height,-sw/2+w/2,-sh/2+h/2,sw,sh) ;
}

function drawScaleText(value){
  var text=parseFloat(value).toFixed(2);
  var percent=parseFloat(value-MINIMUM_SCALE)/
              parseFloat(MAXIMUM_SCALE-MINIMUM_SCALE);
  scaleOutput.innerText=text;
  percent=percent<0.35?0.35:percent;
  scaleOutput.style.fontSize=percent*MAXIMUM_SCALE/1.5+'em';
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
    context.putImageData(event.data,0,0);
  context.translate(canvas.width/2,canvas.height/2-FONT_HEIGHT/2);
  context.fillText(lineOne,-textMetrics.width/2,0);
  context.strokeText(lineOne,-textMetrics.width/2,0);

  textMetrics=context.measureText(lineTwo);
  context.fillText(lineTwo,-textMetrics.width/2,FONT_HEIGHT);
  context.strokeText(lineTwo,-textMetrics.width/2,FONT_HEIGHT);
  context.restore();
}

function iteration(){
  //iterate every pixel
  for(var index=0;index<length;index++){
    value=data[index];
  }

  //reverse iteration
  for(index=length-1;index>=0;index--){
    value=data[index];
  }
  //only prcess alpha ,not modifiying RGB
  for(index=3;index<=length-4;index+=4){
    //data[index]=...;//
  }

}

//filter
function drawInBlackAndWhite(){
  var data=undefined,i=0;
  imageData=context.getImageData(0,0,canvas.width,canvas.height);
  data=imageData.data;
  for(i=0;i<data.length-4;i+=4){
    average=(data[i]+data[i+1]+data[i+2])/3;
    data[i]=average;
    data[i+1]=average;
    data[i+2]=average;
  }
  context.putImageData(imageData,0,0);
}

function drawInColor(){
  context.drawImage(image,0,0,image.width,image.height,0,0,
                    context.canvas.width,context.canvas.height);
}

function emboss(){
  var imagedata,data,length,width;
  imagedata=context.getImageData(0,0,canvas.width,canvas.height);
  data=imagedata.data;
  width=imagedata.width;
  length=data.length;
  for(i=0;i<length;i++){
    if((i+1)%4!==0){

    }
  }
}

function drawOriginalImage() {
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

//sunglass filter main js
function putSunglassesOn(){
  var imagedata,
    center={x:canvas.width/2,y:canvas.height/2},
    leftLensLocation={x:center.x-LENS_RADIUS-10,y:center.y},
    rightLensLocation={x:center.x+LENS_RADIUS+10,y:center.y};
  sunglassFilter.postMessage(
                context.getImageData(0,0,canvas.width,canvas.height));
//message event
  sunglassFilter.onmessage=function(event){
    offscreenContext.putImageData(event.data,0,0);
    drawLenses(leftLensLocation,rightLensLocation);
    drawWire(center);
    drawConnectors(center);
  };
}

//animate
function increaseTransparency(imagedata,steps){
  var alpha,currentAplpha,step,length=imagedata.data.length;
  for(var i=3;i<length;i+=4){//For every alpha component
    alpha=imagedataOffscreen.data[i];
    if(alpha>0){
      currentAplpha=imagedata.data[i];
      step=Math.ceil(alpha/steps);
      if(currentAplpha+step<=alpha){//Not at original alpha yet
        imagedata.data[i]+=step; //Increase transparency
      }else{
        imagedata.data[i]=alpha; //
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

//animation
function animationComplete(){
  setTimeout(function(){
    context.clearRect(0,0,canvas.width,canvas.height);
  },1000);
}

//magnifier
function drawMagnifyingGlass(mouse){
  var scaledMagnifyRectangle=null;
  manifyingGlassX=mouse.x;
  manifyingGlassY=mouse.y;
  calculateMagnifyRectangle(mouse);
  imageData=context.getImageData(magnifyRectangle.x,magnifyRectangle.y
                                magnifyRectangle.width,magnifyRectangle.height);
  context.save();
  scaledMagnifyRectangle=={
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
  context.arc(manifyingGlassX,manifyingGlassY,manifyingGlassRadius,0,Math.PI*2,false);
  context.clip();
}

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

context.fillStyle='cornflowerblue';

var glassSize=10;
var scale=1.0;

offscreenCanvas.width=canvas.width;
offscreenCanvas.height=canvas.height;
image.src="lovely.jpg";
image.onload=function(e){
  context.drawImage(image,0,0,canvas.width,canvas.height);
  offscreenContext.drawImage(image,0,0,canvas.width,canvas.height);
  drawWatermark(context);
  drawWatermark(offscreenContext);
  drawScaleText(scaleSlider.value);
  drawOriginalImage();
}














