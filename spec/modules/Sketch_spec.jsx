import React from 'react';
import Sketch from '../../src/js/modules/Sketch.jsx';
import ReactTestUtils from 'react-addons-test-utils';
import DelayedNodeUpdate from '../../src/js/adapter/DelayedNodeUpdate.js'
import Backend from '../../src/js/adapter/Backend.js';
import CRUDTreeComponent from '../../src/js/d3/CRUDTreeComponent.jsx';
import { shallow, mount } from 'enzyme';
import { MemoryRouter as Router } from 'react-router-dom';

describe('Sketch Component', function() {

  beforeAll(function() {
    this.userObject = {token: 'token'};
    this.projectId = 1;
    this.sketchIteration = 1;
  })

  beforeEach(function() {
    this.sketches = [
      {
        id: 1,
        rootNode:  {}
      }
    ];
    this.projectId = 1;
    this.userObject = {};
  });

  let createNode = function(nodeId, parentId) {
    let generateMethodData = function(methodName) {
      return {
        enabled: false,
        request: {
          contentType: 'application/json',
          queryParams: '',
          body: ''
        },
        response: {
          contentType: 'application/json',
          status: '204',
          body: ''
        }
      }
    };

    return {
      id: nodeId,
      parentId: parentId,
      name: nodeId+'-name',
      fullpath: 'fullpath',
      children: [],
      data: {
        get: generateMethodData('get'),
        put: generateMethodData('put'),
        post: generateMethodData('post'),
        delete: generateMethodData('delete'),
        patch: generateMethodData('patch')
      }
    }
  }

/*
<Sketch
 sketches={this.state.sketches}
 projectId={routeProps.match.params.projectId}
 sketchIteration={routeProps.match.params.sketchIteration}
 userObject={this.props.userObject}/> }} />
 */

  it('should pass an empty sketch tree to the CRUDTree component', function() {
    let root = createNode('root');
    root.type = 'root';
    this.sketches[0].rootNode = root;

    const wrapper = shallow(<Sketch
      sketches={this.sketches}
      sketchIteration={1}/>);

    let CRUDTree = wrapper.find(CRUDTreeComponent);
    expect(CRUDTree.exists()).toBe(true);

    expect(CRUDTree.prop('selectedNode').id).toBe('root');
    expect(CRUDTree.prop('rootNode').children).toEqual([]);
  })

  it('should pass a tree to the CRUDTree Component', function() {
    // Create a test tree
    let root = createNode('root');
    root.type = 'root';
    let rootNode1 = createNode('root1', root.id);
    let rootNode2 = createNode('root2', root.id);
    let childNode1 = createNode('child1', rootNode1.id)
    rootNode1.children.push(childNode1);
    let grandChildNode1 = createNode('gc1', childNode1.id);
    let grandChildNode2 = createNode('gc2', childNode1.id);
    childNode1.children.push(grandChildNode1);
    childNode1.children.push(grandChildNode2);

    root.children.push(rootNode1);
    root.children.push(rootNode2);

    this.sketches[0].rootNode = root;

    const wrapper = shallow(<Sketch
      sketches={this.sketches}
      sketchIteration={1}/>);

    let CRUDTree = wrapper.find(CRUDTreeComponent);
    expect(CRUDTree.exists()).toBe(true);

    expect(CRUDTree.prop('selectedNode').id).toBe('root');
    expect(CRUDTree.prop('rootNode').children.length).toBe(2);
    let renderedTree = CRUDTree.prop('rootNode').children;
    expect(renderedTree[0].name).toBe(rootNode1.name);
    expect(renderedTree[0].children.length).toBe(1);
    expect(renderedTree[0].children[0].name).toBe(childNode1.name);
    expect(renderedTree[0].children[0].children.length).toBe(2);
    expect(renderedTree[0].children[0].children[0].name).toBe(grandChildNode1.name);
  });

  // Not implemneted yet
  // Will be implmented when we turn on sketch selection
  xit('should re-render the tree when the selected sketch is changed', function() {
    // Create a test tree
    let root = createNode('root');
    root.type = 'root';
    let rootNode1 = createNode('root1', root.id);
    let rootNode2 = createNode('root2', root.id);
    root.children.push(rootNode1);
    root.children.push(rootNode2);

    let newSketch = {
      id: '2',
      rootNode: root
    };

    let root_sketch1 = createNode('root-sketch-1');
    root_sketch1.type = 'root';
    this.sketches[0].rootNode = root_sketch1;

    this.sketches.push(newSketch);

    const wrapper = shallow(<Sketch
      sketches={this.sketches}
      sketchIteration={1}/>);

    let CRUDTree = wrapper.find(CRUDTreeComponent);
    expect(CRUDTree.exists()).toBe(true);

    expect(CRUDTree.prop('selectedNode').id).toBe('root-sketch-1');
    expect(CRUDTree.prop('rootNode').children.length).toBe(0);

    // Change the selected sketch iteration
    wrapper.setProps({sketchIteration: 2});
    // For some reason I need to set an additional prop to make Enzyme call willUpdate
    wrapper.setProps({triggerUpdate: true});
    expect(CRUDTree.prop('selectedNode').id).toBe('root');
    expect(wrapper.find(CRUDTreeComponent).prop('rootNode').children.length).toBe(2);
  })

  //TBD
  xit('should re-render the tree when the project is changed', function() {
    fail('to be implemented');
  })


  it('should schedule a backend write when the URI is changed', function(done) {

    let userObject = {token: 'token'};
    let projectId = 1;
    let sketchIteration = 1;

    let root = createNode('root');
    root.type = 'root';
    let node = createNode('my-node', root.id);
    root.children.push(node);
    this.sketches[0].rootNode = root;

    const wrapper = shallow(<Sketch
      sketches={this.sketches}
      projectId={projectId}
      userObject={userObject}
      sketchIteration={sketchIteration}/>);

    // Fake the Delayed Writer
    spyOn(wrapper.instance().delayedNodeUpdate, 'write').and
    .callFake((token, _projectId, _sketchIteration, nodeId, updateObject, interval) => {
      return new Promise((resolve, reject) => {
        expect(token).toBe(userObject.token);
        expect(_projectId).toBe(projectId);
        expect(_sketchIteration).toBe(sketchIteration);
        expect(nodeId).toBe(node.id);
        expect(updateObject.name).toBe('/new/value');
        done();
        resolve();
      });
    });

    wrapper.setState({selectedNode: node});

    wrapper.instance().uriChanged(node.id, '/new/value');

  })

  it('should update in-memory descendant node names when the URI is changed', function(done) {
    let userObject = {token: 'token'};
    let projectId = 1;
    let sketchIteration = 1;
    let root = createNode('root');
    root.type = 'root';
    root.fullpath = '';
    let node = createNode('my-node', root.id);
    let child1 = createNode('child1', node.id);
    let child2 = createNode('child2', node.id);
    let gc1 = createNode('gc1', child2.id);

    let newValue = 'new-value';

    root.children.push(node);
    node.children.push(child1);
    node.children.push(child2);
    child2.children.push(gc1);

    this.sketches[0].rootNode = root;

    const wrapper = shallow(<Sketch
      sketches={this.sketches}
      projectId={projectId}
      userObject={userObject}
      sketchIteration={sketchIteration}/>);

    // Fake the Delayed Writer
    spyOn(wrapper.instance().delayedNodeUpdate, 'write').and
    .callFake((token, _projectId, _sketchIteration, nodeId, updateObject, interval) => {
      return new Promise((resolve, reject) => {
        // Make sure that the child nodes have been updated
        expect(gc1.fullpath).toBe('/' + newValue + '/' + child2.name + '/' + gc1.name);
        done();
        resolve();
      });
    });

    wrapper.setState({selectedNode: node});
    wrapper.instance().uriChanged(node.id, newValue);

  });

  describe('delete handler', function() {


    beforeEach(function(){
      // Setup the tree
      let root = createNode('root');
      root.type = 'root';
      let node = createNode('my-node', root.id);
      let child1 = createNode('child1', node.id);
      let child2 = createNode('child2', node.id);
      let gc1 = createNode('gc1', child2.id);

      root.children.push(node);
      node.children.push(child1);
      node.children.push(child2);
      child2.children.push(gc1);

      this.sketches[0].rootNode = root;
    })

    it('should flush the write queue before executing a delete', function(done) {
      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        projectId={this.projectId}
        userObject={this.userObject}
        sketchIteration={this.sketchIteration}/>);

      spyOn(wrapper.instance().delayedNodeUpdate, 'flush').and.callFake(() => {
        done();
      });

      wrapper.instance().clickHandler({name: 'detail', source: 'child2'});
      wrapper.instance().handleDeleteConfirmed();

    });

    it('should call the Backend to delete the selectedNode', function(done) {
      spyOn(Backend, 'deleteNode').and.callFake((tkn, projectId, sketchIteration, nodeId) => {
        expect(nodeId).toBe('child2');
        return new Promise((resolve,reject) => {
          resolve({});
        })
      })

      spyOn(Backend, 'getSketch').and.callFake(() => {
        return new Promise((resolve,reject) => {
          // delete 'child2' from the tree and return it
          this.sketches[0].rootNode.children[0].children.splice(1,1);

          resolve({
            sketch:{
              rootNode: this.sketches[0].rootNode
            }
          });
          done();
        })
      })

      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        projectId={this.projectId}
        userObject={this.userObject}
        sketchIteration={this.sketchIteration}/>);

      wrapper.instance().clickHandler({name: 'detail', source: 'child2'});
      wrapper.instance().handleDeleteConfirmed();

    })
  })

  describe('keypress handler', function() {

    beforeEach(function(){
      // Setup the tree
      let root = createNode('root');
      root.type = 'root';
      let node = createNode('my-node', root.id);
      let root2 = createNode('root2', root.id);
      let root3 = createNode('root3', root.id);
      let root4 = createNode('root4', root.id);
      let child1 = createNode('child1', node.id);
      let child2 = createNode('child2', node.id);
      let child3 = createNode('child3', node.id);
      let gc1 = createNode('gc1', child2.id);

      node.children.push(child1);
      node.children.push(child2);
      node.children.push(child3);
      child2.children.push(gc1);

      root.children.push(node);
      root.children.push(root2);
      root.children.push(root3);
      root.children.push(root4);
      this.sketches[0].rootNode = root;
    })

    it('should move to the middle root node on a right arrow', function() {
      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        sketchIteration={1}/>);
      wrapper.instance().handleKeyPress({key: 'ArrowRight'});
      expect(wrapper.state('selectedNode').id).toBe('root2');
    })

    it('should move to the middle child of a root node', function() {
      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        sketchIteration={1}/>);

      wrapper.instance().clickHandler({name: 'detail', source: 'my-node'});
      wrapper.instance().handleKeyPress({key: 'ArrowRight'});
      expect(wrapper.state('selectedNode').id).toBe('child2');
    })

    it('should not move right on a childless node', function() {
      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        sketchIteration={1}/>);

      // Select the grandchild node
      wrapper.instance().clickHandler({name: 'detail', source: 'gc1'});
      wrapper.instance().handleKeyPress({key: 'ArrowRight'});
      expect(wrapper.state('selectedNode').id).toBe('gc1');
    })

    it('should move left on a left arrow', function() {
      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        sketchIteration={1}/>);

      // Select the grandchild node
      wrapper.instance().clickHandler({name: 'detail', source: 'gc1'});

      wrapper.instance().handleKeyPress({key: 'ArrowLeft'});
      expect(wrapper.state('selectedNode').id).toBe('child2');
    })

    it('should move to the API root on a left arrow from a root node', function() {
      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        sketchIteration={1}/>);

      // Select the grandchild node
      wrapper.instance().clickHandler({name: 'detail', source: 'my-node'});

      wrapper.instance().handleKeyPress({key: 'ArrowLeft'});
      expect(wrapper.state('selectedNode').id).toBe('root');
    })

    it('should do nothing on a left arrow from the API root', function() {
      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        sketchIteration={1}/>);

      wrapper.instance().handleKeyPress({key: 'ArrowLeft'});
      expect(wrapper.state('selectedNode').id).toBe('root');
    })

    it('should do nothing on an up arrow from the API root', function() {
      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        sketchIteration={1}/>);

      wrapper.instance().handleKeyPress({key: 'ArrowUp'});
      expect(wrapper.state('selectedNode').id).toBe('root');
    })

    it('should do nothing on an up arrow on a first sibling', function() {
      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        sketchIteration={1}/>);

      // Select the grandchild node
      wrapper.instance().clickHandler({name: 'detail', source: 'my-node'});

      wrapper.instance().handleKeyPress({key: 'ArrowUp'});
      expect(wrapper.state('selectedNode').id).toBe('my-node');
    })

    it('should move to the previous sibling on an up arrow', function() {
      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        sketchIteration={1}/>);

      // Select the grandchild node
      wrapper.instance().clickHandler({name: 'detail', source: 'child2'});

      wrapper.instance().handleKeyPress({key: 'ArrowUp'});
      expect(wrapper.state('selectedNode').id).toBe('child1');
    })

    it('should do nothing on a down arrow from the API root', function() {
      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        sketchIteration={1}/>);

      wrapper.instance().handleKeyPress({key: 'ArrowDown'});
      expect(wrapper.state('selectedNode').id).toBe('root');
    })

    it('should do nothing on a down arrow on a last sibling', function() {
      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        sketchIteration={1}/>);

      // Select the grandchild node
      wrapper.instance().clickHandler({name: 'detail', source: 'child3'});

      wrapper.instance().handleKeyPress({key: 'ArrowDown'});
      //console.log(wrapper.state('selectedNode').id);
      expect(wrapper.state('selectedNode').id).toBe('child3');
    })

    it('should move to the next sibling on a down arrow', function() {
      const wrapper = shallow(<Sketch
        sketches={this.sketches}
        sketchIteration={1}/>);

      // Select the grandchild node
      wrapper.instance().clickHandler({name: 'detail', source: 'child1'});

      wrapper.instance().handleKeyPress({key: 'ArrowDown'});
      expect(wrapper.state('selectedNode').id).toBe('child2');
    })

  })

});
