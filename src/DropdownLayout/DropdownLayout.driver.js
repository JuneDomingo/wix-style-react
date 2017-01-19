import React from 'react';
import DropdownLayout from '../DropdownLayout';
import ReactTestUtils from 'react-addons-test-utils';
import ReactDOM from 'react-dom';
import find from 'lodash.find';

const dropdownLayoutDriverFactory = ({component, wrapper}) => {

  const isClassExists = (component, className) => !!(component.className.match(new RegExp('\\b' + className + '\\b')));
  const contentContainer = component.childNodes[0];
  const options = component.querySelector('[data-hook=dropdown-layout-options]');
  const optionAt = position => (options.childNodes[position]);

  return {
    exists: () => !!component,
    isShown: () => isClassExists(contentContainer, 'shown'),
    isDown: () => isClassExists(contentContainer, 'down'),
    isUp: () => isClassExists(contentContainer, 'up'),
    hasTheme: theme => isClassExists(contentContainer, theme),
    tabIndex: () => component.tabIndex,
    optionsLength: () => options.childNodes.length,
    mouseEnterAtOption: position => ReactTestUtils.Simulate.mouseEnter(optionAt(position)),
    mouseLeaveAtOption: position => ReactTestUtils.Simulate.mouseLeave(optionAt(position)),
    mouseClickOutside: () => ReactTestUtils.Simulate.blur(contentContainer),
    isOptionExists: optionText => !!find(options.childNodes, opt => opt.textContent === optionText),
    isOptionHovered: position => isClassExists(optionAt(position), 'hovered'),
    isOptionSelected: position => isClassExists(optionAt(position), 'selected'),
    isOptionHoveredWithGlobalClassName: position => isClassExists(optionAt(position), 'wixstylereactHovered'),
    isOptionSelectedWithGlobalClassName: position => isClassExists(optionAt(position), 'wixstylereactSelected'),
    classes: () => options.className,
    pressDownKey: () => ReactTestUtils.Simulate.keyDown(component, {key: 'ArrowDown'}),
    pressUpKey: () => ReactTestUtils.Simulate.keyDown(component, {key: 'ArrowUp'}),
    pressEnterKey: () => ReactTestUtils.Simulate.keyDown(component, {key: 'Enter'}),
    pressTabKey: () => ReactTestUtils.Simulate.keyDown(component, {key: 'Tab'}),
    pressEscKey: () => ReactTestUtils.Simulate.keyDown(component, {key: 'Escape'}),
    optionContentAt: position => optionAt(position).textContent,
    clickAtOption: position => ReactTestUtils.Simulate.click(optionAt(position)),
    isOptionADivider: position => isClassExists(optionAt(position), 'divider'),
    setProps: props => {
      ReactDOM.render(<div ref={r => component = r}><DropdownLayout {...props}/></div>, wrapper);
    }
  };
};

export default dropdownLayoutDriverFactory;
