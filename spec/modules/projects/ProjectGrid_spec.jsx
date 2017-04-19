import React from 'react';
import ProjectGrid from '../../../src/js/modules/projects/ProjectGrid.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';


describe('ProjectGrid Component', function() {
  describe('Layout tests', function() {

    it('should display a single project thumbnail', function() {
      const projectList = [
        {
          id: 1,
          name: 'project 1',
          description: 'a project'
        }
      ];

      const wrapper = mount(<ProjectGrid projects={projectList} selectionHandler={function(selected) {}}/>);
      expect(wrapper.find('div.projectCell').length).toBe(1);
    })
  })

  it('should display a 3x3 grid for 8 projects', function() {

    const projectList = [
      {id: 1, name: 'project 1', description: 'a project'},
      {id: 2, name: 'project 2', description: 'a project'},
      {id: 3, name: 'project 3', description: 'a project'},
      {id: 4, name: 'project 4', description: 'a project'},
      {id: 5, name: 'project 5', description: 'a project'},
      {id: 6, name: 'project 6', description: 'a project'},
      {id: 7, name: 'project 7', description: 'a project'},
      {id: 8, name: 'project 8', description: 'a project'}
    ];

    const wrapper = mount(<ProjectGrid projects={projectList} selectionHandler={function(selected) {}} />);
    expect(wrapper.find('div.projectCell').length).toBe(8);
    expect(wrapper.find('div.projectRow').length).toBe(3);
  })
});
