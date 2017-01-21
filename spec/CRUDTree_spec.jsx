import React from 'react';
import { shallow } from 'enzyme';
import CRUDTree from '../src/js/CRUDTree.jsx';

describe('CRUDTree', function() {

let width = 1000;
let height = 800;

  it('can render an empty tree with a single root node', function() {
    const treeData =  {
      "id": 0,
      "name": "API",
      "children": []
    }

    const wrapper = shallow(<CRUDTree data={[treeData]} width={width} height={height} />);

    // Look for an SVG element
    expect(wrapper.find('svg').length).toEqual(1);

    console.log(wrapper.find('g').length);
    
    // Look for the g element
    const svg = wrapper.find('svg');
    expect(svg.find('g').length).toEqual(1);

  });
})
