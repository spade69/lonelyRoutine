/**
 * Pause  component
 * A pause toast
 * 
 * Date 2017/2/8
 * Author Jason
 */
import React from 'react';
import './Pause.scss';
import * as MiniGame from '../../miniGame';
//only div
const s={
    toast:'pauseToast',
    toastOrigin:'toast',
    pause:'pause'
}

class Pause extends React.Component{
    constructor(props){
        super(props);
        this.state={
            value:'',
            display:'none'
        };
        this.handleClick=this.handleClick.bind(this);
    }

    componentDidMount(){
        console.log('DidMount');
        window.onblur=MiniGame.windowOnBlur(this);
        window.onfocus=MiniGame.windowOnFocus(this);
    }

    handleClick(){
        MiniGame.pauseToastClickHandler(this);
    }

    render(){
        return(
            <div className={s.toast+' '+s.toastOrigin} onClick={this.handleClick}>
                <p className={s.pause}>{this.props.pause.info}</p>
                <p>{this.props.pause.start}</p>
            </div>
        );
    }
}

export default Pause;