
app.controller("OverviewController", function($scope, $http, $interval) {
	$scope.$on('recordsUpdate', function(e, records) {

		var trending = 5;

		records = clone(records);

		/*
		 * Scores
		 */

		records.sort(keySort('uptime'));

		var curr;

		records.forEach(function(record, i) {
			if(record.active) {
				curr = i;
			}
		});	

		$scope.scores = {
			best: records[records.length-1],
			next: records[curr+1],
			curr: records[curr],
			prev: records[curr-1],
			worst: records[0],
		};


		/*
		 * Stats
		 */

		records.sort(keySort('since'));
		$scope.stats = {};

		$scope.stats.total = records.reduce(
			function(sum, record) {
				return sum + record.uptime;
			}, 0);

		$scope.stats.avg = Math.round($scope.stats.total / records.length);

		$scope.stats.trend = Math.round(records.slice(trending * -1).reduce(
			function(sum, record) {
				return sum + record.uptime;
			}, 0) / Math.min(trending, records.length));


		/*
		 * Functions
		 */

		function keySort(key) {
			return function(a, b) {
				return a[key] - b[key];
			};
		};

		function clone(o) {
			return JSON.parse(JSON.stringify(o));
		};

	});

});
