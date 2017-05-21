
//Function for creating the grouped bubbles chart with the countries
function createCountryBubbles() {

  $("svg#countriesGrouped").empty();

  $("#gapminderMapping").text(selectedGapminderVariable);

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
    .data(function (d) { return d.data.country.split(" "); })   //Splits the word at the space char and returns the words in an array
    .enter().append("tspan")
      .attr("x", 0)
      .attr("y", function (d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
      .text(function (d) { return d; });

}
