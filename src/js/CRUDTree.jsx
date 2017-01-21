import d3Wrap from 'react-d3-wrap'
import * as d3 from 'd3'

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

    const resourceBoxWidth = 200;
    const resourceBoxHeight = 60;
    const halfBoxWidth = resourceBoxWidth / 2;
    const halfBoxHeight = resourceBoxHeight / 2;
    const urlLeftMargin = 5;

    // setup container, root svg element passed in along with data and options
    const g = this.state.g;
    const treeData = data[0];
    var root = d3.hierarchy(treeData);
    var nodes = this.state.tree(root);

    // adds the links between the nodes
var link = g.selectAll(".tree-link")
    .data( nodes.descendants().slice(1), function(d) { return d.data.id; })
  .enter().append("path")
    .attr("class", "tree-link")
    .attr("d", function(d) {
        return "M" + (d.y + (resourceBoxWidth/2)) + "," + (d.x + resourceBoxHeight/2)
            + "C" + (d.parent.y + 100) + "," + d.x
            + " " + (d.parent.y + 100) + "," + d.parent.x
            + " " + (d.parent.y + halfBoxWidth) + "," + (d.parent.x + halfBoxHeight);
      });

// adds each node as a group
var node = g.selectAll(".node")
    .data(nodes.descendants(), function(d) { return d.data.id; })
  .enter().append("g")
    .attr("class", function(d) { return "node" +
        (d.children ? " node--internal" : " node--leaf"); })
    .attr("transform", function(d) {
      return "translate(" + d.y + "," + d.x + ")"; });

node.exit().remove();

// adds the rectangle shape to the tree node
  node.append("rect")
          .attr("width", resourceBoxWidth)
          .attr("height", resourceBoxHeight)
  		//.attr("y",-30)
  		.style("display", function(d) {if(d.root) return 'none'})
          .attr("class", "node-uri");

// adds the text to the node
node.append("text")
  .attr("dy", ".35em")
  .attr("x", 10)
  .attr("y", function(d) { return d.children ? -20 : 20; })
  .style("text-anchor", "start")
  .text(function(d) { return d.data.url; });

  },

  destroy () {
    // Optional clean up when a component is being unmounted...
  }

});

export default CRUDTree;
