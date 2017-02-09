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

class App extends React.Component{
    constructor(props){
        super(props);
        this.newGameClickHandler=this.newGameClickHandler.bind(this);
        this.state={
            value:'',
            overDisplay:'none',
            highScoreDisplay:'none',
            scoreDisplay:'none',
            highScoreName:1 //0 focus 1 lost focus
        };
    }

    handleOver(){
        MiniGame.over(this);
    }

    newGameClickHandler(){
        MiniGame.newGameClickHandler();
    }

    componentDidMount(){
        MiniGame.game.start();
    }   

    render(){
        const overDisplay=this.state.overDisplay;
        return(
            <div>
                <Progress progress={this.props.app.progress}/>
                <Score />
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
