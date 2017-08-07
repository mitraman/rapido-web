import React from 'react';
import BodyEditor from '../../../../src/js/modules/sketch/tree/BodyEditor.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';


describe('Response Body Editor', function() {

  let selectedNode = {
    id: 1,
    name: 'blah',
    fullPath: '/api/blah',
    data: {
      get: {
        enabled: true,
        request: {
          contentType : 'application/json',
          queryParams : '?param=value',
          body : 'requestText'
        },
        response: {
          contentType : 'application/json',
          status : '200',
          body : 'responseText'
        }
      },
      put: {
        enabled: false,
        request: {
          contentType : 'application/json',
          queryParams : '',
          body : '{}'
        },
        response: {
          contentType : 'application/json',
          status : '200',
          body : '{}'
        }
      },
      delete: {
        enabled: true,
        request: {
          contentType : 'application/json',
          queryParams : '',
          body : 'delete requestBody'
        },
        response: {
          contentType : 'application/json',
          status : '200',
          body : 'delete responesBody'
        }
      }
    },
    children: []
  }


  it('should display the response body of the GET method for editing by default', function() {
    const wrapper = mount(<BodyEditor node={selectedNode}/>);
    expect(wrapper.instance().responseEditor.getValue()).toBe(selectedNode.data['get'].response.body);
    expect(wrapper.instance().requestEditor.getValue()).toBe(selectedNode.data['get'].request.body);
  })

  it('should set the state of the PATCH method response to empty if it is not provided', function() {
    const wrapper = mount(<BodyEditor node={selectedNode}/>);
    //console.log(wrapper.state('data'));
    expect(wrapper.state('data').patch.response.body).toBe('');
    expect(wrapper.state('data').patch.request.body).toBe('');
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
      const wrapper = mount(<BodyEditor node={selectedNode} updateHandler={updateHandlerSpy}/>);
      wrapper.instance().onEditorChange(null, 'responseBody' );
      expect(updateHandlerSpy).not.toHaveBeenCalled();
      jasmine.clock().tick(persistenceDelay);
      expect(updateHandlerSpy).toHaveBeenCalled();

    })

    it('should provide unaltered data to the update handler', function(done) {
      let callCount = 0;

      let updateHandler = function(methodName, updateData) {
        expect(updateData).toBeDefined();
        let responseBody = selectedNode.data.get.response.body;
        expect(updateData.response.body).toBe(responseBody);
        done();
      }

      const wrapper = mount(<BodyEditor node={selectedNode} updateHandler={updateHandler}/>);
      wrapper.instance().onEditorChange(null, 'responseBody' );
      jasmine.clock().tick(persistenceDelay);

    })

    it('should provide updated data to the update handler', function(done) {
      let updatedData = 'new text';

      let callCount = 0;
      let updateHandler = function(methodName, data) {
        if( callCount === 0 ) {
          callCount++;
          return;
        }
        expect(data).toBeDefined();
        //console.log(data);
        expect(data.response.body).toBe(updatedData);
        done();
      }

      const wrapper = mount(<BodyEditor node={selectedNode} updateHandler={updateHandler}/>);
      wrapper.instance().responseEditor.setValue(updatedData);
      wrapper.instance().onEditorChange(null, 'responseBody' );
      jasmine.clock().tick(persistenceDelay);

    })

  })



});
