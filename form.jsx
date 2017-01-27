/*
 *option compoent
  select compoent
* */
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

ReactDOM.render(
<FlavorForm /> ,
document.getElementById('root')
);


