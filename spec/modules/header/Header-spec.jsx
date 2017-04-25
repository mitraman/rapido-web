import React from 'react';
import Header from '../../../src/js/modules/header/Header.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';

describe('Header Component', function() {

  beforeEach(function(){
  })

  it('should render a login button for guests', function() {
    const wrapper = shallow(<Header />);
    expect(wrapper.find('button #login').length).toBe(1);
  })

});
