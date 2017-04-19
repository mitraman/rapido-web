import React from 'react';
import ProjectItem from '../../../src/js/modules/projects/ProjectItem.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';


describe('ProjectItem Component', function() {

  const project = {id: 1, name: 'project 1', description: 'a project'};

  it('should display a project item', function() {
    const wrapper = shallow(<ProjectItem project={project} selectionHandler={function(selected) {}} />);
    expect(wrapper.find('div.projectItem').length).toBe(1);

  })

  it('should display the project name', function() {
    const wrapper = shallow(<ProjectItem project={project} selectionHandler={function(selected) {}} />);
    expect(wrapper.find('div.projectName').text()).toBe(project.name);
  })

  it('should display the project description', function() {
    const wrapper = shallow(<ProjectItem project={project} selectionHandler={function(selected) {}} />);
    expect(wrapper.find('div.projectDescription').text()).toBe(project.description);
  })

});
