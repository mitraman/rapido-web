import d3Wrap from 'react-d3-wrap'
import * as d3 from 'd3'
import CRUDTreeNode from './CRUDTreeNode'

import '../css/tree.css'

const CRUDTree = d3Wrap ({

  initialize (svg, data, options) {
    // Optional initialize method called once when component mounts
    const g = d3.select(svg)
      .append('g')
      .attr('transform', `translate(${options.margin.left}, ${options.margin.top})`);

    var tree = d3.tree()
      .size([300,600]);

    this.state = {
      g: g,
      tree: tree
    };

  },

  update (svg, data, options) {

    // Cleanup old graph
    var svg = d3.select("svg > g");
    svg.selectAll("*").remove();

    // setup container, root svg element passed in along with data and options
    const g = this.state.g;
    const treeData = data[0];
    const handler = data[1];
    var root = d3.hierarchy(treeData);
    var nodes = this.state.tree(root);



    // adds the links between the nodes
var link = g.selectAll(".tree-link")
    .data( nodes.descendants().slice(1), function(d) { return d.data.id; })
  .enter().append("path")
    .attr("class", "tree-link")
    .attr("d", function(d) {
        return "M" + (d.y) + "," + (d.x + CRUDTreeNode.halfBoxHeight())
            + " " + (d.parent.y + CRUDTreeNode.resourceBoxWidth()) + "," + (d.parent.x + CRUDTreeNode.halfBoxHeight());
      });



let node = CRUDTreeNode.drawNode(g, nodes, handler);
node.exit().remove();

  },

  destroy () {
    // Optional clean up when a component is being unmounted...
  }

});

export default CRUDTree;
