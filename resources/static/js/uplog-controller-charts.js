
app.controller("ChartsController", function($scope) {

	$scope.$on('recordsUpdate', function(e, records) {
		$scope.records = records.slice();

	});

});


app.directive('myChart', function ($parse) {

	var margin = {top: 20, right: 20, bottom: 30, left: 50},
		width = 960 - margin.left - margin.right,
	   	height = 500 - margin.top - margin.bottom;

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

	function draw(data, el) {
		var chart = d3.select(el);

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
    		.x(function(d) { return x(d.since*1000); })
		    .y(function(d) { return y(d.uptime/3600.); });

		x.domain(d3.extent(data, function(d) { return d.since*1000; }));
		y.domain([0, d3.max(data, function(d) { return d.uptime/3600.; })]);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)

		svg.append("path")
			.datum(data)
			.attr("class", "line")
			.attr("d", line);

		/*svg.append("text")
			.attr("class", "x label")
			.attr("text-anchor", "middle")
			.attr("x", width/2.)
			.attr("y", height + 35)
			.text("Date")*/

	}
});
