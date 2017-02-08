/**
 * List  & Options
 * 
 * Date 2017/1
 * Author Jason
 */
//React must be imorted! ReactDOM not 
//
import React from 'react';


function ListItem(props){
  return <li>{props.value}</li>;
}


function NumberList(props){
  const numbers=props.numbers;
  const listItems=numbers.map((number)=>
    <ListItem key={number.toString()} value={number} />
  );

  return (
    <ul>{listItems}</ul>
  );
}

function OrderList(props){
  const items=props.items;
  const listItems=items.map((item,index)=>
    <ListItem key={index} value={item} />
  );

  return (
    <ol>{listItems}</ol>
  );
}

function OptionItem(props){
  return <option>{props.value}</option>;
}

function Select(props){
  const items=props.items;
  const optionItems=items.map((item)=>
    <OptionItem key={item.toString()} value={item} />
  );

  return (
    <select>{optionItems}</select>
  );
}

export  {
  ListItem,
  NumberList,
  OrderList,
  OptionItem,
  Select
};


/*ReactDOM.render(
  <Select items={items} />,
  document.getElementById('root')
);
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
*/
