/**
 * Audio component
 * 
 * Date 2017/2/8
 * Author Jason
 */
//React must be imorted! ReactDOM not 
import React from 'react';

//props.audio 

function SourceItem(props){
    return (<source src={props.audio.url} 
                        type={props.audio.type}>{props.value}</source>);
}

function Audio(props){
    const items=props.items;
    const infos=props.audioInfo;
    //do not recommend the using index, because 
    //the lists mey be resort,
    const sourceItems=infos.map((item,index)=>
        <SourceItem key={index} audio={item} />
    );

    return (
        <audio preload='auto'>{sourceItems}</audio> 
    );
} 

export default Audio;
