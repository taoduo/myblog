var app = angular.module('management', ['ngRoute', 'ngSanitize']);
var converter = new showdown.Converter();

app.filter('parseMd', function() {
  return function(md) {
    return converter.makeHtml(md);
  }
});

app.filter('trustUrl', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
});

app.filter('formatGeoPos', function() {
  return function(b) {
    return b.lat.toPrecision(8) + ", " + b.lng.toPrecision(8);
  }
});

// Credits for: http://stackoverflow.com/questions/17063000/ng-model-for-input-type-file
// Used specifically for the upload of blog pictures, need change to generalize
app.directive("fileread", ['$http', function ($http) {
    return {
        scope: {
          fileread: "=",
          uploads: '='
        },
        link: function (scope, element, attributes) {
          element.bind("change", function (changeEvent) {
            var files = changeEvent.target.files;
            var reader = new FileReader();
            var count = 0;
            reader.onload = function (loadEvent) {
              scope.$apply(function () {
                var fn = files[count].name;
                scope.fileread = reader.result;
                // upload picture
                $http.post('/management/upload', {'pics' : {
                  data : reader.result,
                  filename : fn
                }})
                .then(function(response) {
                  if (response.status == 200) {
                    // upload success callback
                    scope.uploads.push({
                      originalName : response.data.filename,
                      newName : response.data.path
                    });
                  }
                });
              });
              count++;
              // read the next one
              if (count < files.length) {
                reader.readAsDataURL(files[count]);
              }
            };
            // read the first file
            reader.readAsDataURL(files[count]);
          });
        }
    }
}]);

app.run(function($rootScope, $window, $http){
  $(":file").filestyle({
    input: false,
    buttonText: 'Upload Pictures',
    iconName: "glyphicon glyphicon-picture"
  });

	$rootScope.content = 'overview';
  $rootScope.currentDate = new Date();
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
    newPost.pics = $scope.uploads.map(function(pic) {
      return pic['newName'] // no 'public'
    });
    console.log($scope.uploads[0]);
		$http.post('/management/post', newPost).then(function(response) {
			if (response.status == 200) {
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
