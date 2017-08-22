import * as d3 from 'd3'

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

  static drawNodes(svg, g, rootTreeNode, handler, selectedNode) {
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
  		    .attr("class", function(d) {
            if (selectedNode && d.data.id === selectedNode.id ){
              return "selected-node-uri";
            }else {
              return "node-uri";
            }
          })
          .on("click", function(d) {
            if( !d.data.isRoot) {
              //console.log('node clicked');
              handler({
                name: "detail",
                source: d.data.id,
                x: d.y,
                y: d.x
              })
              d3.event.stopPropagation();
            }
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
          handler({
            name: "add",
            source: d.data.id
          })
          d3.event.stopPropagation();

      });


    node.append("text")
      .attr("font-size", "18")
      .text("+")
      .attr("transform", function(d) {
        let boxWidth = (d.data.isRoot ? rootBoxWidth : resourceBoxWidth);
        return "translate(" + (boxWidth - 5) + "," + (resourceBoxHeight / 2  + 5)+ ")";
      })
      .style("pointer-events",  "none")

/***
    // context menu
    let contextMenuGroup = node.append("g")
      .attr("transform", "translate(" + ((resourceBoxWidth/2) - 30) + "," + (resourceBoxHeight - 15) + ")")
      .attr("visibility", function(d) {
        if (selectedNode && d.data.id === selectedNode.id && selectedNode != '/'){
          return "visible";
        }else {
          return "hidden";
        }
      })

    contextMenuGroup.append("rect")
      .attr("width", 60)
      .attr("height", 30)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("class", "context-menu")

    contextMenuGroup.append("circle")
      .attr("r", "15")
      .attr("class", "delete-button")
      .attr("x", "37")
      .attr("y", "15")
      .on("click", function(d) {
        console.log('delete menu clicked.');
        d3.event.stopPropagation();
        handler({
          name: "delete",
          source: d.data.id,
        })
      })

      contextMenuGroup.append("text")
        .attr("font-family", "FontAwesome")
        .attr("font-size", function(d) {
          //return d.size +'em';
          return '1.4em';
        })
        .text(() => { return '\uf014'})
        .style("pointer-events",  "none")
        .attr("class", "fa-icon-text")
        .attr("text-anchor", "middle")
        .attr("x", "37")
        .attr("y", "15")
**/

    // Full URI path
    node.append("text")
      .attr("font-size", fullPathFontSize)
      .text(function(d) { return d.data.fullpath;})
      .attr("transform", "translate(10," + (resourceBoxHeight-7) + ")")
      .style("pointer-events",  "none")
      .attr("visibility", function(d) {
        if (selectedNode && d.data.id === selectedNode.id ){
          return "visible";
        }else {
          return "hidden";
        }
      })


    // Method badges
    let badges =
    node.append("g")
      .attr("class", "badges");

    // GET Badge
    badges.append("rect")
      .filter(function(d) {
        if( d.data.isRoot ) return;
        if( d.data.data.get  ){
          return d.data.data.get.enabled;
        }else {
          return false;
        }
      })
      .attr("width", 30)
      .attr("height", 12)
      .attr("rx", 3)
      .attr("ry", 2)
      .attr("transform", "translate(8,4)")
      .attr("class", "get")
    .append('svg:title')
      .text('GET');


    // PUT badge
    badges.append("rect")
      .filter(function(d) {
        if( d.data.isRoot ) return;
        if( d.data.data.put  ){
          return d.data.data.put.enabled;
        }else {
          return false;
        }
      })
      .attr("width", 30)
      .attr("height", 12)
      .attr("rx", 3)
      .attr("ry", 2)
      .attr("transform", "translate(46,4)")
      .attr("class", "put")
    .append('svg:title')
      .text('PUT');

    // POST badge
    badges.append("rect")
      .filter(function(d) {
        if( d.data.isRoot ) return;
        if( d.data.data.post  ){
          return d.data.data.post.enabled;
        }else {
          return false;
        }
      })
      .attr("width", 30)
      .attr("height", 12)
      .attr("rx", 3)
      .attr("ry", 2)
      .attr("transform", "translate(84,4)")
      .attr("class", "post")
    .append('svg:title')
      .text('POST');

      // DELETE badge
      badges.append("rect")
        .filter(function(d) {
          if( d.data.isRoot ) return;
          if( d.data.data.delete  ){
            return d.data.data.delete.enabled;
          }else {
            return false;
          }
        })
        .attr("width", 30)
        .attr("height", 12)
        .attr("rx", 3)
        .attr("ry", 2)
        .attr("transform", "translate(122,4)")
        .attr("class", "delete")
      .append('svg:title')
        .text('DELETE');

      // PATCH badge
      badges.append("rect")
        .filter(function(d) {
          if( d.data.isRoot ) return;
          if( d.data.data.patch  ){
            return d.data.data.patch.enabled;
          }else {
            return false;
          }
        })
        .attr("width", 30)
        .attr("height", 12)
        .attr("rx", 3)
        .attr("ry", 2)
        .attr("transform", "translate(160,4)")
        .attr("class", "patch")
      .append('svg:title')
        .text('PATCH');

  return {
    translations: translations,
    node: node
  };

  }

}
