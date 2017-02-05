var canvas=document.getElementById('canvas'),
    context=canvas.getContext('2d'),
    AXIS_MARGIN=40,
    AXIS_ORIGIN={x:AXIS_MARGIN,y:canvas.height-AXIS_MARGIN},
    AXIS_TOP=AXIS_MARGIN,
    AXIS_RIGHT=canvas.width-AXIS_MARGIN,

    HORIZONTAL_TICK_SPACING=10,
    VERTICAL_TICK_SPACING=10,

    AXIS_WIDTH=AXIS_RIGHT-AXIS_ORIGIN.x,
    AXIS_HEIGHT=AXIS_ORIGIN.y-AXIS_TOP,

    NUM_VERTICAL_TICKS=AXIS_HEIGHT / VERTICAL_TICK_SPACING,
    NUM_HORIZONTAL_TICKS=AXIS_WIDTH/HORIZONTAL_TICK_SPACING,

    TICK_WIDTH=10,
    TICKS_LINEWIDTH=0.5,
    TICKS_COLOR='navy',

    AXIS_LINEWIDTH=1.0,
    AXIS_COLOR='blue';

//function
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

function drawAxes(){
  context.save();
  context.strokeStyle=AXIS_COLOR;
  context.lineWidth=AXIS_LINEWIDTH;

  drawHorizontalAxis();
  drawVerticalAxis();

  context.lineWidth=0.5;
  context.lineWidth=TICKS_LINEWIDTH;
  context.strokeStyle=TICKS_COLOR;

  drawVerticalAXisTicks();
  drawHorizontalAxisTicks();

  context.restore();

}

function drawHorizontalAxis(){
  context.beginPath();
  context.moveTo(AXIS_ORIGIN.x,AXIS_ORIGIN.y);
  context.lineTo(AXIS_RIGHT,AXIS_ORIGIN.y);
  context.stroke();

}

function drawVerticalAxis(){
  context.beginPath();
  context.moveTo(AXIS_ORIGIN.x,AXIS_ORIGIN.y);
  context.lineTo(AXIS_ORIGIN.x,AXIS_TOP);
  context.stroke();
}

function drawVerticalAXisTicks(){
  var deltaX;
  for(var i=1;i<NUM_VERTICAL_TICKS;++i){
    context.beginPath();
    if(i%5===0) deltaX=TICK_WIDTH;
    else deltaX=TICK_WIDTH/2;

    context.moveTo(AXIS_ORIGIN.x-deltaX,AXIS_ORIGIN.y-i*VERTICAL_TICK_SPACING);
    context.lineTo(AXIS_ORIGIN.x+deltaX,AXIS_ORIGIN.y-i*VERTICAL_TICK_SPACING);
    context.stroke();
  }
}

function drawHorizontalAxisTicks(){
  var deltaY;
  for(var i=1;i<NUM_HORIZONTAL_TICKS;++i){
    context.beginPath();
    if(i%5===0) deltaY=TICK_WIDTH;
    else deltaY=TICK_WIDTH/2;

    context.moveTo(AXIS_ORIGIN.x+i*HORIZONTAL_TICK_SPACING,AXIS_ORIGIN.y-deltaY);
    context.lineTo(AXIS_ORIGIN.x+i*HORIZONTAL_TICK_SPACING,AXIS_ORIGIN.y+deltaY);
    context.stroke();
  }
}

//
function drawDashedLine(context,x1,y1,x2,y2,dashLength){
  dashLength=dashLength===undefined?5:dashLength;

  var deltaX=x2-x1;
  var deltaY=y2-y1;
  var numDashes=Math.floor(Math.sqrt(deltaX*deltaX+deltaY*deltaY)/dashLength);

  for(var i=0;i<numDashes;i++){
    context[i%2===0?'moveTo':'lineTo']
      (x1+(deltaX/numDashes)*i,y1+(deltaY/numDashes)*i);
  }

  context.stroke();
};

function main(context){
  context.lineWidth=3;
  context.strokeStyle='blue';
  drawDashedLine(context,20,20,context.canvas.width-20,20);
  drawDashedLine(context,context.canvas.width-20,20,
  context.canvas.width-20,context.canvas.height-20,10);
  drawDashedLine(context,context.canvas.width-20,
  context.canvas.height-20,20,context.canvas.height-20,15);

  //Initialization...
  drawGrid('lightgray',10,10);
  drawAxes();
}

module.exports={
  drawGrid:drawGrid,
  drawAxes:drawAxes,
  drawHorizontalAxis:drawHorizontalAxis,
  drawVerticalAxis:drawVerticalAxis,
  drawVerticalAXisTicks:drawVerticalAXisTicks,
  drawHorizontalAxisTicks:drawHorizontalAxisTicks,
  drawDashedLine:drawDashedLine
}










