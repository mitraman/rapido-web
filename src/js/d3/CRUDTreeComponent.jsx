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
    //console.log('componentDidMount');
    this.initialize(this.svgElement);
    this.update(this.svgElement, this.props.rootNodes, this.props.handler, this.props.selectedNode);
  }

  componentDidUpdate () {
    // console.log('componentDidUpdate');
    // console.log(this.props.rootNodes);
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

    // Cleanup any existing graphs
    let svg = d3.select(svgElement);
    const g = this.state.g;
    g.selectAll("*").remove();

    let svgWidth = ($("svg").width());
    let svgHeight = ($("svg").height());

    svg.on('click', function() {

      //console.log('svg clicked');
      handler({
        name: "reset"
      });
      /*
      console.log('TODO: deselect nodes if svg is clicked');
      console.log('TODO: stop propogating events when node is clicked so that svg.onClick does not get called');
      */


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

    //TODO: Set a pan extent so that the user can't lose the sketch by panning it away
    let zoom = d3.zoom();
    svg.call(zoom.on("zoom", () => {
      g.attr("transform", d3.event.transform);
    }));

    if( selectedNode === '/') {
      // Zoom out and center the graph
      let offsetX = 400;
      let offsetY = 200;

      let scale = 0.5;
      let translate = [offsetX, offsetY];
      svg.transition().duration(75)
      .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
    }
    else {
      // Move the position of the tree to the selected node
      //console.log(drawNodesResult.translations[selectedNode.id]);
      let offsetX = (0 - drawNodesResult.translations[selectedNode.id].y);
      let offsetY = (0 - drawNodesResult.translations[selectedNode.id].x);
      const xPadding = 20;
      const yPadding = 20;
      //g.attr("transform", "translate(" + (offsetX + xPadding) + "," + (offsetY + yPadding) + ")");
      //zoom.translate([offsetX,offsetY]);
      let scale = 1;
      let translate = [offsetX + xPadding, offsetY + yPadding];
      svg.transition().duration(200)
      .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
    }

    // Use less of an x offset for the initial root node
    //const xPadding = svgWidth / 2;



  }

  destroy () {
    // Optional clean up when a component is being unmounted...
  }

}
