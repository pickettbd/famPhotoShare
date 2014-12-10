(function() {
	var app = angular.module('app');
	app.controller('LoginController', function($scope, $http, $window) {

		$scope.authenticateUser = function() {
			username = document.getElementById("username").value;
			password = document.getElementById("password").value;
			var user = {"username": username, "password": password};
			$http.post('/login', user).then( function(res) {
				$window.location = '/welcome';
			}, function(err){
				alert('Incorrect Username or Password');
				document.getElementById("password").value = "";
			});




//.success(function(data, status, headers, config){
//				alert('login was successfull!');
//				$window.location.href= data.url ? data.url : '/';
//                $scope.view.loading = false;
//			}).error(function(data, status, headers, config) {
//                console.log(data);
//                $scope.view.loading = false;
//                $scope.view.submitted = true;
//                $scope.view.serverError=data.message ? data.message : "Server Error!";
//            });
		};
	});
//	app.config(function($routeProvider, $locationProvider){
//		$routeProvider
//			.when('/welcome', {
//				templateUrl : 'views/welcome.jade',
//				controller : mainController
//			});
//
//
//		// use the HTML5 History API
//		$locationProvider.html5Mode(true);
//	});
})();
