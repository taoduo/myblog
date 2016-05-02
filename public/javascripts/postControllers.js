var app = angular.module('mainApp', []);
app.controller('postController', function($http, $scope) {
	$scope.submit = function() {
		console.log($scope.post);
		$scope.success = false;
		$scope.error = false;
		$http.post('/blogPost', $scope.post).then(function(response) {
			if (response.data == 'Posted!') {
				$scope.success = true;
				window.location = window.location.protocol + "//" + window.location.host
			} else {
				$scope.error = true;
			}
		});
	};
});