import React, {PropTypes, Component} from 'react';
import Slider from 'wix-style-react/Slider';

class ControlledSlider extends Component {

  static propTypes = {
    value: PropTypes.arrayOf(PropTypes.number)
  }

  constructor({value}) {
    super();
    this.state = {value};
  }

  render() {
    const onChange = value => this.setState({value});
    return (
      <Slider {...this.props} value={this.state.value} onChange={onChange}/>
    );
  }

}

export default ControlledSlider;
