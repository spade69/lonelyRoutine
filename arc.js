var context=document.getElementById('canvas').getContext('2d');

var CENTROID_RADIUS=10,
    CENTROID_STROKE_STYLE='rgb(0,0,0,0.5)',
    CENTROID_FILL_STYLE='rgba(80,190,240,0.6)',

    RING_INNER_RADIUS=35,
    RING_OUTER_RADIUS=55,

    ANNOTATIONS_FILL_STYLE='rgba(0,0,230,0.9)',
    ANNOTATIONS_TEXT_SIZE=12,
    TICK_WIDTH=10,
    TICK_LONG_STROKE_STYLE='rgba(100,140,230,0.9)',
    TICK_SHORT_STROKE_STYLE='rgba(100,140,230,0.7)',

    TRACKING_DIAL_STROKING_STYLE='rgba(100,140,230,0.5)',
    GUIDEWIRE_STROKE_STYLE='goldenrod',
    GUIDEWIRE_FILL_STYLE='rgba(250,250,0,0.6)',
    circle={x:canvas.width/2,y:canvas.height/2,radius:150};


function drawDial(){
  var loc={x:circle.x,y:circle.y};

  drawCentroid();
  drawCentroidGuidewire(loc);//clock 's guidewire, (pointer of a clock)
  drawRing();
  drawTickInnerCircle();
  drawTicks();
  drawAnnotations();
}

function drawCentroid(){
  context.beginPath();
  context.save();
  context.strokeStyle=CENTROID_STROKE_STYLE;
  context.fillStyle=CENTROID_FILL_STYLE;
  context.arc(circle.x,circle.y,CENTROID_RADIUS,0,Math.PI*2,false);
  context.stroke();
  context.fill();
  context.restore();
}

function drawCentroidGuidewire(loc){
  var angle=-Math.PI/4,radius,endpt;
  radius=circle.radius+RING_OUTER_RADIUS;

  if(loc.x>=circle.x){
    endpt={x:circle.x+radius*Math.cos(angle),y:circle.y+radius*Math.sin(angle)};

  }else{
    endpt={x:circle.x-radius*Math.cos(angle),
          y:circle.y-radius*Math.sin(anglen)};
  }
  context.save();

  context.strokeStyle=GUIDEWIRE_STROKE_STYLE;
  context.fillStyle=GUIDEWIRE_FILL_STYLE;

  context.beginPath();
  context.moveTo(circle.x,circle.y);
  context.lineTo(endpt.x,endpt.y);
  context.stroke();

  context.beginPath();
  context.strokeStyle=TICK_LONG_STROKE_STYLE;
  context.arc(endpt.x,endpt.y,5,0,Math.PI*2,false);
  context.fill();
  context.stroke();

  context.restore();
}

function drawRing(){
  drawRingOuterCircle();

  context.strokeStyle='rgba(0,0,0,0.1)';
  context.arc(circle.x,circle.y,circle.radius+RING_INNER_RADIUS,0,Math.PI*2,false);
  context.fillStyle='rgba(100,140,230,0.1)';
  context.fill();
  context.stroke();
}

function drawRingOuterCircle(){
  context.shadowColor='rgba(0,0,0,0.7)';
  context.shadowOffsetX=3,
  context.shadowOffsetY=3,
  context.shadowBlur=6,
  context.strokeStyle=TRACKING_DIAL_STROKING_STYLE;
  context.beginPath();
  context.arc(circle.x,circle.y,circle.radius+RING_OUTER_RADIUS,0,Math.PI*2,true);
  context.stroke();
}

function drawTickInnerCircle(){
  context.save();
  context.beginPath();
  context.strokeStyle='rgba(0,0,0,0.1)';
  context.arc(circle.x,circle.y,circle.radius+RING_INNER_RADIUS-TICK_WIDTH,
              0,Math.PI*2,false);
  context.stroke();
  context.restore();
}

function drawTick(angle,radius,cnt){
  var tickWidth=cnt%4===0?TICK_WIDTH:TICK_WIDTH/2;
  context.beginPath();
  context.moveTo(circle.x+Math.cos(angle)*(radius-tickWidth),
                  circle.y+Math.sin(angle)*(radius-TICK_WIDTH));
  context.lineTo(circle.x+Math.cos(angle)*(radius),
                  circle.y+Math.sin(angle)*radius);
  context.strokeStyle=TICK_SHORT_STROKE_STYLE;
  context.stroke();
}

function drawTicks(){
  var radius=circle.radius+RING_INNER_RADIUS,
      ANGLE_MAX=2*Math.PI,
      ANGLE_DELTA=Math.PI/64,
      tickWidth;
  context.save();

  for(var angle=0,cnt=0;angle<ANGLE_MAX;angle+=ANGLE_DELTA,cnt++){
    drawTick(angle,radius,cnt++);
  }

  context.restore();
}

//number on the clock
function drawAnnotations(){
  var radius=circle.radius+RING_INNER_RADIUS;
  context.save();
  context.fillStyle=ANNOTATIONS_FILL_STYLE;
  context.font=ANNOTATIONS_TEXT_SIZE+'px Helvetica';
  for(var angle=0;angle<2*Math.PI;angle+=Math.PI/8){
    context.beginPath();
    context.fillText((angle*180/Math.PI).toFixed(0),
                    circle.x+Math.cos(angle)*(radius-TICK_WIDTH*2),
                    circle.y-Math.sin(angle)*(radius-TICK_WIDTH*2));
  }
  context.restore();

}

function drawRubberbandShape(loc){
  var angle,
      radius;

  if(mousedown.y===loc.y){
    //Horizontal lines are special case
    radius=Math.abs(loc.x-mousedown.x);
  }
  else{
    //For horizontal lines,the angle is 0,and Math,sin(0) is 0
    //which means we would be dividing by 0 here to get NaN
    //for radius.
    angle=Math.atan(rubberbandRect,height/rubberbandRect.width),
    radius=rubberbandRect.height/Math.sin(angle);
  }

  context.beginPath();
  context.arc(mousedown.x,mousedown.y,radius,0,Math.PI*2,false);
  context.stroke();

  if(fillCheckbox.checked)
    context.fill();
}

function roundedRect(cornerX,cornerY,width,height,cornerRadius){
  if(width>0) context.moveTo(cornerX+cornerRadius,cornerY);
  else context.moveTo(cornerX-cornerRadius,cornerY);

  context.arcTo(cornerX+width,cornerY,cornerX+width,cornerY+height,cornerRadius);
  context.arcTo(cornerX+width,cornerY+height,
                cornerX,cornerY+height,cornerRadius);
  context.arcTo(cornerX,cornerY+height,cornerX,cornerY,cornerRadius);

  if(width>0){
    context.arcTo(cornerX,cornerY,cornerX+cornerRadius,cornerY,cornerRadius);
  }else{
    context.arcTo(cornerX,cornerY,cornerX-cornerRadius,cornerY,cornerRadius);
  }
}

function drawRoundedRect(strokeStyle,fillStyle,cornerX,cornerY,width,height,cornerRadius){
  context.beginPath();
  roundedRect(cornerX,cornerY,width,height,cornerRadius);

  context.strokeStyle=strokeStyle;
  context.fillStyle=fillStyle;
  context.stroke();
  context.fill();
}

//drawRoundedRect('blue','yellow',50,40,100,100,10);
context.shadowColor='rgba(0,0,0,0.4)';
context.shadowOffsetX=2;
context.shadowOffsetY=2;
context.shadowBlur=4;
context.textAlign='center';
context.textBaseline='middle';
//drawGrid('lightgray',10,10);
drawDial();


