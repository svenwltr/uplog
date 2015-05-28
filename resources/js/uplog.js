
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
	return function(seconds) {
		var result = '';
		if(seconds < 0) {
			result = '-';
			seconds = seconds * -1;
		}

		var minutes = Math.floor(seconds / 60);
		var seconds = seconds % 60;

		var hours   = Math.floor(minutes / 60);
		var minutes = minutes % 60;

		var days  = Math.floor(hours / 24);
		var hours = hours % 24;

		if(days > 0)
			result = result + days + 'd'

		if(hours > 0 | days > 0)
			result = result + hours + 'h'

		if(hours > 0 | days > 0 | minutes > 0)
			result = result + minutes + 'm'

		if(hours > 0 | days > 0 | minutes > 0 | seconds > 0)
			result = result + seconds + 's'

		return result;

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

