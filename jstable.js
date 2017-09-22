function makeTableByCsv(inputCsv) {
  if (inputCsv == null) {
    throw 'No Input Data';
  }

  var lines = inputCsv.split(/[\r\n]+/);
  if (lines.length < 1) {
    throw 'Invalid CSV Data';
  }
  while (lines[0]                == '')  lines.shift();
  while (lines[lines.length - 1] == '')  lines.pop();

  maxcol = 0;
  var words = [];
  for (var i = 0; i < lines.length; i++) {
    words.push(lines[i].split(','));
    while (words[i][words[i].length - 1] == '')  words[i].pop();
    maxcol = (maxcol < words[i].length) ? words[i].length : maxcol;
  }

  var output = '';
  for (var i = 0; i < words.length; i++) {
    if (i == 0) {
      output = output + '<thead><tr>';
    } else if (i == 1) {
      output = output + '<tbody><tr>';
    } else {
      output = output + '<tr>';
    }

    for (var j = 0; j < maxcol; j++) {
      if (i == 0) {
        if (j < words[i].length) {
          output = output + '<th>' + words[i][j] + '</th>';
        } else {
          output = output + '<th>' + 'n/a' + '</th>';
        }
      } else {
        if (j < words[i].length) {
          output = output + '<td>' + words[i][j] + '</td>';
        } else {
          output = output + '<td>' + 'n/a' + '</td>';
        }
      }
    }

    if (i == 0) {
      output = output + '</tr></thead>';
    } else if (i == words.length - 1) {
      output = output + '</tr></tbody>';
    } else {
      output = output + '</tr>';
    }
  }

  return output;
}

function makeTableByJson(inputJson) {
  if (inputJson == null) {
    throw 'No Input Data';
  }

  var objJson;
   try {
     objJson = JSON.parse(inputJson);
   } catch(e) {
     throw 'Not JSON Data';
   }

  var keys = [];
  var values = Object.keys(objJson).length;
  for (var i = 0; i < values; i++) {
    if (typeof(objJson[i]) === 'undefined') {
      throw 'Invalid JSON Data';
    }
    for (var j = 0; j < Object.keys(objJson[i]).length; j++) {
      var val = Object.keys(objJson[i])[j];
      if (typeof(objJson[i][val]) === 'number' || typeof(objJson[i][val]) === 'string') {
        keys.push(val);
      }
    }
  }
  keys = keys.filter(function (x, i, self) {
    return self.indexOf(x) === i;
  });

  var output = '';
  output = output + '<thead><tr>';
  for (var i = 0; i < keys.length; i++) {
    output = output + '<th>' + keys[i] + '</th>';
  }
  output = output + '</tr></thead>';

  output = output + '<tbody>';
  for (var i = 0; i < values; i++) {
    output = output + '<tr>';
    for (var j = 0; j < keys.length; j++) {
      var val = objJson[i][keys[j]];
      if (typeof(val) === 'number' || typeof(val) === 'string') {
        output = output + '<td>' + val + '</td>';
      } else {
        output = output + '<td>' + 'n/a' + '</td>';
      }
    }
    output = output + '</tr>';
  }
  output = output + '</tbody>';


  return output;
}

function makeTable(filename, input) {
  var output = '';

  if (filename == null) {
    throw 'No Filename';
  }

  if (typeof(filename) !== 'string') {
    throw 'Invalid Filename';
  }

  var extention = filename.match(/\.([a-zA-Z]+)$/);
  if (extention == null) {
    throw  'No File Extention';
  } else {
    extention = extention[1].toLowerCase();
  }

  switch (extention) {
    case 'csv':
      try {
        output = makeTableByCsv(input);
      } catch (e) {
        throw e;
      }
      break;

    case 'json':
      try {
        output = makeTableByJson(input);
      } catch (e) {
        throw e;
      }
      break;

    default:
      throw 'Unsupported File Type';
  }

  return output;
}
