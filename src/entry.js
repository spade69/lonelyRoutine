import React from 'react';
import ReactDOM from 'react-dom';
import {
  ListItem,
  NumberList,
  OptionItem,
  Select
} from './components/line.jsx';

//var line=require('../js/line.js');
import * as line from './common/axis.js';
import * as arc from './common/arc.js';
import * as bezier from './common/bezier';
import * as text from './common/text';
import * as img from './common/img';
import * as eraser from './common/eraser';
import * as animate from './common/animate';
import req from './lib/requestNextAnimationFrame.js';
import Stopwatch from './lib/stopWatch.js';
import AnimationTimer from './lib/AnimationTimer';
import * as polygonObj from './lib/polygon';
import * as behaviors from './lib/behavior';

var canvas=document.getElementById('canvas'),
    context=canvas.getContext('2d');
   

/*axis.drawDemo();
arc.drawDemo();
bezier.drawDemo();
text.drawDemo();*/

/*eraser.setErasePathForEraser();
eraser.setDrawPathForEraser({x:12,y:23});
eraser.setEraserAttributes();
eraser.drawRubberbandShape({x:12,y:23});
eraser.updateRubberbandRectangle({x:12,y:23});
eraser.saveDrawingSurface();
eraser.restoreDrawingSurface();
eraser.initialization();

canvas.onmousedown=eraser.eraserdownHandler;
canvas.onmousemove=eraser.erasermoveHandler;
canvas.onmouseup=eraser.eraserupHandler;
*/
//React
const items=['red','green','blue','orange','cornflowerblue'];
const numbers=[1,2,3,4,5];
const treeUrl={
	tree:'public/smalltree.png' ,
	nearTree:'public/tree-twotrunks.png',
	grass:'public/grass.png',
	grass2:'public/grass2.png',
	sky:'public/sky.png',
};

ReactDOM.render(
  <Select items={items} />,
  document.getElementById('root')
);

//Test img 
//
/*img.setClip();
img.drawMagnifyingGlassCircle({x:200,y:300});
img.drawMagnifyingGlass({x:20,y:30});*/
//img.drawDemo('./public/lovely.jpg');

//Test  Animation
//animate.testDemo(treeUrl);

//Test animationNextFrame
/*let stopx=new Stopwatch();
stopx.start();
stopx.stop();
console.log(stopx.getElapsedTime());
stopx.reset();
console.log(stopx.isRunning());*/

 //test 
 let animateTest=new AnimationTimer(2000,AnimationTimer.makeEaseOut(1));
