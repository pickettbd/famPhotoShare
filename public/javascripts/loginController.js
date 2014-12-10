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




		};
	});
})();
