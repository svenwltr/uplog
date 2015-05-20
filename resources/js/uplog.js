
var app = angular.module('uplogApp', ['ngRoute', 'angularMoment']);


app.run(function(amMoment) {
	amMoment.changeLocale('de');
});

app.constant('angularMomentConfig', {
    preprocess: 'unix'
});

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.
		when('/home', {
			templateUrl: 'html/overview.html',
			controller: 'OverviewController'
		}).
		when('/table', {
			templateUrl: 'html/table.html',
			controller: 'TableController'
		}).
		when('/charts', {
			templateUrl: 'html/charts.html',
			controller: 'ChartsController'
		}).
		otherwise({
			redirectTo: '/home'
		});
}]);

app.filter('duration', function() {
	return function(sec_num) {
		var prefix = '';
		if(sec_num < 0) {
			prefix = '-';
			sec_num = sec_num * -1;
		}
		var hours   = Math.floor(sec_num / 3600);
		var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
		var seconds = sec_num - (hours * 3600) - (minutes * 60);

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		var time    = prefix+hours+':'+minutes+':'+seconds;
		return time;

	};
})

/*
 * Automaticly refreshes records and broadcasts them.
 */
app.run(function($rootScope, $http, $interval) {
	var cache = null;

	$rootScope.$on('$viewContentLoaded', function() {
		if(cache) {
			$rootScope.$broadcast('recordsUpdate', cache);
		}
	});

	refresh();
	$interval(refresh, 1000);

	function refresh() {
		$http.get('/api/records').success(function(data) {
			var records = new Records(data);
			records.inheritHashes(cache);

			cache = records;
			$rootScope.$broadcast('recordsUpdate', records);
			
		});
	}

});

app.directive('myActiveState', function($location) {
	return {
		restrict: 'AC',
		link: function(scope, element, attr) {
			var a = element.find('a');

			/* refresh, when location changed */
			scope.$on('$locationChangeSuccess', refresh);

			/* refresh, when href changed (ie by using ng-href) */
			scope.$watch( /* may impact performance */
				function(){ return a.attr('href') },
				function(){ refresh(); }
			);

			/* refresh on load */
			refresh();

			function refresh() {
				var href = a.attr('href');
				var curr = '#' + $location.path();
				if(curr.indexOf(href) == 0)
					attr.$addClass('active');
				else
					attr.$removeClass('active');
			}
		},
	}
});

app.controller("MainController", function() {
});

