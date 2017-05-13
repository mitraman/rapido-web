import React from 'react'
import BodyEditor from './tree/BodyEditor.jsx';

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      url: '',
      requestParams: '?'
    }
  }

  componentDidMount() {
  }

  onChange(e) {
    this.setState({url: e.target.value});
    if(e.target.name === 'nodeUrl') {
      // Notify the parent that the uri has changed
      this.props.uriChangeHandler(this.props.node.id, e.target.value);
    }
  }

  responseDataUpdated(responseData) {
    console.log('responseDataUpdated');
    // persist the changes to the backend
    // notify the user

  }

  /* Render Method */
  render() {
    return(
      <div>
        <div className="nodeName"><h3>{this.props.node.name}</h3></div>
        <div><input className="form-control" name="nodeUrl" type="text" value={this.state.url} onChange={(e) => this.onChange(e)}/></div>
        <BodyEditor node={this.props.node} updateHandler={this.responseDataUpdated}/>
      </div>
    );
  }

}
