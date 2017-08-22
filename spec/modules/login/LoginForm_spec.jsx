import React from 'react';
import LoginForm from '../../../src/js/modules/login/LoginForm.jsx';
import Backend from '../../../src/js/adapter/Backend.js';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';
import Promise from 'bluebird';


function createSimulatedElement(name, value, validState) {

  return {
    target: {
      name: name,
      value: value,
      classList: { add: function(className) {} },
      validity: validState
    },
    setCustomValidity: function(customState) { this.target.validity.customError = true; }
  };

}

describe('LoginForm Component', function() {

  // A mock alert box
  const reactAlertMsg = {
    error: function(message, callback) {}
  }

  beforeEach(function() {
  });

  it('should render a login form', function() {
    const wrapper = shallow(<LoginForm/>);
    expect(wrapper.find('form #login-form').length).toBe(1);
  })

  it('should render an email field in a login form', function() {
    const wrapper = shallow(<LoginForm/>);
    expect(wrapper.find('input[name="email"]').length).toBe(1);
  })

  it('should render a password field in a login form', function() {
    const wrapper = shallow(<LoginForm/>);
    expect(wrapper.find('input[name="password"]').length).toBe(1);
  })

  it( 'should render a remember me checkbox', function() {
    const wrapper = shallow(<LoginForm/>);
    expect(wrapper.find('input[name="rememberMe"][type="checkbox"]').length).toBe(1);
  })

  it( 'should render a forgotten password link', function() {
    const wrapper = shallow(<LoginForm/>);
    expect(wrapper.find('a #forgotPassword').length).toBe(1);
  })

  it('should render a submit button', function() {
    const wrapper = mount(<LoginForm/>);
    expect(wrapper.find('button #login-button').length).toBe(1);
  })

  // TODO: Error reporting for login modal
  xit('should reject an attempt to login before filling out form', function() {

    let loginSucceeded = jasmine.createSpy('loginSucceeded');
    spyOn(LoginForm.prototype, "showAlert").and.callThrough()

    const wrapper = mount(<LoginForm alertMsg={reactAlertMsg} loginSucceeded={loginSucceeded}/>);
    wrapper.find('button #login-button').get(0).click();

    expect(LoginForm.prototype.showAlert).toHaveBeenCalledWith('Please fill out login form fields');
    expect(loginSucceeded).not.toHaveBeenCalled();

  })

  xit('should reject an attempt to login with a missing email address', function() {

    spyOn(LoginForm.prototype, "showAlert").and.callThrough()
    let loginSucceeded = jasmine.createSpy('loginSucceeded');

    const wrapper = mount(<LoginForm alertMsg={reactAlertMsg} loginSucceeded={loginSucceeded}/>);

    // Try resetting the state of LoginForm
    wrapper.setState({formStarted: false});

    const emailInputField = wrapper.find('input[name="email"]');
    let simulatedEmailElement = createSimulatedElement('email', 'email value', { valueMissing: true});
    emailInputField.simulate('change',  simulatedEmailElement);

    const passwordInputField = wrapper.find('input[name="password"]');
    let passwordEmailElement = createSimulatedElement('password', 'some1password!', { valid: true});
    passwordInputField.simulate('change',  passwordEmailElement);

    wrapper.find('button #login-button').get(0).click();

    expect(LoginForm.prototype.showAlert).toHaveBeenCalledWith('Please enter your email address');
    expect(loginSucceeded).not.toHaveBeenCalled();
  })

  xit('should reject an attempt to login with a missing password', function() {

    let loginSucceeded = jasmine.createSpy('loginSucceeded');
    spyOn(LoginForm.prototype, "showAlert").and.callThrough();

    const wrapper = mount(<LoginForm alertMsg={reactAlertMsg} loginSucceeded={loginSucceeded}/>);

    // Try resetting the state of LoginForm
    wrapper.setState({formStarted: false});

    const emailInputField = wrapper.find('input[name="email"]');
    let simulatedEmailElement = createSimulatedElement('email', 'email value', { valid: true});
    emailInputField.simulate('change',  simulatedEmailElement);

    const passwordInputField = wrapper.find('input[name="password"]');
    let passwordEmailElement = createSimulatedElement('password', 'some1password!', { valueMissing: true});
    passwordInputField.simulate('change',  passwordEmailElement);

    wrapper.find('button #login-button').get(0).click();

    expect(LoginForm.prototype.showAlert).toHaveBeenCalledWith('Please enter your password');
    expect(loginSucceeded).not.toHaveBeenCalled();

  })

  xit('should reject an attempt to login with an invalid email address', function() {

    let loginSucceeded = jasmine.createSpy('loginSucceeded');
    spyOn(LoginForm.prototype, "showAlert").and.callThrough();

    const wrapper = mount(<LoginForm alertMsg={reactAlertMsg} loginSucceeded={loginSucceeded}/>);

    const emailInputField = wrapper.find('input[name="email"]');
    let simulatedEmailElement = createSimulatedElement('email', 'email value', { typeMismatch: true});
    emailInputField.simulate('change',  simulatedEmailElement);

    const passwordInputField = wrapper.find('input[name="password"]');
    let passwordEmailElement = createSimulatedElement('password', 'some1password!', { valid: true});
    passwordInputField.simulate('change',  passwordEmailElement);

    wrapper.find('button #login-button').get(0).click();

    expect(LoginForm.prototype.showAlert).toHaveBeenCalledWith('Your email address doesn\'t look right.');
    expect(loginSucceeded).not.toHaveBeenCalled();

  })

  it('should login a user on successful entry of the form', function(done) {

    const password = 'MyPassword1';
    const email = 'testuser@email.com';
    const fullName = 'first last';
    const nickName = 'nick';
    const userID = 14;
    const token ='llsakdflk1j32lf32'

    spyOn(Backend, "login").and.callFake(function(userInfo) {
       expect(userInfo.email).toBe(email);
       expect(userInfo.password).toBe(password);
       return new Promise( (resolve,reject)=> {
         resolve({
           token: token,
           userId: userID,
           fullName: fullName,
           email: email,
           nickName: nickName
         });
       })
    })

    const wrapper = mount(<LoginForm loginSucceeded={()=>{done()}}/>);

    // Set the component state so that a form can be submitted
    wrapper.setState({email: email});
    wrapper.setState({password: password});
    wrapper.setState({formStarted: true});

    // Click submit
    //wrapper.find('button #login-button').get(0).click();
    wrapper.find('button #login-button').simulate('submit');

  })

  it( 'should store an auth token in permanent storage if "remember me" is ticked', function(done) {

    const password = 'MyPassword1';
    const email = 'testuser@email.com';
    const fullName = 'first last';
    const nickName = 'nick';
    const userID = 14;
    const token ='llsakdflk1j32lf32'

    spyOn(Backend, "login").and.callFake(function(userInfo) {
       expect(userInfo.email).toBe(email);
       expect(userInfo.password).toBe(password);
       return new Promise( (resolve,reject)=> {
         resolve({
           token: token,
           userId: userID,
           fullName: fullName,
           email: email,
           nickName: nickName
         });
       })
     })

    const wrapper = mount(<LoginForm loginSucceeded={done}/>);

    // Set the component state so that a form can be submitted
    wrapper.setState({email: email});
    wrapper.setState({password: password});
    wrapper.setState({formStarted: true});
    wrapper.setState({rememberMe: true});

    // Click submit
    //wrapper.find('button #login-button').get(0).click();
    wrapper.find('button #login-button').simulate('submit');

    var store = {};

    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      expect(key).toBe('userInfo');
      let userInfo = JSON.parse(value);
      expect(userInfo.token).toBe(token);
      expect(userInfo.userId).toBe(userID);
      expect(userInfo.email).toBe(email);
      expect(userInfo.nickName).toBe(nickName);
      expect(userInfo.fullName).toBe(fullName);
      return store[key] = value + '';
    });


  })

  it( 'should store an auth token in session storage if remember me is not ticked', function(done) {

    const password = 'MyPassword1';
    const email = 'testuser@email.com';
    const fullName = 'first last';
    const nickName = 'nick';
    const userID = 14;
    const token ='llsakdflk1j32lf32'

    spyOn(Backend, "login").and.callFake(function(userInfo) {
       expect(userInfo.email).toBe(email);
       expect(userInfo.password).toBe(password);
       return new Promise( (resolve,reject)=> {
         resolve({
           token: token,
           userId: userID,
           fullName: fullName,
           email: email,
           nickName: nickName
         });
       })
     })


    const wrapper = mount(<LoginForm loginSucceeded={done}/>);

    // Set the component state so that a form can be submitted
    wrapper.setState({email: email});
    wrapper.setState({password: password});
    wrapper.setState({formStarted: true});
    wrapper.setState({rememberMe: false});

    // Click submit
    //wrapper.find('button #login-button').get(0).click();
    wrapper.find('button #login-button').simulate('submit');

    var store = {};

    spyOn(sessionStorage, 'setItem').and.callFake(function (key, value) {
      expect(key).toBe('userInfo');
      let userInfo = JSON.parse(value);
      expect(userInfo.token).toBe(token);
      expect(userInfo.userId).toBe(userID);
      expect(userInfo.email).toBe(email);
      expect(userInfo.nickName).toBe(nickName);
      expect(userInfo.fullName).toBe(fullName);
      return store[key] = value + '';
    });
  })

  // TODO: Need to rethink the alerting mechanism
  xit('should alert the user if the API call fails', function(done) {

    const password = 'MyPassword1';
    const email = 'testuser@email.com';
    const fullName = 'first last';
    const nickName = 'nick';
    const userID = 14;
    const token ='llsakdflk1j32lf32'

    const serverError = 'some unexplained problem';

    spyOn(Backend, "login").and.callFake(function(userInfo) {
       expect(userInfo.email).toBe(email);
       expect(userInfo.password).toBe(password);
       return new Promise( (resolve,reject)=> {
         reject(serverError);
       })
     })

     spyOn(LoginForm.prototype, 'showAlert').and.callFake(function (error) {
       expect(error).toBe(serverError);
       done();
     });


    const wrapper = mount(<LoginForm loginSucceeded={function() {fail('login should have failed.') } }/>);

    // Set the component state so that a form can be submitted
    wrapper.setState({email: email});
    wrapper.setState({password: password});
    wrapper.setState({formStarted: true});
    wrapper.setState({rememberMe: false});

    // Click submit
    wrapper.find('button #login-button').get(0).click();

  });


});
