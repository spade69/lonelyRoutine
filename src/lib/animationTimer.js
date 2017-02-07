//An animation runs for a duration . It's up to you,
//however to start and stop the animation ,do not aumatically
//You can check if animation is over with isOver()
import Stopwatch from './stopWatch.js';
//check if animation is running with isRunning()
//Supply an timeWarp function. (时间扭曲函数)
// They allow you do easily incorperate 
//non-linear motion, such as : ease-in ease-out elastic, etc.
//abstract a AnimationTimer Object
let AnimationTimer=function(duration,timeWarp){//decide the duration
    this.timeWarp=timeWarp;
    if(duration!==undefined) this.duration=duration;
    else this.duration=1000; //default 1s

    this.stopwatch=new Stopwatch();
};

AnimationTimer.prototype={
    start:function(){
        this.stopwatch.start();
    },
    stop:function(){
        this.stopwatch.stop();
    },
  getElapsedTime:function(){
    let elapsedTime=this.stopwatch.getElapsedTime(),
        percentComplete=elapsedTime/this.duration;
    if(!this.stopwatch.running) 
        return undefined;
    //here we cannot use ===, because a={} implicit undefined
    if(this.timeWarp==undefined) 
        return elapsedTime; 
    
    return elapsedTime*(this.timeWarp(percentComplete)/percentComplete);
  },
  isRunning:function(){
    return this.stopwatch.running;
  },
  isOver:function(){
    return this.stopwatch.getElapsedTime()>this.duration;
  },
  reset:function(){
    this.stopwatch.reset();
  }
};

//Not defined in prototype
AnimationTimer.makeEaseOut=function(strength){
    return function(percentComplete){
        return 1-Math.pow(1-percentComplete,strength*2);
    };
};

AnimationTimer.makeEaseIn=function(strength){
    return function(percentComplete){
        return Math.pow(percentComplete,strength*2);
    };
};

AnimationTimer.makeEaseInOut=function(){
    return function(percentComplete){
        return percentComplete-Math.sin(percentComplete*2*Math.PI)/(2*Math.PI);
    };
};

AnimationTimer.makeElastic=function(passes){
    passes=passes||3;
    return function (percentComplete){
        return((1-Math.cos(percentComplete*Math.PI*passes)))*
                (1-percentComplete)+percentComplete;
    };
};

AnimationTimer.makeBounce=function(bounces){
    //here we use makeElastric to implement makeBounce
    let fn=AnimationTimer.makeElastic(bounces);
    return function(percentComplete){
        percentComplete=fn(percentComplete);
        return percentComplete<=1?percentComplete:2-percentComplete;
    };
};

AnimationTimer.makeLinear=function(){
    return function(percentComplete){
        return percentComplete;
    };
};

export default AnimationTimer;
