import React from 'react'
import ReactDOM from 'react-dom'
import LoginForm from './LoginForm.jsx'


export default class extends React.Component{
  constructor(props) {
    super(props);
  }

  loginSucceeded() {

  }

  render() {
    return(
      <div><LoginForm loginSucceeded={this.loginSucceeded}/></div>
    )
  }
}
