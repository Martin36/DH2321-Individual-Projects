//The dimensions of the SVG element
var width = 800,
    height = 600;
//Creates the SVG element where the chart will be created
var chart = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
    .attr("transform", "translate(50,50)");
//Create the pack layout
var pack = d3.pack()
  .size([width, height - 50])
  .padding(10);
//Load the data
d3.csv("Data/Feeling_of_happiness.csv", function (error, data) {
  if (error) throw error;


  //Create the root node (needed for the pack function)
  var root = d3.hierarchy({ children: data })
    .sum(function (d) { return 10; });   //10 to represent the size of the bubbles

  //Map the data to node elements
  var node = chart.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

  //Uses the data stored in node to create a circle
  node.append("circle")
     .attr("country", function (d) { return d.Country; })
     .attr("r", function (d) { return d.r; })
     .style("fill", "rgb( 0, 0, 255)");
});