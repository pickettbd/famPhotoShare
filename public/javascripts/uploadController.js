(function() {

	angular.module('app').controller('UploadController', function($scope, $http) {

		$scope.hasGroups = false;
		$scope.groups = [];
		$scope.error = false;

		this.getGroups = function() { 
			$http.get('/api/users/whoami').then(function(usernameRes) {
				var userName = usernameRes.data;
				$http.get('/api/users/' + userName + '/groups').then(function(groupsRes) {
					$scope.groups = groupsRes.data;
					if($scope.groups.length > 0) {
						$scope.hasGroups = true;
					}
				}, function(err) {
						console.error('ERR', err);
				});
			}, function(err) {
					console.error('ERR', err);
			});
		};

		this.getGroups();

		$scope.$watch("input.grp", function( newValue, oldValue ) {
			if ( newValue === oldValue ) {
				return;
			}
			groupNameDropDown = document.getElementById("grp");
			groupName = groupNameDropDown.options[groupNameDropDown.selectedIndex].value;
			$http.get('/api/groups/' + groupName + '/events').then(function(res) {
				$scope.events = res.data;
			}, function(err) {
					console.error('ERR', err);
			});
		});

		this.upload = function() {
			var groupNameDDL = document.getElementById('grp');
			var groupName = groupNameDDL.options[groupNameDDL.selectedIndex].value
			var eventNameDDL = document.getElementById('evt');
			var eventName = eventNameDDL.options[eventNameDDL.selectedIndex].value
			if (eventName == '') {
				$scope.error = true;
				return;
			}
			$scope.error = false;
			document.uploadForm.action = "/api/groups/" + groupName + "/events/" + eventName + "/photos";
			document.uploadForm.submit();
		}

		this.hasGroups = function() {
			return $scope.hasGroups;
		};

		this.error = function() {
			return $scope.error;
		}

	});

})();
