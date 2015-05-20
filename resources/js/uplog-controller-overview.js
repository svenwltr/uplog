
app.controller("OverviewController", function($scope, $http, $interval) {
	$scope.$on('recordsUpdate', function(e, records) {

		var trending = 5;

		/*
		 * Scores
		 */

		var curr = records.active();
		var yest = records.slice(-2,-1)[0];

		$scope.scores = {
			best: records.best(),
			next: records.better(curr),
			curr: curr,
			prev: records.worse(curr),
			worst: records.worst(),
		};


		/*
		 * Stats
		 */

		$scope.stats = {};
		$scope.stats.total = records.totalUptime();
		$scope.stats.avg = Math.round(yest.average);
		$scope.stats.trend = Math.round(yest.trend);


		/*
		 * Functions
		 */

		function clone(o) {
			return JSON.parse(JSON.stringify(o));
		};

	});

});
