/**
 * Score Toast  component
 * A game Score toast
 * 
 * Date 2017/2/8
 * Author Jason
 * 
 */

import React from 'react';
import './Score.scss';


//only div
const s={toast:'toast',scoreToast:'scoreToast'};
let styleObj={
    width:'30px',
    height:'30px',
    padding:'15px',
    borderRadius:'120px',
    borderLeft:'1px solid black',
    background:'red',
    position:'absolute',
    left:'300px'
};
class ScoreToast extends React.Component{
    constructor(props){
        super(props);
        this.state={value:''};
    }

    render(){
        const scoreText=this.props.scoreText;
        const scoreDisplay=this.props.scoreDisplay;
        //let cssObj={display:scoreDisplay,:scoreText}
        return(
            <div className={s.toast+' '+s.scoreToast} 
                    style={{display:scoreDisplay}}>
            {scoreText}
            <div style={styleObj}></div>
            </div>
            
        );
    }
}

export default ScoreToast;