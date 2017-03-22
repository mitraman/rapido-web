import React from 'react';
import CreateNodeModal from '../src/js/CreateNodeComponent.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';

let loginForm = null;

describe('Create Node Modal Component', function() {

  beforeEach(function(){
  })

  it('should contain a single form with correct fields', function() {
    const wrapper = shallow(<CreateNodeModal />);
    const form = wrapper.find('form');
    expect(form.length).toBe(1);
    expect(form.find('#InputURL input').length).toBe(1);
    expect(form.find('#InputNodeType input').length).toBe(1);
    expect(form.find('#InputDescription input').length).toBe(1);
    expect(form.find('#InputMethods input').length).toBe(1);
  })

})
