
app.controller("OverviewController", function($scope, $http, $interval) {
	$scope.$on('recordsUpdate', function(e, records) {

		var trending = 5;

		/*
		 * Scores
		 */

		var curr = records.active();

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
		$scope.stats.avg = records.averageUptime(0, -1);
		$scope.stats.trend = records.averageUptime(-1-trending, -1);


		/*
		 * Functions
		 */

		function clone(o) {
			return JSON.parse(JSON.stringify(o));
		};

	});

});
