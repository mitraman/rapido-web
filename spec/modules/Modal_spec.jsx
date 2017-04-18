import React from 'react';
import Modal from '../../src/js/modules/Modal.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';

describe('Modal Component', function() {

  let modalId = 'thisId';
  let title = 'my modal title';
  let bodyText = 'body content';
  let body = <div>{bodyText}</div>

  beforeEach(function(){

  })

  it('should render a modal with the specified id', function() {
    const wrapper = shallow(<Modal id={modalId}/>);
    let selector = 'div .modal [id="' + modalId + '"]';
    expect(wrapper.find(selector).length).toBe(1);
  })

  it('should render a modal with the specified title', function() {
    const wrapper = shallow(<Modal id={modalId} title={title}/>);
    expect(wrapper.find('div .modal-title').text()).toBe(title);
  })

  it('should render a modal with the specified body', function() {
    const wrapper = shallow(<Modal id={modalId} title={title} body={body} />);
    expect(wrapper.find('div .modal-body').childAt(0).text()).toBe(bodyText);
  })

  it( 'should render a single button with the correct label', function() {
    const buttonLabel = 'button label';
    let buttons = [{id:'button1', label: buttonLabel, className: 'btn-default'}]
    const wrapper = shallow(<Modal id={modalId} title={title} body={body} buttons={buttons}/>);
    //console.log(wrapper.find('div .modal-footer').debug());
    expect(wrapper.find('div .modal-footer').length).toBe(1);
    expect(wrapper.find('div #button1').text()).toBe(buttonLabel);
  })

  it(' should not render a footer if buttons are not supplied', function() {
    const wrapper = shallow(<Modal id={modalId} title={title} body={body}/>);
    expect(wrapper.find('div .modal-footer').length).toBe(0);
  })
});
