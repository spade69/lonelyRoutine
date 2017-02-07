/**
 * Draw polygon
 * Author Jason
 * Date 20167/2/7
 */
var Point = function (x, y) {
   this.x = x;
   this.y = y;
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

function drawPolygons(){
  polygons.forEach(function(polygon){
    drawPolygon(polygon);
  });

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

function drawPolygonRubberShape(loc, sides, startAngle) {
   var polygon = new Polygon(mousedown.x, mousedown.y,
                     rubberbandRect.width, 
                     parseInt(sidesSelect.value),
                     (Math.PI / 180) * parseInt(startAngleSelect.value),
                     context.strokeStyle,
                     context.fillStyle,
                     fillCheckbox.checked);
   drawPolygon(polygon);
   
   if (!dragging) {
      polygons.push(polygon);
   }
}

export {
  Polygon,
  drawPolygon,
  drawPolygons,
  drawPolygonRubberShape
};