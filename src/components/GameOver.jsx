/**
 * Game Over component
 * 
 * Date 2017/2/8
 * Author Jason
 */

import React from 'react';

//
const s={toast:'xx',title:'Over'};

class GameOver extends React.Component{
    constructor(props){
        super(props);
        this.state={value:''}
    }

    render(){
        return(
            <div className={s.toast}>
                <p className={s.title}>{this.props.over.title}</p>
                <p>
                    <input type='checkbox' />
                    {this.props.over.clear}
                </p>
                <input type='button' value={this.props.over.button} autoFocus='true'/>
            </div>
        );
    }
}

export default GameOver;