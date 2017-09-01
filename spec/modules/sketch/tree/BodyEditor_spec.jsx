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


});
