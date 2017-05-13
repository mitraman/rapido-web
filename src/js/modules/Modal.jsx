import React from 'react'
import ReactDOM from 'react-dom'
import AlertContainer from 'react-alert'


export default class extends React.Component{

  constructor(props) {
    super(props)
  }

  render() {

    // Create button button bar
    let buttonBar = [];
    let modalFooter;

    // Only build a footer panel and button bar if buttons have been specified
    for( var i = 0; this.props.buttons &&  i < this.props.buttons.length; i++ ) {
      let button = this.props.buttons[i];
      buttonBar.push(<button key={button.id} type="button" className={button.className} id={button.id}>{button.label}</button>);
    }
    if( buttonBar.length > 0) {
      modalFooter = <div className="modal-footer">{buttonBar}</div>
    }

    return (
    <div id={this.props.id} className="modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 className="modal-title">{this.props.title}</h4>
          </div>
          <div className="modal-body">{this.props.body}</div>
          {modalFooter}
        </div>
      </div>
    </div>
    )
  }
}
