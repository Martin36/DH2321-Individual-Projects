﻿//Array containing the data
var dataArray = [];
//var dataArray6 = [];
var countries = [];
//Containing the countries with their data from Gapminder
var countryObjects = [];
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
var selectedGapminderVariable = "Indicator alcohol consumption";

//Function for loading the data of the variables
function loadData() {
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

        dataArray = [];
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
          dataArray.push(countryObj);
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
        dataArray = [];
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
          dataArray.push(countryObj);
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
  dataArray = [];
  countries = [];
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
    dataArray.push(countryObj);
  }
  //Check if the bar chart should be updated
  if (selectedCountries.length > 0 && selectedVariables.length > 0) {
    createBarChart();
  }
  //Load the gapminder data if it is not loaded yet
  if (!gapminderLoaded) {
    loadGapminderData();
  } else {
    createCountryBubbles();
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
      createCountryBubbles();
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
