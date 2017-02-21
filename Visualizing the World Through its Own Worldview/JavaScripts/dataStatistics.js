var dataStatistics = function () {


  this.addColumns = function (data, columnsToAdd) {

    //var colNames = data.columns;
    var newData = [];
    
    var colNames = data.columns.filter(function (d) {
      return !columnsToAdd.includes(d);
    })

    for (i = 0; i < data.length - 1; ++i) {
      var dataRow = new Object;
      sum = 0;
      for (var x in data[0]) {
        if (!columnsToAdd.includes(x)) {
          dataRow[x] = data[i][x];
        }
        else {
          sum += data[i][x];
        }
      }
      dataRow['Other'] = sum;
      newData.push(dataRow);
    }

    newData.columns = colNames;
    return newData;
  }
}


