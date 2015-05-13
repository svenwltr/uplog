
app.controller("ChartsController", function($scope) {

	$scope.$on('recordsUpdate', function(e, records) {
		$scope.records = records.slice();

		$scope.timechart = [
			{
				key: 'trend',
				color: '#8ae234',
			},
			{
				key: 'average',
				color: '#729fcf',
			},
			{
				key: 'uptime',
				color: 'black',
			},
		];

		$scope.timechart.forEach(function(line) {
			line.data = records.slice().map(function(record) {
				return {
					x: record.since*1000,
					y: record[line.key]/3600.,
				};
			});

		});

	});

});


app.directive('myTimeChart', function ($parse) {

	var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 960 - margin.left - margin.right,
	   	height = 400 - margin.top - margin.bottom;

     return {
		restrict: 'E', // only as element
		replace: false, // don't overwrite directive
		scope: {data: '=chartData'},
		link: function (scope, element, attrs) {
			var data = scope.data;

			if(data) {
				draw(data, element[0]);
			}

			scope.$watch("data",function(newData) {
				element.empty();
				data = newData;
				draw(data, element[0]);

			});

		} 
	};

	function draw(sets, el) {
		var chart = d3.select(el);

		var some = sets[0].data[0];

		var domains = {
			x: {
				min: some.x,
				max: some.x,
			},
			y: {
				min: some.y,
				max: some.y,
			},
		};

		sets.forEach(function(set) {
			set.data.forEach(function(point, i) {
				domains.x.min = Math.min(domains.x.min, point.x);
				domains.x.max = Math.max(domains.x.max, point.x);
				if(i < set.data.length-1) {
					domains.y.min = Math.min(domains.y.min, point.y);
					domains.y.max = Math.max(domains.y.max, point.y);
				}
			});
		});

		var svg = chart.append("div").attr("class", "chart").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g") .attr("transform", "translate(" + margin.left + ","
					+ margin.top + ")");

		var x = d3.time.scale().range([0, width]);
		var y = d3.scale.linear().range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		var line = d3.svg.line()
			.interpolate('monotone')
    		.x(function(d) { return x(d.x); })
		    .y(function(d) { return y(d.y); });

		x.domain([domains.x.min, domains.x.max+12*60*60*1000])
		y.domain([domains.y.min-0.2, domains.y.max+0.2])

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)

		svg.append("clipPath")
			.attr("id", "chart-area")
			.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", width)
			.attr("height", height);

		sets.forEach(function(set) {
			svg.append("path")
				.attr("clip-path", "url(#chart-area)")
				.datum(set.data)
				.attr("class", "line")
				.attr('style', 'stroke: '+set.color)
				.attr("d", line);
			svg.selectAll(".point")
				.data(set.data)
				.enter().append("circle")
				.attr("class", "point-"+set.key)
				.attr("clip-path", "url(#chart-area)")
				.attr("stroke", set.color)
				.attr("fill", function(d, i) { return set.color })
				.attr("cx", function(d, i) { return x(d.x) })
				.attr("cy", function(d, i) { return y(d.y) })
				.attr("r", function(d, i) { return 1 });
		});

		/*svg.append("text")
			.attr("class", "x label")
			.attr("text-anchor", "middle")
			.attr("x", width/2.)
			.attr("y", height + 35)
			.text("Date")*/

	}
});
