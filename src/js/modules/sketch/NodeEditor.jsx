import React from 'react'
import BodyEditor from './tree/BodyEditor.jsx';

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      url: this.props.node.name,
      requestParams: '?'
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.node.id  != this.props.node.id) {
      this.setState({url: nextProps.node.name});
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

  nodeDataUpdated(key, fields) {
    //console.log('message body data updated');
    // persist the changes to the backend
    // notify the user
    this.props.dataChangeHandler(this.props.node.id, key, fields);
  }

  /* Render Method */
  render() {

    let bodyEditor = <div/>
    if( this.props.node != '/') {
      bodyEditor = <BodyEditor node={this.props.node} updateHandler={(key,fields)=>this.nodeDataUpdated(key,fields)}/>
    }
    return(

      <div>
        <form>
          <div className="input-group form-group-sm">
            <span className="input-group-addon" id="basic-addon1">{this.props.prePath}</span>
            <input
              className="form-control"
              type="text"
              name="nodeUrl"
              id="formInputURI"
              placeholder="enter path segment here"
              value={this.state.url}
              onChange={(e) => this.onChange(e)}/>
          </div>
        </form>
        {bodyEditor}
      </div>
    );
  }

}
