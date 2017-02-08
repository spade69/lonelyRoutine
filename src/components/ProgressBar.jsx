/**
 * ProgressBar component
 * 
 * Date 2017/2/8
 * Author Jason
 */
import React from 'react';


const s={root:'ss',title:'xxx'};//should replace as .css
//div 
// -- title 
// -- start loading button
// --progress
// props.progress

function LoadButton(props){
    return(
        <span>
            <input type='button' value={props.progress.value} autoFocus='true'/>
            <span>{props.progress.msg}</span>
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
                <div></div>
            </div>
        );
    }
}

export default progressBar;