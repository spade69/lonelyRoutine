/**
 * App  Main UI of Minilisim Game
 *
 *  * The top-level React component setting context (global) variables
 * that can be accessed from all the child components.
 * 
 * Date 2017/2/8
 * Author Jason
 * 
 */
import React from 'react';
//import 
import Audio from './Audio//Audio.jsx';
import Progress from './ProgressBar/ProgressBar.jsx';
import Rank from './Rank/RankScore.jsx';
import Pause from './Pause/Pause.jsx';
import Score from './Score/ScoreToast.jsx';
import Over from './Over/GameOver.jsx';
import './variables.scss';
//test data for App
import * as MiniGame from '../miniGame';
import Event from '../lib/observer.js';

class App extends React.Component{
    constructor(props){
        super(props);
        this.newGameClickHandler=this.newGameClickHandler.bind(this);
        this.handleLoadScore=this.handleLoadScore.bind(this);
        this.state={
            value:'',
            overDisplay:'none',
            highScoreDisplay:'none',
            scoreDisplay:'none',
            scoreText:'',
            highScoreName:1 //0 focus 1 lost focus
        };
    }

    handleLoadScore(newStateObj){
        //extract new state from sub-Component
        //此处更新状态
        this.setState({
            scoreDisplay:newStateObj.scoreDisplay,
            scoreText:newStateObj.scoreText
        });    
    }

    newGameClickHandler(){
        MiniGame.newGameClickHandler();
    }

    componentDidMount(){
        // 启动游戏
        MiniGame.game.start(this);
        MiniGame.startNewGame(); 
        //Event.listen('LoadScore',MiniGame.loadScoreDisplayHandler)
        Event.listen('over',()=>{MiniGame.over(this);});
        Event.listen('updateScore',()=>{MiniGame.updateScore(this);});
    }   

    componentDidUpdate(prevProps,prevState){

    }

    render(){
        const overDisplay=this.state.overDisplay;
        const scoreText=this.state.scoreText;
        const scoreDisplay=this.state.scoreDisplay;
        return(
            <div>
                <Progress progress={this.props.app.progress}
                                callbackParent={this.handleLoadScore}/>
                <Score scoreDisplay={scoreDisplay}
                            scoreText={scoreText}/>
                <Pause pause={this.props.app.pause}/>
                <Over over={this.props.app.over} 
                        overDisplay={overDisplay} onClick={this.newGameClickHandler}/>
                <Rank rank={this.props.app.rank}/>
                <Audio audioInfo={this.props.app.infos}/>
            </div>
        );
    }
}

export default App;
