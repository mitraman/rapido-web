import React from 'react';
import ProjectCell from '../../../src/js/modules/projects/ProjectCell.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';


describe('ProjectCell Component', function() {

  const project = {
      id: 1,
      name: 'project 1',
      description: 'a project'
    };

  it('should display the name of the project', function() {
    const wrapper = shallow(<ProjectCell project={project}/>);
    expect(wrapper.find('div.projectCell').length).toBe(1);
    expect(wrapper.find('h3.projectName').text()).toBe(project.name);
  })

  it('should display the description of the project', function() {
    const wrapper = shallow(<ProjectCell project={project}/>);
    expect(wrapper.find('div.projectDescription').text()).toBe(project.description);
  })

  it('should render a link that calls a function with the id of the project', function() {

    let clickFunction = jasmine.createSpy('spy');

    const wrapper = shallow(<ProjectCell project={project} selectionHandler={clickFunction}/>);
    let linkSelector = 'a#select' + project.id;
    expect(wrapper.find(linkSelector).length).toBe(1);

    wrapper.find(linkSelector).simulate('click');
    expect(clickFunction).toHaveBeenCalled();

  })

});
