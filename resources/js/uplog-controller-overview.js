
app.controller("OverviewController", function($scope, $http, $interval) {

	refresh();

	var promise = $interval(refresh, 1000);
	$scope.$on('$destroy', function(){
		$timeout.cancel(promise);
	});

	function refresh() {
		$http.get('/api/stats').success(function(data) {
			$scope.stats = data;
			$scope.scores = data.scores; // shortcut
		});
	}

});
