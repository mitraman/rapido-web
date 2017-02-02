import React from 'react';
import Login from '../src/js/LoginComponent.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';

let loginForm = null;

describe('Login Component', function() {

  beforeEach(function(){
  })

  it('should contain a single form with username and password fields', function() {
    const wrapper = shallow(<Login />);
    const form = wrapper.find('form');
    expect(form.length).toBe(1);
    expect(form.find('#InputUserID input').length).toBe(1);
    expect(form.find('#InputPassword input').length).toBe(1);
  })


  it('should trigger a submit event on login submission', function(done) {

    // Sadly, enzyme does not propogate events, so a click button simluation will not
    // trigger the onSubmit form event.  Instead we can use React Test Utils

    const userId = 'test-user';
    const password = 'password';

    const loginHandler = function(params) {
      // TODO: re-enable these tests.
      //expect(params.userId).toBe(userId);
      //expect(params.password).toBe(password);
      done();
    };

    const result = ReactTestUtils.renderIntoDocument(<Login onSubmit={loginHandler}/>)

    const loginForm =
      ReactTestUtils.findRenderedDOMComponentWithTag(result, 'form');

    let userIdField =
      ReactTestUtils.findAllInRenderedTree(result, function(inst) {
        return( ReactTestUtils.isDOMComponent(inst) && inst.getAttribute('id') === 'InputUserID');
    });

    let passwordField =
    ReactTestUtils.findAllInRenderedTree(result, function(inst) {
      return( ReactTestUtils.isDOMComponent(inst) && inst.getAttribute('id') === 'InputPassword');
    });

    userIdField[0].setAttribute('value','ronnie');
    ReactTestUtils.Simulate.change(userIdField[0]);
    passwordField[0].value = password;

/*  console.log(loginForm.refs);
    loginForm.refs.inputUserId.getDOMNode().value = userId;
    loginForm.refs.inputPassword.getDOMNode().value = password;
*/
    ReactTestUtils.Simulate.submit(loginForm);

  });
})
