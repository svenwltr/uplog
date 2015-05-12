
app.controller("ChartsController", function($scope) {

	$scope.$on('recordsUpdate', function(e, records) {
		$scope.records = records.slice();

	});

});


app.directive('myChart', function ($parse) {

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

	function draw(records, el) {
		var chart = d3.select(el);

		var data = {
			uptime: [],
			avg: [],
			trend: [],
		};

		var domains = {
			x: {
				min: records.slice(0,1)[0].since*1000,
				max: records.slice(0,1)[0].since*1000,
			},
			y: {
				min: records.slice(0,1)[0].uptime/3600.,
				max: records.slice(0,1)[0].uptime/3600.,
			},
		};

		records.slice().forEach(function(record, i) {
			var x = record.since*1000
			var y = record.uptime/3600.

			data.uptime.push({x: x, y: y});
			data.trend.push({x: x, y: record.trend/3600.})
			data.avg.push({x: x, y: record.average/3600.})

			domains.x.min = Math.min(domains.x.min, x);
			domains.x.max = Math.max(domains.x.max, x);
			if(i !== records.length-1) {
				domains.y.min = Math.min(domains.y.min, y);
				domains.y.max = Math.max(domains.y.max, y);
			}

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

		plot(data.trend, 'trend');
		plot(data.avg, 'avg');
		plot(data.uptime, 'uptime');

		/*svg.append("text")
			.attr("class", "x label")
			.attr("text-anchor", "middle")
			.attr("x", width/2.)
			.attr("y", height + 35)
			.text("Date")*/

		function plot(data, suffix) {
			svg.append("path")
				.attr("clip-path", "url(#chart-area)")
				.datum(data)
				.attr("class", "line line-"+suffix)
				.attr("d", line);
			svg.selectAll(".point")
				.data(data)
				.enter().append("circle")
				.attr("clip-path", "url(#chart-area)")
				.attr("stroke", "black")
				.attr("fill", function(d, i) { return "black" })
				.attr("cx", function(d, i) { return x(d.x) })
				.attr("cy", function(d, i) { return y(d.y) })
				.attr("r", function(d, i) { return 1 });
		}

	}
});
