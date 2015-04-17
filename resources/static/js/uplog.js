
var app = angular.module('uplogApp', ['ngRoute', 'angularMoment']);


app.run(function(amMoment) {
	amMoment.changeLocale('de');
});

app.constant('angularMomentConfig', {
    preprocess: 'unix'
});

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'html/overview.html',
			controller: 'OverviewController'
		}).
		when('/table', {
			templateUrl: 'html/table.html',
			controller: 'TableController'
		}).
		otherwise({
			redirectTo: '/'
		});
}]);

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

