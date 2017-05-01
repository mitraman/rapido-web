import d3Wrap from 'react-d3-wrap'
import * as d3 from 'd3'
import CRUDTree from './CRUDTree'

import '../../css/tree.css'

const CRUDTreeElement = d3Wrap ({

  initialize (svg, data, options) {

    // initialize method called once when component mounts
    const g = d3.select(svg)
      .append('g')
      .attr('ref', 'sketch')
      .attr('transform', `translate(${options.margin.left}, ${options.margin.top})`);

      var levelWidth = [1];
      var levelDepth = [1];
      var treeWidth = ((d3.max(levelDepth) + 1) * CRUDTree.resourceBoxWidth());
      var treeHeight = ((d3.max(levelWidth) * 2) * CRUDTree.resourceBoxHeight() ) + 100;

    // var tree = d3.tree()
    //   .size([treeHeight,treeWidth])
    //   .nodeSize([CRUDTree.resourceBoxHeight(), CRUDTree.resourceBoxWidth()]);

    var tree = d3.tree()
      .nodeSize([CRUDTree.resourceBoxHeight() + 100, CRUDTree.resourceBoxWidth() + 100]);

    this.state = {
      g: g,
      tree: tree
    };

  },

  update (svg, data, options) {

    // Cleanup any existing graphs
    var svg = d3.select("svg > g");
    svg.selectAll("*").remove();

    // Zoom and pan support
    let zoomed = function () {
      g.attr("transform", d3.event.transform);
    }

    let svgWidth = ($("svg").width());
    let svgHeight = ($("svg").height());
    let viewPort = svg.append("rect")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .style("fill", "none")
    .style("pointer-events", "all");

    /*
    The mouse based zoom and pan is jerky and unpredictable.  Need to figure out why before
    re-enabling this.
    .call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed));
        */

    // setup the container, root svg element passed in along with data and options
    const g = this.state.g;
    const rootNodes = data[0];
    const handler = data[1];

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
    let drawNodesResult = CRUDTree.drawNodes(g, nodes, handler);
    let node = drawNodesResult.node;
    node.exit().remove();

    //TODO: reposition on each node selection
    // Move the position of the tree graph based on a selected node
    let offsetX = (0 - drawNodesResult.translations['root'].y);
    let offsetY = ( 0 - drawNodesResult.translations['root'].x);
    // Use less of an x offset for the initial root node
    //const xPadding = svgWidth / 2;
    const xPadding = 100;
    const yPadding = svgHeight / 2;
    g.attr("transform", "translate(" + (offsetX + xPadding) + "," + (offsetY + yPadding) + ")");

  },

  destroy () {
    // Optional clean up when a component is being unmounted...
  }

});

export default CRUDTreeElement;
