/**
 * Pause  component
 * A pause toast
 * 
 * Date 2017/2/8
 * Author Jason
 */
import React from 'react';


//only div
const s={toast:''}

class Pause extends React.Component{
    constructor(props){
        super(props);
        this.state={
            value:''
        }
    }
    render(){
        return(
            <div className={s.toast}>
                <p className={s.pause}>{this.props.pause.info}</p>
                <p>{this.props.pause.start}</p>
            </div>
        );
    }
}

export default Pause;