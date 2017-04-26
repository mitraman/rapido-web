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

    var tree = d3.tree()
      .size([treeHeight,treeWidth]);

    this.state = {
      g: g,
      tree: tree
    };

  },

  update (svg, data, options) {

    // Cleanup any existing graphs
    var svg = d3.select("svg > g");
    svg.selectAll("*").remove();

    // setup the container, root svg element passed in along with data and options
    const g = this.state.g;
    const rootNodes = data[0];
    const handler = data[1];
    console.log('rootNodes:',rootNodes);

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
    console.log(nodes);
    let node = CRUDTree.drawNodes(g, nodes, handler);
    node.exit().remove();

    // Move the position of the tree graph based on x and y parameters
    let offsetX = data[2].x;
    let offsetY = data[2].y;
    g.attr("transform", "translate(" + offsetX + "," + offsetY + ")");
  },

  destroy () {
    // Optional clean up when a component is being unmounted...
  }

});

export default CRUDTreeElement;
