import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import Input from './Input';
import styles from './Input.scss';
import $ from 'jquery';

const inputDriverFactory = ({component, wrapper}) => {
  const $component = $(component);
  const input = $component.find('input')[0];
  const clearButton = $(component).find(`.${styles.clearButton}`);

  return {
    trigger: (trigger, event) => ReactTestUtils.Simulate[trigger](input, event),
    focus: () => input.focus(),
    clickClear: () => ReactTestUtils.Simulate.click(clearButton[0]),
    enterText: text => ReactTestUtils.Simulate.change(input, {target: {value: text}}),
    getValue: () => input.value,
    getPlaceholder: () => input.placeholder,
    getDefaultValue: () => input.defaultValue,
    getTabIndex: () => input.tabIndex,
    getReadOnly: () => input.readOnly,
    hasPrefix: () => $component.find(`.${styles.prefix}`).length === 1,
    hasSuffix: () => $component.find(`.${styles.suffix}`).length === 1,
    prefixComponentExists: style => $component.find(`.${styles.prefix} ${style}`).length === 1,
    suffixComponentExists: style => $component.find(`.${styles.suffix} ${style}`).length === 1,
    hasExclamation: () => $component.find(`.${styles.exclamation}`).length === 1,
    hasError: () => component.classList.contains(styles.hasError),
    getUnit: () => $component.find(`.${styles.unit}`)[0].textContent,
    hasMagnifyingGlass: () => $component.find(`.${styles.magnifyingGlass}`).length === 1,
    hasMenuArrow: () => $component.find(`.${styles.menuArrow}`).length === 1,
    hasClearButton: () => clearButton.length > 0,
    isRTL: () => component.className.indexOf(styles.rtl) >= 0,
    isFocusedStyle: () => component.classList.contains(styles.hasFocus),
    isHoveredStyle: () => component.classList.contains(styles.hasHover),
    isOfStyle: style => component.classList.contains(styles[`theme-${style}`]),
    isOfSize: size => component.classList.contains(styles[`size-${size}`]),
    isFocus: () => document.activeElement === input,
    exists: () => $component.find('input').length > 0,
    hasIconLeft: () => !$component.find(`.${styles.prefix}`).is(':empty'),
    setProps: props => {
      ReactDOM.render(<div ref={r => component = r}><Input {...props}/></div>, wrapper);
    }
  };
};

export default inputDriverFactory;
