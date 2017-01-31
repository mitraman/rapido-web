import React from 'react'
import ReactDOM from 'react-dom'

function onSubmit() {

}

export default class extends React.Component{
  constructor(props) {
      super(props);

      this.state = {
        userId: '',
        password: ''
      };
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    console.log('handleChange');
    console.log(event.type);
    console.log(event.target);
    console.log(event.target.id);
    console.log(event.target.value);

  }

  handleSubmit(event) {
    this.props.onSubmit(
      {
        userId: this.state.userId,
        password: this.state.password
      });
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="InputUserID">User ID</label>
          <input
            type="text"
            value={this.state.userId}
            onChange={this.handleChange}
            className="form-control"
            id="InputUserID"
            placeholder="User ID"/>
        </div>
        <div className="form-group">
          <label htmlFor="InputPassword">Password</label>
          <input
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
            className="form-control"
            id="InputPassword"
            placeholder="Password"/>
        </div>
        <button type="submit" className="btn btn-default">Submit</button>
      </form>
    )
  }
}
