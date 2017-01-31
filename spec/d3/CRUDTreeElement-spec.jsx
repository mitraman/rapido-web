import React from 'react';
import CRUDTreeElement from '../../src/js/d3/CRUDTreeElement.jsx';
import ReactTestUtils from 'react-addons-test-utils';

describe('CRUDTree', function() {

let width = 1000;
let height = 800;

  beforeEach(function(){

  })
  it('can render an empty tree with a single root node', function() {
    const treeData =  {
      "id": 0,
      "url": "API",
      "children": []
    }

    let clickHandler = {};

    let crudTree = ReactTestUtils.renderIntoDocument(<CRUDTreeElement
       data={ [treeData,
         clickHandler,
         { x: 0, y: 0 }]
       }
       width={width}
       height={height} />);

    let svgElement = ReactTestUtils.findRenderedDOMComponentWithTag(crudTree, 'svg');
    expect(svgElement.childNodes.length).toBe(1);
    let gElement = svgElement.firstChild;
    expect(gElement.tagName).toBe('g');

    // There should be a single API root element
    expect(gElement.childNodes.length).toBe(1);
    let gNodeEl = gElement.firstChild;
    expect(gNodeEl.tagName).toBe('g');
    // We need to use baseVal because this is an SVG element
    expect(gNodeEl.className.baseVal).toContain('node');
    // Make sure the node looks the way we expect


/*
    const wrapper = mount(<CRUDTree data={[treeData]} width={width} height={height} />);
    console.log(wrapper.children().length);
    console.log(wrapper.render());

    // Look for an SVG element
    expect(wrapper.find('svg.d3-wrap').length).toEqual(1);
**/
  });
})
