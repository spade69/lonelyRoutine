/**
 * ***
 * Author : Jason
 * Date: 2017/2/4
 */

//image Painter
var ImagePainter=function(imageUrl){
    this.image=new Image;
    this.image.src=imageUrl;
};

ImagePainter.prototype={
    image:undefined,

    paint:function(sprite,context){
        if(this.image!==undefined){
            if(!this.image.complete){
                this.image.onload=function(e){
                    sprite.width=this.width;
                    sprite.height=this.height;
                    //drawImage~
                    context.drawImage(this,sprite.left,sprite.top,
                                                sprite.width,sprite.height);
                };
            }else{
                context.drawImage(this.image,sprite.left,sprite.top,
                            sprite.width,sprite.height);
            }
        }
    }
};


//SpriteSheet
var SpriteSheetPainter=function(cells){
    this.cells=cells||[];
    this.cellIndex=0;
}

SpriteSheetPainter.prototype={
    advance:function(){ // normally cellindex ++ else reset 0 if cellindex>cells.length
        if(this.cellIndex==this.cells.length-1){
            this.cellIndex=0;
        }else{
            this.cellIndex++;
        }
    },
    paint:function(sprite,context){
        var cell=this.cells[this.cellIndex];
        context.drawImage(spritesheet,cell.left,cell.top,cell.width,cell.height,
                                sprite.left,sprite.top,cell.width,cell.height);
    }
}

var Sprite=function(name,painter,behaviors){
    if(name!==undefined) this.name=name;
    if(painter!==undefined) this.painter=painter;
    if(behaviors!==undefined) this.behaviors=behaviors;

    return this;
};

//Prototype
Sprite.prototype={
    top:0, //全部都是默认值，不同的实例拥有同样的属性值  
    left:0,
    width:10,
    height: 10,
    velocityX: 0,
    velocityY: 0,
    fps:60,
    trap:false,
    freeze:false,
    tapTimes:0,
    color:[],
   visible: true,
   animating: false,
   painter: undefined, // object with paint(sprite, context)
   behaviors: [], // objects with execute(sprite, context, time)
    paint:function(context){
        if(this.painter!==undefined&&this.visible){
            this.painter.paint(this,context);
        }
    },
    update:function(context,time){
        for(var i=0;i<this.behaviors.length;++i){
            this.behaviors[i].execute(this,context,time);
        }
    }
}
// Sprite Animators...........................................................

// Sprite animators have an array of painters that they succesively apply
// to a sprite over a period of time. Animators can be started with 
// start(sprite, durationInMillis, restoreSprite)
var SpriteAnimator=function(painters,elapsedCallback){
    this.painters=painters;
    if(elapsedCallback){
        this.elapsedCallback=elapsedCallback;
    }
};

SpriteAnimator.prototype={
    painters:[],
    duration:1000,
    startTime:0,
    index:0,
    elapsedCallback:undefined,
    end:function(sprite,originalPainter){
        sprite.animating=false;
        if(this.elapsedCallback){
            this.elapsedCallback(sprite);
        }else{
            sprite.painter=originalPainter;//原始painter
        }
    },
    start:function(sprite,duration){
        var endTime=+new Date()+duration,
            period=duration/(this.painters.length),
            lastUpdate=0,
            animator=this,//for setInterval() function
            originalPainter=sprite.painter;
        this.index=0;
        sprite.animating=true;
        sprite.painter=this.painter[this.index];

        requestNextAnimationFrame(function spriteAnimatorAnimate(time){
            if(time<endTime){
                if((time-lastUpdate)>period){
                    sprite.painter=animator.painters[++animator.index];
                    lastUpdate=time;
                }
                requestNextAnimationFrame(spriteAnimatorAnimate);
            }else{
                animator.end(sprite,originalPainter);
            }
        })
    }
}

//图像绘制器，精灵表绘制器
export {ImagePainter,Sprite,SpriteAnimator,SpriteSheetPainter};
