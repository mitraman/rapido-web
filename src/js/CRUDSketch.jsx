import React from 'react'
import CRUDTree from './CRUDTree'
import EditObserver from './EditObserver'
import { browserHistory } from 'react-router'


// create an event handler for actions on CRUD nodes
class ClickHandler {
  fire(event, source) {
    if( event === "detail" ) {
      if( source ) {
        const path = '/nodes/' + source;
        browserHistory.push(path);
      }else {
        console.log.warn('Invalid node ID:' + source);
      }
    } else if( event === "add" ) {

    }
  }
}

export default class extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      treeData: {
        "id": 0,
        "name": "API",
        "children": [
          { "id" : 1, "name" : "projects", "url": "/projects", "fullpath": "/projects", "get": true}
        ]
      }
    }

    // add an observer for the child edit view
    let observer = new EditObserver();
    observer.addObserver(function(event) {
      console.log(event.id);
    }) 
  }

  render() {
    return (
      <div className="row">
      <div>
        <CRUDTree
          data={[this.state.treeData, new ClickHandler()]}
          width={1000} height={600}
          options={ {
            border: "2px solid black",
            margin: {
                top: 0,
                bottom: 0,
                left: 50,
                right: 0
            } }
          }/>
      </div>
      <div>
        {this.props.children}
      </div>
      </div>
    )
  }
}
