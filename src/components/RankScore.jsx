/**
 * rankScore component
 * 
 * Date 2017/2/8
 * Author Jason
 */

import React from 'react';

import {OrderList} from './ListOption.jsx';

const s={root:'aa',title:'xx'}
// div 
// --p titile
// --input text 
// --input button
// --input ScoresButton
// --title previsousHighScoreTitle
// --ol score list
//props.rank
class rankScore extends React.Component{
    constructor(props){
        super(props);
        this.state={
            value:'',
            rank:[],
            preRank:[]
        };
    }

    componentDidMount(){

    }

    componentDidUpdate(){

    }

    render(){
        return(
            <div className={s.root}>
                <p className={s.title}>{this.props.rank.title}</p>
                <p>Input your name : </p>
                <input type='text' autoFocus='true' />
                <input type='button' value={this.props.rank.add} disabled='true' />
                <input type='button' value={this.props.rank.new} />
                <p className={s.title} display='none'>{this.state.preRank}</p>
                <OrderList items={this.state.rank} />                 
            </div>
        );//this.props.rank.items
    }
}

export default rankScore;