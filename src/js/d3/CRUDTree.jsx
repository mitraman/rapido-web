
const resourceBoxWidth = 250;
const resourceBoxHeight = 90;
const rootBoxWidth = 250;
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

  static drawNodes(g, rootTreeNode, handler) {
    let translations = {};

    // Create a new <g> for every object in the nodeList
    let node = g.selectAll(".node")
      .data(rootTreeNode.descendants(), function(d) {
        // Use the ID as the d3 identifier so that nodes can be replaced by ID
        return d.data.id;
      })
    .enter().append("g")
      .attr("class", function(d) {
        if( d.data.isRoot ) {
          return "root-node";
        }else {
          return "node" + (d.children ? " node--internal" : " node--leaf");
        }})
      .attr("id", function(d) { return d.data.id })
      .attr("transform", function(d) {
        // Store the translation coordinates for easier lookups
        let id = (d.data.isRoot) ? 'root' : d.data.id;
        translations[id] = {x: d.x, y: d.y};
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
          .attr("width", (d) => { return (d.data.isRoot ? rootBoxWidth : resourceBoxWidth) })
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
    .text(function(d) {  return (d.data.isRoot ? "/" : d.data.name); })

    // top separator
    node.append("path")
      .attr("class", "node-internal-border")
      .attr("d", function(d) {
        let boxWidth = (d.data.isRoot ? rootBoxWidth : resourceBoxWidth);
        return "M0,20," + boxWidth + ",20"
      });

    // bottom separator
    node.append("path")
        .attr("class", "node-internal-border")
        .attr("d", function(d) {
          let boxWidth = (d.data.isRoot ? rootBoxWidth : resourceBoxWidth);
          return "M0," + (resourceBoxHeight - 20) + "," + boxWidth + "," + (resourceBoxHeight - 20);
      });

    // outbound node
    node.append("circle")
      .attr("r", "15")
      .attr("class", "connector-out")
      .attr("transform", function(d) {
        let boxWidth = (d.data.isRoot ? rootBoxWidth : resourceBoxWidth);
        return "translate(" + boxWidth + "," + resourceBoxHeight / 2 +")";
      })
      .on("click", function(d) {
        //console.log("out connector clicked");
        if( !d.data.isRoot) {
          handler("add", d.data.id)
        }
      });

    node.append("text")
      .attr("font-size", "18")
      .text("+")
      .attr("transform", function(d) {
        let boxWidth = (d.data.isRoot ? rootBoxWidth : resourceBoxWidth);
        return "translate(" + (boxWidth - 5) + "," + (resourceBoxHeight / 2  + 5)+ ")";
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

  return {
    translations: translations,
    node: node
  };

  }

}
