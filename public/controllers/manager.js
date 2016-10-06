var converter = new showdown.Converter();

app.controller('postController', function($http, $scope) {
	$scope.contentHtml = "";
	$scope.submit = function() {
		$scope.success = false;
		$scope.error = false;
		var newPost = {};
		newPost.title = $scope.post.title;
	  newPost.content = $scope.contentHtml;
	  newPost.home = $scope.post.home;
	  newPost.link = $scope.post.link;
		$http.post('/blogPost', newPost).then(function(response) {
			if (response.data == 'Posted!') {
				$scope.success = true;
				window.location = window.location.protocol + "//" + window.location.host
			} else {
				$scope.error = true;
			}
		});
	};

	$scope.refreshPreview = function() {
		$scope.contentHtml = converter.makeHtml($scope.post.content);
	}
});
