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

  const project = {
    name: 'sample project'
  }

  beforeEach(function(){
  })

  it('should render a user dropdown menu with a nickName', function() {
    const wrapper = shallow(<AuthenticatedHeader userInfo={userObject} project={project} />);
    expect(wrapper.find('a.userProfile').length).toBe(1);
    expect(wrapper.find('a.userProfile').text().startsWith(userObject.nickName)).toBe(true);
  })

  it('should render a user dropdown menu with the fullName if nickName is blank', function() {
    let noNickName = {
      token: 'blah',
      email: 'test@test.com',
      fullName: 'Ronnie Mitra',
      nickName: '',
      userId: 12
    }
    const wrapper = shallow(<AuthenticatedHeader userInfo={noNickName} project={project}/>);
    expect(wrapper.find('a.userProfile').length).toBe(1);
    expect(wrapper.find('a.userProfile').text().startsWith(noNickName.fullName)).toBe(true);
  })

  it('should render a logout menu item', function() {
    const wrapper = shallow(<AuthenticatedHeader userInfo={userObject} project={project}/>);
    let userProfileMenu = wrapper.find('ul[aria-labelledby="userProfileMenu"]');
    expect(userProfileMenu.length).toBe(1);
    expect(userProfileMenu.children('li#signout').length).toBe(1);
  })

  it('should logout the user when logout is selected', function() {
    const wrapper = shallow(<AuthenticatedHeader userInfo={userObject} project={project}/>);
    wrapper.instance().logout();
    // TODO: Make sure that the credentials are removed after a logout
  })


});
