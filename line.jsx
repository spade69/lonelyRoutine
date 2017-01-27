
//

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

const items=['red','green','blue','orange','cornflowerblue'];
const numbers=[1,2,3,4,5];
ReactDOM.render(
  <Select items={items} />,
  document.getElementById('root')
);
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
