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
import * as gv from '../../common/global.js';
const CANVAS_WIDTH=gv.canvas.width;
const CANVAS_HEIGHT=gv.canvas.height;
let progressRoot={
    position:'relative',
    width:CANVAS_WIDTH
    },
    progressTitle={
        font:'16px Arial'
    },

    progressButton={
        paddingTop:'50%',
        marginTop:'50%',
        padding:'20px',
        position:'absolute',
        left:'40%',
        top:CANVAS_WIDTH/2,
        width:'16%',
        height:CANVAS_HEIGHT/12,
        display:'block',
        backgroundColor:'white',
        margin:'0 auto',
        borderRadius:'20px',
        boxShadow :'1px 1px 5px #999'
    },
    progressInput={
        position:'absolute',
        width:'0',
        height:'0',
        marginLeft:'20%',
        marginTop:'20%',
        border:CANVAS_WIDTH/24+'px solid transparent',
        borderLeft: CANVAS_WIDTH/12+'px solid #00CC00',
        backgroundColor:'transparent',
        content:' '
    },
    progressDiv={
        paddingLeft:'60px',
        paddingTop:'45px'
    },
    progressMsg={
        display:'none',
        font:'15px Helvetica',
        paddingLeft:'20px',
        color:'blue'
    }

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
        progressMsg.display=this.props.loadMsgDisplay; //don't use this.props
        progressInput.display=this.props.display;
        return(
            <span style={progressButton}>
                <input type='button' value={this.props.progress.value} 
                                            style={progressInput}
                                            onClick={this.props.onClick}
                                             />
                <span style={progressMsg}>{this.props.progress.msg}</span>
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
        progressDiv.display=this.state.progressDivDisplay;
        progressRoot.display=this.state.loadingToastDisplay;
        progressTitle.display=this.state.loadingTitle;
        return(
            <div style={progressRoot}>
                <span style={progressTitle}>{this.props.progress.title}</span>
                <LoadButton progress={this.props.progress} 
                                    display={loadButtonDisplay}
                                    loadMsgDisplay={loadMsgDisplay}
                                    onClick={this.handlerClick}/>
                <div style={progressDiv}></div>
            </div>
        );
    }
}

export default progressBar;