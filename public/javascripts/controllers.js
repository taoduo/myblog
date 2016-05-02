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

app.controller('contactController', function($scope, $rootScope, $http) {
    $scope.initMap = function() {
        var map;
        var pos = {
            lat: 44.4613092,
            lng: -93.15613380000002
        };
        $http.get('/location').then(function success(response) {
            $rootScope.locations = response.data;
            pos = {};
            pos.lat = $rootScope.locations[0].lat;
            pos.lng = $rootScope.locations[0].lng;
            if ($rootScope.currentUser == null) {
                // stranger
                map = new google.maps.Map(document.getElementById('map'), {
                    center: pos,
                    zoom: 9
                });
                var infoWindow = new google.maps.InfoWindow({map: map});
                infoWindow.setPosition(pos);
                infoWindow.setContent('<b>Hi, visitor! I am here!</b>');
            } else {
                // register user
                map = new google.maps.Map(document.getElementById('map'), {
                    center: pos,
                    zoom: 9
                });
                var infoWindow = new google.maps.InfoWindow({map: map});
                infoWindow.setPosition(pos);
                infoWindow.setContent('<b>Hi, ' + $rootScope.currentUser.username + '! I am HERE!</b>');
            }
        }, function error() {
            if ($rootScope.currentUser == null) {
                // stranger
                map = new google.maps.Map(document.getElementById('map'), {
                    center: pos,
                    zoom: 9
                });
                var infoWindow = new google.maps.InfoWindow({map: map});
                infoWindow.setPosition(pos);
                infoWindow.setContent('<b>Hi, visitor! I am here!</b>');
            } else {
                // register user
                map = new google.maps.Map(document.getElementById('map'), {
                    center: pos,
                    zoom: 9
                });
                var infoWindow = new google.maps.InfoWindow({map: map});
                infoWindow.setPosition(pos);
                infoWindow.setContent('<b>Hi, ' + $rootScope.currentUser.username + '! I am HERE!</b>');
            }
        });
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
            if (response.data.username) {
                $rootScope.currentUser = response.data;
                reset();
                $('#logIn').modal('hide');
                if ($rootScope.currentUser.email == 'taod@carleton.edu' &&
                            $rootScope.currentUser.role == 'administrator') {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function(position) {
                            var pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            $http.post('/location', pos).then(function success(response) {
                                if (response.data == 'success') {
                                    console.log('New position ' + pos + ' added');
                                } else {
                                    console.log(response.data);
                                }
                            });
                        });
                    }
                }
                window.location = window.location.protocol + "//" + window.location.host
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