
app.controller("OverviewController", function($scope, $http, $interval) {
	$scope.$on('recordsUpdate', function(e, records) {

		var currID;

		records.forEach(function(record, i) {
			if(record.active) {
				currID = i;
			}
		});	

		$scope.scores = {
			best: records[records.length-1],
			next: records[currID+1],
			curr: records[currID],
			prev: records[currID-1],
			worst: records[0],
		};

	});

});
