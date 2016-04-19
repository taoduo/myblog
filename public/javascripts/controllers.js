var app = angular.module('mainApp', []);
app.run(function($rootScope) {
	$rootScope.content = 'home';
	$rootScope.classyear = 'Sophomore';
});

app.controller('menuController', function($scope, $rootScope) {
    $scope.switchContent = function(content) {
    	$rootScope.content = content;
    }
});

app.controller('aboutController', function($scope) {
	$scope.real = false;
    $scope.toggleImg = function() {
    	$scope.real = !$scope.real;
    }
});
app.controller('contactController', function($scope) {
	$scope.initMap = function() {
		var map;
		var pos = {
			lat: 44.4613092,
			lng: -93.15613380000002
		};
		map = new google.maps.Map(document.getElementById('map'), {
			center: pos,
			zoom: 4
		});
		var infoWindow = new google.maps.InfoWindow({map: map});
		infoWindow.setPosition(pos);
		infoWindow.setContent('<b>I am HERE!</b>');
	}
});