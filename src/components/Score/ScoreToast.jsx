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
const s={toast:'toast'};

class ScoreToast extends React.Component{
    constructor(props){
        super(props);
        this.state={value:''};
    }

    render(){
        return(
            <div className={s.toast}>
            </div>
        );
    }
}

export default ScoreToast;