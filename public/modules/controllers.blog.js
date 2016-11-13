var app = angular.module('blog', ['ngSanitize']);
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

app.run(function($rootScope, $http, $location) {
    $rootScope.classyear = 'Junior';
    $rootScope.logout = function() {
        $http.post('/logout').then(function success(response) {
            $rootScope.currentUser = null;
        });
    }
    $http.post($location.path()).then(function success(response) {
      $rootScope.blog = response.data;
    });
});

app.controller('signupController', function($scope, $http, $rootScope) {
    function reset() {
        $scope.signup = null;
    }

    $scope.submit = function() {
        $http.post('/signup', $scope.signup).then(function success(response) {
            console.log(response);
            if (response.data.username) {
                console.log('signup user returned:' + response.data.username);
                $rootScope.currentUser = response.data;
                reset();
                $('#signUp').modal('hide');
            } else {
                $scope.signupMsg = response.data.message;
            }
        }, function error(err) {
            console.log(err);
        });
    };
});

app.controller('loginController', function($scope, $http, $rootScope) {
    function reset() {
        $scope.login = null;
        $scope.loginForm.$setPristine();
    }

    $scope.submit = function() {
        $http.post('/login', $scope.login).then(function success(response) {
            console.log('login response!');
            if (response.data.username) {
                console.log('login success!');
                $rootScope.currentUser = response.data;
                reset();
                $('#logIn').modal('hide');
                if ($rootScope.currentUser.email == 'taod@carleton.edu' &&
                            $rootScope.currentUser.role == 'administrator') {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function postPosition(position) {
                            var pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                                comment: "Administrator Login"
                            };
                            $http.post('/location', pos).then(function successCallback(response) {
                                if (response.data != 'success') {
                                    console.log(response.data);
                                }
                                window.location = window.location.protocol + "//" + window.location.host
                            }, function errorCallback(response) {
                                console.log("err!");
                                console.log(response);
                                window.location = window.location.protocol + "//" + window.location.host
                            });
                        });
                    } else {
                        window.location = window.location.protocol + "//" + window.location.host
                    }
                }
            } else {
                $scope.loginMsg = response.data.message;
            }
        }, function error(err) {
            console.log(err);
        });
    };
});
