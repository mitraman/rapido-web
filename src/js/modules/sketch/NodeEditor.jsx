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
    //console.log('componentWillReceiveProps:', nextProps);
    if(nextProps.node.id  != this.props.node.id) {
      this.setState({url: nextProps.node.name});
    }
  }


  componentDidUpdate(prevProps, prevState) {
    // console.log('componentDidUpdate');
    if( prevProps.node.id != this.props.node.id ) {
        // console.log('setting focus');
        // this.urlField.focus();
    }

    //this.urlField.focus();
  }

  componentDidMount() {
    //console.log('NodeEditor componentDidMount');
    //this.urlField.focus();
  }

  onChange(e) {
    //TODO: Validate the change and don't allow illegal characters

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

    let bodyEditor =
    <BodyEditor
      vocabulary={this.props.vocabulary}
      node={this.props.node}
      updateHandler={(key,fields)=>this.nodeDataUpdated(key,fields)}/>

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
              ref={(input) => { this.urlField = input;}}
              onChange={(e) => this.onChange(e)}/>
          </div>
        </form>
        {bodyEditor}
      </div>
    );
  }

}
