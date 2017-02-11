/**
 * rankScore component
 * 
 * Date 2017/2/8
 * Author Jason
 */

import React from 'react';
import './Rank.scss';
import {OrderList} from '../ListOption.jsx';
import * as MiniGame from '../../miniGame';

const s={
    root:'highScoreToast',title:'title',
    previous:'previousHighScoresTitle',
    highScoreList:'highScoreList'
}
// div 
// --p titile
// --input text 
// --input button
// --input ScoresButton
// --title previsousHighScoreTitle
// --ol score list
//props.rank
class rankScore extends React.Component{
    constructor(props){
        super(props);
        this.handleAddClick=this.handleAddClick.bind(this);
        this.state={
            value:'',
            rank:[],
            preRank:[],
            preScoreDisplay:'none',
            //highScoreName:1  
            buttonDisable:true,

        };
    }

    handleAddClick(){
        MiniGame.addScoreClickHandler();
    }

    handleNewGameClick(){
        MiniGame.newGameFromScoreClickHandler();
    }

    handleNameKeyUp(){
        MiniGame.nameInputKeyUpHandler();
    }

    componentDidMount(){
        
    }   

    componentDidUpdate(){

    }

    render(){
        return(
            <div className={s.root}>
                <p className={s.title}>{this.props.rank.title}</p>
                <p>Input your name : </p>
                <input type='text' autoFocus='true' onKeyUp={this.handleNameKeyUp}/>
                <input type='button' value={this.props.rank.add} 
                        disabled='true' onClick={this.handleAddClick} />
                <input type='button' value={this.props.rank.new} 
                        onClick={this.handleNewGameClick}/>
                <p className={s.title+' '+s.previous} display='none'>{this.state.preRank}</p>
                <OrderList items={this.state.rank} className={s.highScoreList} />                 
            </div>
        );//this.props.rank.items
    }
}

export default rankScore;