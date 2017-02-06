/*
Most frequently used function in drawing animation or graph
Date : 2017/2/6
Author :Jason
 */

//low level abstraction ~ 
function windowToCanvas(x,y){
  var bbox=canvas.getBoundingClientRect();
  return {x:x-bbox.left*(canvas.width/bbox.width),
          y:y-bbox.top*(canvas.height/bbox.height)};
}


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



//Guidewires
function drawHorizontalLine(y){
  context.beginPath();
  context.moveTo(0,y+0.5);
  context.lineTo(context.canvas.width,y+0.5);
  context.stroke();
}

function drawVerticalLine(x){
  context.beginPath();
  context.moveTo(x+0.5,0);
  context.lineTo(x+0.5,context.canvas.height);
  context.stroke();
}

function drawGuidewires(x,y){
  context.save(); //save drawing surface and then draw guidewire!!!!!
  context.strokeStyle='rgba(0,0,230,0.4)';
  context.lineWidth=0.5;
  drawVerticalLine(x);
  drawHorizontalLine(y);
  context.restore();
}

export {windowToCanvas,drawGrid};