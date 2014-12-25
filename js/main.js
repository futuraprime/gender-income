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
  red : { 1 : '#821B0D', 2 : '#B13631', 3 : '#D75B5B', 4 : '#F18788', 5 : '#FDB9B0' },
  green : { 1 : '#1E5124', 2 : '#337331', 3 : '#509453', 4 : '#77B479', 5 : '#A8D4A1' },
  yellow : { 1 : '#664400', 2 : '#8A6318', 3 : '#AD8536', 4 : '#D0A95C', 5 : '#F2CE88' },
  blue : { 1 : '#00477A', 2 : '#2368A0', 3 : '#4A8AC1', 4 : '#75AEDC', 5 : '#A7D2F1' },
  grey : { 1 : '#353131', 2 : '#5E5959', 3 : '#8A8585', 4 : '#B7B4B4', 5 : '#E6E5E5' }
};

var groupings = {
            'management' : { color : colors.red[1],    name : 'Management' },
    'operations_finance' : { color : colors.red[2],    name : 'Business and Financial Operations' },
             'computers' : { color : colors.red[4],    name : 'Computer and Mathematical' },
           'engineering' : { color : colors.red[5],    name : 'Architecture and Engineering' },
               'science' : { color : colors.green[1],  name : 'Life, Physical, and Social Science' },
       'social_services' : { color : colors.green[2],  name : 'Community and Social Services' },
                   'law' : { color : colors.green[3],  name : 'Legal' },
             'education' : { color : colors.green[4],  name : 'Education, Training, and Library' },
   'media_entertainment' : { color : colors.green[5],  name : 'Arts, Design, Entertainment, Sports, and Media' },
   'health_practitioner' : { color : colors.blue[1],   name : 'Healthcare Practitioners and Technical' },
        'health_support' : { color : colors.blue[2],   name : 'Healthcare Support' },
            'protective' : { color : colors.blue[3],   name : 'Protective Service' },
      'food_preparation' : { color : colors.blue[4],   name : 'Food Preparation and Serving Related' },
  'building_maintenance' : { color : colors.blue[5],   name : 'Buildng and Grounds Cleaning and Maintenance' },
               'service' : { color : colors.yellow[1], name : 'Personal Care and Service' },
          'sales_retail' : { color : colors.yellow[2], name : 'Sales and Related' },
         'admin_support' : { color : colors.yellow[3], name : 'Office and Administrative Support' },
      'farm_fish_forest' : { color : colors.yellow[4], name : 'Farming, Fishing, and Forestry' },
          'construction' : { color : colors.yellow[5], name : 'Construction and Extraction' },
           'maintenance' : { color : colors.grey[2],   name : 'Installation, Maintenance, and Repair' },
            'production' : { color : colors.grey[3],   name : 'Production' },
        'transportation' : { color : colors.grey[4],   name : 'Transportation and Material Moving' }
};

var data = oboe('./data/data_5yr.json');

var proportionScale = d3.scale.linear()
  .domain([0,1]);
var incomeScale = d3.scale.linear()
  .domain([0,250000]);
var gapScale = d3.scale.log()
  .base(2)
  .domain([0.5, 2]);
var groupPopulationScale = d3.scale.linear()
  .domain([1,10000000]);

var topGraphFsm = new machina.Fsm({
  initialize : function() {
    var self = this;

    this.container = d3.select('#firstInteractive').append('svg');
    var containerElement = document.getElementById('firstInteractive');

    this.width = containerElement.clientWidth;
    this.height = containerElement.clientHeight;

    this.padding = 40;

    data.done(function(data) {
      self.handle('loaded', data);
    });
  },

  initialState : 'loading',

  handleData : function(data) {
    console.log('has data!!!!!!', data);
  },

  states : {
    'loading' : {
      loaded : function(data) {
        this.handleData(data);
        this.transition('first');
      }
    },
    'first' : {

    }
  }
});


// var items = firstInteractive.selectAll('g.line-group');

var groupsColorScale = chroma.scale([colors.blue[5], colors.blue[2]])
    .domain([20000,100000], 4)
    .mode('hsv');

data.done(function(fullData) {
  window.fullData = fullData;
  console.log('done');

  var collection = items.data(fullData.groups);
  var group = collection.enter().append('svg:g')
    .classed('line-group', true);
  


  var leftSide = 200;
  var rightSide = width - 200;

  function mainLine(group, leftSide, rightSide, leftFn, rightFn, sizeFn) {
    return group.append('svg:line')
      .classed('item', true)
      .attr('x1', leftSide)
      .attr('x2', rightSide)
      .attr('y1', leftFn)
      .attr('y2', rightFn)
      .attr('stroke', function(d) { return groupsColorScale(d.B24121.total); })
      // .attr('stroke', function(d) { return d.group && groupings[d.group] && groupings[d.group].color; })
      .attr('stroke-width', sizeFn);
  }
  function leftLabel(group, leftSide, leftFn, textFn) {
    return group.append('svg:text')
      .classed('leftlabel', true)
      .classed('label', true)
      .text(textFn)
      .attr('x', leftSide - 5)
      .attr('y', function(d) { return leftFn(d) + 5; });
  }
  function rightLabel(group, rightSide, rightFn, textFn) {
    return group.append('svg:text')
      .classed('rightlabel', true)
      .classed('label', true)
      .text(textFn)
      .attr('x', rightSide + 5)
      .attr('y', function(d) { return rightFn(d) + 5; });
  }
  function centerLabel(group, leftSide, rightSide, leftFn, rightFn, sizeFn, textFn) {
    var crossWidth = rightSide - leftSide;
    return group.append('svg:text')
      .classed('centerlabel', true)
      .classed('label', true)
      .text(textFn)
      .attr('transform', function(d) {
        // this is tricky, we're going to angle them a bit...
        var rise = rightFn(d) - leftFn(d);
        return 'rotate(' + (Math.PI * 18 * Math.atan(rise/crossWidth)) + ', '+(width/2)+', '+
          ((leftFn(d) + rightFn(d)) / 2) +')';
      })
      .attr('x', width/2)
      .attr('y', function(d) {
        return (leftFn(d) + rightFn(d)) / 2 - sizeFn(d) / 2 - 3;
      });
  }
  function hoverLine(group, leftSide, rightSide, leftFn, rightFn) {
    console.log('adding hoverLine...');
    var spacing = 7;
    return group.append('svg:polygon')
      .classed('hoverline', true)
      .attr('points', function(d) {
        return leftSide  + ',' + ( leftFn(d) - spacing) + ',' +
               rightSide + ',' + (rightFn(d) - spacing) + ',' +
               rightSide + ',' + (rightFn(d) + spacing) + ',' +
               leftSide  + ',' + ( leftFn(d) + spacing);
      })
      .on('mouseenter', function(d) {
        this.parentNode.classList.add('active');
        this.parentNode.parentNode.appendChild(this.parentNode); // move this group to the top of the stack
      })
      .on('mouseleave', function(d) {
        this.parentNode.classList.remove('active');
      });
  }

  var leftFn = function(d) { return leftScale(d.B24126.total / d.B24124.total); };
  var rightFn = function(d) {
    // return rightScale(d.B24121.total);
    return altRightScale(d.B24123.total / d.B24122.total);
  };
  var sizeFn = function(d) { return sizeScale(d.B24124.total); };

  var leftTextFn = function(d) { return Math.round(100 * d.B24126.total / d.B24124.total) + "%"; };
  // var rightTextFn = function(d) { return '$' + commaNumber(d.B24121.total); };
  var rightTextFn = function(d) { return Math.round(100 * d.B24123.total / d.B24122.total) + "¢"; };
  var centerTextFn = function(d) { return groupings[d.group].name; };

  mainLine(group, leftSide, rightSide, leftFn, rightFn, sizeFn);
  leftLabel(group, leftSide, leftFn, leftTextFn);
  rightLabel(group, rightSide, rightFn, rightTextFn);
  centerLabel(group, leftSide, rightSide, leftFn, rightFn, sizeFn,
    // function(d) { return d.name; }
    centerTextFn
  );
  hoverLine(group, leftSide, rightSide, leftFn, rightFn, sizeFn);

  firstInteractive.append('svg:text')
    .classed('leftlabel', true)
    .classed('label', true)
    .text('more women')
    .attr('x', leftSide + 40)
    .attr('y', leftScale(1.01));

  firstInteractive.append('svg:text')
    .classed('leftlabel', true)
    .classed('label', true)
    .text('more men')
    .attr('x', leftSide + 40)
    .attr('y', leftScale(0.06));

  firstInteractive.append('svg:text')
    .classed('leftlabel', true)
    .classed('mainlabel', true)
    .text('Percent Female')
    .attr('x', leftSide + 40)
    .attr('y', 15);

  firstInteractive.append('svg:text')
    // .classed('centerlabel', true)
    .classed('label', true)
    .text('women make more')
    .attr('x', rightSide - 40)
    .attr('y', altRightScale(1.25));

  firstInteractive.append('svg:text')
    // .classed('centerlabel', true)
    .classed('label', true)
    .text('men make more')
    .attr('x', rightSide - 40)
    .attr('y', altRightScale(0.75));

  firstInteractive.append('svg:text')
    // .classed('centerlabel', true)
    .classed('mainlabel', true)
    .text('Wage Gap')
    .attr('x', rightSide - 42)
    .attr('y', 15);
  firstInteractive.append('svg:text')
    .classed('label unitlabel', true)
    .text('cents earned by women')
    .attr('x', rightSide - 40)
    .attr('y', 33);
  firstInteractive.append('svg:text')
    .classed('label unitlabel', true)
    .text('per dollar earned by men')
    .attr('x', rightSide - 40)
    .attr('y', 49);

  firstInteractive.append('svg:line')
    .classed('median-line', true)
    .attr('x1', leftSide - 50)
    .attr('x2', rightSide + 50)
    .attr('y1', leftScale(0.5))
    .attr('y2', altRightScale(1))
    .attr('stroke-dasharray', '10 4 2 4');
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
