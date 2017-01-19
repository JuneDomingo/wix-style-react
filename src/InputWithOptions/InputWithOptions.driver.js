import React from 'react';
import InputWithOptions from './InputWithOptions';
import ReactTestUtils from 'react-addons-test-utils';
import inputDriverFactory from '../Input/Input.driver';
import dropdownLayoutDriverFactory from '../DropdownLayout/DropdownLayout.driver';
import ReactDOM from 'react-dom';

const inputWithOptionsDriverFactory = ({component, wrapper}) => {

  const inputWrapper = component.childNodes[0];
  const inputDriver = inputDriverFactory({component: inputWrapper.childNodes[0], wrapper: inputWrapper});
  const dropdownLayoutDriver = dropdownLayoutDriverFactory({component: component.childNodes[1].childNodes[0], wrapper});

  const driver = {
    exists: () => !!component,
    inputWrapper: () => inputWrapper,
    focus: () => ReactTestUtils.Simulate.focus(inputWrapper),
    blur: () => dropdownLayoutDriver.mouseClickOutside(),
    pressDownKey: () => ReactTestUtils.Simulate.keyDown(inputWrapper, {key: 'ArrowDown'}),
    pressUpKey: () => ReactTestUtils.Simulate.keyDown(inputWrapper, {key: 'ArrowUp'}),
    pressAnyKey: () => ReactTestUtils.Simulate.keyDown(inputWrapper, {key: 'Any'}),
    pressEnterKey: () => ReactTestUtils.Simulate.keyDown(inputWrapper, {key: 'Enter'}),
    pressEscKey: () => ReactTestUtils.Simulate.keyDown(inputWrapper, {key: 'Escape'}),
    setProps: props => {
      ReactDOM.render(<div ref={r => component = r}><InputWithOptions {...props}/></div>, wrapper);
    }
  };
  return {driver, inputDriver, dropdownLayoutDriver};
};

export default inputWithOptionsDriverFactory;
