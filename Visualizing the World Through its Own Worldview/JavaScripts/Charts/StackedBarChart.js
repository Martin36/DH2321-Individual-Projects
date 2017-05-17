var data;
var z = [];
var textWidth = 100;
//https://bl.ocks.org/mbostock/3886394
//Function for creating the stacked bar chart with the previously specified variables and countries
function createBarChart() {
  //Clear the SVG if there already exists a var chart
  $("svg#stackedBarChart").empty();
  //The data that is to be used
  data = dataArray;
  //Filter countries
  for (var i in data) {
    data = filterCountries(data);
  }
  //Set up the SVG element and append a group
  var svg = d3.select("svg#stackedBarChart"),
      margin = { top: 20, right: 60, bottom: 30, left: 40 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom,
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //Create the scaling for the x-axis (this is the scaleBand for the groupes (the outer one))
  var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .align(0.1);
  //Scaling for inside the group
  var x1 = d3.scaleBand()
    .padding(0.05);
  //Create the scaling for the y-axis
  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  //Sort the selectedVariables accoring to the variablesArray
  selectedVariables.sort(function (a, b) {
    return (variablesArray.indexOf(a) < variablesArray.indexOf(b)) ? -1 : 1;
  });
  //Remove the variables that do not exist in this wave
  for (var i = 0; i < selectedVariables.length; i++) {
    //If the selected variable is not in the array, then remove it from the selected variables
    if (variablesArray.indexOf(selectedVariables[i]) < 0) {
      selectedVariables.splice(i, 1);
    }
  }

  //Create the color scale
  z = [];
  for (var i = 0; i < selectedVariables.length; i++) {
    var variableRemoved = false;
    var counter = 0;
    var dataObj = data[counter];
    z[selectedVariables[i]] = colorScales[variablesArray.indexOf(selectedVariables[i])];

    //This needs to be done if the first object in the data array does not have the
    //selected variable. Check when counter is equal to data.length then none of the
    //selected countries has the selected variable
    if(dataObj == undefined){
      console.log("Data object is undefined");
      continue;
    }
    while(dataObj[selectedVariables[i]] == null && counter <= data.length){
      if(counter == data.length){
        //Remove the selected variable
        delete z[selectedVariables[i]];
        delete selectedVariables[i];
        variableRemoved = true;
        break;
      }
      dataObj = data[++counter];
    }
    if(!variableRemoved){
      //Map the colors to each category
      z[selectedVariables[i]].domain(Object.keys(dataObj[selectedVariables[i]]));
    }
  }

  //The stack variable will stack the rectangles on each other
  var stack = d3.stack()
      .offset(d3.stackOffsetExpand);

  //Map the data for the x-axis (which is the countries)
  x0.domain(data.map(function (d) { return d.country }));
  //This is the domain for the variables in the group
  x1.domain(selectedVariables).rangeRound([0, x0.bandwidth()]);

  //Create the groups for holding the grouped bars
  var barGroups = g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g").attr("class", "barGroup")
      .attr("transform", function (d) { return "translate(" + x0(d.country) + ",0)"; });

  //Create the groups representing the bars and holding the stacked rectangles
  var stackedBars = barGroups.selectAll("g")
    .data(function (d) {
      var newData = [];
      for (var i = 0; i < selectedVariables.length; i++) {
        if (d[selectedVariables[i]] != undefined) {   //If there is not data for this variable for this country the leave it blank
          newData.push(d[selectedVariables[i]]);
          newData[newData.length - 1].name = selectedVariables[i];
        }
      }
      return newData;
    })
    .enter().append("g").attr("class", "stackedBar")
      .attr("transform", function (d) {
        return "translate(" + x1(d.name) + ",0)";
      });

  //Create all the stacked rectangles in the bars
  stackedBars.selectAll("rect")
    .data(function (d) {
      var name = d.name;
      var colorScale = z[name];
      delete d.name;
      var keys = Object.keys(d);
      var tempStack = stack.keys(keys);
      var newData = tempStack([d]);
      //Set color for each element in new data
      for (var i = 0; i < newData.length; i++) {
        newData[i].color = colorScale(newData[i].key);
      }
      return newData;
    })
    .enter().append("rect")
      .attr("x", 0)
      .attr("y", function (d) { return y(d[0][1]); })
      .attr("width", x1.bandwidth())
      .attr("height", function (d) { return y(d[0][0]) - y(d[0][1]); })
      .attr("fill", function (d) { return d.color; })
     	.on("mouseover", function (d) {
     	  //Calculate the part of space that this rectangle takes 
     	  var part = (d[0][1] - d[0][0]);
     	  tooltip.text(d.key + ": " + percentFormat(part));
     	  return tooltip.style("visibility", "visible");
     	})
	    .on("mousemove", function () { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
	    .on("mouseout", function () { return tooltip.style("visibility", "hidden"); });

  //Create the x-axis
  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  //Create the y-axis
  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"));

  createLegend(data);

  //Show the "wave buttons"
  if ($(".waveContainer").is(":hidden")) {
    $(".waveContainer").toggle();
  }
}

function createLegend(data) {
  //Data for the legend
  var legendData = [];
  for (var key in data[0]) {
    if (selectedVariables.indexOf(key) > -1) {
      legendData.push(data[0][key]);
      legendData[legendData.length - 1].name = key;
    }
  }

  console.log(legendData);
  var legendWidth = d3.select("svg#legend").attr("width");
/*
  var legendScale = d3.scaleOrdinal()
    .range(z["Important in life: Work"].range())
    .domain(legendData.map(function (d) {
      return Object.keys(d).filter(function (d) {
        return d != "name";
      });
    })[0]);
*/

  $("svg#legend").empty();
/*
  //Append header for the legend
  d3.select("svg#legend").append("text")
    .attr("x", legendWidth - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .attr("transform", "translate(0, 0)")
    .attr("font-size", 15)
    .text(function (d) {
      return d.name;
    });
*/
  //Create the d3 legend
  var legend = d3.legendColor()
    .shapeWidth(50)
    .shapePadding(5)
    .orient('horizontal')
    .labelWrap(40);

  d3.select("svg#legend")
    .selectAll("g")
    .data(legendData.map(function (d) {
      var colorScale = z[d.name];
      var name = d.name;
      delete d.name;
      var keys = Object.keys(d);
      var data = {
        name : name,
        keys : keys,
        colors : colorScale.range()
      };
      return data;
    }))
    .enter()
    .append("g")
    .attr("class", "legendLinear")
    .attr("transform", function (d, i) {
      return "translate(20," + (20 + 100*i) + ")";
    })
    .each(function (d, i) {
      //console.log(d);
      legend
        .title(d.name)
        .scale(d3.scaleOrdinal()
          .range(d.colors)
          .domain(d.keys));
      d3.select(this)
        .call(legend);
    });
/*
  //Create a d3 legend
  var legend = d3.legendColor()
    .title(legendData[0].name)
    .shapeWidth(50)
    .shapePadding(5)
    .orient('horizontal')
    .labelWrap(40)
    .scale(legendScale);

    .call(legend);
*/
  /*

  //Then create a group element for each bar
  var rows = legend.selectAll("g")
    .data(function (d) {
      var colorScale = z[d.name];
      delete d.name;
      var keys = Object.keys(d);
      var newData = [];
      var dataObj;
      for (var i = 0; i < keys.length; i++) {
        dataObj = {
          name: keys[i],
          color: colorScale(keys[i])
        };
        newData.push(dataObj);
      }
      return newData;
    })
    .enter().append("g")
    .attr("transform", function (d, i) {
      return "translate(0," + (20 + i * 20) + ")";
    });


  rows.append("rect")
    .attr("x", legendWidth - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", function (d) {
      return d.color;
    });

  //Add labels to the legend
  rows.append("text")
    .attr("x", legendWidth - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function (d) { return d.name; })
    .call(wrap, textWidth);
    */
}

//Function for creating the legend that corresponds to the bar chart 
function createLegend2(data) {

  //Data for the legend
  var legendData = [];
  for (var key in data[0]) {
    if (selectedVariables.indexOf(key) > -1) {
      legendData.push(data[0][key]);
      legendData[legendData.length - 1].name = key;
    }
  }
  var legendWidth = d3.select("svg#legend").attr("width");

  var legendScale = d3.scaleBand()
    .rangeRound([0, legendWidth])
    .padding(0.1)
    .align(0.1);

  legendScale.domain(legendData.map(function (d) {
    return d.name;
  }));

  $("svg#legend").empty();
  //Create the legend in a separte SVG element
  //First create one group for each element
  var legend = d3.select("svg#legend").append("g")//.attr("transform", "translate(-500, 0)")
    .selectAll("g")
    .data(legendData)
    .enter().append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .attr("transform", function (d, i) { return "translate(" + -i * 230 + ", 0)"; });

  //Append header for the legend
  legend.append("text")
      .attr("x", legendWidth - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .attr("transform", "translate(0, 0)")
      .attr("font-size", 15)
      .text(function (d) {
        return d.name;
      });

  //Then create a group element for each bar
  var rows = legend.selectAll("g")
    .data(function (d) {
      var colorScale = z[d.name];
      delete d.name;
      var keys = Object.keys(d);
      var newData = [];
      var dataObj;
      for (var i = 0; i < keys.length; i++) {
        dataObj = {
          name: keys[i],
          color: colorScale(keys[i])
        };
        newData.push(dataObj);
      }
      return newData;
    })
    .enter().append("g")
      .attr("transform", function (d, i) {
        return "translate(0," + (20 + i * 20) + ")";
      });


  rows.append("rect")
      .attr("x", legendWidth - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", function (d) {
        return d.color;
      });

  //Add labels to the legend
  rows.append("text")
      .attr("x", legendWidth - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function (d) { return d.name; })
      .call(wrap, textWidth);

  //Add text indication which wave is selected
  d3.select("svg#legend").append("text")
      .attr("x", legendWidth - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .attr("transform", "translate(-1200, 40)")
      .attr("font-size", 30)
      .text("Selected Wave: " + selectedWave);

}
//https://bl.ocks.org/mbostock/7555321
function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      x = text.attr("x"),
      dy = parseFloat(text.attr("dy")),
      tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}