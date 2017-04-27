import React from 'react';
import Landing from '../../src/js/modules/Landing.jsx';
import LoginService from '../../src/js/modules/login/LoginService.js'
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';
import Promise from 'bluebird';

describe('Landing page ', function() {

  xit('TODO: should call the loggedIn prop', function(done) {
    //TODO: Now that the registered function has been moved into the render block,
    // need to find a way to call it.  May need to simulate a click.
    
    let loggedIn = function() {
      done();
    }

    //let loginService = new LoginService();
    spyOn(LoginService, "login").and.callFake(function(email, password, rememberMe) {
       return new Promise( (resolve,reject)=> {
         resolve({
           userId: 2,
           fullName: 'first last',
           email: email,
           nickName: 'nickname'
         });
       })
    })

    const wrapper = shallow(<Landing loggedIn={loggedIn}/>);
    wrapper.instance().registered({
      email: 'first.last@email.com',
      password: 'password'
    })

  });
})
