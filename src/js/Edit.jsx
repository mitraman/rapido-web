import React from 'react'
import AceEditor from 'react-ace'
import EditObserver from './EditObserver'
import { browserHistory } from 'react-router'

import 'brace/mode/json'
import 'brace/theme/github'


function closeWindow() {
  // fire a close window event
  let observer = new EditObserver();
  let event = {
    id: "closewindow"
  };
  observer.notify({id: 'closeeditor'});
  // route back
  const path = "/nodes";
  browserHistory.push(path);
}

function onChange(evt) {

}

export default React.createClass({
  render() {
    return (
      <div>
        <input type="text"></input>
        <button type="button" className="btn btn-cancel btn-lg"
          onClick={() => closeWindow()}>Close</button>
        <AceEditor
          mode="json"
          theme="github"
          onChange={onChange}
          name="property-editor"
          editorProps={{$blockScrolling: true}}
          />,
      </div>
    )
  }
})
