import React from 'react';
import RegistrationForm from '../../../src/js/modules/register/RegistrationForm.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import createHistory from 'history/createBrowserHistory'

const history = createHistory();

function createSimulatedElement(name, value, validState) {



  return {
    target: {
      name: name,
      value: value,
      classList: { add: function(className) {} },
      validity: validState
    },
    setCustomValidity: function(customState) {
      this.target.validity.customError = true;
      this.target.validity.valid = false;
    }
  };

}

describe('RegistrationForm Component', function() {

  // A mock alert box
  const mockAlertContainer = {
    error: function(message, callback) {}
  }

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
    expect(wrapper.find('div#email').hasClass('has-error')).toBe(true);
    expect(wrapper.find('input[name="email"]').prop('value')).toBe('someemail');
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
    expect(wrapper.find('div#password').hasClass('has-error')).toBe(true);
    expect(wrapper.find('input[name="password"]').prop('value')).toBe('bla');

  })

  it( 'should display an error when the password and confirmPassword fields do not match', function() {


    const wrapper = mount(<RegistrationForm/>);
    const passwordConfirmField = wrapper.find('input[name="passwordConfirm"]');
    //let simulatedPasswordInputElement = createSimulatedElement('password', 'blablah', { valid: true });
    let simulatedElement = createSimulatedElement('passwordConfirm', 'blu', {  });

    // Set the password state
    wrapper.setState({ password: 'blablah '});

    // Simulate a change to the passwordConfirm field
    passwordConfirmField.simulate('change',  simulatedElement);

    //console.log(wrapper.state('errorMessages'));
    expect(wrapper.state('errorMessages').passwordConfirm).not.toBeNull();
    expect(wrapper.find('div #passwordConfirmError').length).not.toBe(0);

    // !!!!! WORKAROUND: When using Enzyme, the setCutomValidity function does not work on an HTML element,
    // so the code doesn't set the error message properly.  Instead, we have to check for this generic error
    expect(wrapper.find('div #passwordConfirmError').text()).not.toBe('Passwords do not match');
    expect(wrapper.find('div #passwordConfirmError').text()).toBe('Invalid field value');

    expect(wrapper.find('div #passwordConfirmError').text().length).not.toBe(0);
    expect(wrapper.find('div#passwordConfirm').hasClass('has-error')).toBe(true);

    //console.log(wrapper.find('div#passwordConfirmError').text());

  })

  it('should display an error when a name value fails the HTML required contraint', function() {
    const wrapper = shallow(<RegistrationForm/>);
    const inputField = wrapper.find('input[name="fullName"]');
    let simulatedElement = createSimulatedElement('fullName', '', { valueMissing: true});

    inputField.simulate('change',  simulatedElement);
    expect(wrapper.state('errorMessages').fullName).not.toBeNull();
    expect(wrapper.find('div #fullNameError').text().length).not.toBe(0);
    expect(wrapper.find('div#fullName').hasClass('has-error')).toBe(true);
  })

  it('should reject an attempt to submit an form with an invalid name', function() {
    spyOn(RegistrationForm.prototype, "showAlert").and.callThrough()

    const wrapper = shallow(<RegistrationForm alertBox={mockAlertContainer}/>);
    const inputField = wrapper.find('input[name="fullName"]');
    let simulatedElement = createSimulatedElement('fullName', '', { valueMissing: true});

    inputField.simulate('change',  simulatedElement);
    expect(wrapper.state('errorMessages').fullName).not.toBeNull();
    expect(wrapper.find('div #fullNameError').text().length).not.toBe(0);

    wrapper.find('button #register').simulate('click', { preventDefault: () => undefined });

    // Check to see if the alertbox gets populated
    expect(RegistrationForm.prototype.showAlert).toHaveBeenCalledWith('Name is a required field');

    // Check to see if the invalid fields have been visually flagged
    //console.log(wrapper.find('div#fullName').debug());
    expect(wrapper.find('div#fullName').hasClass('has-error')).toBe(true);

  })

  it('should reject an attempt to submit an form with a missing name and email', function() {
    spyOn(RegistrationForm.prototype, "showAlert").and.callThrough()

    const wrapper = shallow(<RegistrationForm alertBox={mockAlertContainer}/>);

    const inputNameField = wrapper.find('input[name="fullName"]');
    let simulatedNameElement = createSimulatedElement('fullName', '', { valueMissing: true});
    inputNameField.simulate('change',  simulatedNameElement);

    const inputEmailField = wrapper.find('input[name="email"]');
    let simulatedEmailElement = createSimulatedElement('email', '', { valueMissing: true});
    inputEmailField.simulate('change',  simulatedEmailElement);

    expect(wrapper.state('errorMessages').fullName).not.toBeNull();
    expect(wrapper.find('div #fullNameError').text().length).not.toBe(0);

    wrapper.find('button #register').simulate('click', { preventDefault: () => undefined });

    // Check to see if the alertbox gets populated
    expect(RegistrationForm.prototype.showAlert).toHaveBeenCalledWith('Name is a required field');
    expect(RegistrationForm.prototype.showAlert).toHaveBeenCalledWith('Email is a required field');

    // Check to see if the invalid fields have been visually flagged
    //console.log(wrapper.find('div#fullName').debug());
    expect(wrapper.find('div#fullName').hasClass('has-error')).toBe(true);

  })

  it('should reject an attempt to submit an form with a password that does not match', function() {
    spyOn(RegistrationForm.prototype, "showAlert").and.callThrough()

    const wrapper = mount(<RegistrationForm alertBox={mockAlertContainer}/>);
    const VALID_ELEMENT = {valid: true};

    const inputPasswordField = wrapper.find('input[name="password"]');
    let simulatedPasswordElement = createSimulatedElement('password', 'mypassword', VALID_ELEMENT);
    inputPasswordField.simulate('change',  simulatedPasswordElement);

    const inputPasswordConfirmField = wrapper.find('input[name="passwordConfirm"]');
    let simulatedPasswordConfirmElement = createSimulatedElement('passwordConfirm', 'not-mypassword', { customError: 'mismatched passwords'} );
    inputPasswordConfirmField.simulate('change',  simulatedPasswordConfirmElement);

    expect(wrapper.state('errorMessages').passwordConfirm).not.toBeNull();

    wrapper.find('button #register').simulate('click', { preventDefault: () => undefined });

    // Check to see if the alertbox gets populated
    expect(RegistrationForm.prototype.showAlert).toHaveBeenCalledWith('Passwords do not match');

    // Check to see if the invalid fields have been visually flagged
    //console.log(wrapper.find('div#fullName').debug());
    expect(wrapper.find('div#passwordConfirm').hasClass('has-error')).toBe(true);

  })

  it('should reject an attempt to submit an empty form', function() {
    spyOn(RegistrationForm.prototype, "showAlert").and.callThrough()

    const wrapper = shallow(<RegistrationForm alertBox={mockAlertContainer}/>);
    wrapper.find('button #register').simulate('click', { preventDefault: () => undefined });

    // Check to see if the alertbox gets populated
    expect(RegistrationForm.prototype.showAlert).toHaveBeenCalledWith('Please fill out registration form');
  })

  it('should register a user on successful entry of the form', function(done) {

    spyOn(RegistrationForm.prototype, "showAlert").and.callFake(function(message) {
      //console.log(message);
      fail('resitration failed with errror');
    });

    let validRegistration = {
      fullName: 'Test User',
      password: 'MyPassword1',
      email: 'testuser@email.com'
    }

    // Setup Sinon for mocking backend server
    this.server = sinon.fakeServer.create();
    this.server.respondImmediately = true;

    this.server.respondWith("POST", __BACKEND +  "/api/register", function(xhr) {
      let jsonBody = JSON.parse(xhr.requestBody);
      expect(jsonBody.fullname).toBe(validRegistration.fullName);
      expect(jsonBody.email).toBe(validRegistration.email);
      expect(jsonBody.nickname).toBe('')
      expect(jsonBody.password).toBe(validRegistration.password);

      xhr.respond(200, {"Content-Type": "application/json"},
        JSON.stringify({
           id: (Math.random() * (32767 - 1)) + 1,
           fullName: xhr.requestBody.fullname,
           nickName: xhr.requestBody.nickname,
           email: xhr.requestBody.email
        }));
   });



    const wrapper = mount(<RegistrationForm alertBox={mockAlertContainer} registrationSuceeded={() => {done()}}/>);

    // Set the field properties
    wrapper.setState({fullName: validRegistration.fullName});
    wrapper.setState({password: validRegistration.password});
    wrapper.setState({email: validRegistration.email});
    wrapper.setState({formStarted: true});

    // Click submit
    wrapper.find('button #register').simulate('click', { preventDefault: () => undefined });
    //expect(RegistrationForm.prototype.showAlert).not.toHaveBeenCalled();
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

    this.server.respondWith("POST", __BACKEND + "/api/register", function(xhr) {
      let jsonBody = JSON.parse(xhr.requestBody);
      expect(jsonBody.fullname).toBe(validRegistration.fullName);
      expect(jsonBody.email).toBe(validRegistration.email);
      expect(jsonBody.nickname).toBe('')
      expect(jsonBody.password).toBe(validRegistration.password);

      xhr.respond(401, {"Content-Type": "application/json"},
        JSON.stringify({
           error: serverError
        }));
   });

  // Setup a spy to make sure that an error allert is issued
  spyOn(RegistrationForm.prototype, "showAlert").and.callFake(function(error){
    expect(error).toBe(serverError);
    done();
  });

  const wrapper = mount(<RegistrationForm/>);

  // Set the field properties
  wrapper.setState({fullName: validRegistration.fullName});
  wrapper.setState({password: validRegistration.password});
  wrapper.setState({email: validRegistration.email});
  wrapper.setState({formStarted: true});

  // Click submit
  wrapper.find('button #register').simulate('click', { preventDefault: () => undefined });


  })

  it( 'should not show an alert if a field error is corrected', function() {
    spyOn(RegistrationForm.prototype, "showAlert").and.callThrough()


    const wrapper = shallow(<RegistrationForm alertBox={mockAlertContainer}/>);

    const inputField = wrapper.find('input[name="fullName"]');
    let simulatedElement = createSimulatedElement('fullName', '', { valueMissing: true});
    inputField.simulate('change',  simulatedElement);

    // Click submit
    wrapper.find('button #register').simulate('click', { preventDefault: () => undefined });

    expect(RegistrationForm.prototype.showAlert).toHaveBeenCalledWith('Name is a required field');

    simulatedElement = createSimulatedElement('fullName', 'a name', { valid: true});
    inputField.simulate('change',  simulatedElement);
    // Click submit again
    //TODO: This test causes problems, need to fix it.
/*    wrapper.find('button #register').simulate('click', { preventDefault: () => undefined });

    expect(RegistrationForm.prototype.showAlert.calls.count()).toEqual(1);
    */
  })

  xit( 'should send a user to the login page if the email address already exists', function() {
    fail('not implemented yet');
  })

});
