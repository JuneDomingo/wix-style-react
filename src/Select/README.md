# Select component

## Properties

| propName | propType | defaultValue | isRequired | description |
|----------|----------|--------------|------------|-------------|
| options | array | - | - | Array of objects containing a value and a text. If text is '-', a divider will render at that position. Text should normally be just a text, but the system supports React elements as well |
| onChange | func | - | - | Callback function called whenever the user selects a different value in the list |
| dropDirectionUp | bool | false | - | Whether the component opens up or down |
| placeHolder | string | - | - | shown when no option is selected |

## Usage

```js
import Select from 'wix-style-react/Select';

const options = [
  {value: 0, text: 'Option 1'},
  {value: 1, text: 'Option 2'},
  {value: 2, text: 'Option 3'},
  {value: 3, text: 'Option 4'},
  {value: null, text: '-'},
  {value: 4, text: 'Divider example above'}
];

class ControlledSelect extends Component {
  static propTypes = {
    value: PropTypes.string
  };

  constructor({value}) {
    super();
    this.state = {value};
  }

  render() {
    const onChange = value => this.setState({value});

    return (
      <Select {...this.props} options={options} value={this.state.value} onChange={onChange}/>
    );
  }
}