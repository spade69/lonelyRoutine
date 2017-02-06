import * as gv from './global.js';
import {windowToCanvas,drawGrid} from './basic';
let canvas=gv.canvas,
    context=gv.context,
    drawingSurfaceImageData,
    lastX,
    lastY,
    mousedown={},
    rubberbandRect={},
    dragging=false,
    eraserWidth=200,
    eraserShape='circle',
    guidewires=true;
    
  //  drawRadio=document.getElementById('drawRadio'),
  //  eraseRadio=document.getElementById('eraserRadio'),

const ERASER_LINE_WIDTH=1,
    ERASER_SHADOW_COLOR='rgb(0,0,0)',
    ERASER_SHADOW_STYLE='blue',
    ERASER_STROKE_STYLE='rgb(0,0,255)',
    ERASER_SHADOW_OFFSET=-5,
    ERASER_SHADOW_BLUR=20,

    GRID_HORIZONTAL_SPACING=10,
    GRID_VERTICAL_SPACING=10,
    GRID_LINE_COLOR='lightblue',




//Save and restore drawing surface! ..
function saveDrawingSurface(){
  //getImageData!
  if(drawingSurfaceImageData)
    drawingSurfaceImageData=context.getImageData(0,0,canvas.width,canvas.height);
}

function restoreDrawingSurface(){
    if(drawingSurfaceImageData)
        context.putImageData(drawingSurfaceImageData,0,0);
}



//Rubber bands
function updateRubberbandRectangle(loc){
  rubberbandRect.width=Math.abs(loc.x-mousedown.x);
  rubberbandRect.height=Math.abs(loc.y-mousedown.y);

  if(loc.x>mousedown.x) rubberbandRect.left=mousedown.x;
  else rubberbandRect.left=loc.x;

  if(loc.y>mousedown.y) rubberbandRect.top=mousedown.y;
  else rubberbandRect.top=loc.y;
}

function drawRubberbandShape(loc){
  context.beginPath();
  context.moveTo(mousedown.x,mousedown.y);
  context.lineTo(loc.x,loc.y);
  context.stroke();
}

function updateRubberband(loc){
  //update the rectangle because of the mousedown inside the rect
  updateRubberbandRectangle(loc);
  drawRubberbandShape(loc);
}

//Guidewires





//Eraser...
function setDrawPathForEraser(loc){
  var eraserWidth=parseFloat(eraserWidth);
  context.beginPath();
  if(eraserShape==='circle'){
    context.arc(loc.x,loc.y,eraserWidth/2,0,Math.PI*2,false);
  }else{
    context.rect(loc.x-eraserWidth/2,loc.y-eraserWidth/2,eraserWidth,eraserWidth);

  }
  context.clip();//clipping !
}

function setErasePathForEraser(){
//  var eraserWidth=parseFloat(eraserWidthSelect.value);

  context.beginPath();
  if(eraserShape==='circle'){
    context.arc(lastX,lastY,eraserWidth/2+ERASER_LINE_WIDTH,
                0,Math.PI*2,false);
  }
  else{
    context.rect(lastX-eraserWidth/2-ERASER_LINE_WIDTH,
                lastY-eraserWidth/2-ERASER_LINE_WIDTH,
                eraserWidth+ERASER_LINE_WIDTH*2,
                eraserWidth+ERASER_LINE_WIDTH*2);
  }
  context.clip();
}

function setEraserAttribute(){
  context.lineWidth=ERASER_LINE_WIDTH;
  context.shadowColor=ERASER_SHADOW_STYLE;
  context.shadowOffsetX=ERASER_SHADOW_OFFSET;
  context.shadowOffsetY=ERASER_SHADOW_OFFSET;
  context.shadowBlur=ERASER_SHADOW_BLUR;
  context.strokeStyle=ERASER_STROKE_STYLE;
}

function eraseLast(){
  context.save();
  setErasePathForEraser();
  drawGrid(GRID_LINE_COLOR,GRID_HORIZONTAL_SPACING,GRID_VERTICAL_SPACING);
  context.restore();
}

function drawEraser(loc){
  context.save();
  setEraserAttributes();
  setDrawPathForEraser(loc);
  context.stroke();
  context.restore();

}

//Draw Text
function drawText(){
  context.save();
  context.shadowColor='rgba(100,100,150,0.8)';
  context.shadowOffsetX=5;
  context.shadowOffsetY=5;
  context.shadowBlur=10;

  context.fillStyle='cornflowerblue';
  context.fillText('HTML5',20,250);
  context.strokeStyle='yellow';
  context.strokeText('HTML5',20,250);
  context.restore();
}

function setClippingRegion(radius){
  context.beginPath();
  context.arc(canvas.width/2,canvas.height/2,radius,0,Math.PI*2,false);
  context.clip();
}

function fillCanvas(color){
  context.fillStyle=color;
  context.fillRect(0,0,canvas.width,canvas.height);
}

function endAnimation(loop){
  clearInterval(loop);
  setTimeout(function(e){
    context.clearRect(0,0,canvas.width,canvas.height);
    drawText();
  },1000);
}

function drawAnimationFrame(radius){
  setClippingRegion(radius);
  fillCanvas('lightgray');
  drawText();
}

function animate(){
  var radius=canvas.width/2,loop;
  loop=window.setInterval(function(){
    radius-=canvas.width/100;
    fillCanvas('charcoal');
    if(radius>0){
      context.save();
      drawAnimationFrame(radius);
      context.restore();
    }else{
      endAnimation(loop);
    }
  },16);
};

//Event handler
canvas.onmousedown=function(e){
  animate();
};

/*
//Canvas event
canvas.onmousedown=function(e){
  var loc=windowToCanvas(e.clientX,e.clientY);
  e.preventDefault();
  //if(drawRadio.checked)
  saveDrawingSurface();
  mousedown.x=loc.x;
  mousedown.y=loc.y;
  lastX=loc.x;
  lastY=loc.y;
  dragging=true;
};

canvas.onmousemove=function(e){
  var loc;
  if(dragging){
    e.preventDefault(); //Prevent selections
    loc=windowToCanvas(e.clientX,e.clientY);
    if(drawRadio.checked){
      restoreDrawingSurface();
      updateRubberband(loc);
      if(guidewires){
        drawGuidewires(loc.x,loc.y);
      }
    }
    else{
      eraseLast();
      drawEraser(loc);
    }
    lastX=loc.x;
    lastY=loc.y;
  }
};

canvas.onmouseup=function(e){
  loc=windowToCanvas(e.clientX,e.clientY);
  if(drawRadio.checked){
    restoreDrawingSurface();
    updateRubberband(loc);
  }

  if(eraseRadio.checked){
    eraseLast();
  }

  dragging=true;
};
*/
drawGrid(GRID_LINE_COLOR,GRID_HORIZONTAL_SPACING,GRID_VERTICAL_SPACING);

context.lineWidth=0.5;
context.font='128pt Comic-sans';
drawText();












