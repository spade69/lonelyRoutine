var context=document.getElementById('canvas').getContext('2d');
var canvas=document.getElementById('canvas'),
    sidesSelect=document.getElementById('sidesSelect'),
 //   startAngleSelect=document.getElementById('startAngleSelect'),
    fillCheckbox=document.getElementById('fillCheckbox'),
    editCheckbox=document.getElementById('editCheckbox'),

    drawingSurfaceImageData,
    mousedown={},
    rubberbandRect={},

    dragging=false,
    draggingOffsetX,
    draggingOffsetY,
    sides=8,
    startAngle=0,
    guidewires=true,
    editing=false,
    polygons=[],
  //Point constructor
    Point=function(x,y){
      this.x=x;
      this.y=y;
    };

//Polygon constructor
var Polygon=function(centerX,centerY,radius,sides,startAngle,strokeStyle,fillStyle,filled){
  this.x=centerX;
  this.y=centerY;
  this.radius=radius;
  this.sides=sides;
  this.startAngle=startAngle;
  this.strokeStyle=strokeStyle;
  this.fillStyle=fillStyle;
  this.filled=filled;
}

//Functions Polygon prototype
//

Polygon.prototype={
  getPoints:function(){
    var points=[],
        angle=this.startAngle||0;
    for(var i=0;i<this.sides;i++){
      points.push(new Point(this.x+this.radius*Math.sin(angle),this.y-this.radius*Math.cos(angle)));
      angle+=2*Math.PI/this.sides;
    }
    return points;
  },

  createPath:function(context){
    var points=this.getPoints();
    console.log(points);
    context.beginPath();
    context.moveTo(points[0].x,points[0].y);
    for(var i=1;i<this.sides;++i){
      context.lineTo(points[i].x,points[i].y);
    }
    context.closePath();
  },

  stroke:function(context){
    context.save();
    this.createPath(context);
    context.strokeStyle=this.strokeStyle;
    context.stroke();
    context.restore();
  },

  fill:function(context){
    context.save();
    this.createPath(context);
    context.fillStyle=this.fillStyle;
    context.fill();
    context.restore();
  },

  move:function(x,y){
    this.x=x;
    this.y=y;
  }

};
//Function
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



function windowToCanvas(x,y){
  var bbox=canvas.getBoundingClientRect();
  return {x:x-bbox.left*(canvas.width/bbox.width),
          y:y-bbox.top*(canvas.height/bbox.height)};
}

//Save and restore drawing surface! ..
function saveDrawingSurface(){
  //getImageData!
  drawingSurfaceImageData=context.getImageData(0,0,canvas.width,canvas.height);
}

function restoreDrawingSurface(){
  context.putImageData(drawingSurfaceImageData,0,0);
}


//Draw a polygon
function drawPolygon(polygon){
  context.beginPath();
  polygon.createPath(context);
  polygon.stroke(context);
  if(fillCheckbox.checked){
    polygon.fill(context);
  }
}

//Rubber bands
function drawRubberbandShape(loc,sides,startAngle){
  var polygon=new Polygon(mousedown.x,mousedown.y,rubberbandRect.width,
                          sides,startAngle,context.strokeStyle,context.fillStyle);
  context.beginPath();
  polygon.createPath(context);
  polygon.stroke(context);

 // if(fillCheckbox.checked){
    polygon.fill(context);
 // }else{
 //   polygon.push(polygon);
 // }
}

function updateRubberbandRectangle(loc){
  rubberbandRect.width=Math.abs(loc.x-mousedown.x);
  rubberbandRect.height=Math.abs(loc.y-mousedown.y);
  if(loc.x>mousedown.x) rubberbandRect.left=mousedown.x;
  else rubberbandRect.left=loc.x;
  if(loc.y>mousedown.y) rubberbandRect.top=mousedown.y;
  else rubberbandRect.top=loc.y;
}

function updateRubberband(loc,sides,startAngle){
  updateRubberbandRectangle(loc);
  drawRubberbandShape(loc,sides,startAngle);
}

//Dragging
function startDragging(loc){
  saveDrawingSurface();
  mousedown.x=loc.x;
  mousedown.y=loc.y;
}

function startEditing(){
  canvas.style.cursor='pointer';
  editing=true;
}

function stopEditing(){ canvas.style.cursor='crosshair';
  editing=false;
}

//Guideline
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
  context.save();
  context.strokeStyle='rgba(0,0,230,0.4)';
  context.lineWidth=0.5;
  drawVerticalLine(x);
  drawHorizontalLine(y);
}

function drawPolygons(){
  polygons.forEach(function(polygon){
    drawPolygon(polygon);
  });

}

//Event handlers
canvas.mousedown=function(e){
  var loc=windowToCanvas(e.clientX,e.clientY);
  e.preventDefault();
  if(editing){
    polygons.forEach(function(polygon){
      polygon.createPath(context);
      if(context.isPointInPath(loc.x,loc.y)){
        startDragging(loc);
        dragging=polygon;
        draggingOffsetX=loc.x-polygon.x;
        draggingOffsetY=loc.y-polygon.y;
        return ;
      }
    });
  }else{
    startDragging(loc);
    dragging=true;
  }
};

canvas.onmousemove=function(e){
  var loc=windowToCanvas(e.clientX,e.clientY);
  e.preventDefault();

  if(editing&&dragging){
    dragging.x=loc.x-draggingOffsetX;
    dragging.y=loc.y-draggingOffsetY;
    context.clearRect(0,0,canvas.width,canvas.height);
    drawPolygons();
  }else{
    if(dragging){
      restoreDrawingSurface();
      updateRubberband(loc,sides,startAngle);
      if(guidewires){
        drawGuidewires(mousedown.x,mousedown.y);
      }
    }
  }
};


canvas.onmouseup=function(e){
  var loc=windowToCanvas(e.clientX,e.clientY);
  dragging=false;
  if(editing){

  }
  else{
    restoreDrawingSurface();
    updateRubberband(loc,sides,startAngle);
  }
};


//Initialization
//context.strokeStyle=strokeStyleSelect.value;
//context.fillStyle=fillStyleSelect.value;
saveDrawingSurface();
context.shadowColor='rgba(0,0,0,0.4)';
context.shadowOffsetX=2;
context.shadowOffsetY=2;
context.shadowBlur=4;




