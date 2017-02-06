
var Stopwatch=function(){};

Stopwatch.prototype={
  startTime:{},
  running:false,
  elapsed:undefined,
  start:function(){
    this.startTime=+new Date();
    this.elapsedTime=undefined;
    this.running=true;
  },
  stop:function(){
    this.elapsed=(+new Date())-this.startTime;
    this.running=false;
  },
  getElapsedTime:function(){
    if(this.running){
      return (+new Date())-this.startTime;

    }else{
      return this.elapsed;
    }
  },
  isRunning:function(){
    return this.running;
  },
  reset:function(){
    this.elapsed=0;
  }

}

var stopwatch=new Stopwatch(),
    secondsInput=document.getElementById('secondsInput'),
    animateButton=document.getElementById('startStopButton');

function animate(){
  if(stopwatch.isRunning()&&
    stopwatch.getElapsedTime()>timerSetting*1000){
    //Animation over
    stopwatch.stop();
    animateButton.value='Start';
    secondsInput.disabled=false;
    secondsInput.value=0;

  }else if(stopwatch.isRunning()){//Animation is running
    redraw();
    requestNextAnimationFrame(animate);
  }
}

//abstract a AnimationTimer Object
AnimationTimer=function(duration){
  this.duration=duration;
};

AnimationTimer.prototype={
  duration:undefined,
  stopwatch:new Stopwatch(),
  start:function(){
    this.stopwatch.start();
  },
  stop:function(){
    this.stopwatch.stop();
  },
  getElapsedTime:function(){
    var elapsedTime=this.stopwatch.getElapsedTime();//
    if(!this.stopwatch.running)
      return undefined;
    else
      return elapsedTime;
  },
  isRunning:function(){
    return this.stopwatch.isRunning();
  },
  isOver:function(){
    return this.stopwatch.getElapsedTime()>this.duration;
  }
}


