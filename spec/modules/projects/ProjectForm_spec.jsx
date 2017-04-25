import React from 'react';
import ProjectForm from '../../../src/js/modules/projects/ProjectForm.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';


describe('ProjectForm Component', function() {

  // A mock alert box
  const reactAlertMsg = {
    error: function(message, callback) {}
  }

  beforeEach(function() {
  });

  it('should render a project form', function() {
    const wrapper = shallow(<ProjectForm/>);
    expect(wrapper.find('form #project-form').length).toBe(1);
  })

  it('should render an name field in the form', function() {
    const wrapper = shallow(<ProjectForm/>);
    expect(wrapper.find('input[name="projectName"]').length).toBe(1);
  })

  it('should render a description textarea in the form', function() {
    const wrapper = shallow(<ProjectForm/>);
    expect(wrapper.find('textarea[name="projectDescription"]').length).toBe(1);
  })

  it( 'should render a select box for the style', function() {
    const wrapper = shallow(<ProjectForm/>);
    expect(wrapper.find('select[name="style"]').length).toBe(1);
  })

  it('should render a submit button', function() {
    const wrapper = mount(<ProjectForm/>);
    expect(wrapper.find('button #create-project-button').length).toBe(1);
  })

  it('should reject an attempt to create a project without a name', function() {

    spyOn(ProjectForm.prototype, "showAlert").and.callThrough()
    let projectCreated = jasmine.createSpy('projectCreated');

    const wrapper = mount(<ProjectForm alertMsg={reactAlertMsg} projectCreated={projectCreated}/>);

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
    expect(loginSucceeded).not.toHaveBeenCalled();
  })

  it('should create a project on successful entry of the form', function(done) {

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



    const wrapper = mount(<LoginForm loginSucceeded={()=>{done()}}/>);

    // Set the component state so that a form can be submitted
    wrapper.setState({userId: validLogin.userId});
    wrapper.setState({password: validLogin.password});
    wrapper.setState({formStarted: true});

    // Click submit
    wrapper.find('button #login-button').get(0).click();

    expect(LoginForm.prototype.showAlert).not.toHaveBeenCalled();

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
