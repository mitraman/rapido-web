import React from 'react'
import RegistrationForm from './register/RegistrationForm'
export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {}
  }

  /* Render Method */
  render() {
    return(
      <div id="landing">
        <div className="col-md-4">
          <h3>Sketch your way to a great API.</h3>
        </div>
        <div className="col-md-3 registration-section">
            <RegistrationForm fromDashboard={false}/>
        </div>
      </div>
    )
  }
}
