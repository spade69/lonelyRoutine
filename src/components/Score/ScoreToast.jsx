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
import Event from '../../lib/observer.js';
import * as gv from '../../common/global.js';
//only div
const CANVAS_WIDTH=gv.canvas.width;
const CANVAS_HEIGHT=gv.canvas.height;
const s={toast:'toast',scoreToast:'scoreToast'};
let styleObj={
    width:'30px',
    height:'30px',
    padding:'15px',
    borderRadius:'120px',
    borderLeft:'1px solid black',
    background:'',
    position:'absolute',
    left:'',
    top:'100px'
},
hrObj={
   width:'1px',
   height:'100px',
   position:'absolute',
   top:0,
   left:''
}

function LineBall(props){
    styleObj.background=props.obj.color;
    styleObj.left=props.obj.left+'px';
    hrObj.left=parseInt(props.obj.left)+30+'px';//?
   // console.log('props here'+props.value);
    return(
        <div>
            <hr style={hrObj}></hr>
            <div style={styleObj}></div>
        </div>
    );
}


function BallList(props){
    const arrObj=props.arrObj;
    //console.log(colors);
    const listItems=arrObj.map((item,index)=>
        //styleObj.background=color;
        <LineBall key={index} obj={item}/>
    );
    
    return (
        <div>{listItems}</div>
    );
}

class ScoreToast extends React.Component{
    constructor(props){
        super(props);
        this.state={
            value:'',
            arrObj:[] //{color:'red',left:'300'}
        };
    }

    componentDidMount(){
        //suitable to set listen
        Event.listen('updateLineBallObj',(realMyObj)=>{
            this.setState({
                arrObj:realMyObj
            });
            //console.log(realMyObj);
        });
    }

    componentDidUpdate(){

    }

    render(){
        const scoreText=this.props.scoreText;
        const scoreDisplay=this.props.scoreDisplay;
        const arrObj=this.state.arrObj;
        //let cssObj={display:scoreDisplay,:scoreText}
        return(
            <div className={s.toast+' '+s.scoreToast} 
                    style={{display:scoreDisplay}}>
            {scoreText}
            <BallList arrObj={arrObj}/>
            </div>
            
        );
    }
}

export default ScoreToast;