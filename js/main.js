var interactive = d3.select('#interactive').append('svg');
var interactiveElement = document.getElementById('interactive');
var width = interactiveElement.clientWidth;
var height = interactiveElement.clientHeight;

function commaNumber (amount, dollar) {
  // return a 0 dollar value if amount is not valid
  // (you may optionally want to return an empty string)
  if (isNaN(amount)) {
    return "0";
  }

  // convert the number to a string
  var amount_str = String(amount);

  // split the string by the decimal point, separating the
  // whole dollar value from the cents. Dollars are in
  // amount_array[0], cents in amount_array[1]
  var amount_array = amount_str.split(".");

  // add the dollars portion of the amount to an
  // array in sections of 3 to separate with commas
  var dollar_array = [];
  var start;
  var end = amount_array[0].length;
  while (end > 0) {
    start = Math.max(end - 3, 0);
    dollar_array.unshift(amount_array[0].slice(start, end));
    end = start;
  }

  // assign dollar value back in amount_array with
  // the a comma delimited value from dollar_array
  amount_array[0] = dollar_array.join(",");

  // finally construct the return string joining
  // dollars with cents in amount_array
  var amount_string = amount_array.join("."); 
  if (dollar) {
    amount_string = "$"+amount_string;
  }
  return (amount_string);
} //commaNumber


//  'B24121': 'DETAILED OCCUPATION BY MEDIAN EARNINGS IN THE PAST 12 MONTHS (IN 2013 INFLATION-ADJUSTED DOLLARS) FOR THE FULL-TIME, YEAR-ROUND CIVILIAN EMPLOYED POPULATION 16 YEARS AND OVER',
//  'B24122': 'DETAILED OCCUPATION BY MEDIAN EARNINGS IN THE PAST 12 MONTHS (IN 2013 INFLATION-ADJUSTED DOLLARS) FOR THE FULL-TIME, YEAR-ROUND CIVILIAN EMPLOYED MALE POPULATION 16 YEARS AND OVER',
//  'B24123': 'DETAILED OCCUPATION BY MEDIAN EARNINGS IN THE PAST 12 MONTHS (IN 2013 INFLATION-ADJUSTED DOLLARS) FOR THE FULL-TIME, YEAR-ROUND CIVILIAN EMPLOYED FEMALE POPULATION 16 YEARS AND OVER',
//  'B24124': 'DETAILED OCCUPATION FOR THE FULL-TIME, YEAR-ROUND CIVILIAN EMPLOYED POPULATION 16 YEARS AND OVER',
//  'B24125': 'DETAILED OCCUPATION FOR THE FULL-TIME, YEAR-ROUND CIVILIAN EMPLOYED MALE POPULATION 16 YEARS AND OVER',
//  'B24126': 'DETAILED OCCUPATION FOR THE FULL-TIME, YEAR-ROUND CIVILIAN EMPLOYED FEMALE POPULATION 16 YEARS AND OVER'


var codes = {
  'B24121': 'DETAILED OCCUPATION BY MEDIAN EARNINGS IN THE PAST 12 MONTHS (IN 2013 INFLATION-ADJUSTED DOLLARS) FOR THE FULL-TIME, YEAR-ROUND CIVILIAN EMPLOYED POPULATION 16 YEARS AND OVER',
  'B24122': 'DETAILED OCCUPATION BY MEDIAN EARNINGS IN THE PAST 12 MONTHS (IN 2013 INFLATION-ADJUSTED DOLLARS) FOR THE FULL-TIME, YEAR-ROUND CIVILIAN EMPLOYED MALE POPULATION 16 YEARS AND OVER',
  'B24123': 'DETAILED OCCUPATION BY MEDIAN EARNINGS IN THE PAST 12 MONTHS (IN 2013 INFLATION-ADJUSTED DOLLARS) FOR THE FULL-TIME, YEAR-ROUND CIVILIAN EMPLOYED FEMALE POPULATION 16 YEARS AND OVER',
  'B24124': 'DETAILED OCCUPATION FOR THE FULL-TIME, YEAR-ROUND CIVILIAN EMPLOYED POPULATION 16 YEARS AND OVER',
  'B24125': 'DETAILED OCCUPATION FOR THE FULL-TIME, YEAR-ROUND CIVILIAN EMPLOYED MALE POPULATION 16 YEARS AND OVER',
  'B24126': 'DETAILED OCCUPATION FOR THE FULL-TIME, YEAR-ROUND CIVILIAN EMPLOYED FEMALE POPULATION 16 YEARS AND OVER'
};

var colors = {
  red : {
    1 : '#821B0D',
    2 : '#B13631',
    3 : '#D75B5B',
    4 : '#F18788',
    5 : '#FDB9B0'
  },
  green : {
    1 : '#1E5124',
    2 : '#337331',
    3 : '#509453',
    4 : '#77B479',
    5 : '#A8D4A1'
  },
  yellow : {
    1 : '#664400',
    2 : '#8A6318',
    3 : '#AD8536',
    4 : '#D0A95C',
    5 : '#F2CE88'
  },
  blue : {
    1 : '#00477A',
    2 : '#2368A0',
    3 : '#4A8AC1',
    4 : '#75AEDC',
    5 : '#A7D2F1'
  },
  grey : {
    1 : '#353131',
    2 : '#5E5959',
    3 : '#8A8585',
    4 : '#B7B4B4',
    5 : '#E6E5E5'
  }
};

var groupings = {
            'management' : { color : colors.red[1] },
            'operations' : { color : colors.red[2] },
               'finance' : { color : colors.red[3] },
             'computers' : { color : colors.red[4] },
           'engineering' : { color : colors.red[5] },
               'science' : { color : colors.green[1] },
       'social_services' : { color : colors.green[2] },
                   'law' : { color : colors.green[3] },
             'education' : { color : colors.green[4] },
   'media_entertainment' : { color : colors.green[5] },
   'health_practitioner' : { color : colors.blue[1] },
        'health_support' : { color : colors.blue[2] },
            'protective' : { color : colors.blue[3] },
      'food_preparation' : { color : colors.blue[4] },
  'building_maintenance' : { color : colors.blue[5] },
               'service' : { color : colors.yellow[1] },
          'sales_retail' : { color : colors.yellow[2] },
         'admin_support' : { color : colors.yellow[3] },
      'farm_fish_forest' : { color : colors.yellow[4] },
          'construction' : { color : colors.yellow[5] },
            'extraction' : { color : colors.grey[1] },
           'maintenance' : { color : colors.grey[2] },
            'production' : { color : colors.grey[3] },
        'transportation' : { color : colors.grey[4] }
};

var padding = 20;

var leftScale = d3.scale.linear()
  .domain([0,1])
  .range([height - padding, padding]);

var rightScale = d3.scale.linear()
  .domain([0,100000])
  .range([height - padding, padding]);

var sizeScale = d3.scale.linear()
  .domain([1,10000000])
  .range([1, 10]);


var items = interactive.selectAll('line.item');
var data = oboe('./data/data_5yr.json');

data.done(function(fullData) {
  window.fullData = fullData;
  console.log('done');

  var collection = items.data(fullData.groups);
  var group = collection.enter().append('svg:g')
    .classed('profession-group', true);

  group.append('svg:line')
    .classed('item', true)
    .attr('x1', 200)
    .attr('x2', width - 200)
    .attr('y1', function(d) { return leftScale(
      d.B24125.total / d.B24124.total
    ); })
    .attr('y2', function(d) { return rightScale(d.B24121.total); })
    .attr('stroke-width', function(d) {
      return sizeScale(d.B24124.total);
    });
    // .attr('stroke', function(d) { return d.group && groupings[d.group] && groupings[d.group].color; });
  group.append('svg:line')
    .classed('hoverline', true)
    .attr('x1', 200)
    .attr('x2', width - 200)
    .attr('y1', function(d) { return leftScale(
      d.B24125.total / d.B24124.total
    ); })
    .attr('y2', function(d) { return rightScale(d.B24121.total); })
    .on('mouseenter', function(d) {
      this.parentNode.classList.add('active');
      console.log(d.name, d.B24125.total / d.B24124.total, d.group, groupings[d.group]);
    })
    .on('mouseleave', function(d) {
      this.parentNode.classList.remove('active');
    });
  group.append('svg:text')
    .classed('leftlabel', true)
    .classed('label', true)
    .text(function(d) { return Math.round(100 * d.B24125.total / d.B24124.total) + "%"; })
    .attr('x', 200 - 5)
    .attr('y', function(d) { return leftScale(
      d.B24125.total / d.B24124.total
    ) + 5; });
  group.append('svg:text')
    .classed('rightlabel', true)
    .classed('label', true)
    .text(function(d) {
      return '$' + commaNumber(d.B24121.total);
    })
    .attr('x', width - 200 + 5)
    .attr('y', function(d) { return rightScale(d.B24121.total) + 5; });
});


// var fullData = [];
// // get every node as it comes in...
// data.node('!.*', function(node) {
//   fullData.push(node);
//   items.data(fullData)
//     .enter().append('svg:circle')
//     .classed('item', true)
//     .attr('cx', function(d) { return xScale(d['B24214'].total); })
//     .attr('cy', function(d) { return yScale(d['B24121'].total); })
//     .attr('r', 20);
// });
