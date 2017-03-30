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

  it('should render a login form', function() {
    const wrapper = shallow(<LoginForm/>);
    expect(wrapper.find('form #login').length).toBe(1);
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
    const wrapper = shallow(<LoginForm/>);
    expect(wrapper.find('button #login').length).toBe(1);
  })

  fit('should reject an attempt to login without a username(email)', function() {
    const wrapper = shallow(<LoginForm/>);

    wrapper.find('button #login').simulate('click', { preventDefault: () => undefined });

    fail("work on this tomorrow");
    // What do we test for to make sure the for didn't submit?

  })

  it('should reject an attempt to login without a password', function() {
    const wrapper = shallow(<RegistrationForm/>);
    const inputField = wrapper.find('input[name="fullName"]');
    let simulatedElement = createSimulatedElement('fullName', '', { valueMissing: true});

    inputField.simulate('change',  simulatedElement);
    expect(wrapper.state('errorMessages').fullName).not.toBeNull();
    expect(wrapper.find('div #fullNameError').text().length).not.toBe(0);

    wrapper.find('button #register').simulate('click', { preventDefault: () => undefined });
    // What do we test for to make sure the for didn't submit?

  })

  it('should login a user on successful entry of the form', function(done) {

    let validRegistration = {
      fullName: 'Test User',
      password: 'MyPassword1',
      email: 'testuser@email.com'
    }

    // Setup Sinon for mocking backend server
    this.server = sinon.fakeServer.create();
    this.server.respondImmediately = true;

    this.server.respondWith("POST", "/api/register", function(xhr) {
      expect(xhr.requestBody.fullname).toBe(validRegistration.fullName);
      expect(xhr.requestBody.email).toBe(validRegistration.email);
      expect(xhr.requestBody.nickname).toBe('')
      expect(xhr.requestBody.password).toBe(validRegistration.password);

      xhr.respond(200, {"Content-Type": "application/json"},
        JSON.stringify({
           id: (Math.random() * (32767 - 1)) + 1,
           fullName: xhr.requestBody.fullname,
           nickName: xhr.requestBody.nickname,
           email: xhr.requestBody.email
        }));
   });


    const wrapper = mount(<RegistrationForm/>);

    // Set the field properties
    wrapper.setState({fullName: validRegistration.fullName});
    wrapper.setState({password: validRegistration.password});
    wrapper.setState({email: validRegistration.email});

    // Watch for the browserHistory to change
    spyOn(browserHistory, 'push').and.callFake(function(newUrl){
      expect(newUrl).toBe('/mailVerification');
      done();
    })

    // Click submit
    wrapper.find('button #register').simulate('click', { preventDefault: () => undefined });
  })

  it( 'should store an auth token in permanent storage if remember me is ticked', function(done) {

  })

  it( 'should store an auth token in session storage if remember me is not ticked', function(done) {

  })

  it('should alert the user if the API call fails', function(done) {

    let validRegistration = {
      fullName: 'Test User',
      password: 'MyPassword1',
      email: 'testuser@email.com'
    }
    let serverError = 'some unexplained problem';

    // Setup Sinon for mocking backend server
    this.server = sinon.fakeServer.create();
    this.server.respondImmediately = true;

    this.server.respondWith("POST", "/api/register", function(xhr) {
      expect(xhr.requestBody.fullname).toBe(validRegistration.fullName);
      expect(xhr.requestBody.email).toBe(validRegistration.email);
      expect(xhr.requestBody.nickname).toBe('')
      expect(xhr.requestBody.password).toBe(validRegistration.password);

      xhr.respond(401, {"Content-Type": "application/json"},
        JSON.stringify({
           error: serverError
        }));
   });

  // Setup a spy to make sure that an error allert is issued
  spyOn(RegistrationForm.prototype, "showAlert").and.callFake(function(error){
    console.log('got you', error);
    expect(error).toBe(serverError);
    done();
  });

  const wrapper = mount(<RegistrationForm/>);

  // Set the field properties
  wrapper.setState({fullName: validRegistration.fullName});
  wrapper.setState({password: validRegistration.password});
  wrapper.setState({email: validRegistration.email});


  // Click submit
  wrapper.find('button #register').simulate('click', { preventDefault: () => undefined });


  })

});
