import React from 'react'
import ReactDOM from 'react-dom'
import AlertContainer from 'react-alert'
import Backend from '../../adapter/Backend.js'

export default class extends React.Component{

  constructor(props) {
      super(props);
      this.state = {
        projectName: '',
        projectDescription: '',
        style: 'CRUD',
        errorMessages: {},
        formStarted: false
      };

      // Keep the labels out of the state parameter becuase they aren't changed after being rendered.
      this.labels = {
        projectName: 'Project Name',
        projectDescription: 'Description'
      }

      this.alertOptions = {
        offset: 14,
        position: 'top right',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
      };
      this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    //TODO: Focus on the first input element when the modal is loaded.
    //this.projectNameInput.focus();
  }

  /* Method to show alert message */
  showAlert(message){
    this.props.alertMsg.error(message, {
      time: 5000,
      type: 'error',
      icon: <span className=""></span>
    });
  }

  /* Method to handle input change */
  handleChange(e) {
    this.setState({formStarted: 'true'});

    this.setState({
      [e.target.name]: e.target.value
    });

    this.showInputError(e.target);
  }

  /* Method to handle form submission */
  handleSubmit(e) {
    console.log('handleSubmit');
    e.preventDefault();
    if( !this.state.formStarted ) {
      console.log('pristine');
      // Project name is the only required field, so set an error message jsut for that field
      console.log(this);
      this.setState({errorMessages: {projectName: 'Please provide a name for the new project.'}});
      console.log('set errormessage');
      console.log(this.state.errorMessages);
    }else if (Object.keys(this.state.errorMessages).length !== 0  ) {
      // Remind the user that there are problems with the form
      this.showAlert('There are problems with the form. Please correct them before continuing.');
    } else {
      Backend.createProject(this.props.userObject.token,
      {
        name: this.state.projectName,
        description: this.state.projectDescription,
        style: this.state.style
      }).then( (result) => {
        this.props.projectCreated(result.id)
      }).catch( (error) => {
        //console.log('Error occurred while creating project:', error);
        this.showAlert(error);
      })
    }
  }

  showInputError(input) {
    let validityState = input.validity;

    let errorMessages = this.state.errorMessages;
    let label = this.labels[input.name];

    if( !validityState.valid ) {
      if (validityState.valueMissing) {
        errorMessages[input.name] = `${label} is a required field`;
      } else {
        console.warn('unexpected conformance validator problem: ', validityState);
        errorMessages[input.name] = `Invalid field value`;
      }
    } else if( validityState.valid ) {
        delete errorMessages[input.name];
    }
    this.setState({'errorMessages': errorMessages})
  }

  /* Render Method */
  render() {

    return(
      <div>
        <form id="project-form" className="project-form" noValidate onSubmit={(e) => {this.handleSubmit(e)}}>
          <div className="form-group">
            <label htmlFor="InputProjectName" id="projectNameLabel">Project Name:</label>
            <input
              type="text"
              className="form-control"
              value={this.state.projectName}
              onChange={this.handleChange}
              id="InputProjectName"
              name="projectName"
              ref={(input)=>{ this.projectNameInput = input}}
              placeholder="Project Name"
              required />
            <div className="error" id="projectNameError">{this.state.errorMessages.projectName}</div>
          </div>

          <div className="form-group">
            <label htmlFor="InputProjectDescription" id="projectDescriptionLabel">Project Description:</label>
            <textarea
              className="form-control"
              id="InputProjectDescription"
              name="projectDescription"
              placeholder="An Optional Project Description"
              value={this.state.projectDescription}
              onChange={this.handleChange}
              rows="3"></textarea>
          </div>

          <div className="form-group">
              <button type="submit" id="create-project-button" className="btn btn-default pull-left">Create</button>
          </div>
        </form>
      </div>
    )
  }
}
