//Cred: http://bl.ocks.org/jasondavies/1341281
var margin = { top: 30, right: 10, bottom: 10, left: 10 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangePoints([0, width], 1),
    y = {},
    dragging = {};

var yAxis = [1, 10];

var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Reads the data and creates the parallel coordinate graph
d3.csv("Data/Proj1-data.csv", function (error, data) {

  // Extract the list of dimensions and create a scale for each.
  x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
    return d != "name" && (y[d] = d3.scale.linear()
			.domain(/*d3.extent(cars, function (p) {return +p[d];})*/ yAxis)
			.range([height, 0]));
  }));

  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", path);

  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
      .call(d3.behavior.drag()
        .origin(function (d) { return { x: x(d) }; })
        .on("dragstart", function (d) {
          dragging[d] = x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function (d) {
          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          dimensions.sort(function (a, b) { return position(a) - position(b); });
          x.domain(dimensions);
          g.attr("transform", function (d) { return "translate(" + position(d) + ")"; })
        })
        .on("dragend", function (d) {
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(foreground).attr("d", path);
          background
              .attr("d", path)
            .transition()
              .delay(500)
              .duration(0)
              .attr("visibility", null);
        }));

  // Add an axis and title.
  g.append("g")
      .attr("class", "axis")
      .each(function (d) { d3.select(this).call(axis.scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function (d) { return d; });

  // Add and store a brush for each axis.
  g.append("g")
      .attr("class", "brush")
      .each(function (d) {
        d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
});

//The number of the categories (names of the axes)
var nrOfCategories = 9;
//Amount of group members
var group_members = 0;
var group_names = [];
var group_data = [];
//Initialize the array with zeros
for (var i = 0; i < nrOfCategories; i++) {
  group_data[i] = 0;
}
var categories;

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function (p) { return [position(p), y[p](d[p])]; }));
}

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = dimensions.filter(function (p) { return !y[p].brush.empty(); }),
      extents = actives.map(function (p) { return y[p].brush.extent(); });
  //Array for holding names of the selected lines 
  var selected = [];
  //This part is for generating the data for the table
  foreground.style("display", function (d) {
    return actives.every(function (p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? selected.push(d) : null;
  });
  //This part is for showing which lines are selected
  foreground.style("display", function (d) {
    return actives.every(function (p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    }) ? null : "none";
  });
  //Only selects the first 20 names to show
  data_table(selected.splice(0, 20));
}

// simple data table
function data_table(sample) {
  // sort by first column
  var sample = sample.sort(function (a, b) {
    var col = d3.keys(a)[0];
    return a[col] < b[col] ? -1 : 1;
  });

  var table = d3.select("#person-list")
    .html("")
    .selectAll(".row")
      .data(sample)
    .enter().append("div")
		.on("click", function (d) {
		  //Function for selecting the person pressed and show a diagram of that persons skills
		  create_barchart(d);
		});

  table
    .append("span")
      .attr("class", "color-block")
      .style("background", "#FF0000")

  table
    .append("span")
      .text(function (d) { return d.name; })
}
//https://leanpub.com/D3-Tips-and-Tricks
function create_barchart(data) {

  var margin = { top: 20, right: 20, bottom: 70, left: 40 },
  width = 600 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

  var y = d3.scale.linear().range([height, 0]);
  y.domain([0, 10]);

  //The name of the person whom is displayed in the bar chart
  var name = data.name;   

  //List of the different skills
  categories = Object.keys(data).filter(function (d) {
    return !(d == "name")   //Filter out the name parameter from the x-axis
  });

  //Extract the numbers from the data 
  var new_values = Object.values(data);
  new_values = new_values.splice(1);

  var new_data = create_data_array(categories, new_values);

  //Initialize diagram if it does not already exist
  if (!$("#diagram").length) {
    initialize_barchart(new_data, categories, name);
  }
  else {
    //Here we just want to change the data in the diagram
    //First the height of the bars
    d3.select("#diagram").selectAll('rect')
       .data(new_data)
       .attr("y", function (d) { return y(d.value); })
     	 .attr("height", function (d) { return height - y(d.value); });
    //Then the name
    d3.select("#barchart-name")
      .text(name);
    //Change the button click funtion
    d3.select("#button").select("input")
      .on("click", function (d) {
        //Check if this person already is in the group
        if (!($.inArray(name, group_names) > -1)) {
          group_members++;
          group_names[group_members] = name;
          //Save data in chart and calculate mean value
          group_data = group_data.map(function (num, ind) {
            return (num + +new_data[ind].value) / group_members;
          });
          (groupchart_exists()) ? update_groupchart() : create_groupchart();
        }
      });
  }
  
}

function initialize_barchart(data, categories, name) {

  var margin = { top: 20, right: 20, bottom: 70, left: 40 },
			width = 600 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(9);

  var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);

  //Create the domains for the x and y axis
  x.domain(categories);    //Object.keys(data) returns the names of the variables of the object "data"
  y.domain([0, 10]);

  var svg = d3.select("#bar-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("id", "diagram")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("id", "barchart-name")
    .attr("transform", "rotate(0)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .attr("dx", ".3cm")
    .style("text-anchor", "front")
    .text(name);

  svg.selectAll("bar")
			.data(data)
		.enter().append("rect")
			.style("fill", "steelblue")
			.attr("x", function (d) { return x(d.name); })
			.attr("width", x.rangeBand())
			.attr("y", function (d) { return y(d.value); })
			.attr("height", function (d) { return height - y(d.value); });

  //Create a button
  d3.select("#button").append("input")
    .attr("name", "addToGroup")
    .attr("type", "button")
    .attr("value", "Add To Group")
    .on("click", function (d) {
      //Check if this person already is in the group
      if (!($.inArray(name, group_names) > -1)) {
        group_members++;
        group_names[group_members] = name;
        //Save data in chart and calculate mean value
        group_data = group_data.map(function (num, ind) {
          return (num + +data[ind].value) / group_members;
        });
        (groupchart_exists()) ? update_groupchart() : create_groupchart();
      }
    });
}

function create_groupchart(){

  var margin = { top: 20, right: 20, bottom: 70, left: 40 },
  width = 800 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

  var y = d3.scale.linear().range([height, 0]);
  y.domain([0, 10]);

  //Initialize diagram if it does not already exist
  if (!$("#group-diagram").length) {
    initialize_groupchart(group_data, categories, name);
  }
  else {
    update_groupchart();
  }

}

function initialize_groupchart(data, categories, name) {

  var margin = { top: 20, right: 20, bottom: 70, left: 40 },
  width = 800 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
  var y = d3.scale.linear().range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(9);

  var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);

  //Create the domains for the x and y axis
  x.domain(categories);    //Object.keys(data) returns the names of the variables of the object "data"
  y.domain([0, 10]);

  data = create_data_array(categories, data);

  var svg = d3.select("#group-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("id", "group-diagram")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", "-.55em")
    .attr("transform", "rotate(-90)");

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
  .append("text")
    .attr("id", "barchart-name")
    .attr("transform", "rotate(0)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .attr("dx", ".3cm")
    .style("text-anchor", "front")
    .text("Mean of group members");

  svg.selectAll("bar")
			.data(data)
		.enter().append("rect")
			.style("fill", "steelblue")
			.attr("x", function (d) { return x(d.name); })
			.attr("width", x.rangeBand())
			.attr("y", function (d) { return y(d.value); })
			.attr("height", function (d) { return height - y(d.value); });

}

function update_groupchart() {

  var margin = { top: 20, right: 20, bottom: 70, left: 40 },
  height = 450 - margin.top - margin.bottom;
  var y = d3.scale.linear().range([height, 0]);
  y.domain([0, 10]);

  //Here we just want to change the data in the diagram
  d3.select("#group-diagram").selectAll('rect')
   .data(group_data)
   .attr("y", function (d) { return y(d); })
   .attr("height", function (d) { return height - y(d); });

}

function groupchart_exists() {
  return $("#group-diagram").length;
}
//Merges the array of categories with the array of values to create a new array with objects containing both a category and value
function create_data_array(categories, values) {
  //This array contains the category and value pair such as ["IVIS", 4]
  var rows = [];
  for (var i = 0; i < values.length; i++) {
    rows[i] = [categories[i], values[i]];
  }

  var names = ["name", "value"];

  //Create a new array with object elements such as {name : IVIS, value : 4} for example
  var new_data = rows.map(function (row) {
    return row.reduce(function (result, field, index) {
      result[names[index]] = field;
      return result;
    }, {});
  });

  return new_data;
}