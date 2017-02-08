/*
 *option compoent
  select compoent
* */
import React from 'react';
import ReactDOM from 'react-dom';

//因为要在Select中根据items的个数来循环渲染这个option，
//所以每一个option单独写成一个函数了, 列表和下拉框有这个必要
//其他不太必要
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

class FlavorForm extends React.Component{
  constructor(props){
    super(props);
    this.state={value:'coconut'};

    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
  }

  handleChange(event){
    this.setState({value:event.target.value});
  }

  handleSubmit(event){
    alert('Your favorite flavor is : '+this.state.value);
    event.preventDefault();
  }

  render(){
    return(
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite
          <Select items={items} />
        </label>
        {props.Guide}
        <input type='checkbox'checked />
        <input type='button' value='Erase all' />
        <input type="submit" value="Submit"/>
      </form>
    );
  }
}
/*
ReactDOM.render(
<FlavorForm /> ,
document.getElementById('root')
);*/

export {FlavorForm,Select};

