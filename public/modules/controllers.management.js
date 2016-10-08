var app = angular.module('management', ['ngRoute', 'ngSanitize']);
var converter = new showdown.Converter();

app.filter('parseMd', function() {
  return function(md) {
    return converter.makeHtml(md);
  }
});

app.filter('formatGeoPos', function() {
  return function(b) {
    return b.lat.toPrecision(8) + ", " + b.lng.toPrecision(8);
  }
});

app.run(function($rootScope, $window, $http){
	$rootScope.content = 'overview';
  $rootScope.refreshBlogs = function() {
    $http.post('/management/getBlogs').then(function(response) {
  		$rootScope.blogs = response.data;
  	});
  };
  $rootScope.refreshBlogs();
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
  $scope.closePreview = function() {
    $('#preview-modal').modal('hide');
  }
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
  $scope.closePreview = function() {
    $('#preview-modal').modal('hide');
  }
  $scope.closeEdit = function() {
    $('#edit-modal').modal('hide');
  }
	$scope.edit = function(id) {
    $scope.post = JSON.parse(JSON.stringify($rootScope.findBlog(id)));
	};
	$scope.delete = function(id) {
    if (confirm('Delete?')) {
  		$http.delete('/management/blog?id=' + id).then(function(response) {
        if (response.status == 200) {
          alert('Deleted!');
          $rootScope.refreshBlogs();
        } else {
          alert('Error!');
        }
  		});
    }
	};
	$scope.refreshPreview = function() {
		$scope.contentHtml = converter.makeHtml($scope.post.content);
	};
	// edit
	$scope.submit = function() {
		$http.post('/management/edit', $scope.post).then(function(response) {
      if (response.status == 200) {
        $scope.success = true;
        $rootScope.refreshBlogs();
      } else {
        $scope.error = true;
      }
		});
	}
});

app.controller('locationController', function($scope, $http) {
  $scope.locations = [];
  $scope.getLocations = function() {
    $http.get('/location').then(function(response) {
      $scope.locations = response.data;
    });
  };
  $scope.delete = function(id) {
    console.log(id);
    $http.delete('/management/location?id=' + id).then(function(response) {
      if (response.status == 200) {
        $scope.getLocations();
      }
    });
  }
  $scope.getLocations();
});
