
app.controller("TableController", function($scope, $http, $interval) {

	$scope.table = {
		sort : 'position',
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

	refresh();
	$interval(refresh, 1000);

	function refresh() {
	$http.get('/api/records')
		.success(function(data) {
			data.sort(function(a,b) {
				return a.uptime - b.uptime;
			});
			$scope.records = [];
			data.forEach(function(record, i) {
				record.position = data.length - i;
				$scope.records.push(new Record(record));
			});
		});

	}

});
