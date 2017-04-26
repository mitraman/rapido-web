import React from 'react';
import AuthenticatedHeader from '../../../src/js/modules/header/AuthenticatedHeader.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';

describe('Header Component', function() {

  const userObject = {
    token: 'blah',
    email: 'test@test.com',
    fullName: 'Ronnie Mitra',
    nickName: 'nickName',
    userId: 12
  }

  beforeEach(function(){
  })

  it('should render navigation buttons if the showNavButtons property is true ', function() {
    const wrapper = shallow(<AuthenticatedHeader showNavButtons={true} userInfo={userObject}/>);
    expect(wrapper.find('div.navigationButtons').length).toBe(1);
  })

  it('should not render navigation buttons if the showNavButtons property is false', function() {
    const wrapper = shallow(<AuthenticatedHeader showNavButtons={false} userInfo={userObject}/>);
    expect(wrapper.find('div.navigationButtons').length).toBe(0);
  })

  it('should render a user dropdown menu with a nickName', function() {
    const wrapper = shallow(<AuthenticatedHeader userInfo={userObject} showNavButtons={true}/>);
    expect(wrapper.find('div.userProfile').length).toBe(1);
    expect(wrapper.find('div.userProfile').text()).toBe(userObject.nickName);
  })

  it('should render a user dropdown menu with the fullName if nickName is blank', function() {
    let noNickName = {
      token: 'blah',
      email: 'test@test.com',
      fullName: 'Ronnie Mitra',
      nickName: '',
      userId: 12
    }
    const wrapper = shallow(<AuthenticatedHeader userInfo={noNickName} showNavButtons={true}/>);
    expect(wrapper.find('div.userProfile').length).toBe(1);
    expect(wrapper.find('div.userProfile').text()).toBe(noNickName.fullName);
  })

  it('should render a logout menu item', function() {
    const wrapper = shallow(<AuthenticatedHeader userInfo={userObject} showNavButtons={true}/>);
    let userProfileMenu = wrapper.find('ul[aria-labelledby="userProfileMenu"]');
    expect(userProfileMenu.length).toBe(1);
    expect(userProfileMenu.children('li#signout').length).toBe(1);
  })


});
