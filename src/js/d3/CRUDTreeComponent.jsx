import React from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import CRUDTree from './CRUDTree'

import '../../css/tree.scss'

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.margin = {
      left: 0,
      top: 0
    }
  }

  componentDidMount () {
    this.initialize(this.svgElement);
    this.update(this.svgElement, this.props.rootNodes, this.props.handler, this.props.selectedNode);
  }

  componentDidUpdate () {
    this.update(this.svgElement, this.props.rootNodes, this.props.handler, this.props.selectedNode);
  }

  componentWillUnmount () {
    this.destroy();
  }

  render() {
    const { width, height } = this.props
    return <svg ref={(e) => {this.svgElement = e;}} className='CRUDTreeSVG' width={ width } height={ height } />
  }

  initialize (svg, data, options) {

    // initialize method called once when component mounts
    const g = d3.select(svg)
      .append('g')
      .attr('ref', 'sketch')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

      var levelWidth = [1];
      var levelDepth = [1];
      var treeWidth = ((d3.max(levelDepth) + 1) * CRUDTree.resourceBoxWidth());
      var treeHeight = ((d3.max(levelWidth) * 2) * CRUDTree.resourceBoxHeight() ) + 100;

    var tree = d3.tree()
      .nodeSize([CRUDTree.resourceBoxHeight() + 100, CRUDTree.resourceBoxWidth() + 100]);

    this.state = {
      g: g,
      tree: tree
    };
  }

  update (svgElement, rootNodes, handler, selectedNode) {

    //console.log(selectedNode);

    // Cleanup any existing graphs
    let svg = d3.select(svgElement);
    const g = this.state.g;
    g.selectAll("*").remove();

    let svgWidth = ($("svg").width());
    let svgHeight = ($("svg").height());

    svg.on('click', function() {
      console.log('svg clicked');
      console.log('TODO: deselect nodes if svg is clicked');
      console.log('TODO: stop propogating events when node is clicked so that svg.onClick does not get called');
    })

    // Create a default root node for the nodes
    let treeRoot = {
      name: "ROOT",
      isRoot: true,
      children: rootNodes
    };

    const root = d3.hierarchy(treeRoot);
    var nodes = this.state.tree(root);


    // draw link paths between the nodes in the tree
    var link = g.selectAll(".tree-link")
      .data( nodes.descendants().slice(1), function(d) { return d.data.id; })
      .enter().append("path")
      .attr("class", "tree-link")
      .attr("d", function(d) {
          return "M" + (d.y) + "," + (d.x + CRUDTree.halfBoxHeight())
              + " " + (d.parent.y + CRUDTree.resourceBoxWidth()) + "," + (d.parent.x + CRUDTree.halfBoxHeight());
        });

    // draw the tree nodes
    let drawNodesResult = CRUDTree.drawNodes(svg, g, nodes, handler, selectedNode);
    let node = drawNodesResult.node;
    node.exit().remove();

    //TODO: reposition on each node selection
    // Move the position of the tree graph based on a selected node
    let offsetX = (0 - drawNodesResult.translations['root'].y);
    let offsetY = ( 0 - drawNodesResult.translations['root'].x);
    if( selectedNode ) {
      // Move the position of the tree to the selected node
      offsetX = (0 - drawNodesResult.translations[selectedNode.id].y) + 300;
      offsetY = (0 - drawNodesResult.translations[selectedNode.id].x);
    }

    // Use less of an x offset for the initial root node
    //const xPadding = svgWidth / 2;
    const xPadding = 100;
    const yPadding = svgHeight / 2;
    //g.attr("transform", "translate(" + (offsetX + xPadding) + "," + (offsetY + yPadding) + ")");

    //TODO: Set a pan extent so that the user can't lose the sketch by panning it away

    svg.call(d3.zoom()
      .on("zoom", () => {
        //console.log('zoom called');
        //node.attr("transform", d3.event.transform);
        g.attr("transform", d3.event.transform);
    }));

  }

  destroy () {
    // Optional clean up when a component is being unmounted...
  }

}
