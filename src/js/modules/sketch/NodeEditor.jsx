import React from 'react'
import ResponseEditor from './tree/ResponseEditor.jsx';

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
  }

  responseDataUpdated(responseData) {
    // persist the changes to the backend
    // notify the user
  }

  /* Render Method */
  render() {
    return(
      <div>
        <div className="nodeName"><h3>{this.props.node.name}</h3></div>
        <ResponseEditor node={this.props.node} updateHandler={this.responseDataUpdated}/>
      </div>
    );
  }

}
