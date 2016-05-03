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

app.controller('contactController', function($scope, $rootScope, $http, $filter) {
    var map;
    var infoWindow;
    $scope.initMap = function() {
        var pos = {
            lat: 44.4613092,
            lng: -93.15613380000002
        };
        $http.get('/location').then(function success(response) {
            $rootScope.locations = response.data;
            pos = {};
            pos.lat = $rootScope.locations[0].lat;
            pos.lng = $rootScope.locations[0].lng;
            map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 9
            });
            infoWindow = new google.maps.InfoWindow({map: map});
            infoWindow.setPosition(pos);
            if ($rootScope.currentUser == null) {
                // stranger
                infoWindow.setContent('<b>Hi, visitor! I am here!</b>');
            } else {
                // register user
                infoWindow.setContent('<b>Hi, ' + $rootScope.currentUser.username + '! I am HERE!</b>');
            }
            var flightPlanCoordinates = $rootScope.locations;
            var flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            flightPath.setMap(map);
        }, function error() {
            map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 9
            });
            var infoWindow = new google.maps.InfoWindow({map: map});
            infoWindow.setPosition(pos);
            if ($rootScope.currentUser == null) {
                // stranger
                infoWindow.setContent('<b>Hi, visitor! I am here!</b>');
            } else {
                // register user
                infoWindow.setContent('<b>Hi, ' + $rootScope.currentUser.username + '! I am HERE!</b>');
            }
        });
    }

    $scope.checkLocation = function(latitude, longitude, time) {
        console.log(latitude, longitude);
        map.setCenter({
            lat: latitude,
            lng: longitude
        });
        infoWindow.close();
        infoWindow = new google.maps.InfoWindow({map: map});
        infoWindow.setPosition({
            lat: latitude,
            lng: longitude
        });
        infoWindow.setContent('<b>I was here at ' + $filter('date')(time, 'medium') + ' </b>');
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
        console.log('click!');
        $http.post('/login', $scope.login).then(function success(response) {
            console.log('login response!');
            if (response.data.username) {
                console.log('login success!');
                $rootScope.currentUser = response.data;
                reset();
                $('#logIn').modal('hide');
                if ($rootScope.currentUser.email == 'taod@carleton.edu' &&
                            $rootScope.currentUser.role == 'administrator') {
                    console.log('Administrator login!');
                    if (navigator.geolocation) {
                        console.log('Geo allowed!');
                        navigator.geolocation.getCurrentPosition(function(position) {
                            console.log('Geo Callback!');
                            var pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };
                            $http.post('/location', pos).then(function success(response) {
                                console.log('location posted!');
                                if (response.data == 'success') {
                                    console.log('New position ' + pos + ' added');
                                } else {
                                    console.log(response.data);
                                }
                            });
                        },function() {
                            console.log('can\'t get the location.');
                        });
                    } else {
                        console.log('geolocation rejected!');
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