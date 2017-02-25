//http://bl.ocks.org/biovisualize/1016860
//Popup to show on hover for the barchart
var tooltip = d3.select("body")
	.append("div")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden")
	.text("");

//Function for creating buttons that gives the user the ability to change the "wave" of the data
function addWaveButtonListners() {
  //Find the buttons and add listeners to them
  d3.select("button#wave3Button")
    .on("click", function () {
      selectedWave = 3;
      //Change the variables array so that the variables not included in this wave does not exist
      variablesArray = [
        "Feeling of happiness",
        "Important in life: Family",
        "Satisfaction with your life",
        "Important in life: Work",
        "Most important first choice",
        "Most people can be trusted",
        "State of health subjective"
      ];
      loadData();
    });

  d3.select("button#wave4Button")
    .on("click", function () {
      selectedWave = 4;
      //Change the variables array so that the variables not included in this wave does not exist
      variablesArray = [
        "Feeling of happiness",
        "Important in life: Family",
        "Satisfaction with your life",
        "Important in life: Work",
        "Most important first choice",
        "State of health subjective"
      ];
      loadData();
    });

  d3.select("button#wave5Button")
    .on("click", function () {
      selectedWave = 5;
      //Change the variables array so that the variables not included in this wave does not exist
      variablesArray = [
        "Feeling of happiness",
        "Important in life: Family",
        "Satisfaction with your life",
        "Important in life: Work",
        "Most important first choice",
        "Most people can be trusted",
        "Being very successful is important to me",
        "State of health subjective"
      ];
      loadData();
    });

  d3.select("button#wave6Button")
    .on("click", function () {
      selectedWave = 6;
      //Change the variables array so that the variables not included in this wave does not exist
      variablesArray = [
        "Feeling of happiness",
        "Important in life: Family",
        "Satisfaction with your life",
        "Important in life: Work",
        "Most important first choice",
        "Most people can be trusted",
        "Being very successful is important to me",
        "State of health subjective"
      ];
      loadData();
    });
}

function addMappingButtonListners() {
  d3.select("button#gdpButton")
    .on("click", function () {
      selectedGapminderVariable = gapminderDataVariables[0];
      selectedCountries = [];
      updateCountryBubbles();
    });
  d3.select("button#alcoholButton")
    .on("click", function () {
      selectedGapminderVariable = gapminderDataVariables[1];
      selectedCountries = [];
      updateCountryBubbles();
    });
  d3.select("button#bmiFemaleButton")
    .on("click", function () {
      selectedGapminderVariable = gapminderDataVariables[2];
      selectedCountries = [];
      updateCountryBubbles();
    });
  d3.select("button#bmiMaleButton")
    .on("click", function () {
      selectedGapminderVariable = gapminderDataVariables[3];
      selectedCountries = [];
      updateCountryBubbles();
    });
  d3.select("button#healthButton")
    .on("click", function () {
      selectedGapminderVariable = gapminderDataVariables[4];
      selectedCountries = [];
      updateCountryBubbles();
    });
  d3.select("button#suicideButton")
    .on("click", function () {
      selectedGapminderVariable = gapminderDataVariables[5];
      selectedCountries = [];
      updateCountryBubbles();
    });
  d3.select("button#warButton")
    .on("click", function () {
      selectedGapminderVariable = gapminderDataVariables[6];
      selectedCountries = [];
      updateCountryBubbles();
    });
}