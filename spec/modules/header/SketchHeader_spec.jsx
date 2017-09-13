import React from 'react';
import SketchHeader from '../../../src/js/modules/header/SketchHeader.jsx';
import Backend from '../../../src/js/adapter/Backend.js';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow } from 'enzyme';

describe('Sketch Header Component', function() {

  const userObject = {
    token: 'blah',
    email: 'test@test.com',
    fullName: 'Ronnie Mitra',
    nickName: 'nickName',
    userId: 12
  }

  const project = {
    name: 'sample project'
  }

  beforeEach(function(){
  })

  it('should call the backend to create a sketch when the create sketch is called', function() {
    spyOn(Backend, 'createSketch').and.callFake( (token, projectId) => {
      expect(token).toBe(userObject.token)
      expect(projectId).toBe(project.id);
      return new Promise( (resolve,reject) => {
        resolve({
          sketch: {
            id: 1,
            index: 2,
            createdAt: '',
            rootNode: {}
          }
        })
      })
    })

    const wrapper = shallow(<SketchHeader userInfo={userObject} project={project}/>);
    wrapper.instance().createSketch();
  })

  //TODO: Need to figure out how to show the error
  xit('should alert the user if a sketch could not be created', function() {
    spyOn(Backend, 'createSketch').and.callFake( (token, projectId) => {
      expect(token).toBe(userObject.token)
      expect(projectId).toBe(project.id);
      return new Promise( (resolve,reject) => {
        reject();
      })
    })


    const wrapper = shallow(<SketchHeader userInfo={userObject} project={project}/>);
    wrapper.instance().createSketch();
  })


});
