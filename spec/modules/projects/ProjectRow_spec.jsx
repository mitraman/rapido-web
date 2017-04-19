import React from 'react';
import ProjectRow from '../../../src/js/modules/projects/ProjectRow.jsx';
import { browserHistory } from 'react-router'
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';


describe('ProjectRow Component', function() {

  const projects = [
    { id: 1, name: 'project 1', description: 'a project description' },
    { id: 2, name: 'project 2', description: 'a second project description' },
    { id: 234, name: 'project 3', description: 'a project description again' },
    { id: 32, name: 'project 4', description: 'further project description' },
    { id: 123, name: 'project 5', description: 'another project description' }
  ];

  it('should render 5 project cells', function() {
    const wrapper = shallow(<ProjectRow projects={projects}/>);
    expect(wrapper.find('div.projectRow').length).toBe(1);
    expect(wrapper.find('div.projectRow').children().length).toBe(5);
  })

  it('should propogate a click handler', function() {

    let clickFunction = jasmine.createSpy('spy');

    const wrapper = shallow(<ProjectRow projects={projects} selectionHandler={clickFunction}/>);
    expect(wrapper.find('div.projectRow').length).toBe(1);
    expect(wrapper.find('div.projectRow').children().length).toBe(5);
    //expect(clickFunction).toHaveBeenCalled();

  })

});
