//Arrays to hold selections
var selectedCountries = [];
var selectedVariables = [];

createCountryBubbles();

loadData();

createListOfVariables();

//Function for creating the grouped bubbles chart with the countries
function createCountryBubbles() {

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

  //Load the data
  d3.csv("Data/Feeling_of_happiness_average.csv", function (error, data) {
    if (error) throw error;


    //Create the root node (needed for the pack function)
    var root = d3.hierarchy({ children: data })
      .sum(function (d) {
        return d.Average;
      });   //Gives all the bubbles the same size

    //Map the data to node elements
    var node = chart.selectAll(".node")
      .data(pack(root).leaves())
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });

    //Uses the data stored in node to create a circle
    node.append("circle")
       .attr("country", function (d) { return d.data.Country; })
       .attr("r", function (d) { return d.r; })
       .style("fill", "rgb(158, 154, 200)")
       .on("click", function (d) {
         //Find index of the element
         var index = selected.indexOf(d.data);
         //Check if country aleady is selected, otherwise we want to remove it
         if (index >= 0) {
           //Remove the element from the array
           selected.splice(index, 1);
           //Set color back to normal
           d3.select(this).style("fill", "rgb(158, 154, 200)");
         }
         else {
           //Add the selected country to an array
           selected.push(d.data);
           //Set color to red
           d3.select(this).style("fill", "rgb(255, 0, 0)");
         }

       })
    /*    .on("mouseover", function (d) {
          d3.select(this).style("fill", "rgb(255, 0, 0)");
        })
        .on("mouseout", function (d) {
          d3.select(this).style("fill", "rgb(158, 154, 200)");
        })
        */
    //Add text to the bubbles
    node.append("text")
        .attr("text-anchor", "middle")
      .selectAll("tspan")
      .data(function (d) { return d.data.Country.split(" "); })   //Splits the word at the space char and returns the words in an array
      .enter().append("tspan")
        .attr("x", 0)
        //.attr("y", 0)
        .attr("y", function (d, i, nodes) { return 13 + (i - nodes.length / 2 - 0.5) * 10; })
        .text(function (d) { return d; });
  });

}

//Function for creating a list with checkboxes of variables where the user can select which ones they want to see
function createListOfVariables() {

  //Array containing the names of the variables
  var variablesArray = [
    "Feeling of happiness",
    "Important in life",
    "Satisfaction with your life"
  ];

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
          console.log(selectedVariables);
        } else {
          //Remove the variable from the selected ones
          var index = selectedVariables.indexOf(this.value);
          if (index >= 0) {
            selectedVariables.splice(index, 1);
          }
        }
      })

    //Append a label
    div.append("label")
      .attr("for", variablesArray[i])
      .text(variablesArray[i]);

    //Add a break
    div.append("br");

    //Add a button for creating the bar chart

  };
}

//Function for loading the data of the variables
function loadData() {

  d3.queue()
    .defer(d3.csv, "Data/Feeling_of_happiness_average.csv")
    .defer(d3.csv, "Data/Important_in_life_Family_Wave6.csv")
    .defer(d3.csv, "Data/Satisfaction_with_your_life_Wave6.csv")
    .await(function (error, feelings, family, satisfaction) {
      if (error) { console.log(error); };

      //Remove any empty properties of the objects
      for (var i = 0; i < feelings.length; i++) {
        clean(feelings[i]);
      }
      for (var i = 0; i < family.length; i++) {
        clean(family[i]);
      }
      for (var i = 0; i < satisfaction.length; i++) {
        clean(satisfaction[i]);
      }
    })
}
//http://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
//Remove any properties that are empty i.e. ""
function clean(obj) {
  for (var propName in obj) {
    if (obj[propName] === "") {
      delete obj[propName];
    }
  }
}
//Function for creating the stacked bar chart with the previously specified variables and countries
function createBarChart() {

}