var app = angular.module('mainApp', []);
app.run(function($rootScope, $http) {
    $rootScope.content = 'home';
    $rootScope.classyear = 'Sophomore';
    $rootScope.logout = function() {
        $http.post('/logout').then(function success(response) {
            $rootScope.currentUser = null;
        });
    }
    $http.post('/getHomeBlog').then(function success(response) {
        $rootScope.homepost = response.data;
    });
    $http.post('/getBlog').then(function sucess(response) {
        $rootScope.blogs = response.data;
    });
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

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map = new google.maps.Map(document.getElementById('map'), {
                    center: pos,
                    zoom: 4
                });
                var infoWindow = new google.maps.InfoWindow({map: map});
                infoWindow.setPosition(pos);
                infoWindow.setContent('<b>I am HERE!</b>');
            }, function() {
                map = new google.maps.Map(document.getElementById('map'), {
                    center: pos,
                    zoom: 4
                });
                var infoWindow = new google.maps.InfoWindow({map: map});
                infoWindow.setPosition(pos);
                infoWindow.setContent('<b>I was HERE!</b>');
            })
        }
    }
});

app.controller('signupController', function($scope, $http, $rootScope) {
    function reset() {
        $scope.signup = null;
    }

    $scope.submit = function() {
        $http.post('/signup', $scope.signup).then(function success(response) {
            console.log(response);
            if (response.data.username) {
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
            if (response.data.username) {
                $rootScope.currentUser = response.data;
                reset();
                $('#logIn').modal('hide');
            } else {
                $scope.loginMsg = response.data.message;
            }
        }, function error(err) {
            console.log(err);
        });
    };
});

app.controller('userDashboardController', function() {
});