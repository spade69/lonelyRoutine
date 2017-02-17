/**
 * ProgressBar component
 * 
 * Date 2017/2/8
 * Author Jason
 */
import React from 'react';
//import withStyles from 'isomorphic-style-loader/lib/withStyles';
import './Progress.scss';
import * as MiniGame from '../../miniGame';
import Event from '../../lib/observer.js';

const s={
    root:'Progress-root',
    title:'Progress-title',
    button:'Progress-button',
    input:'Progress-input',
    arrow:'Progress-button:after',
    progress:'Progress-Div',
    msg:'Progress-Msg'
};//should replace as .css
//div 
// -- title 
// -- start loading button
// --progress
// props.progress

class LoadButton extends React.Component{
    constructor(props){
        super(props);
        //this.handlerClick=this.handleClick.bind(this);
    }

    render(){
        const MsgDisplay=this.props.loadMsgDisplay; //don't use this.props
        const display=this.props.display;
        return(
            <span className={s.button+' '+s.arrow}>
                <input type='button' value={this.props.progress.value} 
                                            style={{display:display}}
                                            onClick={this.props.onClick}
                                            className={s.input} />
                <span className={s.msg} style={{display:MsgDisplay}}>{this.props.progress.msg}</span>
            </span>
        );
    }
}

class progressBar extends React.Component{
    constructor(props){
        super(props);
        this.handlerClick=this.handlerClick.bind(this);
        this.onLoadScoreHandle=this.onLoadScoreHandle.bind(this);
        this.state={
            value:'Loading Game...',
            loadButtonDisplay:'inline-block',
            progressDivDisplay:'block',
            loadingToastDisplay:'block',
            loadMsgDisplay:'none',
            loadingTitle:'inline'
        };
        //this.props
    }

    handlerClick(e){ //passing the event object of React a synthetic event.
        //此处订阅了LoadScore这个消息，这个处理函数会在
        //稍后触发
        Event.listen('LoadScore',this.onLoadScoreHandle);
        //loadButtonHandler中触发！
         MiniGame.loadButtonHandler.call(this,e);
    }

    onLoadScoreHandle(){
        //此函数改变ScoreDisplay scoreText等states
        var newStateObj=MiniGame.loadScoreDisplayHandler();
        //setState 是异步的
        //传递state obj 给父组件的这个方法 ！并执行这个方法
        //这个方法就会更新state！  
        this.props.callbackParent(newStateObj);
    }



    render(){
        const loadButtonDisplay=this.state.loadButtonDisplay;
        const loadMsgDisplay=this.state.loadMsgDisplay;
        const progressDivDisplay=this.state.progressDivDisplay;
        const loadingToastDisplay=this.state.loadingToastDisplay;
        const loadingTitle=this.state.loadingTitle;
        return(
            <div className={s.root} style={{display:loadingToastDisplay}}>
                <span className={s.title} style={{display:loadingTitle}}>{this.props.progress.title}</span>
                <LoadButton progress={this.props.progress} 
                                    display={loadButtonDisplay}
                                    loadMsgDisplay={loadMsgDisplay}
                                    onClick={this.handlerClick}/>
                <div className={s.progress} 
                        style={{display:progressDivDisplay}}></div>
            </div>
        );
    }
}

export default progressBar;