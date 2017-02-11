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
            </div>
        );
    }
}

export default ScoreToast;