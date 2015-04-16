
var app = angular.module('uplogApp', ['ngRoute', 'angularMoment']);


app.run(function(amMoment) {
	amMoment.changeLocale('de');
});

app.constant('angularMomentConfig', {
    preprocess: 'unix'
});

app.filter('duration', function() {
	return function(sec_num) {
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		var time    = hours+':'+minutes+':'+seconds;
		return time;

	};
})

app.controller("MainController", function() {
});

app.controller("TableController", function($scope, $http, $interval) {

	$scope.table = {
		sort : 'since',
		reverse: true,
		setSort: function(key) {
			if($scope.table.sort === key) {
				$scope.table.reverse = !$scope.table.reverse;
			} else {
				$scope.table.sort = key;
			}
		},
	}

	refresh();
	$interval(refresh, 1000);

	function refresh() {
	$http.get('/api/records')
		.success(function(data) {
			$scope.records = [];
			data.forEach(function(record) {
				$scope.records.push(new Record(record));
			});
		});

	}

});

function Record(record) {
	this.since = record.since;
	this.uptime = record.uptime;
	this.kernel = record.kernel;
	this.active = record.active;

}

Record.prototype.begin = function() {
	return this.since

}

Record.prototype.end = function() {
	return this.since + this.uptime;

}

Record.prototype.beginSOD = function() {
	return secondOfDay(this.begin());
}

Record.prototype.endSOD = function() {
	return secondOfDay(this.end());
}

function secondOfDay(time) {
	return time % (24*3600);

}
