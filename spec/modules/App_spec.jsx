import React from 'react';
import App from '../../src/js/modules/App.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';

// Needed to support React-Router context requireents for Link and Route elements
const mountWithRouter = node => mount(<Router>{node}</Router>);

describe('Root App Component', function() {

  var store = {};

  beforeEach(function(){
    // LocalStorage mock for token.
    spyOn(localStorage, 'getItem').and.callFake(function(key) {
        //let value = store[key] ? store[key] : null;
        //return value;
        return store[key];
    });
  })

  it('should render a guest landing page if there is no auth token', function() {
    store.userInfo = null;
    const wrapper = mountWithRouter(<App/>);
    expect(wrapper.find('div #landing').length).toBe(1);
  })

  it('should render an authenticated body if there is a valid auth token', function() {
    store.userInfo = '{"userid": "14"}';
    const wrapper = shallow(<App/>);
    expect(wrapper.find('div #app-body').length).toBe(1);
  })

  it( 'should render a guest landing page if the auth token does not contain a user id', function() {
    store.userInfo = '{"_missing_userid": "143"}';
    const wrapper = mountWithRouter(<App/>);
    expect(wrapper.find('div #landing').length).toBe(1);
  })

});
