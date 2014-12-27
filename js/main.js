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

function Axis(options) {
  _.extend(this, options);
}
// direct here just funnels the values into the range instead of trying to be clever
Axis.prototype.generate = function(height, padding, direct) {
  return {
    name : this.name,
    scale : this.scale.copy()
      .range(direct ? [height, padding] : [height - padding, padding]),
    colorScale : this.colorScale,
    value : this.value,
    offset : this.offset,
    format : this.format,
    labels : this.labels,
    median : this.median
  };
};

// define the axes
var axisTopPosition = 30;
var proportionAxis = new Axis({
  name : 'proportion',
  scale : d3.scale.linear().domain([0,1]),
  colorScale : chroma.scale([colors.green[5], colors.green[3]]).domain([0, 1])
    .mode('hsv').out('hex'),
  value : function(d) { return d.B24126.total / d.B24124.total; },
  offset : 40,
  format : function(v) { return Math.round(v * 100) + "%"; },
  labels : [
    { text : 'Percent Female', heading : true, position : axisTopPosition },
    { text : 'more women', position: 0.91 },
    { text : 'more men', position : -0.02 },
    { text : 'equal', position : 0.51, classed : { speciallabel : true } }
  ],
  median : 0.5
});
var incomeAxis = new Axis({
  name : 'income',
  scale : d3.scale.linear().domain([0,250000]),
  colorScale : chroma.scale([colors.blue[5], colors.blue[3]]).domain([20000,100000])
    .mode('hsv').out('hex'),
  value : function(d) { return d.B24121.total; },
  offset : 70,
  format: function(v) { return "$" + commaNumber(v); },
  labels : [
    { text : 'Median Income', heading : true, position : axisTopPosition },
    { text : 'higher income', position: 100000 },
    { text : 'lower income', position : 0 }
  ]
});
var gapAxis = new Axis({
  name : 'wagegap',
  scale : d3.scale.log().base(2).domain([0.5, 2]),
  colorScale : chroma.scale([colors.yellow[4], colors.yellow[2]]).domain([0.5, 2])
    .mode('hsv').out('hex'),
  value : function(d) { return d.B24123.total / d.B24122.total; },
  offset : 40,
  format : function(v) { return Math.round(v * 100) + "¢"; },
  labels : [
    { text : 'Wage Gap', heading : true, position : axisTopPosition },
    { text : 'women make more', position : 1.1 },
    { text : 'men make more', position: 0.48 },
    { text : 'cents earned by women', subheading : true, position : axisTopPosition + 18, classed : { speciallabel : false } },
    { text : 'per dollar earned by men', subheading : true, position: axisTopPosition + 18 + 16, classed : { speciallabel : false } },
    { text : 'equal', position : 1.01, classed : { speciallabel : true } }
  ],
  median : 1
});
var groupPopulationAxis = new Axis({
  name : 'population',
  scale : d3.scale.linear().domain([1, 10000000]),
  value : function(d) { return d.B24124.total; },
  offset : 90, // a guess, probably won't actually be used
  format : function(v) { return commaNumber(v); },
  labels : []  // also probably won't be used
});


var SlopeGraphFsm = machina.Fsm.extend({
  constructSlopegraphElement : function(enterGroup, graphState) {
    var self = this;

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
        graphState.active = d.name;
        self.handle('render');
        // this.parentNode.classList.add('active');
        // this.parentNode.parentNode.appendChild(this.parentNode); // move this group to the top of the stack
      })
      .on('mouseleave', function(d) {
        graphState.active = null;
        self.handle('render');
        // this.parentNode.classList.remove('active');
      });

    return enterGroup;
  },

  updateSlopegraphElement : function(group, graphState) {
    var leftFn = function(d) { return graphState.left.scale(graphState.left.value(d)); };
    var rightFn = function(d) { return graphState.right.scale(graphState.right.value(d)); };
    var widthFn = function(d) { return graphState.width.scale(graphState.width.value(d)); };
    var colorFn = function(d) { return graphState.color.colorScale(graphState.color.value(d)); };

    var leftSide = graphState.left.offset;
    var rightSide = graphState.chartWidth - graphState.right.offset;

    var crossWidth = rightSide - leftSide;
    var center = crossWidth / 2 + leftSide;

    group.classed('highlight', function(d) {
      if(!graphState.highlighted) { return false; }

      if(!graphState.highlighted.length) {
        // make it into an array
        graphState.highlighted = [graphState.highlighted];
      }

      if(graphState.highlighted.indexOf(d.name) > -1) {
        // move this to the front as well as adding the class
        this.parentNode.appendChild(this);
        return true;
      }
      return false;
    });
    group.classed('active', function(d) {
      if(!graphState.active) { return false; }

      // note: while highlighted is forced to an array, active is always
      // a string. there can only ever be one active item, though there
      // may be multiple items highlighted
      if(graphState.active === d.name) {
        this.parentNode.appendChild(this);
        return true;
      }
      return false;
    });

    group.select('line.item')
      .transition().duration(250)
      .attr('x1', leftSide)
      .attr('x2', rightSide)
      .attr('y1', leftFn)
      .attr('y2', rightFn)
      .attr('stroke', colorFn)
      .attr('stroke-width', widthFn);

    group.select('circle.leftdot')
      .transition().duration(250)
      .attr('cx', leftSide)
      .attr('cy', leftFn)
      .attr('r', 4)
      .attr('fill', colorFn);

    group.select('circle.rightdot')
      .transition().duration(250)
      .attr('cx', rightSide)
      .attr('cy', rightFn)
      .attr('r', 4)
      .attr('fill', colorFn);

    group.select('text.leftlabel')
      .text(function(d) { return graphState.left.format(graphState.left.value(d)); })
      .attr('x', leftSide - 7)
      .attr('y', function(d) { return leftFn(d) + 5; });

    group.select('text.rightlabel')
      .text(function(d) { return graphState.right.format(graphState.right.value(d)); })
      .attr('x', rightSide + 7)
      .attr('y', function(d) { return rightFn(d) + 5; });

    group.select('text.centerlabel')
      .text(graphState.centerTextFn)
      .attr('transform', function(d) {
        // this is tricky, we're going to angle them a bit...
        var rise = rightFn(d) - leftFn(d);
        return 'rotate(' + (Math.PI * 18 * Math.atan(rise/crossWidth)) + ', '+(center)+', '+
          ((leftFn(d) + rightFn(d)) / 2 - widthFn(d) / 2 - 3) +')';
      })
      .attr('x', center)
      .attr('y', function(d) {
        return (leftFn(d) + rightFn(d)) / 2 - widthFn(d) / 2 - 3;
      });


    var spacing = 7;
    group.select('polygon.hoverline')
      .attr('points', function(d) {
        return leftSide  + ',' + ( leftFn(d) - spacing) + ',' +
               rightSide + ',' + (rightFn(d) - spacing) + ',' +
               rightSide + ',' + (rightFn(d) + spacing) + ',' +
               leftSide  + ',' + ( leftFn(d) + spacing);
      });

    return group;
  },

  generateSlopegraphLegend : function(container, graphState) {
    var leftSide = graphState.left.offset;
    var rightSide = graphState.chartWidth - graphState.right.offset;

    var left = container.selectAll('text.leftaxislabel')
      .data(graphState.left.labels);
    left.enter().append('svg:text')
      .classed('leftaxislabel label', true)
      .attr('x', leftSide - 40);
    left.exit().remove();
    left.text(function(d) { return d.text; })
      .classed('mainlabel', function(d) { return d.heading || d.subheading; })
      .classed('label', function(d) { return !d.heading; })
      .each(function(d) { d3.select(this).classed(d.classed); })
      .transition().duration(250)
      .attr('x', leftSide - 40)
      .attr('y', function(d) { return d.heading || d.subheading ? d.position || 15 : graphState.left.scale(d.position); });


    var right = container.selectAll('text.rightaxislabel')
      .data(graphState.right.labels);
    right.enter().append('svg:text')
      .classed('rightaxislabel label', true)
      .attr('x', rightSide + 40);
    right.exit().remove();
    right.text(function(d) { return d.text; })
      .classed('mainlabel', function(d) { return d.heading || d.subheading; })
      .classed('label', function(d) { return !d.heading; })
      .each(function(d) { d3.select(this).classed(d.classed); })
      .transition().duration(250)
      .attr('x', rightSide + 40)
      .attr('y', function(d) { return d.heading || d.subheading ? d.position || 15 : graphState.right.scale(d.position); });

    var medianLine = [{
      left : graphState.left.median,
      right : graphState.right.median
    }];

    var median = container.selectAll('line.median-line')
      .data(medianLine);
    median.enter().append('svg:line')
      .classed('median-line', true);
    median.exit().remove();
    median.attr('x1', function(d) { return d.left === undefined ? rightSide - 20 : leftSide - 40; })
      .attr('x2', function(d) { return d.right === undefined ? leftSide + 20 : rightSide + 40; })
      .attr('y1', function(d) { return d.left === undefined ? graphState.right.scale(d.right) : graphState.left.scale(d.left); })
      .attr('y2', function(d) { return d.right === undefined ? graphState.left.scale(d.left) : graphState.right.scale(d.right); });
  }
});

var topGraphFsm = new SlopeGraphFsm({
  initialize : function() {
    var self = this;

    this.svg = d3.select('#firstInteractive').append('svg');
    this.container = this.svg.append('svg:g');
    this.svgElement = this.svg.node();

    this.width = this.svgElement.clientWidth;
    this.height = this.svgElement.clientHeight;

    this.padding = 20;
    this.graphState = {};

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

    this.constructSlopegraphElement(enter, this.graphState);
  },

  states : {
    'loading' : {
      loaded : function(data) {
        this.updateData(data);
        this.transition('base-chart');
      }
    },
    'base-chart' : {
      _onEnter : function() {
        var self = this;

        _.extend(this.graphState, {
          chartWidth : self.width,
          left : proportionAxis.generate(this.height, this.padding),
          right : gapAxis.generate(this.height, this.padding),
          width : groupPopulationAxis.generate(1, 6, true),
          color : incomeAxis.generate(this.height, this.padding),
          centerTextFn : function(d) { return groupings[d.group].name; }
        });
        this.handle('render');

        window.addEventListener('resize', _.throttle(function() {
          console.log('resize listener fired');
          self.handle('render');
        }, 250));
      },
      swapAxes : function(axis1Position, axis2Position) {
        var axis1 = this.graphState[axis1Position];
        var axis2 = this.graphState[axis2Position];

        this.graphState[axis1Position] = axis2;
        this.graphState[axis2Position] = axis1;

        this.handle('render');
      },
      swapToAxisPair : function(axis1Name, axis2Name) {
        // the trick here is we don't want to assume we know which
        // side to put each axis on...

        // we do, however, assume we only are rotating among the three axes: left, right, and color
        var movingAxis;

        var axis1Position = _.findKey(this.graphState, { name : axis1Name });
        var axis2Position = _.findKey(this.graphState, { name : axis2Name });

        // if both axes are displayed, stop
        if(axis1Position !== 'color' && axis2Position !== 'color') { return; }

        if(axis1Position === 'color') { movingAxis = axis2Position === 'right' ? 'left' : 'right'; }
        if(axis2Position === 'color') { movingAxis = axis1Position === 'right' ? 'left' : 'right'; }

        this.handle('swapAxes', 'color', movingAxis);
      },
      render : function() {
        this.width = this.svgElement.clientWidth;
        this.height = this.svgElement.clientHeight;

        this.graphState.chartWidth = this.width;

        this.updateSlopegraphElement(this.selection, this.graphState);
        this.generateSlopegraphLegend(this.svg, this.graphState);
      },
      highlight : function(name) {
        this.graphState.highlighted = name;

        this.handle('render');
      }
    }
  }
});
