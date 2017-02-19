//Arrays to hold selections
var selectedCountries = [];
var selectedVariables = [];
//For testing
selectedCountries = ["Iraq", "Ghana", "India"];
selectedVariables = ["Feeling of happiness", "Important in life: Family", "Satisfaction with your life"];
//Array containing the data
var dataArray = [];
//Array containing the names of the variables
var variablesArray = [
  "Feeling of happiness",
  "Important in life: Family",
  "Satisfaction with your life"
];

createCountryBubbles();

createListOfVariables();

loadData();


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
         var index = selectedCountries.indexOf(d.data.Country);
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
           selectedCountries.push(d.data.Country);
           //Set color to red
           d3.select(this).style("fill", "rgb(255, 0, 0)");
           //Enable the create bar chart button if a variable is selected
           if (selectedVariables.length != 0) {
             $('#createBarchartButton input[name="barchartButton"]')
                .attr("disabled", false);
           }
         }
       });
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

//Function for loading the data of the variables
function loadData() {

  d3.queue()
    .defer(d3.csv, "Data/Feeling_of_happiness_Wave6.csv")
    .defer(d3.csv, "Data/Important_in_life_Family_Wave6.csv")
    .defer(d3.csv, "Data/Satisfaction_with_your_life_Wave6.csv")
    .await(function (error, feelings, family, satisfaction) {
      if (error) { console.log(error); };

      //Create new objects containing the variables and country
      for(var i = 0; i < feelings.length; i++){
        var countryObj;
        var country = feelings[i].Country
        var feelingsObj = feelings[i];
        delete feelingsObj.Country;
        var familyObj = family[i];
        delete familyObj.Country;
        var satisfactionObj = satisfaction[i];
        delete satisfactionObj.Country;
        countryObj = {
          "country": country,
          "Feeling of happiness": feelingsObj,
          "Important in life: Family": familyObj,
          "Satisfaction with your life": satisfactionObj
        }
        dataArray.push(countryObj);
      }

      //For testing
      createBarChart();

    });


}

//https://bl.ocks.org/mbostock/3886394
//Function for creating the stacked bar chart with the previously specified variables and countries
function createBarChart() {
  //Clear the SVG if there already exists a var chart
  $("svg#stackedBarChart").empty();

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

  //Create the color scale
  var z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  var stack = d3.stack()
      .offset(d3.stackOffsetExpand);

  //The data that is to be used
  var data = dataArray;

  //Filter countries
  for (var i in data) {
    data = filterCountries(data);
  }
  console.log(data);

  //Map the data for the x-axis (which is the countries)
  x0.domain(data.map(function(d){ return d.country }));
  //This is the domain for the variables in the group
  x1.domain(selectedVariables).rangeRound([0, x0.bandwidth()]);
  //Map the colors to each category
  //TODO: Create multiple color sets for different variables
  z.domain(data.columns.slice(1));


  //Create the groups for holding the grouped bars
  var barGroups = g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function (d) { return "translate(" + x0(d.Country) + ",0)"; });
  
  //Create the groups representing the bars and holding the stacked rectangles
  var stackedBars = barGroups.selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function (d) { return "translate(" + x0() + ",0)"; });


/*
    .enter().append("rect")
      .attr("x", function (d) { return x1(d.key); })
      .attr("y", function (d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function (d) { return height - y(d.value); })
      .attr("fill", function (d) { return z(d.key); });
      */
  var serie = g.selectAll(".serie")
    .data(stack.keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function (d) { return z(d.key); });

  serie.selectAll("rect")
    .data(function (d) { return d; })
    .enter().append("rect")
      .attr("x", function (d) { return x0(d.data.Country); })
      .attr("y", function (d) { return y(d[1]); })
      .attr("height", function (d) { return y(d[0]) - y(d[1]); })
      .attr("width", x0.bandwidth());

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "%"));

  var legend = serie.append("g")
      .attr("class", "legend")
      .attr("transform", function (d) {
        var d = d[d.length - 1];
        return "translate(" + (x0(d.data.Country) + x0.bandwidth()) + "," + ((y(d[0]) + y(d[1])) / 2) + ")";
      });

  legend.append("line")
      .attr("x1", -6)
      .attr("x2", 6)
      .attr("stroke", "#000");

  legend.append("text")
      .attr("x", 9)
      .attr("dy", "0.35em")
      .attr("fill", "#000")
      .style("font", "10px sans-serif")
      .text(function (d) { return d.key; });
}


//Filters the data so that only the selected countries are left
function filterCountries(data) {
  var newData = data.filter(function (d) {
    return selectedCountries.indexOf(d.country) >= 0;
  });
//  newData.columns = columns;
  return newData;
}

//Function for cleaning the data
function cleanData(data) {
  var newData = [];
  //Loop through the arrays in the data
  for (array in data) {
    //Loop through each element in the array
    for (var i = 0; i < data[array].length; i++) {
      if (!Array.isArray(data[array][i])) {
        clean(data[array][i], ["Average"]);
      } else {    //Handle the case of column seperatly
        data[array].columns = clean(data[array].columns);
      }
    }
  }
}

//http://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
//http://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
// Will remove all falsy values: undefined, null, 0, false, NaN and "" (empty string)
//The properties array is a list of additional properties to remove
function clean(obj, properties) {

  if (Array.isArray(obj)) {
    var end = obj.length;
    var newArray = [];
    for (var i = 0; i < end; i++) {
      if (obj[i]) {
        newArray.push(obj[i]);
      }
    }
    return newArray;
  } else {
    var newObj;
    for (var propName in obj) {
      if (obj[propName] === "") {
        delete obj[propName];
      }
    }
    //If some additional parameters has been specified those should also be removed
    if (properties) {
      for (var propName in properties) {
        if (obj[propName] === properties[propName]) {
          delete obj[propName];
        }
      }
    }
    newObj = obj;
    return newObj;
  }
}
