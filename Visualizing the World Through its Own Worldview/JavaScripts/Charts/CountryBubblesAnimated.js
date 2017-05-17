//The dimensions of the SVG element of the grouped countries chart
var widthBubbles = d3.select("svg#countriesGrouped").attr("width"),
    heightBubbles = d3.select("svg#countriesGrouped").attr("height");

//Create the pack layout
var pack = d3.pack()
  .size([widthBubbles * (2 / 3), heightBubbles - 50])
  .padding(1);

var continents = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America"
];

var bubbleColor = "#299cd1";
var bubbleChartColors = ['#ff5252', '#ffd452', '#52ff52', '#52ffff', '#5252ff', '#ff527d'];
var colors = d3.scaleOrdinal(bubbleChartColors);
colors.domain(continents);
var selectedColor = "#D6632E";

// @v4 strength to apply to the position forces
var forceStrength = 0.03;
var center = { x: widthBubbles / 3, y: heightBubbles / 2 };

var selectedCenter = { x: widthBubbles * (2 / 3), y: heightBubbles / 2 };

var simulation;
//Creates the SVG element where the chart will be created
var chart = d3.select("svg#countriesGrouped")
  .append("g");

var bubbles;

//https://github.com/vlandham/bubble_chart_v4
//Function for creating animated country bubbles (using force layout)
function updateCountryBubbles() {
  //Create the tooltip object
  var tooltip = floatingTooltip('countries_tooltip', 240);
  selectedCountries = [];

  //Disable the create barchart button
  d3.select("#createBarchartButton")
    .attr("disabled", true);

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
      if (d[selectedGapminderVariable] != undefined) {
        return d[selectedGapminderVariable]["wave" + selectedWave];    //Size mapped to the GDP of the country
      }
    });

  var newData = pack(root).leaves().sort(function (a, b) { return b.r - a.r; });

  //Map the data to node elements
  bubbles = chart.selectAll(".bubble")
    .data(newData, function (d) { return d.data.country; });

  //Set the time for the animation
  var t = d3.transition().duration(1000);

  //UPDATE
  bubbles
      .attr("country", function (d) { return d.data.country; })
      .style("fill", bubbleColor)
      .attr("stroke", d3.rgb(bubbleColor).darker())
    .transition(t)
      .attr("r", function (d) { return d.r; });

  //EXIT
  bubbles.exit()
    .transition(t)
      .attr("r", function (d) { return d.r; })
      .remove();

  //ENTER
  //Uses the data stored in node to create a circle
  var bubblesE = bubbles.enter().append("circle")
      .classed("bubble", true)
      .attr("country", function (d) { return d.data.country; })
      .attr("r", 0)
      .style("fill", function (d) {
        return colors(d.data.continent);
      })
      .attr('stroke', d3.rgb(bubbleColor).darker())
      .on("click", function (d) {
        //Find index of the element
        var index = selectedCountries.indexOf(d.data.country);
        //Check if country aleady is selected, otherwise we want to remove it
        if (index >= 0) {
          //Remove the element from the array
          selectedCountries.splice(index, 1);
          //Set color back to normal
          d3.select(this)
            .style("fill", bubbleColor)
            .attr("stroke", d3.rgb(bubbleColor).darker());
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
          d3.select(this)
            .style("fill", selectedColor)
            .attr("stroke", d3.rgb(selectedColor).darker());
          //Enable the create bar chart button if a variable is selected
          if (selectedVariables.length != 0) {
            $('#createBarchartButton input[name="barchartButton"]')
              .attr("disabled", false);
          }
        }
        //Move the bubble to the selected ones
        moveSelectedBubbles();
      })
      .on("mouseover", showDetail)
      .on("mouseout", hideDetail)
    .transition(t)
      .attr("r", function (d) { return d.r; });

  bubbles = bubbles.merge(bubblesE);

  //Create the simulation which contains all the forces
  simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);

  //forceSimulation() starts automatically which is not wanted in this case
  simulation.stop();

  simulation.nodes(newData);

  // @v4 Reset the 'x' force to draw the bubbles to the center.
  simulation.force('x', d3.forceX().strength(forceStrength).x(center.x));

  // @v4 We can reset the alpha value and restart the simulation
  simulation.alpha(1).restart();
  function charge(d) {
    return -forceStrength * Math.pow(d.r, 2.0);
  }

  function ticked() {
    bubbles
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; });
  }

  function addText() {
    //Add text to the bubbles
    nodes.append("text")
        .attr("text-anchor", "middle")
        .attr("class", "svgText")
      .selectAll("tspan")
      .data(function (d) { return d.data.country.split(" "); })   //Splits the word at the space char and returns the words in an array
      .enter().append("tspan")
        .attr("x", 0)
        .attr("y", function (d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
        .text(function (d) { return d; });
  }




  //Hides tooltip
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', d3.rgb(bubbleColor).darker());

    tooltip.hideTooltip();
  }

  //Function for moving bubbles when selected
  function moveSelectedBubbles() {
    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('x', d3.forceX().strength(forceStrength).x(function (d) {
      //Check if bubble is selected
      return (selectedCountries.indexOf(d.data.country) >= 0) ? selectedCenter.x : center.x;
    }));

    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();

  }
  /*
  * Function called on mouseover to display the
  * details of a bubble in the tooltip.
  */
  function showDetail(d) {
    // change outline to indicate hover state.
    d3.select(this).attr('stroke', 'black');
    var content = '<span class="name">Country: </span><span class="value">' +
                  d.data.country +
                  '</span><br/>' +
                  '<span class="name">' +
                  selectedGapminderVariable +
                  ': </span><span class="value">' +
                  d.data[selectedGapminderVariable]["wave" + selectedWave] +
                  '</span><br/>' +
                  '<span class="name">Wave: </span><span class="value">' +
                  selectedWave +
                  '</span><br/>' +
                  '<span class="name">Continent: </span><span class="value">' +
                  d.data.continent +
                  '</span>';
    tooltip.showTooltip(content, d3.event);
  }
}
