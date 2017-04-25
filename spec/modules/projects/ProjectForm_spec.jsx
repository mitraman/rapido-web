import React from 'react';
import ProjectForm from '../../../src/js/modules/projects/ProjectForm.jsx';
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
    wrapper.setState({formStarted: true});

    const emailInputField = wrapper.find('input[name="projectName"]');
    let simulatedEmailElement = createSimulatedElement('projectName', '', { valueMissing: true});
    emailInputField.simulate('change',  simulatedEmailElement);

    wrapper.find('button#create-project-button').get(0).click();

    expect(ProjectForm.prototype.showAlert).toHaveBeenCalledWith('Project Name is a required field');
    expect(projectCreated).not.toHaveBeenCalled();
  })

  it('should reject an attempt to submit a pristine form', function() {
    spyOn(ProjectForm.prototype, "showAlert").and.callThrough()
    let projectCreated = jasmine.createSpy('projectCreated');

    const wrapper = mount(<ProjectForm alertMsg={reactAlertMsg} projectCreated={projectCreated}/>);

    // Try resetting the state of LoginForm
    wrapper.setState({formStarted: false});

    wrapper.find('button#create-project-button').get(0).click();

    expect(wrapper.find('div#projectNameError').text()).toBe('Please provide a name for the new project.');
    expect(projectCreated).not.toHaveBeenCalled();
  })

  it('should create a project on successful entry of the form', function(done) {

    const project = {
      name: 'project name',
      description: 'description'
    }

    const userObject = {
      token: 'blah'
    }

    let projectId = 141;
    let projectCreated = function(id) {
      expect(id).toBe(projectId);
      done();
    }

    spyOn(ProjectForm.prototype, "showAlert").and.callThrough();


    // Setup Sinon for mocking backend server
    this.server = sinon.fakeServer.create();
    this.server.respondImmediately = true;

    this.server.respondWith("POST", __BACKEND + "/api/projects", function(xhr) {
      let jsonBody = JSON.parse(xhr.requestBody);
      expect(jsonBody.name).toBe(project.name);
      expect(jsonBody.description).toBe(project.description);
      expect(jsonBody.style).toBe('CRUD');

      xhr.respond(200, {"Content-Type": "application/json"},
        JSON.stringify({
           id: projectId,
           sketches: [
             {
               id: 1
             }
           ]
        }));
   });

    const wrapper = mount(<ProjectForm userObject={userObject} projectCreated={projectCreated}/>);

    // Set the component state so that a form can be submitted
    wrapper.setState({projectName: project.name});
    wrapper.setState({projectDescription: project.description});
    wrapper.setState({formStarted: true});
    wrapper.setState({style: 'CRUD'});

    // Click create
    wrapper.find('button #create-project-button').get(0).click();

    expect(ProjectForm.prototype.showAlert).not.toHaveBeenCalled();

  })

  it('should alert the user if the API call fails', function(done) {
    const serverError = 'some unexplained problem';

    const project = {
      name: 'project name',
      description: 'desription'
    }

    const userObject = {
      token: 'blah'
    }
    // Setup Sinon for mocking backend server
    this.server = sinon.fakeServer.create();
    this.server.respondImmediately = true;

    this.server.respondWith("POST", __BACKEND + "/api/projects", function(xhr) {
      let jsonBody = JSON.parse(xhr.requestBody);
      expect(jsonBody.name).toBe(project.name);
      expect(jsonBody.description).toBe(project.description);
      expect(jsonBody.style).toBe('CRUD');

      xhr.respond(401, {"Content-Type": "application/json"},
        JSON.stringify({
           error: serverError
        }));
    });

    spyOn(ProjectForm.prototype, 'showAlert').and.callFake(function (error) {
      //console.log(error);
      done();
    });

    const wrapper = mount(<ProjectForm userObject={userObject}/>);

    // Set the component state so that a form can be submitted
    wrapper.setState({projectName: project.name});
    wrapper.setState({projectDescription: project.description});
    wrapper.setState({formStarted: true});
    wrapper.setState({style: 'CRUD'});

    // Click submit
    wrapper.find('button #create-project-button').get(0).click();

  });


});
