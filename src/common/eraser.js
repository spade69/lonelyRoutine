import * as gv from './global.js';
import {windowToCanvas,drawGrid,drawGuidewires} from './basic';
let canvas=gv.canvas,
    context=gv.context,
  
  drawingSurfaceImageData,
    mousedown={},
    rubberbandRect={},
    lastX,
    lastY,
    dragging=false,
    eraserWidth=200,
    guidewires=true;//guidewireCheckbox.checked;

const ERASER_LINE_WIDTH=1,
    ERASER_SHADOW_COLOR='rgb(0,0,0)',
    ERASER_SHADOW_STYLE='blue',
    ERASER_STROKE_STYLE='rgb(0,0,255)',
    ERASER_SHADOW_OFFSET=-5,
    ERASER_SHADOW_BLUR=20,
    GRID_LINE_COLOR='lightgray',
    GRID_HORIZONTAL_SPACING=20,
    GRID_VERTICAL_SPACING=20,

    eraserShape='circle';

function eraserdownHandler(e){
  let loc=windowToCanvas(e.clientX,e.clientY);

  e.preventDefault();
  saveDrawingSurface();
  mousedown.x=loc.x;
  mousedown.y=loc.y;
  //console.log('down');
  if(lastX&&lastY){
    lastX=loc.x;
    lastY=loc.y;
  }
  dragging=true;
}

function erasermoveHandler(e){
  var loc;
  if(dragging){
    e.preventDefault(); //Prevent selection

    loc=windowToCanvas(e.clientX,e.clientY);
    restoreDrawingSurface();
    updateRubberband(loc);

    if(guidewires){
      drawGuidewires(loc.x,loc.y);
    }
  }
}

function eraserupHandler(e){
  let loc=windowToCanvas(e.clientX,e.clientY);
  restoreDrawingSurface();
  updateRubberband(loc);
  dragging=false;    
}

function initialization(){

    //Initialization
    context.strokeStyle=ERASER_STROKE_STYLE;
    drawGrid(GRID_LINE_COLOR,GRID_HORIZONTAL_SPACING,GRID_VERTICAL_SPACING);
}


function updateRubberband(loc){
  //update the rectangle because of the mousedown inside the rect
  updateRubberbandRectangle(loc);
  drawRubberbandShape(loc);
}

function drawEraser(loc){
      context.save();
      setEraserAttributes();
      setDrawPathForEraser(loc);
      context.stroke();
      context.restore();
}

function eraseLast(){
        context.save();
        setErasePathForEraser();
        drawGrid(GRID_LINE_COLOR,GRID_HORIZONTAL_SPACING,GRID_VERTICAL_SPACING);
        context.restore();
}
//Save and restore drawing surface! ..
function saveDrawingSurface(){
  //getImageData!
  drawingSurfaceImageData=context.getImageData(0,0,canvas.width,canvas.height);
}

function restoreDrawingSurface(){
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

function setEraserAttributes(){
    context.lineWidth=ERASER_LINE_WIDTH;
    context.shadowColor=ERASER_SHADOW_STYLE;
    context.shadowOffsetX=ERASER_SHADOW_OFFSET;
    context.shadowOffsetY=ERASER_SHADOW_OFFSET;
    context.shadowBlur=ERASER_SHADOW_BLUR;
    context.strokeStyle=ERASER_STROKE_STYLE;
}

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
          console.log('setErasePath');
          context.clip();    
}

function testEraser(){
  setErasePathForEraser();
}

export {
    eraserdownHandler,erasermoveHandler,eraserupHandler,
    initialization,
    updateRubberband,
    drawEraser,
    eraseLast,
    saveDrawingSurface,
    restoreDrawingSurface,
    updateRubberbandRectangle,
    drawRubberbandShape,
    setEraserAttributes,
    setDrawPathForEraser,
    setErasePathForEraser
}



