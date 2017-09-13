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

  // shouldComponentUpdate(nextProps, nextState) {
  //   return true;
  //   //console.log('shouldComponentUpdate - nextProps:', nextProps);
  //   //console.log('shouldComponentUpdate - nextState:', nextState);
  //   if( nextProps._buildingTree === true ){
  //     console.log('not updating - waiting for tree to be built');
  //     return false;
  //   } else {
  //     console.log('safe to udpate');
  //     return true;
  //   }
  //   return !nextProps._buildingTree;
  // }

  componentDidMount () {
    // console.log('CRUDTreeComponent - componentDidMount');
    this.initialize(this.svgElement);
    this.update(this.svgElement, this.props.rootNode, this.props.handler, this.props.selectedNode);
  }

  componentDidUpdate () {
    //  console.log('CRUDTreeComponent - componentDidUpdate');
    //  console.log(this.props.rootNode);
    this.update(this.svgElement, this.props.rootNode, this.props.handler, this.props.selectedNode);
  }

  componentWillUnmount () {
    this.destroy();
  }

  render() {
    const { width, height } = this.props
    return <svg ref={(e) => {this.svgElement = e;}} className='CRUDTreeSVG' width={ width } height={ height } />
  }

  initialize (svg, data, options) {

    // console.log('CRUDTreeComponent:initialize');

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

    // console.log('CRUDTreeComponent:initialize complete.');

  }

  update (svgElement, rootNode, handler, selectedNode) {

    // console.log('CRUDTree:update()');

    // Cleanup any existing graphs
    let svg = d3.select(svgElement);
    const g = this.state.g;

    g.selectAll("*").remove();

    let svgWidth = ($("svg").width());
    let svgHeight = ($("svg").height());

    //TODO: Set a pan extent so that the user can't lose the sketch by panning it away


    let zoom = d3.zoom();
    svg.call(zoom.on("zoom", () => {
      g.attr("transform", d3.event.transform);
    }));


    // Click handler for the svg object
    svg.on('click', function() {
      handler({
        name: "reset"
      });

      //console.log('TODO: deselect nodes if svg is clicked');
    })

    const root = d3.hierarchy(rootNode);
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
    //console.log('drawing nodes');
    let drawNodesResult = CRUDTree.drawNodes(svg, g, nodes, handler, selectedNode);
    //console.log('nodes drawn');
    let node = drawNodesResult.node
    node.exit().remove();

    //console.log('translations:', drawNodesResult.translations);

    // Move the position of the tree to the selected node
    // console.log('drawNodesResult:',drawNodesResult);
    //console.log(selectedNode);
    let offsetX = 0;
    let offsetY = 0;
    if(selectedNode) {
      //console.log('translations: ', drawNodesResult.translations[selectedNode.id]);
      offsetX = (0 - drawNodesResult.translations[selectedNode.id].y);
      offsetY = (0 - drawNodesResult.translations[selectedNode.id].x);
    }
    // console.log('after translations');
    const xPadding = 20;
    const yPadding = 20;
    //g.attr("transform", "translate(" + (offsetX + xPadding) + "," + (offsetY + yPadding) + ")");
    //zoom.translate([offsetX,offsetY]);
    let scale = 1;
    let translate = [offsetX + xPadding, offsetY + yPadding];
    svg.transition().duration(200)
    .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
    // console.log('finished update');

  }

  destroy () {
    // Optional clean up when a component is being unmounted...
  }

}
