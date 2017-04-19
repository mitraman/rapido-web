import React from 'react';
import LoginForm from '../../../src/js/modules/login/LoginForm.jsx';
import { browserHistory } from 'react-router'
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

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
    // Make sure that the browser page doesn't change
    //spyOn(browserHistory, 'push').and.callThrough()

    // Setup a spy to make sure that an error allert is issued
    //spyOn(LoginForm.prototype, "showAlert").and.callThrough()
  });

  it('should render a login form', function() {
    const wrapper = shallow(<LoginForm/>);
    expect(wrapper.find('form #login-form').length).toBe(1);
  })

  it('should render an email field in a login form', function() {
    const wrapper = shallow(<LoginForm/>);
    expect(wrapper.find('input[name="userId"]').length).toBe(1);
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

  it('should reject an attempt to login before filling out form', function() {

    spyOn(browserHistory, 'push').and.callThrough()
    spyOn(LoginForm.prototype, "showAlert").and.callThrough()

    const wrapper = mount(<LoginForm alertMsg={reactAlertMsg}/>);
    wrapper.find('button #login-button').get(0).click();

    expect(LoginForm.prototype.showAlert).toHaveBeenCalledWith('Please fill out login form fields');
    expect(browserHistory.push).not.toHaveBeenCalled();

  })

  it('should reject an attempt to login with a missing email address', function() {

    spyOn(browserHistory, 'push').and.callThrough()
    spyOn(LoginForm.prototype, "showAlert").and.callThrough()

    const wrapper = mount(<LoginForm alertMsg={reactAlertMsg}/>);

    // Try resetting the state of LoginForm
    wrapper.setState({formStarted: false});

    const emailInputField = wrapper.find('input[name="userId"]');
    let simulatedEmailElement = createSimulatedElement('userId', 'userid value', { valueMissing: true});
    emailInputField.simulate('change',  simulatedEmailElement);

    const passwordInputField = wrapper.find('input[name="password"]');
    let passwordEmailElement = createSimulatedElement('password', 'some1password!', { valid: true});
    passwordInputField.simulate('change',  passwordEmailElement);

    wrapper.find('button #login-button').get(0).click();

    expect(LoginForm.prototype.showAlert).toHaveBeenCalledWith('User ID is a required field');
    expect(browserHistory.push).not.toHaveBeenCalled();
  })

  it('should reject an attempt to login with a missing password', function() {

    spyOn(browserHistory, 'push').and.callThrough();
    spyOn(LoginForm.prototype, "showAlert").and.callThrough();

    const wrapper = mount(<LoginForm alertMsg={reactAlertMsg}/>);

    // Try resetting the state of LoginForm
    wrapper.setState({formStarted: false});

    const emailInputField = wrapper.find('input[name="userId"]');
    let simulatedEmailElement = createSimulatedElement('userId', 'userid value', { valid: true});
    emailInputField.simulate('change',  simulatedEmailElement);

    const passwordInputField = wrapper.find('input[name="password"]');
    let passwordEmailElement = createSimulatedElement('password', 'some1password!', { valueMissing: true});
    passwordInputField.simulate('change',  passwordEmailElement);

    wrapper.find('button #login-button').get(0).click();

    expect(LoginForm.prototype.showAlert).toHaveBeenCalledWith('Password is a required field');
    expect(browserHistory.push).not.toHaveBeenCalled();

  })

  it('should reject an attempt to login with an invalid email address', function() {

    spyOn(browserHistory, 'push').and.callThrough();
    spyOn(LoginForm.prototype, "showAlert").and.callThrough();

    const wrapper = mount(<LoginForm alertMsg={reactAlertMsg}/>);

    const emailInputField = wrapper.find('input[name="userId"]');
    let simulatedEmailElement = createSimulatedElement('userId', 'userid value', { typeMismatch: true});
    emailInputField.simulate('change',  simulatedEmailElement);

    const passwordInputField = wrapper.find('input[name="password"]');
    let passwordEmailElement = createSimulatedElement('password', 'some1password!', { valid: true});
    passwordInputField.simulate('change',  passwordEmailElement);

    wrapper.find('button #login-button').get(0).click();

    expect(LoginForm.prototype.showAlert).toHaveBeenCalledWith('User ID should be a valid email address');
    expect(browserHistory.push).not.toHaveBeenCalled();

  })

  it('should login a user on successful entry of the form', function(done) {

    spyOn(LoginForm.prototype, "showAlert").and.callThrough();

    let validLogin = {
      password: 'MyPassword1',
      userId: 'testuser@email.com'
    }

    // Setup Sinon for mocking backend server
    this.server = sinon.fakeServer.create();
    this.server.respondImmediately = true;

    this.server.respondWith("POST", __BACKEND + "/api/login", function(xhr) {
      let jsonBody = JSON.parse(xhr.requestBody);
      expect(jsonBody.email).toBe(validLogin.userId);
      expect(jsonBody.password).toBe(validLogin.password);

      xhr.respond(200, {"Content-Type": "application/json"},
        JSON.stringify({
           token: Math.random()
        }));
   });


    const wrapper = mount(<LoginForm/>);

    // Set the component state so that a form can be submitted
    wrapper.setState({userId: validLogin.userId});
    wrapper.setState({password: validLogin.password});
    wrapper.setState({formStarted: true});

    // Click submit
    wrapper.find('button #login-button').get(0).click();

    expect(LoginForm.prototype.showAlert).not.toHaveBeenCalled();

    // Watch for the browserHistory to change
    spyOn(browserHistory, 'push').and.callFake(function(newUrl){
      expect(newUrl).toBe('/sketches');
      done();
    })

  })

  it( 'should store an auth token in permanent storage if remember me is ticked', function(done) {

    spyOn(LoginForm.prototype, "showAlert").and.callThrough();

    let validLogin = {
      password: 'MyPassword1',
      userId: 'testuser@email.com'
    }

    const token = Math.random();

    // Setup Sinon for mocking backend server
    this.server = sinon.fakeServer.create();
    this.server.respondImmediately = true;

    this.server.respondWith("POST", __BACKEND + "/api/login", function(xhr) {
      let jsonBody = JSON.parse(xhr.requestBody);
      expect(jsonBody.email).toBe(validLogin.userId);
      expect(jsonBody.password).toBe(validLogin.password);

      xhr.respond(200, {"Content-Type": "application/json"},
        JSON.stringify({
           token: token
        }));
   });

    const wrapper = mount(<LoginForm/>);

    // Set the component state so that a form can be submitted
    wrapper.setState({userId: validLogin.userId});
    wrapper.setState({password: validLogin.password});
    wrapper.setState({formStarted: true});
    wrapper.setState({rememberMe: true});

    // Click submit
    wrapper.find('button #login-button').get(0).click();

    expect(LoginForm.prototype.showAlert).not.toHaveBeenCalled();

    var store = {};

    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      expect(key).toBe('token');
      expect(value).toBe(token);
      done();
      return store[key] = value + '';
    });


  })

  it( 'should store an auth token in session storage if remember me is not ticked', function(done) {

    spyOn(LoginForm.prototype, "showAlert").and.callThrough();

    let validLogin = {
      password: 'MyPassword1',
      userId: 'testuser@email.com'
    }

    const token = Math.random();

    // Setup Sinon for mocking backend server
    this.server = sinon.fakeServer.create();
    this.server.respondImmediately = true;

    this.server.respondWith("POST", __BACKEND + "/api/login", function(xhr) {
      let jsonBody = JSON.parse(xhr.requestBody);
      expect(jsonBody.email).toBe(validLogin.userId);
      expect(jsonBody.password).toBe(validLogin.password);

      xhr.respond(200, {"Content-Type": "application/json"},
        JSON.stringify({
           token: token
        }));
    });

    const wrapper = mount(<LoginForm/>);

    // Set the component state so that a form can be submitted
    wrapper.setState({userId: validLogin.userId});
    wrapper.setState({password: validLogin.password});
    wrapper.setState({formStarted: true});
    wrapper.setState({rememberMe: false});

    // Click submit
    wrapper.find('button #login-button').get(0).click();

    expect(LoginForm.prototype.showAlert).not.toHaveBeenCalled();

    var store = {};

    // spyOn(localStorage, 'getItem').and.callFake(function (key) {
    //   return store[key];
    // });
    spyOn(sessionStorage, 'setItem').and.callFake(function (key, value) {
      expect(key).toBe('token');
      expect(value).toBe(token);
      done();
      return store[key] = value + '';
    });
  })

  it('should alert the user if the API call fails', function(done) {
    let validLogin = {
      password: 'MyPassword1',
      userId: 'testuser@email.com'
    }

    const token = Math.random();
    const serverError = 'some unexplained problem';

    // Setup Sinon for mocking backend server
    this.server = sinon.fakeServer.create();
    this.server.respondImmediately = true;

    this.server.respondWith("POST", __BACKEND + "/api/login", function(xhr) {
      let jsonBody = JSON.parse(xhr.requestBody);
      expect(jsonBody.email).toBe(validLogin.userId);
      expect(jsonBody.password).toBe(validLogin.password);

      xhr.respond(401, {"Content-Type": "application/json"},
        JSON.stringify({
           error: serverError
        }));
    });

    spyOn(LoginForm.prototype, 'showAlert').and.callFake(function (error) {
      //console.log(error);
      done();
    });

    const wrapper = mount(<LoginForm/>);

    // Set the component state so that a form can be submitted
    wrapper.setState({userId: validLogin.userId});
    wrapper.setState({password: validLogin.password});
    wrapper.setState({formStarted: true});
    wrapper.setState({rememberMe: false});

    // Click submit
    wrapper.find('button #login-button').get(0).click();

  });


});
