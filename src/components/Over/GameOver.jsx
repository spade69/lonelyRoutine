/**
 * Game Over component
 * 
 * Date 2017/2/8
 * Author Jason
 */

import React from 'react';
import * as MiniGame from '../../miniGame';
import './Over.scss';
import * as gv from '../../common/global.js';
const CANVAS_WIDTH=gv.canvas.width;
const CANVAS_HEIGHT=gv.canvas.height;
const s={Overtoast:'gameOverToast',title:'title',toast:'toast'};

let gameOverToast={
    padding:CANVAS_WIDTH/20+'px',
    marginLeft:'25%',
    marginTop:'20%',
    textAlign:'center'
}

class GameOver extends React.Component{
    constructor(props){
        super(props);

        //this.handleOver=this.handleOver.bind(this);
        this.handleClick=this.handleClick.bind(this);
    }

    // handleOver(){
    //     MiniGame.over(this)
    // }
    
    handleClick(){
       // this.props.newGameClickHandler(that);
       this.props.onClick();
    }

    render(){
        gameOverToast.display=this.props.overDisplay;
        return(
            <div className={s.toast} style={gameOverToast} >
                <p className={s.title}>{this.props.over.title}</p>
                <p>
                    <input type='checkbox' />
                    {this.props.over.clear}
                </p>
                <input type='button' value={this.props.over.button} 
                                            autoFocus='true' onClick={this.handleClick}/>
            </div>
        );
    }
}

export default GameOver;