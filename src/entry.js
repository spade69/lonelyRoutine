import React from 'react';
import ReactDOM from 'react-dom';
import {
  ListItem,
  NumberList,
  OptionItem,
  Select
} from './components/line.jsx';

//var line=require('../js/line.js');
import * as line from './common/axis.js';
import * as arc from './common/arc.js';
import * as bezier from './common/bezier';
import * as text from './common/text';

var canvas=document.getElementById('canvas'),
    context=canvas.getContext('2d');
   

line.drawDemo();
//arc.drawDemo();
bezier.drawDemo();
text.drawDemo();

const items=['red','green','blue','orange','cornflowerblue'];
const numbers=[1,2,3,4,5];



ReactDOM.render(
  <Select items={items} />,
  document.getElementById('root')
);