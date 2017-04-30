import React from 'react';
import ResponseEditor from '../../../../src/js/modules/sketch/tree/ResponseEditor.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';


describe('Response Body Editor', function() {

  let selectedNode = {
    id: 1,
    name: 'blah',
    fullPath: '/api/blah',
    responseData: {
      'get': '{ "name": "value"}',
      'put': 'put data',
      'delete': 'delete data'
    },
    children: []
  }


  it('should display the body of the GET method for editing by default', function() {
    const wrapper = mount(<ResponseEditor node={selectedNode}/>);
    expect(wrapper.instance().editor.getValue()).toBe(selectedNode.responseData['get']);
  })

  it('should set the state of the PATCH method response to empty if it is not provided', function() {
    const wrapper = mount(<ResponseEditor node={selectedNode}/>);
    //console.log(wrapper.state('data'));
    expect(wrapper.state('data').patch).toBe('');
  })

  describe('delayed persistence', function() {
    const persistenceDelay = 3000;

    beforeEach(function() {
      jasmine.clock().install();
    });

    afterEach(function() {
      jasmine.clock().uninstall();
    });

    it('should update the response data on the backend three seconds after the last text update', function() {
      let updateHandlerSpy = jasmine.createSpy("updateHandlerSpy");
      const wrapper = mount(<ResponseEditor node={selectedNode} updateHandler={updateHandlerSpy}/>);
      wrapper.instance().onChange();
      expect(updateHandlerSpy).not.toHaveBeenCalled();
      jasmine.clock().tick(persistenceDelay);
      expect(updateHandlerSpy).toHaveBeenCalled();

    })

    it('should provide unaltered data to the update handler', function(done) {
      let updateHandler = function(responseData) {
        expect(responseData).not.toBeUndefined();
        expect(responseData.get).toBe(selectedNode.responseData.get);
        done();
      }

      const wrapper = mount(<ResponseEditor node={selectedNode} updateHandler={updateHandler}/>);
      wrapper.instance().onChange();
      jasmine.clock().tick(persistenceDelay);

    })

    it('should provide updated data to the update handler', function(done) {
      let updatedData = {
        get: 'new text'
      };
      let updateHandler = function(responseData) {
        expect(responseData).not.toBeUndefined();
        expect(responseData.get).toBe(updatedData.get);
        done();
      }

      const wrapper = mount(<ResponseEditor node={selectedNode} updateHandler={updateHandler}/>);
      wrapper.instance().editor.setValue(updatedData.get);
      wrapper.instance().onChange();
      jasmine.clock().tick(persistenceDelay);

    })

  })



});
