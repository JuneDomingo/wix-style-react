import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import {createDriverFactory} from '../test-common';
import DropdownLayout from './DropdownLayout';
import dropdownLayoutDriverFactory from './DropdownLayout.driver';
import {dropdownLayoutTestkitFactory} from '../../testkit';
import {dropdownLayoutTestkitFactory as enzymeDropdownLayoutTestkitFactory} from '../../testkit/enzyme';
import {mount} from 'enzyme';

describe('DropdownLayout', () => {

  const createDriver = createDriverFactory(dropdownLayoutDriverFactory);
  const options = [
    {id: 0, value: 'Option 1'},
    {id: 1, value: 'Option 2'},
    {id: 2, value: 'Option 3', disabled: true},
    {id: 3, value: 'Option 4'},
    {id: 'divider1', value: '-'},
    {id: 'element1', value: <span style={{color: 'brown'}}>Option 4</span>}
  ];

  it('should have be invisible and drop down by default', () => {
    const driver = createDriver(<DropdownLayout options={options}/>);
    expect(driver.isShown()).toBeFalsy();
    expect(driver.isDown()).toBeTruthy();
  });

  it('should be visible and drop down', () => {
    const driver = createDriver(<DropdownLayout visible options={options}/>);
    expect(driver.isShown()).toBeTruthy();
    expect(driver.isDown()).toBeTruthy();
  });

  it('should have a default tab index', () => {
    const driver = createDriver(<DropdownLayout visible options={options}/>);
    expect(driver.tabIndex()).toBe(1);
  });

  it('should have an options', () => {
    const driver = createDriver(<DropdownLayout visible options={options}/>);
    expect(driver.optionsLength()).toBe(6);

    expect(driver.optionContentAt(0)).toBe('Option 1');
    expect(driver.isOptionADivider(4)).toBeTruthy();
    expect(driver.optionContentAt(5)).toBe('Option 4');
  });

  it('should not hover any option by default', () => {
    const driver = createDriver(<DropdownLayout visible options={options}/>);
    expect(options.map((option, index) => driver.isOptionHovered(index))).not.toContain(true);
  });

  it('should hover when mouse enter and unhover when mouse leave', () => {
    const driver = createDriver(<DropdownLayout visible options={options}/>);
    driver.mouseEnterAtOption(0);
    expect(driver.isOptionHovered(0)).toBeTruthy();
    driver.mouseLeaveAtOption(0);
    expect(driver.isOptionHovered(0)).toBeFalsy();
  });

  it('should not hover divider or a disabled item when mouse enter', () => {
    const driver = createDriver(<DropdownLayout visible options={options}/>);
    driver.mouseEnterAtOption(2);
    expect(driver.isOptionHovered(2)).toBeFalsy();
    driver.mouseLeaveAtOption(4);
    expect(driver.isOptionHovered(4)).toBeFalsy();
  });

  it('should have only one hovered option', () => {
    const driver = createDriver(<DropdownLayout visible options={options}/>);
    driver.mouseEnterAtOption(0);
    expect(driver.isOptionHovered(0)).toBeTruthy();
    driver.mouseEnterAtOption(1);
    expect(driver.isOptionHovered(0)).toBeFalsy();
    expect(driver.isOptionHovered(1)).toBeTruthy();
  });

  it('should hovered items cyclic and skipping divider or disabled items on down key', () => {
    const driver = createDriver(<DropdownLayout visible options={options}/>);
    driver.pressDownKey();
    driver.pressDownKey();
    expect(driver.isOptionHovered(1)).toBeTruthy();
    driver.pressDownKey();
    expect(driver.isOptionHovered(3)).toBeTruthy();
    driver.pressDownKey();
    expect(driver.isOptionHovered(5)).toBeTruthy();
    driver.pressDownKey();
    expect(driver.isOptionHovered(0)).toBeTruthy();
  });

  it('should hovered items cyclic and skipping divider or disabled on up key', () => {
    const driver = createDriver(<DropdownLayout visible options={options}/>);
    driver.pressUpKey();
    expect(driver.isOptionHovered(5)).toBeTruthy();
    driver.pressUpKey();
    expect(driver.isOptionHovered(3)).toBeTruthy();
    driver.pressUpKey();
    expect(driver.isOptionHovered(1)).toBeTruthy();
    driver.pressUpKey();
    expect(driver.isOptionHovered(0)).toBeTruthy();
  });

  it('should call onClose when esc key is pressed', () => {
    const onClose = jest.fn();
    const driver = createDriver(<DropdownLayout visible options={options} onClose={onClose}/>);
    driver.mouseEnterAtOption(0);
    driver.pressEscKey();
    expect(onClose).toBeCalled();
  });

  it('should call select when clicking on an option', () => {
    const onSelect = jest.fn();
    const driver = createDriver(<DropdownLayout visible options={options} onSelect={onSelect}/>);
    driver.clickAtOption(0);
    expect(onSelect).toBeCalledWith(options[0]);
    driver.clickAtOption(5);
    expect(onSelect).toBeCalledWith(options[5]);
  });

  it('should not call select when clicking on a selected option', () => {
    const onSelect = jest.fn();
    const driver = createDriver(<DropdownLayout visible options={options} onSelect={onSelect} selectedId={0}/>);
    driver.clickAtOption(0);
    expect(onSelect.mock.calls.length).toBe(0);
  });

  it('should call select when enter key is pressed', () => {
    const onSelect = jest.fn();
    const driver = createDriver(<DropdownLayout visible options={options} onSelect={onSelect}/>);
    driver.pressDownKey();
    driver.pressEnterKey();
    expect(onSelect).toBeCalled();
  });

  it('should call select when tab key is pressed', () => {
    const onSelect = jest.fn();
    const driver = createDriver(<DropdownLayout visible options={options} onSelect={onSelect}/>);
    driver.pressDownKey();
    driver.pressTabKey();
    expect(onSelect).toBeCalled();
  });

  it('should select the chosen value', () => {
    const selectedId = 0;
    const driver = createDriver(<DropdownLayout visible options={options} selectedId={selectedId}/>);
    expect(driver.isOptionSelected(0)).toBeTruthy();
  });

  it('should hover when mouse enter and unhover when mouse leave when overrideStyle is true', () => {
    const options = [
      {id: 0, value: 'Option 1', overrideStyle: true},
    ];

    const driver = createDriver(<DropdownLayout visible options={options}/>);

    driver.mouseEnterAtOption(0);
    expect(driver.isOptionHoveredWithGlobalClassName(0)).toBeTruthy();
    driver.mouseLeaveAtOption(0);
    expect(driver.isOptionHoveredWithGlobalClassName(0)).toBeFalsy();
  });

  it('should select the chosen value when overrideStyle is true', () => {
    const selectedId = 0;
    const options = [
      {id: 0, value: 'Option 1', overrideStyle: true},
    ];
    const driver = createDriver(<DropdownLayout visible options={options} selectedId={selectedId}/>);

    expect(driver.isOptionSelectedWithGlobalClassName(0)).toBeTruthy();
  });

  describe('testkit', () => {
    it('should exist', () => {
      const div = document.createElement('div');
      const dataHook = 'myDataHook';
      const wrapper = div.appendChild(ReactTestUtils.renderIntoDocument(<div><DropdownLayout dataHook={dataHook} options={options}/></div>));
      const dropdownLayoutTestkit = dropdownLayoutTestkitFactory({wrapper, dataHook});
      expect(dropdownLayoutTestkit.exists()).toBeTruthy();
      expect(dropdownLayoutTestkit.optionsLength()).toBe(6);
    });
  });

  describe('enzyme testkit', () => {
    it('should exist', () => {
      const dataHook = 'myDataHook';
      const wrapper = mount(<DropdownLayout dataHook={dataHook} options={options}/>);
      const dropdownLayoutTestkit = enzymeDropdownLayoutTestkitFactory({wrapper, dataHook});
      expect(dropdownLayoutTestkit.exists()).toBeTruthy();
      expect(dropdownLayoutTestkit.optionsLength()).toBe(6);
    });
  });

  describe('theme support', () => {
    it('should allow setting a custom theme', () => {
      const props = {dataHook: 'myDataHook', theme: 'material', options};
      const wrapper = mount(<DropdownLayout {...props}/>);
      const testkit = enzymeDropdownLayoutTestkitFactory({wrapper, dataHook: props.dataHook});
      expect(testkit.hasTheme('material')).toBe(true);
    });
  });

});
