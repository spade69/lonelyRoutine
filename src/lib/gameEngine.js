/**
 * Collision detection
 * 
 * Date 2017/2/8
 * Author Jason
 */
/**
 * Supprots:
 * Time-based motion
 * Pause
 * High Scores
 * Sound
 * Accessing frame rate
 * Accessing game time
 * Key processing (game.addKeyListener())
 *
 *  
 */
let getTImeNow=function(){
    return +new Date();
}

let Game=function(gameName,canvasId){
    let canvas=document.getElementById(canvasId),
        self=this;
    this.context=canvas.getContext('2d');
    this.gameName=gameName;
    this.sprites=[];
    this.keyListeners=[];

    //High scores
    //
    this.HIGH_SCORES_SUFFIX='Scores';
    //Image loading
    //
    this.imgaeLoading ProgressCallback;
    this.image={};
    this.imageUrls=[];
    this.imagesLoaded=0;
    this.imagesFailedToLoad=0l
    this.imagesIndex=0;

    //Time
    this.startTime=0;
    this.lastTime=0;
    this.gameTime=0;
    this.fps=0;
    this.STARTING_FPS=60;

    this.paused=false;
    this.startedPauseAt=0;
    this.PAUSE_TIMEOUT=100;

    //Sound
    this.soundOn=true;
    this.soundChannels=[];
    this.audio=new Audio();//<audio ></audio>
    this.NUM_SOUND_CHANNELS=10; 

    for(let i=0;i<this.NUM_SOUND_CHANNELS;++i){
        let audio=new Audio();
        this.soundChannels.push(audio);
    }

    //The this object in the following event handlers is the DOM window..
    window.onkeypress=function(e){
        self.keyPressed(e);
    }
    window.onkeydown=function(e){
        self.keyPressed(e);
    }
    return this;
};

//Game method
Game.prototype={
    //Only need icons background few images!
    //Given a URL return the associated image
    getImage:function(imageUrl){
        return this.images[imageUrl];
    },
    //an image loads successfully
    imageLoadedCallback:function(e){
        this.imagesLoaded++;
    },
    imageLoadedErrorCallback:function(e){
        this.imagesFailedToLoad++;
    },

    //load a particular image
    loadImage:function(imageUrl){
        let image=new Image(),self= this; 
        image.src=imageUrl;

        image.addEventListener('load', function(e){
            self.imageLoadedCallback(e);
        });
        image.addEventListener('error',function(e){
            self.imageLoadedErrorCallback(e);
        });

        this.images[imageUrl]=image;
    },
    //call this method repeatly to load images that have been queued .
    //return the percent of the game images that have been processed
    loadImages:function(){
        //if there  are images left to load
        if(this.imagesIndex<this.imageUrls.length){
            this.loadImage(this.imageUrls[this.imagesIndex]);
            this.imagesIndex++;
        }

        //return the percent complete
        return (this.imagesLoaded+this.imagesFailedToLoad)/
                this.imageUrls.length*100;
    },

    //Call this method to add an image to the queue. The image will be loaded by
    //loadImages()
    queueImage:function(imageUrl){
        this.imageUrls.push(imageUrl);
    },

    //Game loop
    //Start the animation by invoking window.requestNextAnimationFrame() 
    //We use JS built-in call()  function to call the function , with tje specified object game
    //setup game starting time
    start:function(){
      //  let self=this;
        this.startTime=getTimeNow();//Record game's startTime

        window.requestNextAnimationFrame(
            (time)=>{
                // animate is the frame presents to customers
                this.animate.call(this,time); 
            });

    },
    //Drives the game animation. This method is called by the browser when it's time
    //for  the next animation frame
    animate:function(time){
        //let self=this; 
        if(this.paused){
            //check if the game is still paused , in PAUSE_TIMEOUT. no need to check
            //more frequently
            setTimeout(()=>{
                window.requestNextAnimationFrame((time)=>{
                    this.animate.call(this,time);
                }) ; 
            },this.PAUSE_TIMEOUT);
        }else{  //game is not paused
            this.tick(time);  //Update fps game time
            this.clearScreen(); //clear the screen

            this.startAnimate(time); //Override it
            this.paintUnderSprites(); //Override

            this.updateSprites(time); //Invoke sprite behavirus
            this.paintSprites(time); //Paint sprites in the canvas

            this.paintOverSprites(); //Override
            this.endAnimate(); //Override yourself

            this.lastTime=time;

            //call this method again when it's time for  the next animation frame
            window.requestNextAnimationFrame((time)=>{
                this.animate.call(this,time); 
            });
        }
    },

    //Update the frame rate, game time, and the last time the application 
    //drew an animation frame
    tick:function(time){
        this.updateFrameRate(time);
        this.gameTime=(getTimeNow())-this.startTime;
    },

 // Update the frame rate, based on the amount of time it took
   // for the last animation frame only.
    updateFrameRate:function(time){
        if (this.lastTime===0)
            this.fps=this.STARTING_FPS;
        else
            this.fps=1000/(time-this.lastTime);
    },
    //Clear the entire canvas
    clearScreen:function(){
        this.context.clearRect(0,0,
            this.context.canvas.width,this.context.canvas.height);

    },

    //Update all sprites . The sprite update() method invokes all of a
    //sprite 's behaviors
    updateSprites:function(time){
        for(let i=0;i<this.sprites.length;++i){
            let sprite=this.sprites[i];
            sprite.update(this.context,time); //(context,time)
        };
    },

    //Paint all visible sprites
    paintSprites:function(time){
        for(let i=0;i<this.sprites.length;++i){
            let sprite=this.sprites[i];
            if(sprite.visible){
                sprite.paint(this.context);
            }
        }
    },

    //Toggle the paused state of the game. If, after togglling
    //the pause state is unpaused, the application subtracts the time
    //spent during the pause from the game's start time. 
    //Game pick up where it left off, without a potentially large jump in time.
    togglePaused:function()    {
        let now=getTImeNow();
        this.paused=!this.paused;

        if(this.paused){
            this.startedPauseAt=now;

        }else{//not paused
            //Adjust start time, so game starts where it leff off when
            //then user pause it
            this.startTime=this.startTime+now-this.startedPauseAt;
            this.lastTime=now;
        }
    },
    //Given a velocity of some object, calculate the number of pixels to
    //move that object for the current frame.
    pixelsPerFrame:function(time,velocity){
        //Sprites move a certain amount of pixels per frame(pixels/frame).
        //Returns the amount of pixels a sprite should move
        //Given frame: velocity: pixel/second
        //pixel/frame= (pixels/second) * (second/frame); 
        return velocity/this.fps;
    },
    //High scores
    //
    setHighScore:function(highScore){
        let key=this.gameName+this.HIGH_SCORES_SUFFIX,
            highScoresString=localStorage[key]; //HTML5 localStorage
    ///highScores?
        highScores.unshift(highScore);
        localStorage[key]=JSON.stringify(highScores);
    },

//Remove the high scores from localStorage
    clearHighScores:function(){
        localStorage[this.gameName+this.HIGH_SCORES_SUFFIX]=JSON.stringify([]);
    },

        //Key listeners , defined event handler here
    //Add a (key,listener) pair to the keyListeners array.
    addKeyListener:function(keyAndListener){
        this.keyListeners.push(keyAndListener);
    },

    //Given a key, return the associated listener
    //
    findKeyListener:function(key){
        let listener=undefined;
        for(let i=0;i<this.keyListeners.length;++i){
            let keyAndListener=this.keyListeners[i],
                currentKey=keyAndListener.key;
                //find out which key it is
            if(currentKey===key){
                listener=keyAndListener.listener;
            }
        };
        return listener;
    },

    //
    keyPressed:function(e){
        let listener=undefined,
            key=undefined;
        switch(e.keyCode){//choose which key it is 
            //Add more keys as needed
            case 32: key='space' break;
            case 68: key='d'; break;
            case 75:key='k' ; break;
            case 83:key='s' ; break;
            case 80:key='p' ; break;
            case 37:key='left arrow' ; break;
            case 39:key='right arrow' ; break;
            case 38:key='up arrow';break;
            case 40: key='down arrow';break;
        }
        //find the corresponding eventhandlers
        listener=this.findKeyListener(key);
        if(listener){ // lisener is a function 
            listener(); //invoke it 
        }
    },

    //Sprites
    //add a sprite to the game . The game engine will update the sprite and paint it
    addSprite:function(sprite){
        this.sprites.push(sprite);
    },
    //It's probably a good iead not to access sprites directly ,because it's better
    //to write generalized code that deal with all sprites.
    getSprite:function(name){
        for(i in this.sprites){
            if(this.sprites[i].name===name)
                return this.sprites[i];
        }
        return null;
    },

    //Sound
    //Return true if the browsert can play sounds in the ogg file format
    canPlayOggVoribis:function(){
        return ""!=this.audio.canPlayType('audio/ogg;codecs="vorbis"');
    },

    //Return true if the browsert can play sounds in the mp3 file format
    canPlayMp3:function(){
        return ""!=this.audio.canPlayType('audio/mpeg');
    },

    getAvailableSoundChannel:function(){
        let audio;
        for(let i=0;i<this.NUM_SOUND_CHANNELS;++i){
            audio=this.soundChannels[i];
            if(audio.played.length===0||audio.ended){
                return audio;
            }
        }
        return undefined //all channels in use

    },
    //play the associated sound
    playSound:function(id){
        let channel=this.getAvailableSoundChannel(),
            element=document.getElementById(id);
        if(channel&&element){
            channel.src=element.src===''?element.currentSrc:element.src;
            channel.load();
            channel.play();
        }
    },

    //Override following method as desired: These four method are callbacks
    //These methods are called by animate() in the order the are listed
    startAnimate: function(time){

    },
    //this method are called before the sprite is painted. 
    paintUnderSprites:function(){

    },
    //called after the sprites are painted.
    paintOverSprites:function(){

    },
    //called after current frame are rendered. 
    endAnimate:function(){

    }
};

