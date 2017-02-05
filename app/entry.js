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
var line=require('../js/line.js');
import React from 'react';
import Select from './line.jsx';


  context.lineWidth=3;
  context.strokeStyle='blue';
  line.drawDashedLine(context,20,20,context.canvas.width-20,20);
  line.drawDashedLine(context,context.canvas.width-20,20,
  context.canvas.width-20,context.canvas.height-20,10);
  line.drawDashedLine(context,context.canvas.width-20,
  context.canvas.height-20,20,context.canvas.height-20,15);

  //Initialization...
  line.drawGrid('lightgray',10,10);
  line.drawAxes();


const items=['red','green','blue','orange','cornflowerblue'];
const numbers=[1,2,3,4,5];

main();
function main(){
    ReactDOM.render(
      <Select items={items} />,
      document.getElementById('root')
    );
}