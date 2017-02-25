var bubbleColor = "#299cd1";
var selectedColor = "#D6632E";

//https://github.com/vlandham/bubble_chart_v4
//Function for creating animated country bubbles (using force layout)
function createAnimatedCountryBubbles() {
  //Create the tooltip object
  var tooltip = floatingTooltip('countries_tooltip', 240);


  //Creates the SVG element where the chart will be created
  var chart = d3.select("svg#countriesGrouped")
    .append("g")
      .attr("transform", "translate(0,0)");

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
  console.log(newData);
  //Map the data to node elements
  var bubbles = chart.selectAll(".bubble")
    .data(newData, function (d) { return d.data.country; });



  //Uses the data stored in node to create a circle
  var bubblesE = bubbles.enter().append("circle")
      .classed("bubble", true)
      .attr("country", function (d) { return d.data.country; })
      .attr("r", 0)
      .style("fill", bubbleColor)
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
      })
      .on("mouseover", showDetail)
      .on("mouseout", hideDetail);

  bubbles = bubbles.merge(bubblesE);

  // @v4 strength to apply to the position forces
  var forceStrength = 0.03;
  var center = { x: widthBubbles / 2, y: heightBubbles / 2 };

  var simulation = d3.forceSimulation()
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(forceStrength).x(center.x))
    .force('y', d3.forceY().strength(forceStrength).y(center.y))
    .force('charge', d3.forceManyBody().strength(charge))
    .on('tick', ticked);
  //forceSimulation() starts automatically which is not wanted in this case
  simulation.stop();

  //Creates a force towards the middle
  simulation.force('center', d3.forceCenter(widthBubbles / 2, heightBubbles / 2));


  // Fancy transition to make bubbles appear, ending with the
  // correct radius
  var transitions = 0;
  bubbles.transition()
    .duration(2000)
    .attr('r', function (d) { return d.r; })
    .on("start", function () {
      transitions++;
    })
    .on("end", function () {
      if (--transitions === 0) {
        //addText();
      }
    })

  //console.log(newData)
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
                  '</span>';

    tooltip.showTooltip(content, d3.event);
  }

/*
 * Hides tooltip
 */
  function hideDetail(d) {
    // reset outline
    d3.select(this)
      .attr('stroke', d3.rgb(bubbleColor).darker());

    tooltip.hideTooltip();
  }

}
