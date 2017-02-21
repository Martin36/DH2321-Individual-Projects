var width = 960,
    height = 500,
    margin = 20;

var x = d3.scale.linear()
    .range([0, width - 3 * margin]);

var y = d3.scale.linear()
    .range([0, height - 2 * margin]);

var y2 = d3.scale.linear()
    .range([0, height - 2 * margin])
    .domain([0, 100]);

var z = d3.scale.category10();

var n = d3.format(",d"),
    p = d3.format("%");

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + 2 * margin + "," + margin + ")");

d3.json("Data/Feeling_of_happiness.json", function (error, data) {
  if (error) throw error;

  //Conter used for spacing the variables on the x-axis 
  var counter = 0;
  var tick = x.ticks(data.lenght);

  // Nest values by contries.
  var countries = d3.nest()
      .key(function (d) { return d.Country; })
      .entries(data);

  // Add x-axis ticks.
  var xtick = svg.selectAll(".x")
//      .data(x.ticks(10))
      .data(data)
    .enter().append("g")
      .attr("class", "x")
      .attr("transform", function (d) { return "translate(" + x(tick[counter++]) + "," + y(1) + ")"; });

  xtick.append("line")
      .attr("y2", 6)
      .style("stroke", "#000");

  xtick.append("text")
      .attr("y", 8)
      .attr("text-anchor", "right")
      .attr("dy", ".71em")
//      .text(p);
      .text(function (d) { return d.Country; });

  // Add y-axis ticks.
  var ytick = svg.selectAll(".y")
      .data(y.ticks(10))
    .enter().append("g")
      .attr("class", "y")
      .attr("transform", function (d) { return "translate(0," + y(1 - d) + ")"; });

  ytick.append("line")
      .attr("x1", -6)
      .style("stroke", "#000");

  ytick.append("text")
      .attr("x", -8)
      .attr("text-anchor", "end")
      .attr("dy", ".35em")
      .text(p);

  //Add offsets to the categories
  var offset = 0;
  //Go through the list of countries 
  for (var i = 0; i < countries.length; i++) {
    offset = 0;

    
  }


  counter = 0;    //TODO: Change this to be the index instead
  // Add a group for each segment, where a segment represents a country.
  var segments = svg.selectAll(".segment")
      .data(countries)
    .enter().append("g")
      .attr("class", "segment")
      .attr("xlink:title", function (d) { return d.key; })
      .attr("transform", function (d) { return "translate(" + x(tick[counter++]) + ")"; });


  // Add a rect for each category in the answer for each country.
  var categories = segments.selectAll(".categories")
      .data(function (d) {
        //Convert the data to the right format
        var obj = d.values[0];   //d.values[0] is the only object in the array
        var answers = Object.keys(obj); 
        var values = answers.map(function (k) {
          return obj[k];
        });
        var result = create_data_array(answers, values);
        result.splice(0, 1);    //Remove the Country variable from the array
        result.splice(result.length - 2, 2);   //Remove (N) variable
        console.log(result);
        return result;
      })
    .enter().append("a")
      .attr("class", "market")
      .attr("xlink:title", function (d) { return d.name; })
    .append("rect")
      .attr("y", function (d) { return y2(1); })
      .attr("height", function (d) { return y2(d.value); })
      .attr("width", function (d) { return x(tick[1]); })     //tick[1] will be 90 in this case and the width should be same for all bars
      .style("fill", function (d) { return z(); });

});


d3.json("Data/marimekko.json", function (error, data) {
  if (error) throw error;

  var offset = 0;

  // Nest values by segment. We assume each segment+market is unique.
  var segments = d3.nest()
      .key(function (d) { return d.segment; })
      .entries(data);
  console.log(segments);
  // Compute the total sum, the per-segment sum, and the per-market offset.
  // You can use reduce rather than reduceRight to reverse the ordering.
  // We also record a reference to the parent segment for each market.
  var sum = segments.reduce(function (v, p) {
    return (p.offset = v) + (p.sum = p.values.reduceRight(function (v, d) {
      d.parent = p;
      return (d.offset = v) + d.value;
    }, 0));
  }, 0);

  // Add x-axis ticks.
  var xtick = svg.selectAll(".x")
      .data(x.ticks(10))
    .enter().append("g")
      .attr("class", "x")
      .attr("transform", function (d) { return "translate(" + x(d) + "," + y(1) + ")"; });

  xtick.append("line")
      .attr("y2", 6)
      .style("stroke", "#000");

  xtick.append("text")
      .attr("y", 8)
      .attr("text-anchor", "middle")
      .attr("dy", ".71em")
      .text(p);

  // Add y-axis ticks.
  var ytick = svg.selectAll(".y")
      .data(y.ticks(10))
    .enter().append("g")
      .attr("class", "y")
      .attr("transform", function (d) { return "translate(0," + y(1 - d) + ")"; });

  ytick.append("line")
      .attr("x1", -6)
      .style("stroke", "#000");

  ytick.append("text")
      .attr("x", -8)
      .attr("text-anchor", "end")
      .attr("dy", ".35em")
      .text(p);

  // Add a group for each segment.
  var segments = svg.selectAll(".segment")
      .data(segments)
    .enter().append("g")
      .attr("class", "segment")
      .attr("xlink:title", function (d) { return d.key; })
      .attr("transform", function (d) { return "translate(" + x(d.offset / sum) + ")"; });

  // Add a rect for each market.
  var markets = segments.selectAll(".market")
      .data(function (d) { return d.values; })
    .enter().append("a")
      .attr("class", "market")
      .attr("xlink:title", function (d) { return d.market + " " + d.parent.key + ": " + n(d.value); })
    .append("rect")
      .attr("y", function (d) { return y(d.offset / d.parent.sum); })
      .attr("height", function (d) { return y(d.value / d.parent.sum); })
      .attr("width", function (d) { return x(d.parent.sum / sum); })
      .style("fill", function (d) { return z(d.market); });
});

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