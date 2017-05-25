import React from 'react';
import NodeEditor from '../../../src/js/modules/sketch/NodeEditor.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';


describe('Node Editor', function() {

  let selectedNode = {
    id: 1,
    name: 'blah',
    fullPath: '/api/blah',
    children: []
  }

  xit('should render the name of the selected node', function() {
    const wrapper = shallow(<NodeEditor node={selectedNode}/>);
    expect(wrapper.find('div.nodeName').length).toBe(1);
    expect(wrapper.find('div.nodeName').text()).toBe(selectedNode.name);
  })

  xit('should render a form component for the node editor', function() {
    const wrapper = shallow(<NodeEditor node={selectedNode}/>);
    fail('to be implemented.');
  })


});
