import React from 'react';
import Header from '../../../src/js/modules/header/Header.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';

describe('Header Component', function() {

  beforeEach(function(){
  })

  it('should render a login button for guests', function() {
    const wrapper = shallow(<Header authenticated={false} />);
    expect(wrapper.find('button #login').length).toBe(1);
  })

  it('should not render a login button in authenticated mode', function() {
    const wrapper = shallow(<Header authenticated={true} />);
    expect(wrapper.find('button #login').length).toBe(0);
  })



});
