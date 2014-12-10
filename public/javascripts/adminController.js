(function() {

	angular.module('app').controller('AdminController', function($http, $scope) {

		$scope.groups = [];

		$scope.populateGroups = function() {
			$http.get('/api/users/whoami').then(function(usernameRes) {
				var username = usernameRes.data;
				$http.get('/api/users/' + username + '/groups').then(function(groupsRes) {
					$scope.groups = groupsRes.data;
					if($scope.groups.length > 0) {
						$scope.hasGroups = 1;
					}
					else {
						$scope.hasGroups = 0;
					}
				}, function(err) {
						console.error('ERR', err);
				});
			}, function(err) {
					console.error('ERR', err);
			});
		};

		this.createGroup = function() {
			groupName = document.getElementById("newGroupName").value;
			if (!groupName.match(/^[a-z0-9][a-z0-9_]+$/i)) {
				alert('group name is invalid');
				return;
			}
			group = { newgroupname : groupName };
			$http.post('/api/groups', group).then(function(statusCode) {
				alert(groupName + ' was successfully created');
				document.getElementById("newGroupName").value = '';
				$scope.populateGroups();
			}, function(err) {
				alert('something went wrong');
				console.error('ERR', err);
			});
		};

		this.addEventToGroup = function() {
			eventName = document.getElementById("newEventName").value;
			groupName = document.getElementById("addEventGroupName").value;
			if (!eventName.match(/^[a-z0-9][a-z0-9_]+$/i)) {
				alert('event name is invalid');
				return;
			}
			newEvent = { eventname : eventName, photos : [] };
			$http.post('/api/groups/' + groupName + '/events', newEvent).then(function(statusCode) {
				alert(eventName + ' was successfully created');
				document.getElementById("newEventName").value = '';
			}, function(err) {
				alert('something went wrong');
				console.error('ERR', err);
			});
		};

		this.addUserToGroup = function() {
			userName = document.getElementById("newUserName").value;
			groupNameDropDown = document.getElementById("addUserGroupName");
			groupName = groupNameDropDown.options[groupNameDropDown.selectedIndex].value;
			if (!userName.match(/^[a-z0-9][a-z0-9_]+$/i)) {
				alert('user name is invalid');
				return;
			}
			$http.post('/api/groups/' + groupName + '/users/' + userName).then(function(res) {
				if (res.status == 200) {
					groupNameDropDown = document.getElementById("addUserGroupName");
					groupName = groupNameDropDown.options[groupNameDropDown.selectedIndex].value;
					alert(userName + ' was successfully added to ' + groupName);
					document.getElementById("newUserName").value = '';
				} else {
					alert('user name does not exist on Family Photo Share');
				}
			}, function(err) {
				alert('something went wrong');
				console.error('ERR', err);
			});
		};

		this.inviteUser = function() {
			email = document.getElementById("emailAddress").value;
			if (!userName.match(/^[-0-9a-z.+_]+@[-0-9a-z.+_]+\.[a-z]$/i)) {
				alert('email is invalid');
				return;
			}
			body = { emailaddress : email };
			$http.post('/api/users/invite', body).then(function(res) {
				if (res.status == 200) {
					alert('your invitation was successfully sent');
					document.getElementById("emailAddress").value = '';
				} else {
					alert('something went wrong');
				}
			}, function(err) {
				alert('something went wrong');
				console.error('ERR', err);
			});
		};

		this.checkGroupName = function() {
			groupName = document.getElementById("newGroupName").value;
			if (groupName.length == 0 || groupName.length == 1) {
				return true;
			}
			return groupName.match(/^[a-z0-9][a-z0-9_]+$/i)
		};

		this.checkEventName = function() {
			eventName = document.getElementById("newEventName").value;
			if (eventName.length == 0 || eventName.length == 1) {
				return true;
			}
			return eventName.match(/^[a-z0-9][a-z0-9_]+$/i)
		};

		this.checkUserName = function() {
			userName = document.getElementById("newUserName").value;
			if (userName.length == 0 || userName.length == 1) {
				return true;
			}
			return userName.match(/^[a-z0-9][a-z0-9_]+$/i)
		};

		$scope.populateGroups();

	});


})();
