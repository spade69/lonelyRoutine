/**
 *   Main implementation of Minilisim Game
 *
 *  * 
 * 
 * Date 2017/2/9
 * Author Jason
 * 
 */

import Game from './lib/gameEngine.js';
import Event from './lib/observer.js';
import * as Arc from './components/arc.js';

var game =new Game('miniGame','canvas'),
    loading=false, // loading flag

    //Score
    score=0,
    lastScore=0,
    lastScoreUpdate=undefined,

    //High score
    HIGH_SCORES_DISPLAYED=10,

    //Paused
    
    //Over
    gameOver=false,

    //Sun Constants
    SUN_TOP=110,
    SUN_LEFT=450,
    SUN_RADIUS=80,

    //Key Listeners
    lastKeyListenerTime=0, //For throttling arrow keys

    //Scrolling the background........
    translateDelta=0.025,
    translateOffset=0,

    // Lives......................................................
    livesLeft = 1;

let scrollBackground=function(){
        translateOffset=
            (translateOffset+translateDelta)%game.context.canvas.width;
        game.context.translate(-translateOffset,0);
    },

    //Paint methods
    //
    paintSun = function (context) {
       context.save();

       context.strokeStyle = 'orange';
       context.fillStyle = 'yellow';
       context.strokeStyle = 'orange';
       context.lineWidth = 1;

       context.beginPath();
       context.arc(SUN_LEFT, SUN_TOP, SUN_RADIUS, 0, Math.PI*2, true);
       context.fill();
       context.stroke();

       context.stroke();
       context.restore();
    },
    paintFarCloud=function(context,x,y){
        context.save();
        scrollBackground();// scroll the background.
        context.lineWidth=0.5; 
        context.strokeStyle='rgba(100,140,230,0,0.8)';
        context.fillStyle='rgba(255,255,255,0.4)';
        context.beginPath();

        context.moveTo(x+102,y+91);
        //draw Adds a quadratic Bézier curve to the current path.
        context.quadraticCurveTo(x+180, y+110, x+250, y+90);
        context.quadraticCurveTo(x+312, y+87, x+279, y+60);
        context.quadraticCurveTo(x+321, y+20, x+265, y+20);
        context.quadraticCurveTo(x+219, y+4, x+171, y+23);
        context.quadraticCurveTo(x+137, y+5, x+104, y+18);
        context.quadraticCurveTo(x+57, y+23, x+79, y+48);
        context.quadraticCurveTo(x+57, y+74, x+104, y+92);
        context.closePath();
       context.stroke();
       context.fill();
       context.restore();
    },

    paintNearCloud=function(context,x,y){
       context.save();
       scrollBackground();
       scrollBackground();
       context.lineWidth=0.5;
       context.strokeStyle='rgba(100, 140, 230, 0, 0.8)';
       context.fillStyle='rgba(255,255,255,0.4)';
       context.beginPath();

       context.fillStyle='rgba(255,255,255,0.7)';

       context.moveTo(x+364, y+37);
       context.quadraticCurveTo(x+426, y+28, x+418, y+72);
       context.quadraticCurveTo(x+450, y+123, x+388, y+114);
       context.quadraticCurveTo(x+357, y+144, x+303,y+ 115);
       context.quadraticCurveTo(x+251, y+118, x+278, y+83);
       context.quadraticCurveTo(x+254, y+46, x+320, y+46);
       context.quadraticCurveTo(x+326, y+12, x+362, y+37);
       context.closePath();
       context.stroke();
       context.fill();
       context.restore();    
    },

//Game over
    over=function(that){
        let highScore,
            highScores=game.getHighScores();
        if(highScores.length===0||score>highScores[0].score){
            showHighScores(that); //App 
        }
        else{
            //gameOverToast.style.display = 'inline';
            that.setState({
                overDisplay:'inline' //change it to the top level
            });
        }

        gameOver=true;
        lastScore=score;
        score=0;
    },



//Pause and Auto-pause Event handler...................................
    togglePaused=function(that){ //that object in jsx
        game.togglePaused();
        //pausedToast.style.display = game.paused ? 'inline' : 'none';
        let displayx=game.paused?'inline':'none';
        that.setState({
            display:displayx
        });
        
    },

    pauseToastClickHandler=function(e){
        //this --> the object in JSX
        this.setState({
            display:'none'
        });
        togglePaused(this);
    };

// 离开浏览器 失去焦点时触发
function windowOnBlur(that){
    console.log(loading,gameOver,game.paused);
    if(!loading && !gameOver&& !game.paused){
        togglePaused(that);
        let displayx=game.paused?'inline':'none';
        that.setState({ 
            display:displayx
        });
    }
    //console.log('sss');
}

function windowOnFocus(that){
    if(game.paused){
        togglePaused(that);
        let displayx=game.paused?'inline':'none';
        that.setState({
            display:displayx
        });
    }
    //console.log('eee');
}

//New Game..................................
//Actually this belongs to the over Compoent
let newGameClickHandler=function(e){
        this.setState({
            overDisplay:'none'
        });
        startNewGame();
    };

function startNewGame(){
    //highScoreParagraph.style.display = 'none';
    gameOver=false;
    livesLeft=1;
    score=0;

}

//High Scores
//Change game display to show high scores when player
//beats the high score
let showHighScores=function(that){
        //highScore  //
        that.setState({
            highScoreDisplay:'inline'
        });
        //livesLeft
        updateHighScoreList(that);
        that.setState({
            highScoreName:0 //0 focus 1 lost focus
        });
    },

    updateHighScoreList=function(that){
        let el,
            highScores=game.getHighScores(),
            length=highScores.length,
            highScore;
            //listParent  not necessary
        //highScoreList.id = 'highScoreList'; // Set up CSS of list
        if(length>0){
            that.setState({
                preScoreDisplay:'block'
            });
            length=length>10?10:length;
            //render high score list
            that.setState({
                rank:highScores
            });

        }else{
            that.setState({
                preScoreDisplay:'none'
            });
        }
    },

    addScoreClickHandler=function(e){
        game.setHighScore({name:this.state.nameValue,score:lastScore});
        updateHighScoreList();
        this.setState({
            buttonDisable:true,
            nameValue:''
        });
    },

    newGameFromScoreClickHandler=function(e){
        this.setState({
            highScoreDisplay:'none'
        });
        startNewGame();
    },

    nameInputKeyUpHandler=function(e){
        if(this.state.nameValue.length>0){
            this.setState({
                buttonDisable:false
            });
        }
        else{
            this.setState({
                buttonDisable:true
            });
        }
    };

//Score Display
    function updateScore (that) {
        // body... 
        if(!loading&& game.lastScoreUpdate!==undefined){
            if(game.gameTime-game.lastScoreUpdate>1000){
                that.setState({
                    scoreDisplay:'inline'
                });
                score+=10;
                //scoreToast.innerHTML = score.toFixed(0);
                game.lastScoreUpdate=game.gameTime;
            }
        }else{
            game.lastScoreUpdate=game.gameTime;
        }
    }

//End game button
let clearHighScoresCheckHandler=function(e){
        if(this.state.clearAll){
            game.clearHighScores();
        }
    },
    //LoadScore handler
    loadScoreDisplayHandler=function(){
        let newStateObj={
            scoreDisplay:'inline',
            scoreText:'10'
        };
        loading=false;
        score=10;
        //console.log('loading Score');
        game.playSound('pop');     
        return newStateObj;
    }


//Load game ....................................................
loading=true;
let loadButtonHandler=function(e){
    let interval,loadingPercentComplete=0;
    e.preventDefault();
    //Inside handler  don't use this! 
    this.setState({
        loadButtonDisplay:'none',
        loadMsgDisplay:'block',
        progressDivDisplay:'block'
    });
    //progressDiv.appendChild(progressbar.domElement);
    //No problem it's url of image , not physical path
    game.queueImage('/public/waterfall.png');
    game.queueImage('/public/tree.png');
    //Supposed to rewrite it with Promise!
    //Interval is the return value of setInterval 
    interval=setInterval((e)=>{
        loadingPercentComplete=game.loadImages();
        if(loadingPercentComplete===100){
            clearInterval(interval);
            setTimeout((e)=>{
                this.setState({
                    loadMsgDisplay:'none',
                    progressDivDisplay:'none'
                });
                setTimeout((e)=>{
                    this.setState({
                        loadingTitle:'none'
                    });
                    setTimeout((e)=>{
                        this.setState({
                            loadingToastDisplay:'none'
                        })
                        game.playSound('pop');
                        setTimeout((e)=>{
                            //Trigger the user-defined event. 
                            Event.trigger('LoadScore');
                            console.log('here');
                        },1000);
                    },500);
                },500);
            },500);
        }
         //progressbar.draw(loadingPercentComplete);
    },16)
}

//Game Paint Method override
game.paintOverSprites=function(){
    paintNearCloud(game.context,120,20);
    paintNearCloud(game.context,game.context.canvas.width+120,20);
};

game.paintUnderSprites=function(){//Draw things other than sprites
    if(!gameOver&& livesLeft===0 ){///gameOver==false
        ///over(that); //here call over 
        ///事件 观察者模式， 订阅over事件，因为这个需要在
        ///处理函数中调用 this.setState, 我选择了直接传入this来处理
        ///这样就需要在App.jsx 中，利用arrow function来处理，但是其实
        ///我不应该在业务逻辑直接this.setState来改变状态，而应该
        ///把状态改变了之后返回给 React组件，在React组件里面通过事件
        ///来获取这个改变后的state值，然后更新state。 其实也就是说
        ///我的React里面的某个事件会触发这个state改变，但是改变是在
        ///我业务逻辑中实现的 
        Event.trigger('over');
    }else{
        paintSun(game.context);
        paintFarCloud(game.context,20,20);
        paintFarCloud(game.context,game.context.canvas.width+20,20);

        if(!gameOver){
            //updateScore(that); 
            Event.trigger('updateScore');
        }
    }
};


export {
    over,updateScore,
    togglePaused,pauseToastClickHandler,
    windowOnBlur,windowOnFocus,
    newGameClickHandler,
    addScoreClickHandler,
    newGameFromScoreClickHandler,
    nameInputKeyUpHandler,
    clearHighScoresCheckHandler,
    loadButtonHandler,
    loadScoreDisplayHandler,
    startNewGame,
    game
};