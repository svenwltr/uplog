
app.controller("TableController", function($scope, $http, $interval) {

	$scope.table = {
		sort : 'rank',
		reverse: false,
		setSort: function(key) {
			if($scope.table.sort === key) {
				$scope.table.reverse = !$scope.table.reverse;
			} else {
				$scope.table.reverse = false;
				$scope.table.sort = key;
			}
		},
	}

	$scope.$on('recordsUpdate', function(e, records) {
		$scope.records = records;
	});

});
