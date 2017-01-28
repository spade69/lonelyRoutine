var canvas=document.getElementById('canvas'),
    context=canvas.getContext('2d'),
    shadowCheckbox=document.getElementById('shadowCheckbox'),
    fontHeight=24,
    alignValues=['start','center','end'],
    baselineValues=['top','middle','bottom','alphabetic','ideographic','hanging'],
    x,y,
    text='HTML5';

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

function drawText(){
  var TEXT_X=65,TEXT_Y=canvas.height/2+35;
  context.strokeStyle='blue';
//  if()
  context.fillText(text,TEXT_X,TEXT_Y);
  context.strokeText(text,TEXT_X,TEXT_Y);
}

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



