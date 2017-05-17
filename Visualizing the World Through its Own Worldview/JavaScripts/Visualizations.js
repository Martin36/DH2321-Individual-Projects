
var percentFormat = d3.format(".1%");

//Color scales
//From: http://colorbrewer2.org/#type=sequential&scheme=YlOrBr&n=9
var colorScales = [];
addColors();

var bubbleChartColors = ['#ff5252', '#ffd452', '#52ff52', '#52ffff', '#5252ff', '#ff527d'];

//Function for creating a list with checkboxes of variables where the user can select which ones they want to see
function createListOfVariables() {

  //Select the select
  var select = d3.select("#listOfVariables");

  //Create an checkbox element for each variable
  for (var i = 0; i < variablesArray.length; i++) {
    //Create option for each variable
    select.append("option")
      .attr("value", variablesArray[i])
      .html(variablesArray[i]);

  }
  $('#listOfVariables').change(addVariables);
  //This function is called when the checkbox is clicked
  function addVariables() {
    //Loop through all the options in the select
    $("#listOfVariables > option").each(function () {
      if(this.selected){
        //Add the variable to the selected ones, if it is not already there
        if(selectedVariables.indexOf(this.value) == -1) {
          selectedVariables.push(this.value);
        }
        //Enable button if any countries are selected
        if (selectedCountries != 0) {
          $("#barchart-button")
            .attr("disabled", false);
        }
      }else{
        //Remove the variable from the selected ones
        var index = selectedVariables.indexOf(this.value);
        if (index >= 0) {
          selectedVariables.splice(index, 1);
        }
      }
    });
    //Disable button if selectedVariables if empty
    if (selectedVariables == 0) {
      $("#barchart-button")
        .attr("disabled", true);
    }
  }
  //Add a button for creating the bar chart
  d3.select("#createBarchartButton").append("input")
    .attr("name", "barchartButton")
    .attr("id", "barchart-button")
    .attr("value", "Create Bar Chart")
    .attr("type", "button")
    .attr("disabled", true)
    .attr("class", "btn btn-info")
    .on("click", function () {
      createBarChart(dataArray);
    })
}
//Function for creating a list with checkboxes of variables where the user can select which ones they want to see
function createListOfVariables2() {
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
            $("#barchart-button")
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
            $("#barchart-button")
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
    .attr("id", "barchart-button")
    .attr("value", "Create Bar Chart")
    .attr("type", "button")
    .attr("disabled", true)
    .on("click", function () {
      createBarChart(dataArray);
    })

}


function addColors() {
  colorScales.push(d3.scaleOrdinal().range(['#f7fcfd', '#e5f5f9', '#ccece6', '#99d8c9', '#66c2a4', '#41ae76', '#238b45', '#006d2c', '#00441b'].reverse()))
  colorScales.push(d3.scaleOrdinal().range(['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#88419d', '#810f7c', '#4d004b'].reverse()))
  colorScales.push(d3.scaleOrdinal().range(['#f7fcf0', '#e0ecf4', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac', '#084081'].reverse()))
  colorScales.push(d3.scaleOrdinal().range(['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000'].reverse()))
  colorScales.push(d3.scaleOrdinal().range(['#fff7fb', '#ece7f2', '#d0d1e6', '#a6bddb', '#74a9cf', '#3690c0', '#0570b0', '#045a8d', '#023858'].reverse()))
  colorScales.push(d3.scaleOrdinal().range(['#fff7fb', '#ece2f0', '#d0d1e6', '#a6bddb', '#67a9cf', '#3690c0', '#02818a', '#016c59', '#014636'].reverse()))
  colorScales.push(d3.scaleOrdinal().range(['#f7f4f9', '#e7e1ef', '#d4b9da', '#c994c7', '#df65b0', '#e7298a', '#ce1256', '#980043', '#67001f'].reverse()))
  colorScales.push(d3.scaleOrdinal().range(['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#cc4c02', '#993404', '#662506'].reverse()))
}

