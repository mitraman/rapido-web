import React from 'react';
import CRUDTree from '../../src/js/d3/CRUDTree.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import * as d3 from 'd3';


function addTreeNode(root, id, name, url, methods) {
let fullpath = url;
  if( root ) {
    fullpath = root.fullpath + url;
  }

  let newNode = {
    "id" : id,
    "name" : name,
    "url": url,
    "fullpath": fullpath,
  }

  if( root ) {
    if( !root.children ) {
      root.children = [];
    }
    root.children.push(newNode);
  }

  return newNode;

}

let svgElement, g = null;

describe('CRUDNodeTree', function() {

  beforeEach(function(){
    svgElement = ReactTestUtils.renderIntoDocument(<svg></svg>);
    g = d3.select(svgElement).append('g');

  })

  it('can render a single parent child tree', function() {

    // generate tree data
    let rootNode = addTreeNode(null, 0, "root", "", [])
    addTreeNode(rootNode, 1, "projects", "/projects", ["get"]);

    // parse the tree data and create a d3 tree object
    let root = d3.hierarchy(rootNode);
    let tree = d3.tree().size([300,600]);
    tree = tree(root);

    // draw the tree in the target SVG <g> container
    CRUDTree.drawNodes(g, tree);

    expect(svgElement.childNodes.length).toBe(1);
    let gElement = svgElement.firstChild;
    expect(gElement.tagName).toBe('g');

    // make sure that the name, url, full path and methods are rendered


  });
})
