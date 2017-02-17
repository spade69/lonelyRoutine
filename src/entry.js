import React from 'react';
import ReactDOM from 'react-dom';
import {
  ListItem,
  NumberList,
  OrderList,
  OptionItem,
  Select
} from './components/ListOption.jsx';

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
import Event from './lib/observer.js';

//Component
/*import Audio from './components/Audio.jsx';
import Progress from './components/ProgressBar.jsx';
import Rank from './components/RankScore.jsx';
import Pause from './components/Pause.jsx';
import Score from './components/ScoreToast.jsx';
import Over from './components/GameOver.jsx';*/
import App from './components/App.jsx';

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

//React //test data for App
const items=['red','green','blue','orange','cornflowerblue'];
const infos=[{url:'/public/sounds/pop.mp3',type:'mp3'},{url:'/public/sounds/whoosh.mp3',type:'mp3'}];
const progress={title:'',msg:'Loading...',value:'Loading Game...'};
//title:'The Ungame'
const rank={
    title:'High score!',
    add:'Add score',
    new:'newGame',
    items:['erd','aa','ornns','xxx']
},
pause={info:'Paused',start:'Click anywhere to start'},
over={
    title:'Game Over',
    clear:'Clear high score',
    button:'new game'},
app={
    progress:progress,
    pause:pause,
    over:over,
    rank:rank,
    infos:infos
};

const numbers=[1,2,3,4,5];
const treeUrl={
    tree:'public/smalltree.png' ,
    nearTree:'public/tree-twotrunks.png',
    grass:'public/grass.png',
    grass2:'public/grass2.png',
    sky:'public/sky.png',
};

//test audio
/*ReactDOM.render(
  <Audio audioInfo={infos} />,
  document.getElementById('root')
);
*/
//test Progress
// ReactDOM.render(
//   <Progress progress={progress} />,
//   document.getElementById('root')
// );

//test List 
// ReactDOM.render(
//     <OrderList items={items} />,
//     document.getElementById('root')
// );

//test rank
// ReactDOM.render(
//     <Rank rank={rank} />,
//     document.getElementById('root')
// );

//test Pause
// ReactDOM.render(
//     <Pause pause={pause}/>,
//     document.getElementById('root')
// );
//Testing score
// ReactDOM.render(
//     <Score />,
//     document.getElementById('root')
// );
//Test Game over
// ReactDOM.render(
//     <Over over={over} />,
//     document.getElementById('root')
// );
ReactDOM.render(
    <App app={app}/>,
    document.getElementById('root')
);


 //test 
 //let animateTest=new AnimationTimer(2000,AnimationTimer.makeEaseOut(1));

//Test Observer
// Event.listen('ddd',(price)=>{
//     console.log('price= '+price) ;
// });

// Event.trigger('ddd',20000);