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
      this.setState({url: nextProps.node.name})
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
    console.log('message body data updated');
    // persist the changes to the backend
    // notify the user
    this.props.dataChangeHandler(this.props.node.id, key, fields);
  }

  /* Render Method */
  render() {
    return(

      <div>
        <h4>{this.props.node.fullpath}</h4>
        <form className="form-horizontal">
          <div className="form-group">
            <label className="col-md-1 control-label pull-left">URI:</label>
            <div className="col-md-11">
              <input
                className="form-control"
                name="nodeUrl"
                type="text"
                placeholder="The URI of this endpoint"
                value={this.state.url}
                onChange={(e) => this.onChange(e)}/>
            </div>
          </div>
      </form>
        <BodyEditor node={this.props.node} updateHandler={(key,fields)=>this.nodeDataUpdated(key,fields)}/>
      </div>
    );
  }

}
