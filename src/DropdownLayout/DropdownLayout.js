import styles from './DropdownLayout.scss';
import React from 'react';
import classNames from 'classnames';
import WixComponent from '../WixComponent';
import isEqual from 'lodash.isequal';
import isobject from 'lodash.isobject';
import trim from 'lodash.trim';
import isstring from 'lodash.isstring';
import has from 'lodash.has';

const modulu = (n, m) => {
  const remain = n % m;
  return remain >= 0 ? remain : remain + m;
};

const NOT_HOVERED_INDEX = -1;

class DropdownLayout extends WixComponent {

  constructor(props) {
    super(props);

    this.state = {
      hovered: NOT_HOVERED_INDEX,
    };

    this._onSelect = this._onSelect.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onMouseEnter = this._onMouseEnter.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onClose = this._onClose.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
  }

  isLegalOption(option) {
    return isobject(option) && has(option, 'id') && trim(option.id).length > 0 &&
        has(option, 'value') && (React.isValidElement(option.value) || (isstring(option.value) && trim(option.value).length > 0));
  }

  onClickOutside() {
    const {visible, onClickOutside} = this.props;
    if (visible && onClickOutside) {
      onClickOutside();
    }
  }

  _onSelect(index) {
    const {options, onSelect, selectedId} = this.props;
    if (index >= 0 && index < options.length) {
      const newSelectedId = options[index].id;
      if (newSelectedId !== selectedId && onSelect) {
        onSelect(options[index]);
        return true;
      }
    }
    return false;
  }

  _onMouseEnter(index) {
    if (this.isSelectableOption(this.props.options[index])) {
      this.setState({hovered: index});
    }
  }

  _onMouseLeave() {
    this.setState({
      hovered: NOT_HOVERED_INDEX
    });
  }

  hoverNextStep(step) {
    const {options} = this.props;

    if (!options.some(this.isSelectableOption)) {
      return;
    }

    let newHovered = this.state.hovered;
    do {
      newHovered = Math.abs(modulu(Math.max(newHovered + step, -1), options.length));
    } while (!this.isSelectableOption(options[newHovered]));

    this.setState({hovered: newHovered});
    this.options.scrollTop = (newHovered - 2) * parseInt(styles.option_height);
  }

  _onKeyDown(event) {
    if (!this.props.visible) {
      return false;
    }

    switch (event.key) {
      case 'ArrowDown': {
        this.hoverNextStep(1);
        break;
      }

      case 'ArrowUp': {
        this.hoverNextStep(-1);
        break;
      }

      case 'Enter': {
        if (!this._onSelect(this.state.hovered)) {
          return false;
        }
        break;
      }

      case 'Tab': {
        this._onSelect(this.state.hovered);
        return true;
      }

      case 'Escape': {
        this._onClose();
        break;
      }

      default: {
        return false;
      }
    }

    event.preventDefault();
    event.stopPropagation();
    return true;
  }

  _onClose() {
    this.setState({
      hovered: NOT_HOVERED_INDEX,
    });

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  renderNode(node) {
    return node ? <div className={styles.node}>{node}</div> : null;
  }

  render() {
    const {options, visible, dropDirectionUp, selectedId, tabIndex, fixedHeader, fixedFooter} = this.props;

    const contentContainerClassName = classNames({
      [styles.contentContainer]: true,
      [styles.shown]: visible,
      [styles.up]: dropDirectionUp,
      [styles.down]: !dropDirectionUp
    }, styles[this.props.theme]);

    return (
      <div tabIndex={tabIndex} className={styles.wrapper} onKeyDown={this._onKeyDown}>
        <div className={contentContainerClassName}>
          {this.renderNode(fixedHeader)}
          <div className={styles.options} ref={options => this.options = options}>
            {options.map((option, idx) => (
              option.value === '-' ?
                (this.renderDivider(idx)) :
                (this.renderItem({
                  option,
                  idx,
                  selected: option.id === selectedId,
                  hovered: idx === this.state.hovered,
                  disabled: option.disabled,
                  overrideStyle: option.overrideStyle
                }))
            ))}
          </div>
          {this.renderNode(fixedFooter)}
        </div>
      </div>
    );
  }

  renderDivider(idx) {
    return (<div key={idx} className={styles.divider}/>);
  }

  renderItem({option, idx, selected, hovered, disabled, overrideStyle}) {
    const optionClassName = classNames({
      [styles.option]: !overrideStyle,
      [styles.selected]: selected && !overrideStyle,
      wixstylereactSelected: selected && overrideStyle, //global class for items that use the overrideStyle
      [styles.hovered]: hovered && !overrideStyle,
      wixstylereactHovered: hovered && overrideStyle, //global class for items that use the overrideStyle
      [styles.disabled]: disabled,
    });
    return (
      <div
        className={optionClassName}
        onClick={!disabled ? () => this._onSelect(idx) : null}
        key={idx}
        onMouseEnter={() => this._onMouseEnter(idx)}
        onMouseLeave={this._onMouseLeave}
        >
        {option.value}
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      this.setState({hovered: NOT_HOVERED_INDEX});
    }

    if (!isEqual(this.props.options, nextProps.options)) {
      if (nextProps.options.some(option => (!this.isLegalOption(option)))) {
        throw new Error('InputWithOptions: Invalid option provided');
      }

      if (this.state.hovered !== NOT_HOVERED_INDEX) {
        this.setState({
          hovered: nextProps.options.findIndex(item => item.id === this.props.options[this.state.hovered].id)
        });
      }
    }
  }

  isSelectableOption(option) {
    return option.value !== '-' && !option.disabled;
  }
}

DropdownLayout.propTypes = {
  dropDirectionUp: React.PropTypes.bool,
  onClose: React.PropTypes.func,
  onSelect: React.PropTypes.func,
  visible: React.PropTypes.bool,
  options: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]).isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.node,
      React.PropTypes.string
    ]).isRequired,
    disabled: React.PropTypes.bool,
    overrideStyle: React.PropTypes.bool
  })),
  selectedId: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  tabIndex: React.PropTypes.number,
  theme: React.PropTypes.string,
  onClickOutside: React.PropTypes.func,
  fixedHeader: React.PropTypes.node,
  fixedFooter: React.PropTypes.node
};

DropdownLayout.defaultProps = {
  options: [],
  tabIndex: 1,
  selectedId: NOT_HOVERED_INDEX
};

DropdownLayout.NONE_SELECTED_ID = NOT_HOVERED_INDEX;

export default DropdownLayout;
