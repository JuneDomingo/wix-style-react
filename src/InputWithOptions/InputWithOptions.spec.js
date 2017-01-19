import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import inputWithOptionsDriverFactory from './InputWithOptions.driver';
import InputWithOptions from './InputWithOptions';
import {createDriverFactory} from '../test-common';
import {inputWithOptionsTestkitFactory} from '../../testkit';
import {inputWithOptionsTestkitFactory as enzymeInputWithOptionsTestkitFactory} from '../../testkit/enzyme';
import {mount} from 'enzyme';

const runInputWithOptionsTest = driverFactory => {
  describe('InputWithOptions', () => {

    const createDriver = createDriverFactory(driverFactory);
    const options = [
      {id: 0, value: 'Option 1'},
      {id: 1, value: 'Option 2'},
      {id: 2, value: 'Option 3', disabled: true},
      {id: 3, value: 'Option 4'},
      {id: 'divider1', value: '-'},
      {id: 'element1', value: <span style={{color: 'brown'}}>Option 4</span>}
    ];

    it('should show dropdown when autofocus is on', () => {
      const {inputDriver, dropdownLayoutDriver} = createDriver(<InputWithOptions options={options} autoFocus={true}/>);
      expect(inputDriver.isFocus()).toBeTruthy();
      expect(dropdownLayoutDriver.isShown()).toBeTruthy();
    });

    it('should have an Input and an hidden DropdownLayout', () => {
      const {inputDriver, dropdownLayoutDriver} = createDriver(<InputWithOptions options={options}/>);
      expect(inputDriver.exists()).toBeTruthy();
      expect(dropdownLayoutDriver.exists()).toBeTruthy();
      expect(dropdownLayoutDriver.isShown()).toBeFalsy();
    });

    it('should show DropdownLayout when input get focused', () => {
      const {driver, dropdownLayoutDriver} = createDriver(<InputWithOptions options={options}/>);
      driver.focus();
      expect(dropdownLayoutDriver.isShown()).toBeTruthy();
    });

    it('should show DropdownLayout on any key press', () => {
      const {driver, dropdownLayoutDriver} = createDriver(<InputWithOptions options={options}/>);
      driver.pressAnyKey();
      expect(dropdownLayoutDriver.isShown()).toBeTruthy();
    });

    it('should show DropdownLayout on down key', () => {
      const {driver, dropdownLayoutDriver} = createDriver(<InputWithOptions options={options}/>);
      driver.pressUpKey();
      expect(dropdownLayoutDriver.isShown()).toBeTruthy();
    });

    it('should show DropdownLayout on up key', () => {
      const {driver, dropdownLayoutDriver} = createDriver(<InputWithOptions options={options}/>);
      driver.pressDownKey();
      expect(dropdownLayoutDriver.isShown()).toBeTruthy();
    });

    it('should hide DropdownLayout on enter and esc key press', () => {
      const {driver, dropdownLayoutDriver} = createDriver(<InputWithOptions options={options}/>);
      driver.focus();
      expect(dropdownLayoutDriver.isShown()).toBeTruthy();
      driver.pressEnterKey();
      expect(dropdownLayoutDriver.isShown()).toBeFalsy();
      driver.pressUpKey();
      expect(dropdownLayoutDriver.isShown()).toBeTruthy();
      driver.pressEscKey();
      expect(dropdownLayoutDriver.isShown()).toBeFalsy();
    });

    it('should call onManuallyInput on enter key press', () => {
      const onManuallyInput = jest.fn();
      const {driver, inputDriver} = createDriver(<InputWithOptions options={options} onManuallyInput={onManuallyInput}/>);
      inputDriver.enterText('my text');
      driver.pressEnterKey();
      expect(onManuallyInput).toBeCalledWith('my text');
    });

    it('should hide options on selection by default', () => {
      const {driver, dropdownLayoutDriver} = createDriver(<InputWithOptions options={options}/>);
      driver.focus();
      dropdownLayoutDriver.clickAtOption(0);
      expect(dropdownLayoutDriver.isShown()).toBeFalsy();
    });

    it('should not hide options on selection', () => {
      const {driver, dropdownLayoutDriver} = createDriver(<InputWithOptions options={options} closeOnSelect={false}/>);
      driver.focus();
      dropdownLayoutDriver.clickAtOption(0);
      expect(dropdownLayoutDriver.isShown()).toBeTruthy();
    });

    it('should call onSelect when an option is pressed', () => {
      const onSelect = jest.fn();
      const {driver, dropdownLayoutDriver} = createDriver(<InputWithOptions options={options} onSelect={onSelect}/>);
      driver.focus();
      dropdownLayoutDriver.clickAtOption(0);
      expect(onSelect).toBeCalledWith({id: 0, value: 'Option 1'});
    });

    it('should call onFocus', () => {
      const onFocus = jest.fn();
      const {driver} = createDriver(<InputWithOptions options={options} onFocus={onFocus}/>);
      driver.focus();
      expect(onFocus).toBeCalled();
    });

    describe('testkit', () => {
      it('should exist', () => {
        const div = document.createElement('div');
        const dataHook = 'myDataHook';
        const wrapper = div.appendChild(ReactTestUtils.renderIntoDocument(<div><InputWithOptions dataHook={dataHook}/></div>));
        const inputWithOptionsTestkit = inputWithOptionsTestkitFactory({wrapper, dataHook});
        expect(inputWithOptionsTestkit.driver.exists()).toBeTruthy();
        expect(inputWithOptionsTestkit.inputDriver.exists()).toBeTruthy();
        expect(inputWithOptionsTestkit.dropdownLayoutDriver.exists()).toBeTruthy();
      });
    });

    describe('enzyme testkit', () => {
      it('should exist', () => {
        const dataHook = 'myDataHook';
        const wrapper = mount(<InputWithOptions dataHook={dataHook}/>);
        const inputWithOptionsTestkit = enzymeInputWithOptionsTestkitFactory({wrapper, dataHook});
        expect(inputWithOptionsTestkit.driver.exists()).toBeTruthy();
        expect(inputWithOptionsTestkit.inputDriver.exists()).toBeTruthy();
        expect(inputWithOptionsTestkit.dropdownLayoutDriver.exists()).toBeTruthy();
      });
    });

    describe('appearance', () => {
      it('should be possible to specify the theme of underlying elements', () => {
        const props = {theme: 'material', dataHook: 'myDataHook'};
        const wrapper = mount(<InputWithOptions {...props}/>);
        const testkit = enzymeInputWithOptionsTestkitFactory({wrapper, dataHook: props.dataHook});
        expect(testkit.inputDriver.isOfStyle(props.theme)).toBe(true);
        expect(testkit.dropdownLayoutDriver.hasTheme(props.theme)).toBe(true);
      });
    });

  });
};

runInputWithOptionsTest(inputWithOptionsDriverFactory);

export {runInputWithOptionsTest};
