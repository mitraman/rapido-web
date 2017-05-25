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
    "data": {
      get: { enabled: true },
      put: { enabled: false }
    }
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

  it('can render a root node', function() {
    let treeRoot = {
      name: "ROOT",
      isRoot: true,
      children: []
    };

    let root = d3.hierarchy(treeRoot);
    let tree = d3.tree().size([300,600]);
    let nodes = tree = tree(root);

    // draw the tree in the target SVG <g> container
    CRUDTree.drawNodes(g, tree);

    expect(svgElement.childNodes.length).toBe(1);
    let gElement = svgElement.firstChild;
    expect(gElement.tagName).toBe('g');

    // Make sure there is only a single node drawn
    expect(gElement.childNodes.length).toBe(1);
    let rootNode = gElement.firstChild;

    // Make sure the first group is a root-node
    expect(rootNode.classList.contains('root-node')).toBe(true);
  })

  it('can render a root with three root node children', function() {
    let treeRoot = {
      name: "ROOT",
      isRoot: true,
      children: []
    };

    addTreeNode(treeRoot, 1, "root1", "/root1", ["get"]);
    addTreeNode(treeRoot, 12, "root2", "/root2", ["get"]);
    addTreeNode(treeRoot, 32, "root3", "/root3", ["get"]);

    let root = d3.hierarchy(treeRoot);
    let tree = d3.tree().size([300,600]);
    let nodes = tree = tree(root);

    // draw the tree in the target SVG <g> container
    CRUDTree.drawNodes(g, tree);

    expect(svgElement.childNodes.length).toBe(1);
    let gElement = svgElement.firstChild;
    expect(gElement.tagName).toBe('g');

    // Make sure all of the nodes are drawn
    expect(gElement.childNodes.length).toBe(4);

    for (var i = 0; i < gElement.children.length; i++) {
      let node = gElement.children.item(i);
      if( i === 0 ) {
        // Make sure the first group is a root-node
        expect(node.classList.contains('root-node')).toBe(true);
      }else {
        expect(node.classList.contains('node')).toBe(true);
        expect(node.classList.contains('node--leaf')).toBe(true);
      }
    }
  })

  it('can render a tree with 100 nodes', function() {


    const siblings = 3;
    let nodeCount = 0;
    const maxNodes = 100;

    // generate tree data
    let treeRoot = {
      name: "ROOT",
      isRoot: true,
      children: []
    };
    nodeCount++;

    let addNodes = function(root) {
      //console.log('addNode called for :', root);
      for( let i = 0; i < siblings; i++ ) {
        let id = nodeCount+1;

        if(nodeCount < maxNodes) {
          //console.log('adding node#' + id);
          let newNode = addTreeNode(root, id, "node"+id, "/node", ["get"]);
          nodeCount++;
          addNodes(newNode);
        }
      }
    }

    addNodes(treeRoot);

    // parse the tree data and create a d3 tree object
    let root = d3.hierarchy(treeRoot);
    let tree = d3.tree().size([300,600]);
    tree = tree(root);

    // draw the tree in the target SVG <g> container
    CRUDTree.drawNodes(g, tree);

    expect(svgElement.childNodes.length).toBe(1);
    let gElement = svgElement.firstChild;
    expect(gElement.tagName).toBe('g');

    // Make sure all of the nodes are drawn
    expect(gElement.childNodes.length).toBe(100);

    // make sure that the name, url, full path and methods are rendered
  });


  xit('TODO: calls the event handler on a RECT click', function(done) {

    // TODO: Need to figure out why click simulation isn't working.

    let treeRoot = {
      name: "ROOT",
      isRoot: true,
      children: []
    };

    addTreeNode(treeRoot, 1, "root1", "/root1", ["get"]);
    addTreeNode(treeRoot, 12, "root2", "/root2", ["get"]);
    addTreeNode(treeRoot, 32, "root3", "/root3", ["get"]);

    let root = d3.hierarchy(treeRoot);
    let tree = d3.tree().size([300,600]);
    let nodes = tree = tree(root);

    let eventHandler = function() {
      console.log('here');
      done();
    }

    // draw the tree in the target SVG <g> container
    CRUDTree.drawNodes(g, tree);

    expect(svgElement.childNodes.length).toBe(1);
    let gElement = svgElement.firstChild;
    expect(gElement.tagName).toBe('g');

    // Make sure all of the nodes are drawn
    expect(gElement.childNodes.length).toBe(4);

    // Find the first node
    let targetNode = null;
    let i = 0;
    while(!targetNode && i < gElement.children.length) {

      let node = gElement.children.item(i);
      if( node.classList.contains('node') ) {
        targetNode = node;
      }else {
        i++;
      }
    }

    expect(targetNode).not.toBeNull();
    console.log(targetNode);

    // Get the RECT for the target node
    let rect = targetNode.children.item(1);
    console.log(rect);
    ReactTestUtils.Simulate.click(rect);

  })

})
