var app = angular.module('management', ['ngRoute', 'ngSanitize']);
var converter = new showdown.Converter();

app.filter('parseMd', function() {
  return function(md) {
    return converter.makeHtml(md);
  }
});

app.run(function($rootScope, $window, $http){
	$rootScope.content = 'overview';
	$http.post('/management/getBlogs').then(function(response) {
		$rootScope.blogs = response.data;
	});
	$rootScope.logout = function() {
			$http.post('/logout').then(function success(response) {
					$rootScope.currentUser = null;
					$window.location.reload();
			});
	}
	$rootScope.findBlog = function(id) {
		for (b in $rootScope.blogs) {
			if ($rootScope.blogs[b]._id == id) {
				return $rootScope.blogs[b];
			}
		}
	}
});

app.controller('menuController', function($scope, $rootScope) {
  $scope.switchContent = function(content) {
      $rootScope.content = content;
  }
});

app.controller('postController', function($http, $scope) {
	$scope.contentHtml = "";
	$scope.submit = function() {
		$scope.success = false;
		$scope.error = false;
		var newPost = {};
		newPost.title = $scope.post.title;
	  newPost.content = $scope.post.content;
	  newPost.home = $scope.post.home;
	  newPost.link = $scope.post.link;
		$http.post('/management/post', newPost).then(function(response) {
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

app.controller('overviewController', function($scope, $rootScope, $http) {
	$scope.edit = function(id) {
		$scope.post = $rootScope.findBlog(id);
	};
	$scope.delete = function(id) {
		console.log(id);
	};
	$scope.refreshPreview = function() {
		$scope.contentHtml = converter.makeHtml($scope.post.content);
	};
	$scope.preview_modal_close = function() {
		$('#preview-modal').modal('hide');
	};
	$scope.edit_modal_close = function() {
		$('#edit-modal').modal('hide');
	};
	$scope.submit = function() {
		$http.post('/management/edit', $scope.post).then(function(response) {
			console.log(response);
		})
	}
});

app.controller('locationController', function($http) {

});
