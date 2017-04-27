import React from 'react';
import TypeAheadTextInput from '../../../src/js/modules/form/TypeAheadTextInput.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';

describe('TypeAheadTextInput Component', function() {

  it('should render a text input component with name and id', function() {
    const id = "myId";
    const name = "myName";
    const wrapper = shallow(<TypeAheadTextInput id={id} name={name}/>);
    expect(wrapper.find('input[type="text"]').length).toBe(1);
    let textInput = wrapper.find('input[type="text"]');
    expect(textInput.length).toBe(1);
    expect(textInput.props().id).toBe(id);
    expect(textInput.props().name).toBe(name);
  });

  // it('should render a typeahead list when a character is typed in the input field', function() {
  //   const typeAheadList = [
  //     "word1",
  //     "second word with spaces",
  //     "duplicateWord",
  //     "duplicateWord",
  //     "word-with$punctuation.",
  //     "word~with%ῈÖöØUnicode"
  //   ];
  //
  //   const wrapper = shallow(<TypeAheadTextInput id={id} name={name}/>);
  //   fail("to be implemented")
  //
  // })

  // describe('findMatches()', function() {
  //   it('should ')
  // })


});
