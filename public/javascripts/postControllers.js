var app = angular.module('mainApp', []);
app.controller('postController', function($http, $scope) {
	$scope.submit = function() {
		console.log($scope.post);
		$http.post('/blogPost', $scope.post).then(function(response) {
			console.log(response);
		});
	};
});