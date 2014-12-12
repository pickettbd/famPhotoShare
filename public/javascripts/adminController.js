(function() {

	angular.module('app').controller('AdminController', function($http, $scope) {

		var whoami = '';

		var createGroupSuccess = false;
		var createGroupAlreadyExists = false;
		var addEventSuccess = false;
		var addEventAlreadyExists = false;
		var inviteUsertoGroupSuccess = false;
		var inviteUsertoGroup409Err = false;
		var hasInvites = false;
		var hasGroups = false;
		$scope.invites = [];
		$scope.groups = [];

		$scope.clearControllerVariables = function() {
			createGroupSuccess = false;
			createGroupAlreadyExists = false;
			addEventSuccess = false;
			addEventAlreadyExists = false;
			inviteUsertoGroupSuccess = false;
			inviteUsertoGroup409Err = false;
		};

		$scope.initialize = function() {
			$http.get('/api/users/whoami').then(function(usernameRes) {
				whoami = usernameRes.data;
				$scope.populateInvites();
				$scope.populateGroups();
			}, function(err) {
					console.error('ERR', err);
			});
		};

		$scope.populateInvites = function() {
			$scope.clearControllerVariables();
			$http.get('/api/users/' + whoami).then(function(userRes) {
				$scope.invites = userRes.data.invites;
				if ($scope.invites.length > 0) {
					hasInvites = true;
				} else {
					hasInvites = false;
				}
			}, function(err) {
				console.error('ERR', err);
			});
		};

		$scope.populateGroups = function() {
			$scope.clearControllerVariables();
			$http.get('/api/users/' + whoami + '/groups').then(function(groupsRes) {
				$scope.groups = groupsRes.data;
				if ($scope.groups.length > 0) {
					hasGroups = true;
				}
			}, function(err) {
					console.error('ERR', err);
			});
		};

		$scope.initialize();

		this.acceptInvitation = function(groupName) {
			$http.post('/api/groups/' + groupName + '/users/' + whoami).then(function(res) {
				$scope.populateInvites();
				$scope.populateGroups();
			}, function(err) {
				alert('something went wrong');
				console.error('ERR', err);
			});
		};

		this.declineInvitation = function(groupName) {
			$http.delete('/api/users/' + whoami + '/groups/' + groupName + '/deny').then(function(res) {
				$scope.populateInvites();
			}, function(err) {
				alert('something went wrong');
				console.error('ERR', err);
			});
		};

		this.createGroup = function() {
			$scope.clearControllerVariables();
			groupName = document.getElementById("newGroupName").value;
			if (!groupName.match(/^[a-z0-9][a-z0-9_]+$/i)) {
				alert('group name is invalid');
				return;
			}
			group = { newgroupname : groupName };
			$http.post('/api/groups', group).then(function(res) {
				document.getElementById("newGroupName").value = '';
				$scope.populateGroups();
				createGroupSuccess = true;
			}, function(err) {
				if (err.status == 409) {
					createGroupAlreadyExists = true;
					return;
				}
				alert('something went wrong');
				console.error('ERR', err);
			});
		};

		this.addEventToGroup = function() {
			$scope.clearControllerVariables();
			eventName = document.getElementById("newEventName").value;
			groupName = document.getElementById("addEventGroupName").value;
			if (!eventName.match(/^[a-z0-9][a-z0-9_]+$/i)) {
				alert('event name is invalid');
				return;
			}
			newEvent = { eventname : eventName, photos : [] };
			$http.post('/api/groups/' + groupName + '/events', newEvent).then(function(res) {
				addEventSuccess = true;
				document.getElementById("newEventName").value = '';
			}, function(err) {
				if (err.status == 409) {
					addEventAlreadyExists = true;
					return;
				}
				alert('something went wrong');
				console.error('ERR', err);
			});
		};
		this.inviteUserToGroup = function() {
			$scope.clearControllerVariables();
			userName = document.getElementById("newUserName").value;
			groupNameDropDown = document.getElementById("addUserGroupName");
			groupName = groupNameDropDown.options[groupNameDropDown.selectedIndex].value;
			if (!userName.match(/^[a-z0-9][a-z0-9_]+$/i)) {
				alert('user name is invalid');
				return;
			}
			
			$http.post('/api/groups/' + groupName + '/users/' + userName + '/invite').then(function(res) {
				groupNameDropDown = document.getElementById("addUserGroupName");
				groupName = groupNameDropDown.options[groupNameDropDown.selectedIndex].value;
				inviteUsertoGroupSuccess = true;
				document.getElementById("newUserName").value = '';
			}, function(err) {
				if (err.status == 409) {
					inviteUsertoGroup409Err = true;
					return;
				}
				else{
					alert('error status not 409');
					console.error('ERR', err);
				}
			});
		};

		this.inviteUser = function() {
			$scope.clearControllerVariables();
			email = document.getElementById("emailAddress").value;
			if (!email.match(/^[0-9a-z._]+@[0-9a-z._]+\.[a-z]+$/i)) {
				alert('email is invalid!');
				return;
			}
			body = { emailaddress : email };
			$http.post('/api/users/invite', body).then(function(res) {
				if (res.status == 200) {
					alert('your invitation was successfully sent');
					document.getElementById("emailAddress").value = '';
				} else {
					alert('res.status not 200');
				}
			}, function(err) {
				alert('post error: something went wrong');
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

		this.hasGroups = function() {
			return hasGroups;
		};

		this.hasInvites = function() {
			return hasInvites;
		};

		this.createGroupSuccess = function() {
			return createGroupSuccess;
		};

		this.createGroupAlreadyExists = function() {
			return createGroupAlreadyExists;
		};

		this.addEventSuccess = function() {
			return addEventSuccess;
		};

		this.addEventAlreadyExists = function() {
			return addEventAlreadyExists;
		};

		this.inviteUsertoGroupSuccess = function() {
			return inviteUsertoGroupSuccess ;
		};

		this.inviteUsertoGroup409Err = function() {
			return inviteUsertoGroup409Err;
		};

	});

})();
