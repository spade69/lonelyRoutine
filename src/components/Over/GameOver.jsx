/**
 * Game Over component
 * 
 * Date 2017/2/8
 * Author Jason
 */

import React from 'react';
import * as MiniGame from '../../miniGame';
import './Over.scss';
//
const s={Overtoast:'gameOverToast',title:'title',toast:'toast'};

class GameOver extends React.Component{
    constructor(props){
        super(props);
        // this.state={
        //     value:'',
        //     display:'none' //block
        // };
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
        //const this.state.
        const display=this.props.overDisplay;
        return(
            <div className={s.Overtoast+' '+s.toast} style={{display:display}} >
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