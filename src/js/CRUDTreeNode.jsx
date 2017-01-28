
const resourceBoxWidth = 250;
const resourceBoxHeight = 90;
const halfBoxWidth = resourceBoxWidth / 2;
const halfBoxHeight = resourceBoxHeight / 2;
const urlLeftMargin = 10;
const urlFontSize = 18;
const fullPathFontSize = 8;

export default class {

  static resourceBoxWidth() { return resourceBoxWidth; }
  static resourceBoxHeight() { return resourceBoxHeight; }
  static halfBoxHeight() { return halfBoxHeight; }
  static halfBoxWidth() { return halfBoxWidth; }

  static drawNode(g, nodes, handler) {

  let node = g.selectAll(".node")
      .data(nodes.descendants(), function(d) {
        // Use the ID as the d3 identifier so that nodes can be replaced by ID
        return d.data.id;
      })
    .enter().append("g")
      .attr("class", function(d) { return "node" +
          (d.children ? " node--internal" : " node--leaf"); })
      .attr("id", function(d) { return d.data.id })
      .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")"; });



  // inbound connector
  node.append("circle")
    .attr("class", "connector-in")
    .attr("r", "5")
    .attr("transform", function(d) {
      return "translate(0,45)";
    });


  // CRUD Node
  node.append("rect")
          .attr("width", resourceBoxWidth)
          .attr("height", resourceBoxHeight)
          .attr("rx", 10)
          .attr("ry", 10)
  		    .attr("class", "node-uri")
          .on("click", function(d) {
            handler({
              name: "detail",
              source: d.data.id,
              x: d.y,
              y: d.x
            })
          });

  // CRUD Node URI (not the full path)
  node.append("text")
    .attr("font-size", urlFontSize)
    .attr("transform", function(d) {
      return "translate(" + urlLeftMargin + "," + ((resourceBoxHeight / 2)+ urlFontSize/2) + ")"
    })
    .style("pointer-events",  "none")
    .text(function(d) { return d.data.url; })

    // top separator
    node.append("path")
      .attr("class", "node-internal-border")
      .attr("d", function(d) {
          return "M0,20," + resourceBoxWidth + ",20"
      });

    // bottom separator
    node.append("path")
        .attr("class", "node-internal-border")
        .attr("d", function(d) {
            return "M0," + (resourceBoxHeight - 20) + "," + resourceBoxWidth + "," + (resourceBoxHeight - 20);
      });

    // outbound node
    node.append("circle")
      .attr("r", "15")
      .attr("class", "connector-out")
      .attr("transform", function() {
        return "translate(" + resourceBoxWidth + "," + resourceBoxHeight / 2 +")";
      })
      .on("click", function(d) {
        console.log("out connector clicked");
        handler("add", d.data.id)
      });

    node.append("text")
      .attr("font-size", "18")
      .text("+")
      .attr("transform", function() {
        return "translate(" + (resourceBoxWidth - 5) + "," + (resourceBoxHeight / 2  + 5)+ ")";
      })
      .style("pointer-events",  "none")


    // Full URI path
    node.append("text")
      .attr("font-size", fullPathFontSize)
      .text(function(d) { return d.data.fullpath;})
      .attr("transform", "translate(10," + (resourceBoxHeight-7) + ")")
      .style("pointer-events",  "none")


    // Method badges
    let badges =
    node.append("g")
      .attr("class", "badges");

    badges.append("rect")
      .filter(function(d) { return d.data.get })
      .attr("width", 33)
      .attr("height", 12)
      .attr("rx", 3)
      .attr("ry", 2)
      .attr("transform", "translate(8,4)")
      .attr("class", "get")

  return node;

/*
  <g transform="translate(120,150)">
    <circle class="connector-in" transform="translate(0,45)" r="10"></circle>
    <rect class="node" width="250" height="90" rx="10" ry="10"></rect>
    <text font-size="20" transform="translate(10,52)">/users</text>
    <text font-size="10" transform="translate(10,84)">/users</text>
    <path style="stroke:gray;strok-width:1px" class="node" d="M0,20,250,20"></path>
    <path style="stroke:gray;strok-width:1px" class="node" d="M0,70,250,70"></path>
    <g class="badges">
      <rect transform="translate(8,4)" class="get" width="33" height="12" rx="3" ry="2"></rect>
      <text transform="translate(14,14)" font-size="9">GET</text>
      <rect transform="translate(47,4)" class="post" width="35" height="12" rx="3" ry="2"></rect>
      <text transform="translate(51,14)" font-size="9" style="font-weight:bold">POST</text>
      <rect transform="translate(88,4)" class="put" width="32" height="12" rx="3" ry="2"></rect>
      <text transform="translate(93,14)" font-size="9">PUT</text>
      <rect transform="translate(126,4)" class="delete" width="48" height="12" rx="3" ry="2"></rect>
      <text transform="translate(131,14)" font-size="9">DELETE</text>
      <rect transform="translate(181,4)" class="patch" width="40" height="12" rx="3" ry="2"></rect>
      <text transform="translate(185,14)" font-size="9">PATCH</text>
    </g>
    <circle class="connector-out" transform="translate(250,45)" r="15"></circle>
    <text transform="translate(245,52)" font-size="18">+</text>
  </g>
*/

  }

}
