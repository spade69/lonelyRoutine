/***
Basic function of canvas
Date 2017/1/23
Author Jason
**/

//converting the mouse click from the window coordinate to canvas coordinate
function window2canvas(canvas,x,y){ //x,y coordinate of window 
    var bbox=canvas.getBoundingClientRect();//bounding box 
    return {x:(x-bbox.left)*(canvas.width/bbox.width),
            y:(y-bbox.top)*(canvas.height/bbox.height)
            };
}

function drawBackground(){
    var VERTICAL_LINE_SPACING=12,
            i=context
}