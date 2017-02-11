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

    componentWillMount(){

    }

    componentDidMount(){
        //window.onblur=MiniGame.windowOnBlur(this);
        //window.onfocus=MiniGame.windowOnFocus(this);
        console.log('work');
        //document.addEventListener('blur', ()=>{MiniGame.windowOnBlur(this)} );
        window.onblur=()=>{
            //console.log(this);  if you don't use arrow function ,then this -> window
            //now this -> Pause object -- a React Component
            MiniGame.windowOnBlur(this);
        }
        window.onfocus=()=>{
            MiniGame.windowOnFocus(this);
        }
    }

    handleClick(){
        MiniGame.pauseToastClickHandler(this);
    }

    render(){
        const display=this.state.display;
        return(
            <div className={s.toast+' '+s.toastOrigin} 
                    onClick={this.handleClick}
                    style={{display:display}}>
                <p className={s.pause}>{this.props.pause.info}</p>
                <p>{this.props.pause.start}</p>
            </div>
        );
    }
}

export default Pause;