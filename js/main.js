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

var dataPromise = oboe('./data/data_5yr.json');

var proportionScale = d3.scale.linear()
  .domain([0,1]);
var incomeScale = d3.scale.linear()
  .domain([0,250000]);
var gapScale = d3.scale.log()
  .base(2)
  .domain([0.5, 2]);
var groupPopulationScale = d3.scale.linear()
  .domain([1,10000000]);

function constructSlopegraphElement(enterGroup) {
  // main line
  enterGroup.append('svg:line')
    .classed('item', true);

  enterGroup.append('svg:circle')
    .classed('leftdot dot', true);

  enterGroup.append('svg:circle')
    .classed('rightdot dot', true);

  enterGroup.append('svg:text')
    .classed('leftlabel label', true);

  enterGroup.append('svg:text')
    .classed('rightlabel label', true);

  enterGroup.append('svg:text')
    .classed('centerlabel mainlinelabel label', true);

  enterGroup.append('svg:polygon')
    .classed('hoverline', true)
    .on('mouseenter', function(d) {
      this.parentNode.classList.add('active');
      this.parentNode.parentNode.appendChild(this.parentNode); // move this group to the top of the stack
    })
    .on('mouseleave', function(d) {
      this.parentNode.classList.remove('active');
    });

  return enterGroup;
}

function updateSlopegraphElement(group, scales) {
  var leftFn = function(d) { return scales.leftScale(scales.leftValue(d)); };
  var rightFn = function(d) { return scales.rightScale(scales.rightValue(d)); };
  var widthFn = function(d) { return scales.widthScale(scales.widthValue(d)); };
  var colorFn = function(d) { return scales.colorScale(scales.colorValue(d)); };

  var crossWidth = scales.rightSide - scales.leftSide;

  group.select('line.item')
    .attr('x1', scales.leftSide)
    .attr('x2', scales.rightSide)
    .attr('y1', leftFn)
    .attr('y2', rightFn)
    .attr('stroke', colorFn)
    .attr('stroke-width', widthFn);

  group.select('circle.leftdot')
    .attr('cx', scales.leftSide)
    .attr('cy', leftFn)
    .attr('r', 4)
    .attr('fill', colorFn);

  group.select('circle.rightdot')
    .attr('cx', scales.rightSide)
    .attr('cy', rightFn)
    .attr('r', 4)
    .attr('fill', colorFn);

  group.select('text.leftlabel')
    .attr('x', scales.leftSide - 7)
    .attr('y', function(d) { return leftFn(d) + 5; })
    .text(function(d) { return scales.leftTextFormat(scales.leftValue(d)); });

  group.select('text.rightlabel')
    .attr('x', scales.rightSide + 7)
    .attr('y', function(d) { return rightFn(d) + 5; })
    .text(function(d) { return scales.rightTextFormat(scales.rightValue(d)); });

  group.select('text.centerlabel')
    .attr('transform', function(d) {
      // this is tricky, we're going to angle them a bit...
      var rise = rightFn(d) - leftFn(d);
      return 'rotate(' + (Math.PI * 18 * Math.atan(rise/crossWidth)) + ', '+(scales.width/2)+', '+
        ((leftFn(d) + rightFn(d)) / 2) +')';
    })
    .attr('x', scales.width / 2)
    .attr('y', function(d) {
      return (leftFn(d) + rightFn(d)) / 2 - widthFn(d) / 2 - 3;
    })
    .text(scales.centerTextFn);


  var spacing = 7;
  group.select('polygon.hoverline')
    .attr('points', function(d) {
      return scales.leftSide  + ',' + ( leftFn(d) - spacing) + ',' +
             scales.rightSide + ',' + (rightFn(d) - spacing) + ',' +
             scales.rightSide + ',' + (rightFn(d) + spacing) + ',' +
             scales.leftSide  + ',' + ( leftFn(d) + spacing);
    });

  return group;
}

var topGraphFsm = new machina.Fsm({
  initialize : function() {
    var self = this;

    this.container = d3.select('#firstInteractive').append('svg');
    var containerElement = document.getElementById('firstInteractive');

    this.width = containerElement.clientWidth;
    this.height = containerElement.clientHeight;

    this.padding = 40;

    dataPromise.done(function(data) {
      self.handle('loaded', data);
    });
  },

  initialState : 'loading',

  updateData : function(data) {
    console.log('has data!!!!!!', data);

    // this one works with groups
    this.selection = this.container.selectAll('g.line-group')
      .data(data.groups);

    var enter = this.selection.enter().append('svg:g')
      .classed('line-group', true);

    constructSlopegraphElement(enter);
  },

  states : {
    'loading' : {
      loaded : function(data) {
        this.updateData(data);
        this.transition('first');
      }
    },
    'first' : {
      _onEnter : function() {
        var self = this;

        console.log('in onEnter');

        this.leftScale = proportionScale.copy()
          .range([this.height - this.padding, this.padding]);
        this.rightScale = gapScale.copy()
          .range([this.height - this.padding, this.padding]);
        this.colorScale = chroma.scale([colors.blue[5], colors.blue[3]])
          .domain([20000,100000], 3)
          .mode('hsv')
          .out('hex');
        this.widthScale = groupPopulationScale.copy()
          .range([1, 6]);

        console.log('scales set');

        updateSlopegraphElement(this.selection, {
          width : self.width,
          leftSide : 200,
          leftScale : self.leftScale,
          rightSide : self.width - 200,
          rightScale : self.rightScale,
          colorScale : self.colorScale,
          widthScale : self.widthScale,
          leftValue : function(d) { return d.B24126.total / d.B24124.total; },
          rightValue : function(d) { return d.B24123.total / d.B24122.total; },
          colorValue : function(d) { return d.B24121.total; },
          widthValue : function(d) { return d.B24124.total; },
          leftTextFormat : function(v) { return Math.round(v * 100) + "%"; },
          rightTextFormat : function(v) { return Math.round(v * 100) + "¢"; },
          centerTextFn : function(d) { return groupings[d.group].name; }
        });
      }
    }
  }
});


// var items = firstInteractive.selectAll('g.line-group');

var groupsColorScale = chroma.scale([colors.blue[5], colors.blue[2]])
    .domain([20000,100000], 4)
    .mode('hsv');

dataPromise.done(function(fullData) {
  window.fullData = fullData;
  console.log('done');

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
