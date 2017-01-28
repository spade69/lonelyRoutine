var canvas=document.getElementById('canvas'),
    context=canvas.getContext('2d'),
    RECTANGLE_WIDTH=100,
    RECTANGLE_HEIGHT=100.
    scale=1.2,
    origin={x:10,y:10};

var sin=clockwise?Math.sin(angle):Math.cos(-angle),
    cos=clockwise?Math.cos(angle):Math.cos(-angle);


context.translate(canvas.width/2-RECTANGLE_WIDTH/2,
                  canvas.height/2-RECTANGLE_HEIGHT/2);
context.strokeRect(0,0,RECTANGLE_WIDTH,RECTANGLE_HEIGHT);

context.clearRect(-origin.x,-origin.y,canvas.width,canvas.height);
context.transform(cos,sin,-sin,cos,0,0);
context.transform(scale,0,0,scale,0,0);
//combine ==>
//context.transform(scale*cos,sin,-sin,scale*cos,0,0)
//错切




