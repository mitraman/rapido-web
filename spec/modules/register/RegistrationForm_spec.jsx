import React from 'react';
import RegistrationForm from '../../../src/js/modules/register/RegistrationForm.jsx';
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

describe('RegistrationForm Component', function() {

  it('should render a registration form', function() {
    const wrapper = shallow(<RegistrationForm/>);
    expect(wrapper.find('form #registration').length).toBe(1);
  })

  it('should render fullname, email and password fields in a registration form', function() {
    const wrapper = shallow(<RegistrationForm/>);
    expect(wrapper.find('input[name="email"]').length).toBe(1);
    expect(wrapper.find('input[name="password"]').length).toBe(1);
    expect(wrapper.find('input[name="fullName"]').length).toBe(1);
    expect(wrapper.find('input[name="passwordConfirm"]').length).toBe(1);
  })

  it('should render a submit button', function() {
    const wrapper = shallow(<RegistrationForm/>);
    expect(wrapper.find('button #register').length).toBe(1);
  })


  it('should display an error when an email value fails the HTML type contraint', function() {

    const wrapper = shallow(<RegistrationForm/>);
    const emailInputField = wrapper.find('input[name="email"]');

    let simulatedElement = createSimulatedElement('email', 'someemail', { typeMismatch: true});

    emailInputField.simulate('change',  simulatedElement);
    expect(wrapper.state('errorMessages').email).not.toBeNull();
    expect(wrapper.find('div #emailError').text()).not.toBeUndefined();
    expect(wrapper.find('div #emailError').text().length).not.toBe(0);
  })


  it('should display an error when a password value fails the HTML pattern constraint', function() {
    const wrapper = shallow(<RegistrationForm/>);
    const inputField = wrapper.find('input[name="password"]');
    let simulatedElement = createSimulatedElement('password', 'bla', { patternMismatch: true});

    inputField.simulate('change',  simulatedElement);
    expect(wrapper.state('errorMessages').password).not.toBeNull();
    expect(wrapper.find('div #passwordError').length).not.toBe(0);
    expect(wrapper.find('div #passwordError').text()).not.toBeUndefined();
    expect(wrapper.find('div #passwordError').text().length).not.toBe(0);

  })

  it( 'should display an error when the password and confirmPassword fields do not match', function() {
    const wrapper = shallow(<RegistrationForm/>);
    const passwordConfirmField = wrapper.find('input[name="passwordConfirm"]');
    //let simulatedPasswordInputElement = createSimulatedElement('password', 'blablah', { valid: true });
    let simulatedElement = createSimulatedElement('passwordConfirm', 'blu', {  });

    // Set the password state
    wrapper.setState({ password: 'blablah '});

    // Simulate a change to the passwordConfirm field
    passwordConfirmField.simulate('change',  simulatedElement);
    expect(wrapper.state('errorMessages').passwordConfirm).not.toBeNull();
    expect(wrapper.find('div #passwordConfirmError').length).not.toBe(0);
    expect(wrapper.find('div #passwordConfirmError').text()).not.toBeUndefined();
    expect(wrapper.find('div #passwordConfirmError').text().length).not.toBe(0);
  })

  it('should display an error when a name value fails the HTML required contraint', function() {
    const wrapper = shallow(<RegistrationForm/>);
    const inputField = wrapper.find('input[name="fullName"]');
    let simulatedElement = createSimulatedElement('fullName', '', { valueMissing: true});

    inputField.simulate('change',  simulatedElement);
    expect(wrapper.state('errorMessages').fullName).not.toBeNull();
    expect(wrapper.find('div #fullNameError').text().length).not.toBe(0);
  })

  it('should reject an attempt to submit an invalid form', function() {
    const wrapper = shallow(<RegistrationForm/>);
    const inputField = wrapper.find('input[name="fullName"]');
    let simulatedElement = createSimulatedElement('fullName', '', { valueMissing: true});

    inputField.simulate('change',  simulatedElement);
    expect(wrapper.state('errorMessages').fullName).not.toBeNull();
    expect(wrapper.find('div #fullNameError').text().length).not.toBe(0);

    wrapper.find('button #register').simulate('click', { preventDefault: () => undefined });
    // What do we test for to make sure the for didn't submit?

  })

  it('should register a user on successful entry of the form', function(done) {

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
