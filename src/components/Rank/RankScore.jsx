/**
 * rankScore component
 * 
 * Date 2017/2/8
 * Author Jason
 */

import React from 'react';
import styles from './Rank.scss';
import {OrderList} from '../ListOption.jsx';
import * as MiniGame from '../../miniGame';
//import classNames from 'classnames'; 
const s={
    root:'highScoreToast',title:'title',
    previous:'previousHighScoresTitle',
    highScoreList:'highScoreList'
}

let highScoreToast={
    position:'absolute',
    display:'none',
    width:'400px',
    left:'0px',
    top:'200px',
    color:'cornflowerblue',
    marginLeft:'150px',
    marginTop:'20px',
    font:'18px fantasy'
},
highScoreParagraph={
    position:'absolute',
    left:'150px',
    top:'-50px',
    color:'red',
    font:'8em fantasy',
    marginLeft:'70px',
    marginBottom:'50px'
},
styleObj={
    color:'rgba(0,0,255,0.6)',
    marginTop:'50px'
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
            <div style={highScoreToast}>
                <p className={styles.title}>{this.props.rank.title}</p>
                <p>Input your name : </p>
                <input type='text' autoFocus='true' onKeyUp={this.handleNameKeyUp}/>
                <input type='button' value={this.props.rank.add} 
                        disabled='true' onClick={this.handleAddClick} />
                <input type='button' value={this.props.rank.new} 
                        onClick={this.handleNewGameClick}/>
                <p className={styles.title+' '+styles.previous} display='none'>{this.state.preRank}</p>
                <OrderList items={this.state.rank} className={s.highScoreList} />                 
            </div>
        );//this.props.rank.items
    }
}

export default rankScore;