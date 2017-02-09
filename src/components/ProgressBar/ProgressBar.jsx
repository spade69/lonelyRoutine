/**
 * ProgressBar component
 * 
 * Date 2017/2/8
 * Author Jason
 */
import React from 'react';
//import withStyles from 'isomorphic-style-loader/lib/withStyles';
import './Progress.scss';

const s={
    root:'Progress-root',
    title:'Progress-title',
    button:'Progress-button',
    progress:'Progress-Div',
    msg:'Progress-Msg'
};//should replace as .css
//div 
// -- title 
// -- start loading button
// --progress
// props.progress

function LoadButton(props){
    return(
        <span className={s.button}>
            <input type='button' value={props.progress.value} autoFocus='true'/>
            <span className={s.msg}>{props.progress.msg}</span>
        </span>
    );
}

class progressBar extends React.Component{
    constructor(props){
        super(props);
        this.state={value:'Loading Game...'};
        //this.props
    }
    render(){
        return(
            <div className={s.root}>
                <span className={s.title}>{this.props.progress.title}</span>
                <LoadButton progress={this.props.progress}/>
                <div className={s.progress}></div>
            </div>
        );
    }
}

export default progressBar;