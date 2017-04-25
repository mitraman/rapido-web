import React from 'react'
import AlertContainer from 'react-alert';
import Backend from '../adapter/Backend.js';

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    console.log('sketch mounted');
  }

  /* Render Method */
  render() {

    return(
      <div id="sketch">Hi there.
      </div>
    )
  }
}
