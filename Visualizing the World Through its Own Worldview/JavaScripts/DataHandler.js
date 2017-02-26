//Array containing the data
var dataArray = [];
//Object containing the data
var dataObj = [];
//var dataArray6 = [];
var countries = [];
//Containing the countries with their data from Gapminder
var countryObjects = [];
//Array to hold any countries that has been removed from the last mapping i.e. if any of the old countries does not exist in the new data
var oldCountryObjects = [];
//Variable for checking if gapminder data is loaded
var gapminderLoaded = false;
//Arrays to hold selections
var selectedCountries = [];
var selectedVariables = [];
var selectedWave = 5;
//Array containing the names of the variables
var variablesArray = [
  "Feeling of happiness",
  "Important in life: Family",
  "Satisfaction with your life",
  "Important in life: Work",
  "Most important first choice",
  "Most people can be trusted",
  "Being very successful is important to me",
  "State of health subjective"
];
//Array containing the names of the gapminder variables 
var gapminderDataVariables = [
  "GDP per capita",
  "Indicator alcohol consumption",
  "Indicator BMI female",
  "Indicator BMI male",
  "Indicator health spending",
  "Suicide indicator",
  "War mortality"
];
var selectedGapminderVariable = "GDP per capita";

var dataLoadedCheck = false;

//Function for loading the data of the variables
function loadData() {
  //Load data for wave 3
  d3.queue()
  .defer(d3.csv, "Data/Feeling_of_happiness_Wave3.csv")
  .defer(d3.csv, "Data/Important_in_life_Family_Wave3.csv")
  .defer(d3.csv, "Data/Satisfaction_with_your_life_Wave3.csv")
  .defer(d3.csv, "Data/Important_in_life_Work_Wave3.csv")
  .defer(d3.csv, "Data/Most_important_first_choice_Wave3.csv")
  .defer(d3.csv, "Data/Most_people_can_be_trusted_Wave3.csv")
  .defer(d3.csv, "Data/State_of_health_subjective_Wave3.csv")
  .await(function (error, cat1, cat2, cat3, cat4, cat5, cat6, cat7) {
    if (error) { console.log(error); };
    var data = [];

    var allCategories = [cat1, cat2, cat3, cat4, cat5, cat6, cat7];
    //Finds the length of the largest array
    var maxLenght = Math.max(...allCategories.map(function(d) {return d.length})); //The ... syntax takes the elements in the array and places them as arguments to the function

    //Create new objects containing the variables and country
    for (var i = 0; i < maxLenght; i++) {
      var countryObj = {};
      countryObj.country = allCategories[0][i].Country;
      //Add country to countries array if it is not alreay in there
      if (countries.indexOf(countryObj.country) < 0) {
        countries.push(countryObj.country);
      }
      for (var j = 0; j < allCategories.length; j++) {
        //Array of the current category
        var currentCategory = allCategories[j];
        //Go through the objects in the current category the find the one that belongs to the current country
        for (var k = 0; k < currentCategory.length; k++) {
          if (currentCategory[k].Country == countryObj.country) {
            //Remove the Country property
            delete currentCategory[k].Country;
            //Add the data to the country object
            countryObj[variablesArray[j]] = currentCategory[k];
          }
        }
      }
      data.push(countryObj);
    }
    dataObj.push(data);
  });
  //Load data for wave 4
  d3.queue()
    .defer(d3.csv, "Data/Feeling_of_happiness_Wave4.csv")
    .defer(d3.csv, "Data/Important_in_life_Family_Wave4.csv")
    .defer(d3.csv, "Data/Satisfaction_with_your_life_Wave4.csv")
    .defer(d3.csv, "Data/Important_in_life_Work_Wave4.csv")
    .defer(d3.csv, "Data/Most_important_first_choice_Wave4.csv")
    .defer(d3.csv, "Data/State_of_health_subjective_Wave4.csv")
    .await(function (error, cat1, cat2, cat3, cat4, cat5, cat6) {
      if (error) { console.log(error); };

      var data = [];
      var allCategories = [cat1, cat2, cat3, cat4, cat5, cat6];
      //Finds the length of the largest array
      var maxLenght = Math.max(...allCategories.map(function(d) {return d.length})); //The ... syntax takes the elements in the array and places them as arguments to the function

      //Create new objects containing the variables and country
      for (var i = 0; i < maxLenght; i++) {
        var countryObj = {};
        countryObj.country = allCategories[0][i].Country;
        //Add country to countries array if it is not alreay in there
        if (countries.indexOf(countryObj.country) < 0) {
          countries.push(countryObj.country);
        }
        for (var j = 0; j < allCategories.length; j++) {
          //Array of the current category
          var currentCategory = allCategories[j];
          //Go through the objects in the current category the find the one that belongs to the current country
          for (var k = 0; k < currentCategory.length; k++) {
            if (currentCategory[k].Country == countryObj.country) {
              //Remove the Country property
              delete currentCategory[k].Country;
              //Add the data to the country object
              countryObj[variablesArray[j]] = currentCategory[k];
            }
          }
        }
        data.push(countryObj);
      }
      dataObj.push(data);
    });
  //Load data for wave 5
  d3.queue()
    .defer(d3.csv, "Data/Feeling_of_happiness_Wave5.csv")
    .defer(d3.csv, "Data/Important_in_life_Family_Wave5.csv")
    .defer(d3.csv, "Data/Satisfaction_with_your_life_Wave5.csv")
    .defer(d3.csv, "Data/Important_in_life_Work_Wave5.csv")
    .defer(d3.csv, "Data/Most_important_first_choice_Wave5.csv")
    .defer(d3.csv, "Data/Most_people_can_be_trusted_Wave5.csv")
    .defer(d3.csv, "Data/Being_very_successful_Wave5.csv")
    .defer(d3.csv, "Data/State_of_health_subjective_Wave5.csv")
    .await(fixData);
  //Load data for wave 6
  d3.queue()
    .defer(d3.csv, "Data/Feeling_of_happiness_Wave6.csv")
    .defer(d3.csv, "Data/Important_in_life_Family_Wave6.csv")
    .defer(d3.csv, "Data/Satisfaction_with_your_life_Wave6.csv")
    .defer(d3.csv, "Data/Important_in_life_Work_Wave6.csv")
    .defer(d3.csv, "Data/Most_important_first_choice_Wave6.csv")
    .defer(d3.csv, "Data/Most_people_can_be_trusted_Wave6.csv")
    .defer(d3.csv, "Data/Being_very_successful_Wave6.csv")
    .defer(d3.csv, "Data/State_of_health_subjective_Wave6.csv")
    .await(fixData);
      

}

//Function for loading the data of the variables
function loadData2() {
  if (selectedWave == 6) {
    d3.queue()
      .defer(d3.csv, "Data/Feeling_of_happiness_Wave6.csv")
      .defer(d3.csv, "Data/Important_in_life_Family_Wave6.csv")
      .defer(d3.csv, "Data/Satisfaction_with_your_life_Wave6.csv")
      .defer(d3.csv, "Data/Important_in_life_Work_Wave6.csv")
      .defer(d3.csv, "Data/Most_important_first_choice_Wave6.csv")
      .defer(d3.csv, "Data/Most_people_can_be_trusted_Wave6.csv")
      .defer(d3.csv, "Data/Being_very_successful_Wave6.csv")
      .defer(d3.csv, "Data/State_of_health_subjective_Wave6.csv")
      .await(fixData);
  }

  if (selectedWave == 5) {
    d3.queue()
      .defer(d3.csv, "Data/Feeling_of_happiness_Wave5.csv")
      .defer(d3.csv, "Data/Important_in_life_Family_Wave5.csv")
      .defer(d3.csv, "Data/Satisfaction_with_your_life_Wave5.csv")
      .defer(d3.csv, "Data/Important_in_life_Work_Wave5.csv")
      .defer(d3.csv, "Data/Most_important_first_choice_Wave5.csv")
      .defer(d3.csv, "Data/Most_people_can_be_trusted_Wave5.csv")
      .defer(d3.csv, "Data/Being_very_successful_Wave5.csv")
      .defer(d3.csv, "Data/State_of_health_subjective_Wave5.csv")
      .await(fixData);
  }

  if (selectedWave == 4) {
    d3.queue()
      .defer(d3.csv, "Data/Feeling_of_happiness_Wave4.csv")
      .defer(d3.csv, "Data/Important_in_life_Family_Wave4.csv")
      .defer(d3.csv, "Data/Satisfaction_with_your_life_Wave4.csv")
      .defer(d3.csv, "Data/Important_in_life_Work_Wave4.csv")
      .defer(d3.csv, "Data/Most_important_first_choice_Wave4.csv")
      .defer(d3.csv, "Data/State_of_health_subjective_Wave4.csv")
      .await(function (error, cat1, cat2, cat3, cat4, cat5, cat6) {
        if (error) { console.log(error); };

        var data = [];
        countries = [];

        var allCategories = [cat1, cat2, cat3, cat4, cat5, cat6];
        //Finds the length of the largest array
        var maxLenght = Math.max(...allCategories.map(function(d) {return d.length})); //The ... syntax takes the elements in the array and places them as arguments to the function

        //Create new objects containing the variables and country
        for (var i = 0; i < maxLenght; i++) {
          var countryObj = {};
          countryObj.country = allCategories[0][i].Country;
          //Add country to countries array if it is not alreay in there
          if (countries.indexOf(countryObj.country) < 0) {
            countries.push(countryObj.country);
          }
          for (var j = 0; j < allCategories.length; j++) {
            //Array of the current category
            var currentCategory = allCategories[j];
            //Go through the objects in the current category the find the one that belongs to the current country
            for (var k = 0; k < currentCategory.length; k++) {
              if (currentCategory[k].Country == countryObj.country) {
                //Remove the Country property
                delete currentCategory[k].Country;
                //Add the data to the country object
                countryObj[variablesArray[j]] = currentCategory[k];
              }
            }
          }
          data.push(countryObj);
        }
        if (selectedCountries.length > 0 && selectedVariables.length > 0) {
          createBarChart();
        }
        if (!gapminderLoaded) {
          loadGapminderData();
        } else {
          createCountryBubbles();
        }

      });
  }

  if (selectedWave == 3) {
    d3.queue()
      .defer(d3.csv, "Data/Feeling_of_happiness_Wave3.csv")
      .defer(d3.csv, "Data/Important_in_life_Family_Wave3.csv")
      .defer(d3.csv, "Data/Satisfaction_with_your_life_Wave3.csv")
      .defer(d3.csv, "Data/Important_in_life_Work_Wave3.csv")
      .defer(d3.csv, "Data/Most_important_first_choice_Wave3.csv")
      .defer(d3.csv, "Data/Most_people_can_be_trusted_Wave3.csv")
      .defer(d3.csv, "Data/State_of_health_subjective_Wave3.csv")
      .await(function (error, cat1, cat2, cat3, cat4, cat5, cat6, cat7) {
        if (error) { console.log(error); };
        var data = [];
        countries = [];

        var allCategories = [cat1, cat2, cat3, cat4, cat5, cat6, cat7];
        //Finds the length of the largest array
        var maxLenght = Math.max(...allCategories.map(function(d) {return d.length})); //The ... syntax takes the elements in the array and places them as arguments to the function

        //Create new objects containing the variables and country
        for (var i = 0; i < maxLenght; i++) {
          var countryObj = {};
          countryObj.country = allCategories[0][i].Country;
          //Add country to countries array if it is not alreay in there
          if (countries.indexOf(countryObj.country) < 0) {
            countries.push(countryObj.country);
          }
          for (var j = 0; j < allCategories.length; j++) {
            //Array of the current category
            var currentCategory = allCategories[j];
            //Go through the objects in the current category the find the one that belongs to the current country
            for (var k = 0; k < currentCategory.length; k++) {
              if (currentCategory[k].Country == countryObj.country) {
                //Remove the Country property
                delete currentCategory[k].Country;
                //Add the data to the country object
                countryObj[variablesArray[j]] = currentCategory[k];
              }
            }
          }
          data.push(countryObj);
        }
        if (selectedCountries.length > 0 && selectedVariables.length > 0) {
          createBarChart();
        }
        if (!gapminderLoaded) {
          loadGapminderData();
        } else {
          createCountryBubbles();
        }

      });
  }
}

//Used for restructuring the input data in loadData()
function fixData(error, feelings, family, satisfaction, work, firstChoice, trust, successful, health) {
  if (error) { console.log(error); };

  var data = [];
  var allCategories = [feelings, family, satisfaction, work, firstChoice, trust, successful, health];
  //Finds the length of the largest array
  var maxLenght = Math.max(...allCategories.map(function(d) {return d.length})); //The ... syntax takes the elements in the array and places them as arguments to the function
  //Create new objects containing the variables and country
  for (var i = 0; i < maxLenght; i++) {
    var countryObj = {};
    countryObj.country = allCategories[0][i].Country;
    //Add country to countries array if it is not alreay in there
    if (countries.indexOf(countryObj.country) < 0) {
      countries.push(countryObj.country);
    }
    for (var j = 0; j < allCategories.length; j++) {
      //Array of the current category
      var currentCategory = allCategories[j];
      //Go through the objects in the current category the find the one that belongs to the current country
      for (var k = 0; k < currentCategory.length; k++) {
        if (currentCategory[k].Country == countryObj.country) {
          //Remove the Country property
          delete currentCategory[k].Country;
          //Add the data to the country object
          countryObj[variablesArray[j]] = currentCategory[k];
        }
      }
    }
    data.push(countryObj);
  }
  dataObj.push(data);
  //Check if this is the second time this functions runs i.g. wave 6 data has loaded
  if (dataLoadedCheck) {
    dataArray = dataObj[selectedWave - 3];
    //Load the gapminder data if it is not loaded yet
    if (!gapminderLoaded) {
      loadGapminderData();
    } else {
      createCountryBubbles();
    }
  } else {
    dataLoadedCheck = true;
  }
};

//Use to read the data from gapminder
function loadGapminderData() {
  d3.queue()
    .defer(d3.csv, "Data/Gapminder_gdp_per_capita.csv")
    .defer(d3.csv, "Data/Gapminder_indicator_alcohol_consumption.csv")
    .defer(d3.csv, "Data/Gapminder_indicator_BMI_female.csv")
    .defer(d3.csv, "Data/Gapminder_indicator_BMI_male.csv")
    .defer(d3.csv, "Data/Gapminder_indicator_health_spending.csv")
    .defer(d3.csv, "Data/Gapminder_suicide_indicator.csv")
    .defer(d3.csv, "Data/Gapminder_war_mortality.csv")
    .await(function (error, cat1, cat2, cat3, cat4, cat5, cat6, cat7) {

      var allCategories = [cat1, cat2, cat3, cat4, cat5, cat6, cat7];
      //Finds the length of the largest array
      var maxLenght = Math.max(...allCategories.map(function(d) {return d.length})); //The ... syntax takes the elements in the array and places them as arguments to the function

      //Create objects containing the data
      for (var i = 0; i < maxLenght; i++) {
        var countryObject = {};
        countryObject.country = allCategories[0][i].Country;
        for (var j = 0; j < allCategories.length; j++) {
          //Array of the current category
          var currentCategory = allCategories[j];
          //Go through the objects in the current category the find the one that belongs to the current country
          for (var k = 0; k < currentCategory.length; k++) {
            if (currentCategory[k].Country == countryObject.country) {
              var waveObj = {
                name: gapminderDataVariables[j],
                wave3: currentCategory[k].Wave3,
                wave4: currentCategory[k].Wave4,
                wave5: currentCategory[k].Wave5,
                wave6: currentCategory[k].Wave6
              };
              //Remove the Country property
              delete currentCategory[k].Country;
              //Add the data to the country object
              countryObject[gapminderDataVariables[j]] = waveObj;
            }
          }
        }
        countryObjects.push(countryObject);
      }
      gapminderLoaded = true;
      //createCountryBubbles();
      updateCountryBubbles();
      createDropdownItems();
      addMappingButtonListners();
    });
}

//Filters the data so that only the selected countries are left
function filterCountries(data) {
  var newData = data.filter(function (d) {
    return selectedCountries.indexOf(d.country) >= 0;
  });
  return newData;
}

//Function for creating the items in the dropdown lists
function createDropdownItems() {

  var dropdownGap = d3.select("#gapminderVariables");
  for (var i = 0; i < gapminderDataVariables.length; i++) {
    dropdownGap.append("option")
      .attr("value", gapminderDataVariables[i])
      .html(gapminderDataVariables[i]);
  }
  //Add listener
  $("#gapminderVariables").change(function () {
    var dropdown = $("#gapminderVariables");
    selectedGapminderVariable = dropdown.val();
    //Set the text to the right variable
    $("#gapminderMapping").html(selectedGapminderVariable);
    selectedCountries = [];
    updateCountryBubbles();
  })
  
  //Create the elements in the waves array
  var dropdownWave = d3.select("#waves");
  for (var i = 3; i < 7; i++) {
    var startYear = 1980 + i * 5;
    var endYear = startYear + 4;
    var elem = dropdownWave.append("option")
      .attr("value", i)
      .html("Wave " + i + " (" + startYear + "-" + endYear + ")");
    if (i == selectedWave) {
      elem.attr("selected", true);
    }
  }
  $("#waves").change(function () {
    var dropdown = $("#waves");
    selectedWave = dropdown.val();
    $("#waveMapping").html(selectedWave);
    dataArray = dataObj[selectedWave - 3];
    updateCountryBubbles();
  })


}