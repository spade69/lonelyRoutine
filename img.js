var canvas=document.getElementById('canvas'),
    context=canvas.getContext('2d'),
    image=new Image(),
    scaleOutput=document.getElementById('scaleOutput'),
    scaleSlider=document.getElementById('scaleSlider'),
    scale=scaleSlider.value,
    scale=1.0, //initialize
    MINIMUM_SCALE=1.0,
    MAXIMUM_SCALE=3.0,

    offscreenCanvas=document.createElement('canvas'),
    offscreenContext=offscreenCanvas.getContext('2d'),

    imageData,
  //create Image data , Imagedata obj! it can be modified!
    imageDataCopy=context.createImageData(canvas.width,canvas.height);

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
  context.translate(canvas.width/2,canvas.height/2-FONT_HEIGHT/2);
  context.fillText(lineOne,-textMetrics.width/2,0);
  context.strokeText(lineOne,-textMetrics.width/2,0);

  textMetrics=context.measureText(lineTwo);
  context.fillText(lineTwo,-textMetrics.width/2,FONT_HEIGHT);
  context.strokeText(lineTwo,-textMetrics.width/2,FONT_HEIGHT);
  context.restore();
}

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
}














