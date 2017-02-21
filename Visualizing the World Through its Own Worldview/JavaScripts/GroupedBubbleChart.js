
var percentFormat = d3.format(".1%");

//Color scales
//From: http://colorbrewer2.org/#type=sequential&scheme=YlOrBr&n=9
var colorScales = [];
var z = d3.scaleOrdinal();
colorScales.push(d3.scaleOrdinal().range(['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'].reverse()))
colorScales.push(d3.scaleOrdinal().range(['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'].reverse()))
colorScales.push(d3.scaleOrdinal().range(['#f7fcf0', '#e0ecf4', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'].reverse()))
colorScales.push(d3.scaleOrdinal().range(['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'].reverse()))
colorScales.push(d3.scaleOrdinal().range(['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'].reverse()))
colorScales.push(d3.scaleOrdinal().range(['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'].reverse()))
colorScales.push(d3.scaleOrdinal().range(['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'].reverse()))
colorScales.push(d3.scaleOrdinal().range(['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'].reverse()))

//Function for creating the grouped bubbles chart with the countries
function createCountryBubbles() {
  $("svg#countriesGrouped").empty();

  $("#gapminderMapping").text(selectedGapminderVariable);

  //The dimensions of the SVG element of the grouped countries chart
  var width = d3.select("svg#countriesGrouped").attr("width"),
      height = d3.select("svg#countriesGrouped").attr("height");

  //Creates the SVG element where the chart will be created
  var chart = d3.select("svg#countriesGrouped")
    .append("g")
      .attr("transform", "translate(0,0)");

  //Create the pack layout
  var pack = d3.pack()
    .size([width, height - 50])
    .padding(1);

  //Filter the countries that exist in the current wave
  var filteredCountryObjects = [];
  for (var i = 0; i < countryObjects.length; i++) {
    if (countries.indexOf(countryObjects[i].country) > -1) {
      filteredCountryObjects.push(countryObjects[i]);
    }
  }

  //Create the root node (needed for the pack function)
  var root = d3.hierarchy({ children: filteredCountryObjects })
    .sum(function (d) {
      //return 1;   //Same size bubbles
      if (d[selectedGapminderVariable] != undefined) {
        return d[selectedGapminderVariable]["wave" + selectedWave];    //Size mapped to the GDP of the country
      }
//      console.log(d[selectedGapminderVariable]["wave" + selectedWave]);
    });
  //Map the data to node elements
  var node = chart.selectAll(".node")
    .data(pack(root).leaves())
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

  //Uses the data stored in node to create a circle
  node.append("circle")
      .attr("country", function (d) { return d.data.country; })
      .attr("r", function (d) { return d.r; })
      .style("fill", "rgb(158, 154, 200)")
      .on("click", function (d) {
        //Find index of the element
        var index = selectedCountries.indexOf(d.data.country);
        //Check if country aleady is selected, otherwise we want to remove it
        if (index >= 0) {
          //Remove the element from the array
          selectedCountries.splice(index, 1);
          //Set color back to normal
          d3.select(this).style("fill", "rgb(158, 154, 200)");
          //Disable the create bar chart button if selectedCountries are empty
          if (selectedCountries.length == 0) {
            $('#createBarchartButton input[name="barchartButton"]')
              .attr("disabled", true);
          }
        }
        else {
          //Add the selected country to an array
          selectedCountries.push(d.data.country);
          //Set color to red
          d3.select(this).style("fill", "rgb(255, 0, 0)");
          //Enable the create bar chart button if a variable is selected
          if (selectedVariables.length != 0) {
            $('#createBarchartButton input[name="barchartButton"]')
              .attr("disabled", false);
          }
        }
      });

    //Add text to the bubbles
    node.append("text")
        .attr("text-anchor", "middle")
        .attr("class", "svgText")
      .selectAll("tspan")
      .data(function (d) {
        return d.data.country.split(" ");
      })   //Splits the word at the space char and returns the words in an array
      .enter().append("tspan")
        .attr("x", 0)
        .attr("y", function (d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
        .text(function (d) { return d; });

}

//Function for creating a list with checkboxes of variables where the user can select which ones they want to see
function createListOfVariables() {

  //Create an checkbox element for each variable
  for (var i = 0; i < variablesArray.length; i++) {
    //Select the correct div
    var div = d3.select("#listOfVariables");
    //Append the input with checkbox property
    div.append("input")
      .attr("type", "checkbox")
      .attr("name", variablesArray[i])
      .attr("value", variablesArray[i])
      .on("change", function () {   //This function is called when the checkbox is clicked
        if (this.checked) {
          //Add the variable to the selected ones
          selectedVariables.push(this.value);
          //Enable button if any countries are selected
          if (selectedCountries != 0) {
            $('#createBarchartButton input[name="barchartButton"]')
               .attr("disabled", false);
          }
        } else {
          //Remove the variable from the selected ones
          var index = selectedVariables.indexOf(this.value);
          if (index >= 0) {
            selectedVariables.splice(index, 1);
          }
          //Disable button if selectedVariables if empty
          if (selectedVariables == 0) {
            $('#createBarchartButton input[name="barchartButton"]')
               .attr("disabled", true);
          }
        }
      })

    //Append a label
    div.append("label")
      .attr("for", variablesArray[i])
      .text(variablesArray[i]);

    //Add a break
    div.append("br");
  };
  //Add a button for creating the bar chart
  d3.select("#createBarchartButton").append("input")
    .attr("name", "barchartButton")
    .attr("value", "Create Bar Chart")
    .attr("type", "button")
    .attr("disabled", true)
    .on("click", function () {
      createBarChart();
    })

}

//https://bl.ocks.org/mbostock/3886394
//Function for creating the stacked bar chart with the previously specified variables and countries
function createBarChart() {
  //Clear the SVG if there already exists a var chart
  $("svg#stackedBarChart").empty();
  //The data that is to be used
  var data = dataArray;
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
  var z = [];
  for (var i = 0; i < selectedVariables.length; i++) {
    z[selectedVariables[i]] = colorScales[variablesArray.indexOf(selectedVariables[i])];
    //Map the colors to each category
    z[selectedVariables[i]].domain(Object.keys(data[0][selectedVariables[i]]));
  }
  //The stack variable will stack the rectangles on each other
  var stack = d3.stack()
      .offset(d3.stackOffsetExpand);

  //Map the data for the x-axis (which is the countries)
  x0.domain(data.map(function(d){ return d.country }));
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
          newData[newData.length-1].name = selectedVariables[i];
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
      .attr("x", width - 24)
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
        }
        newData.push(dataObj);
      }
//      console.log(newData);
      return newData;
    })
    .enter().append("g")
      .attr("transform", function (d, i) {
      //  console.log(d);
        return "translate(0," + (20 + i * 20) + ")";
      });


  rows.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", function (d) {
   //     console.log(d);
        return d.color;
      });

  rows.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function (d) { return d.name; });

  d3.select("svg#legend").append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .attr("transform", "translate(-1200, 40)")
      .attr("font-size", 30)
      .text("Selected Wave: " + selectedWave);

  //Show the "wave buttons"
  if ($(".waveContainer").is(":hidden")) {
    $(".waveContainer").toggle();
  }
}

