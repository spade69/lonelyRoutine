var canvas=document.getElementById('canvas'),
    context=canvas.getContext('2d'),
    eraseAllButton=document.getElementById('eraseAllButton'),
    image=new Image(),
    imageData,
    imageDataCopy=context.createImageData(canvas.width,canvas.height),
    mousedown={},
    rubberbandRectangle={},
    dragging=false;



function copyCanvasPixels(){
  var i=0;
  //copy red,green ,and blue components of the first pixel
  for(i=0;i<3;i++){
    imageDataCopy.data[i]=imageData.data[i];//first 4 pixel?
  }
  //Starting with the alpha component of the first pixel,
  //copy imageData, and make the copy more transparent
  for(i=3;i<imageData.data.length-4;i+=4){
    imageDataCopy.data[i]=imageData.data[i]/2; //Alpha
    imageDataCopy.data[i+1]=imageData.data[i+1]; //Red
    imageDataCopy.data[i+2]=imageData.data[i+2];//Green
    imageDataCopy.data[i+3]=imageData.data[i+3];//blue

  }
}

function captureRubberbandPixels(){
  imageData=context.getImageData(rubberbandRectangle.left,
            rubberbandRectangle.top,rubberbandRectangle.width,rubberbandRectangle.height);

}

function restoreRubberbandPixels(){
  var deviceWidthOverCSSPixels=imageData.width/canvas.width,
      deviceHeightOverCSSPixels=imageData.height/canvas.height;
  //Restore the canvas to what it looked like when the mouse went dwn
  context.putImageData(imageData,0,0);
  //Put the more transparent image data into the rubberband rectangle
  context.putImageData(imageDataCopy,0,0,
                      rubberbandRectangle.left+context.lineWidth,
                      rubberbandRectangle.top+context.lineWidth,
                      (rubberbandRectangle.width-2*context.lineWidth)*deviceWidthOverCSSPixels,
                      (rubberbandRectangle.height-2*context.lineWidth)*deviceHeightOverCSSPixels);
}


function captureEntireCanvas(){
  //capture entire canvas
  imageData=context.getImageData(0,0,canvas.width,canvas.height);
}

//
function captureCanvasPixels(){
  imageData=context.getImageData(0,0,canvas.width,canvas.height);
  copyCanvasPixels();
}


function restoreRubberbandPixelsDirty(){
  var deviceWidthOverCSSPixels=imageData.width/canvas.width,
      deviceHeightOverCSSPixels=imageData.height/canvas.height;
  context.putImageData(imageData,0,0,rubberbandRectangle.left,
                      rubberbandRectangle.top,
                      rubberbandRectangle.width*deviceWidthOverCSSPixels,
                      rubberbandRectangle.height*deviceHeightOverCSSPixels);
}

function setRubberbandRectangle(x,y){
  rubberbandRectangle.left=Math.min(x,mousedown.x);
  rubberbandRectangle.top=Math.min(y,mousedown.y);
  rubberbandRectangle.width=Math.abs(x-mousedown.x);
  rubberbandRectangle.height=Math.abs(y-mousedown.y);
}

function drawRubberband(){
  context.strokeRect(rubberbandRectangle.left+context.lineWidth,
                    rubberbandRectangle.top+context.lineWidth,
                    rubberbandRectangle.width-2*context.lineWidth,
                    rubberbandRectangle.height-2*context.lineWidth);
}

function setRubberbandRectangle(x,y){
  rubberbandRectangle.left=Math.min(x,mousedown.x);
  rubberbandRectangle.top=Math.min(y,mousedown.y);
  rubberbandRectangle.width=Math.abs(x-mousedown.x);
  rubberbandRectangle.height=Math.abs(y-mousedown.y);

}

function updateRubberband(){
  captureRubberbandPixels();
  drawRubberband();

}

function rubberbandStart(x,y){
  //aquire position of mouse, and enable dragging
  mousedown.x=x;
  mousedown.y=y;
  rubberbandRectangle.left=mousedown.x;
  rubberbandRectangle.top=mousedown.y;
  rubberbandRectangle.width=0;//added
  rubberbandRectangle.height=0;
  dragging=true;
  captureCanvasPixels();//
}

function rubberbandStretch(x,y){
  if(rubberbandRectangle.width>2*context.lineWidth&&
    rubberbandRectangle.height>2*context.lineWidth){
      if(imageData!==undefined){
        restoreRubberbandPixels();
      }
    }
  setRubberbandRectangle(x,y);
  if(rubberbandRectangle.width>2*context.lineWidth&&
      rubberbandRectangle.height>2*context.lineWidth){//both width?
        //
        //updateRubberband();
        drawRubberband();
      }
}

function rubberbandEnd(){
  context.putImageData(imageData,0,0);
  //Draw and scale image to the onscreen canvas.
  context.drawImage(canvas,rubberbandRectangle.left+context.lineWidth*2,
                    rubberbandRectangle.top+context.lineWidth*2,
                    rubberbandRectangle.width-4*context.lineWidth,
                    rubberbandRectangle.height-4*context.lineWidth,
                    0,0,canvas.width,canvas.height);
  dragging=false;
  imageData=undefined;
}

//eventhandler
canvas.onmousedown=function(e){
  var loc=windowToCanvas(e.clientX,e.clientY);

  e.preventDefault();
  rubberbandStart(loc.x,loc.y);
}

canvas.onmousemove=function(e){
  var loc;
  if(dragging){
    e.preventDefault(); //Prevent selection

    loc=windowToCanvas(e.clientX,e.clientY);
    rubberbandStretch(loc.x,loc.y);
  }
};

canvas.onmouseup=function(e){
  rubberbandEnd();
}

image.src='lovely.jpg';
image.onload=function(){
  context.drawImage(image,0,0,canvas.width,canvas.height);
};

eraseAllButton.onclick=function(e){
  context.clearRect(0,0,canvas.width,canvas.height);
  context.drawImage(image,0,0,canvas.width,canvas.height);
};

context.strokeStyle='navy';
context.lineWidth=1.0;



