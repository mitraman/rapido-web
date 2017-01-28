import React from 'react'
import AceEditor from 'react-ace'


function closeWindow() {
  // fire a close window event
  let observer = new EditObserver();
  let event = {
    id: "closewindow"
  };
  observer.notify({id: 'closewindow'});
}

function onChange(evt) {

}

export default React.createClass({
  render() {
    return (
      <div>
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
