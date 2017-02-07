import * as gv from './global.js';
let canvas=gv.canvas,
    context=gv.context,
    x,y;
const fontHeight=24,
    alignValues=['start','center','end'],
    baselineValues=['top','middle','bottom','alphabetic','ideographic','hanging'],
    text='HTML5',
    VERTICAL_TICK_SPACING=10,
    HORIZONTAL_TICK_SPACING=10,
    AXIS_WIDTH=300,
    AXIS_HEIGHT=400,
    NUM_VERTICAL_TICKS=AXIS_HEIGHT/VERTICAL_TICK_SPACING,
    NUM_HORIZONTAL_TICKS=AXIS_WIDTH/HORIZONTAL_TICK_SPACING,
    SPACE_BETWEEN_LABELS_AND_AXIS=2,
    AXIS_ORIGIN={x:50,y:50},
    DEGREE_ANNOTATIONS_FILL_STYLE='rgba(0,0,230,0.9)',
    DEGREE_ANNOTATIONS_TEXT_SIZE=12,
    TEXT_FILL_STYLE='rgba(100,130,240,0.5)',
    TEXT_STROKE_STYLE='rgba(200,0,0,0.7)',
    TEXT_SIZE=64,
    circle={x:canvas.width/2,y:canvas.height/2,radius:200}
    ;

//Function
function draw(){
  context.clearRect(0,0,canvas.width,canvas.height);
  drawBackground();
  if(shadowCheckbox.checked) turnShadowsOn();
  else turnShadowsOff();
  drawText();
}

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

function turnShadowsOn(){
  context.shadowColor='rgba(0,0,0,0.8)';
  context.shadowOffsetX=5;
  context.shadowOffsetY=5;
  context.shadowBlur=10;
}

function turnShadowsOff(){
  context.shadowColor=undefined;
  context.shadowOffsetX=0;
  context.shadowOffsetY=0;
  context.shadowBlur=0;
}

/*function drawText(){
  var TEXT_X=65,TEXT_Y=canvas.height/2+35;
  context.strokeStyle='blue';
//  if()
  context.fillText(text,TEXT_X,TEXT_Y);
  context.strokeText(text,TEXT_X,TEXT_Y);
}*/

function drawTextMarker(){
  context.fillStyle='yellow';
  context.fillRect(x,y,7,7);
  context.strokeRect(x,y,7,7);
}

function drawText(text,textAlign,textBaseline){
  if(textAlign) context.textAlign=textAlign;
  if(textBaseline) context.textBaseline=textBaseline;
  context.fillStyle='cornflowerblue';
  context.fillText(text,x,y);
}

function drawTextLine(){
  context.strokeStyle='gray';
  context.beginPath();
  context.moveTo(x,y);
  context.lineTo(x+738,y);
  context.stroke();
}

function drawMiddleText(){
  context.fillStyle='blue';
  context.strokeStyle='yellow';
  context.fillText(text,canvas.width/2,canvas.height/2);
  context.strokeText(text,canvas.width/2,canvas.height/2);
  context.textAlign='center';
  context.textBaseline='middle';
}

//draw Axis label/text
function drawHorizontalAxisLabels(){
  context.textAlign='center';
  context.textBaseline='top';
  for(var i=0;i<=NUM_HORIZONTAL_TICKS;++i){
    if(i%5===0){
      context.fillText(i,AXIS_ORIGIN.x+i*HORIZONTAL_TICK_SPACING,
                      AXIS_ORIGIN.y+SPACE_BETWEEN_LABELS_AND_AXIS)
    }
  }
}

// vertical Axis Labels
function drawVerticalAxisLabels(){
  context.textAlign='right';
  context.textBaseline='middle';
  for(var i=0;i<=NUM_VERTICAL_TICKS;++i){
    if(i%5===0){
      context.fillText(i,AXIS_ORIGIN.x-SPACE_BETWEEN_LABELS_AND_AXIS,
                      AXIS_ORIGIN.y-i*VERTICAL_TICK_SPACING);
    }
  }
}

//Annotations  //number on the clock
function drawAnnotatioons(){
  var radius=circle.radius+DEGREE_DIAL_MARGIN;
  context.save();
  context.fillStyle=DEGREE_ANNOTATIONS_FILL_STYLE;
  context.font=DEGREE_ANNOTATIONS_TEXT_SIZE+'px Helvetica';

  for(var angle=0;angle<2*Math.PI;angle+=Math.PI/8){
    context.beginPath();
    context.fillText((angle*180/Math.PI).toFixed(0),
                    circle.x+Math.cos(angle)*(radius-TICK_WIDTH*2),
                    circle.y-Math.sin(angle)*(radius-TICK_WIDTH*2));
  }
  context.restore();
}

function drawCircularText(string,startAngle,endAngle){
  var radius=circle.radius,
      angleDecrement=(startAngle-endAngle)/(string.length-1),
      angle=parseFloat(startAngle),
      index=0,
      character;
  context.save();
  context.fillStyle=TEXT_FILL_STYLE;
  context.strokeStyle=TEXT_STROKE_STYLE;
  context.font=TEXT_SIZE+'px Lucida Sans';
  while(index<string.length){
    character=string.charAt(index);
    context.save();
    context.beginPath();
    context.translate(circle.x+Math.cos(angle)*radius,
                      circle.y-Math.sin(angle)*radius);
    context.rotate(Math.PI/2-angle);
    context.fillText(character,0,0);
    context.strokeText(character,0,0);
    angle-=angleDecrement;
    index++;

    context.restore();
  }
}


function drawDemo(){
    //context.font='128px Palatino';
    context.font='oblique normal bold 24px palatino';
    /*
    context.lineWidth=1.0;
    context.fillStyle='cornflowerblue';
    turnShadowsOn();
    draw();
    */
    for(var align=0;align<alignValues.length;++align){
      for(var baseline=0;baseline<baselineValues.length;++baseline){
        x=20+align*fontHeight*15;
        y=20+baseline*fontHeight*3;
        drawText(alignValues[align]+'/'+baselineValues[baseline],
                alignValues[align],baselineValues[baseline]);
        drawTextMarker();
        drawTextLine();
      }
    }

    drawCircularText("clockwise around the circle",Math.PI*2,Math.PI/8);
}

export {
  draw,
  drawBackground,
  turnShadowsOn,
  turnShadowsOff,
  drawText,
  drawTextLine,
  drawTextMarker,
  drawMiddleText,
  drawHorizontalAxisLabels,
  drawVerticalAxisLabels,
  drawAnnotatioons,
  drawCircularText,
  drawDemo
}
