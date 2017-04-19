import React from 'react';
import ProjectList from '../../../src/js/modules/projects/ProjectList.jsx';
import { browserHistory } from 'react-router'
import ReactTestUtils from 'react-addons-test-utils';
import { shallow, mount } from 'enzyme';


describe('ProjectList Component', function() {
  describe('Layout tests', function() {

    it('should display a single project item', function() {
      const projectList = [
        {
          id: 1,
          name: 'project 1',
          description: 'a project'
        }
      ];

      const wrapper = mount(<ProjectList projects={projectList} selectionHandler={function(selected) {}}/>);
      expect(wrapper.find('div.projectItem').length).toBe(1);
    })
  })

  it('should display a list of project items', function() {

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

    const wrapper = mount(<ProjectList projects={projectList} selectionHandler={function(selected) {}} />);
    expect(wrapper.find('div.projectItem').length).toBe(8);
  })
});
