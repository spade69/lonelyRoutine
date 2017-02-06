import * as gv from './global.js';
let canvas=gv.canvas,
    context=gv.context;
const ARROW_MARGIN=30,
    POINT_RADIUS=7,
    points=[{x:canvas.width-ARROW_MARGIN,
            y:canvas.height-ARROW_MARGIN},
            {x:canvas.width-ARROW_MARGIN*2,
            y:canvas.height-ARROW_MARGIN},
            {x:POINT_RADIUS,y:canvas.height/2},
            {x:ARROW_MARGIN,y:canvas.height/2-ARROW_MARGIN},
            {x:canvas.width-ARROW_MARGIN,y:ARROW_MARGIN},
            {x:canvas.width-ARROW_MARGIN,y:ARROW_MARGIN*2}];
const endPoints=[{x:130,y:70},{x:430,y:270},{x:430,y:270}],
    controlPoints=[{x:130,y:250},{x:450,y:70},];
//Functions
function drawPoint(x,y,strokeStyle,fillStyle){
  context.beginPath();
  context.fillStyle=fillStyle;
  context.strokeStyle=strokeStyle;
  context.lineWidth=0.5;
  context.arc(x,y,POINT_RADIUS,0,Math.PI*2,false);
  context.fill();
  context.stroke();
}

function drawBezierPoints(){
  var i,strokeStyle,fillStyle;
  for(i=0;i<points.length;i++){
    fillStyle=i%2===0?'white':'blue',
    strokeStyle=i%2===0?'blue':'white';
    drawPoint(points[i].x,points[i].y,strokeStyle,fillStyle);
  }
}

function drawArrow(){
  context.strokeStyle="white";
  context.fillStyle='cornflowerblue';
  context.moveTo(canvas.width-ARROW_MARGIN,ARROW_MARGIN*2);
  context.lineTo(canvas.width-ARROW_MARGIN,canvas.height-ARROW_MARGIN*2);
  context.quadraticCurveTo(points[0].x,points[0].y,
                            points[1].x,points[1].y) ;
  context.lineTo(ARROW_MARGIN,canvas.height/2+ARROW_MARGIN);
  context.quadraticCurveTo(points[2].x,points[2].y,points[3].x,points[3].y);
  context.lineTo(canvas.width-ARROW_MARGIN*2,ARROW_MARGIN);
  context.quadraticCurveTo(points[4].x,points[4].y,points[5].x,points[5].y);
  context.fill();
  context.stroke();

}

function drawBezierCheck(){
  context.fillStyle='cornflowerblue' ;
  context.strokeStyle='yellow';
  context.shadowColor='rgba(50,50,50,1.0)';
  context.shadowOffsetX=2;
  context.shadowOffsetY=2;
  context.shadowBlur=4;
  context.lineWidth=20;
  context.lineCap='round';

  context.beginPath();
  context.moveTo(120.5,130);
  context.quadraticCurveTo(150.8,130,160.6,150.5);
  context.quadraticCurveTo(190,250.0,210.5,160.5);
  context.quadraticCurveTo(240,100.5,290,70.5);

  context.stroke();
}

//third
function drawBezierCurve(){
  context.strokeStyle='blue';
  context.beginPath();
  context.moveTo(endPoints[0].x,endPoints[0].y);
  context.bezierCurveTo(controlPoints[0].x,controlPoints[0].y,
                        controlPoints[1].x,controlPoints[1].y,
                        endPoints[1].x,endPoints[1].y);
  context.stroke();
}

function drawEndPoints(){
  context.strokeStyle='blue';
  context.fillStyle='red';
  endPoints.forEach(function(point){
    context.beginPath();
    context.arc(point.x,point.y,5,0,Math.PI*2,false);
    context.stroke();
    context.fill();
  });
}

function drawControlPoints(){
  context.strokeStyle='yellow';
  context.fillStyle='blue';
  controlPoints.forEach(function(point){
    context.beginPath();
    context.arc(point.x,point.y,5,0,Math.PI*2,false);
    context.stroke();
    context.fill();
  });
}

function drawDemo(){
    context.clearRect(0,0,canvas.width,canvas.height);
    //drawPoint(points[0].x,points[0].y,'blue','yellow');
    //drawBezierPoints();
    //drawArrow();

    drawControlPoints();
    drawEndPoints();
    drawBezierCurve();

}

export {
    drawPoint,
    drawBezierPoints,
    drawArrow,
    drawBezierCheck,
    drawEndPoints,
    drawControlPoints,
    drawDemo
}





