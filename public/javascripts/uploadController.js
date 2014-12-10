(function() {

	angular.module('app').controller('UploadController', function($scope, $http) {

		$scope.hasGroups = false;
		$scope.groups = [];

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
			alert('uploading');
			var groupNameDDL = document.getElementById('grp');
			var groupName = groupNameDDL.options[groupNameDDL.selectedIndex].value
			var eventNameDDL = document.getElementById('evt');
			var eventName = eventNameDDL.options[eventNameDDL.selectedIndex].value
			document.uploadForm.action = "/api/groups/" + groupName + "/events/" + eventName + "/photos";
			document.uploadForm.submit();
		}


	});

})();
