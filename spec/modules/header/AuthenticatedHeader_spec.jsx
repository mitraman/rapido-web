import React from 'react';
import AuthenticatedHeader from '../../../src/js/modules/header/AuthenticatedHeader.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';

describe('Header Component', function() {

  beforeEach(function(){
  })

  it('should render navigation buttons if the showNavButtons property is true ', function() {
    const wrapper = shallow(<AuthenticatedHeader showNavButtons={true} />);
    expect(wrapper.find('div.navigationButtons').length).toBe(1);
  })

  it('should not render navigation buttons if the showNavButtons property is false', function() {
    const wrapper = shallow(<AuthenticatedHeader showNavButtons={false} />);
    expect(wrapper.find('div.navigationButtons').length).toBe(0);
  })

  it('should render a user dropdown menu', function() {
    let userObject = {
      token: 'blah',
      email: 'test@test.com',
      name: 'Ronnie Mitra',
      userId: 12
    }
    const wrapper = shallow(<AuthenticatedHeader userInfo={userObject} showNavButtons={true} />);
    expect(wrapper.find('div.userProfile').length).toBe(1);
  })

});
