(function() {

	angular.module('app').controller('ListController', function($scope, $http) {

		var initial = true;

		$scope.groupname = '';
		$scope.eventname = '';
		$scope.events = [];

		$http.get('http://104.236.25.185/api/users/whoami').then(function(usernameRes) {
 			var username = usernameRes.data;
			$http.get('http://104.236.25.185/api/users/' + username + '/groups').then(function(groupsRes) {
				$scope.groups = groupsRes.data;
				if(groupsRes.data.length > 0) {
					$scope.groupname = groupsRes.data[0];
					$http.get('http://104.236.25.185/api/groups/' + $scope.groupname + '/events').then(function(eventsRes) {
						$scope.events = eventsRes.data;
						$scope.eventname = eventsRes.data[0];
						$http.get('http://104.236.25.185/api/groups/' + $scope.groupname + '/events/' + $scope.eventname + '/thumbs').then(function(thumbsRes) {
							$scope.thumbs = thumbsRes.data;
						}, function(err) {
								console.error('ERR', err);
						});
				}, function(err) {
						console.error('ERR', err);
				});
				}
			}, function(err) {
					console.error('ERR', err);
			});
 		}, function(err) {
				console.error('ERR', err);
		});

		this.getEvents = function(groupIn) {
			$scope.groupname = groupIn;
			$http.get('http://104.236.25.185/api/groups/' + $scope.groupname + '/events').then(function(eventsRes) {
				$scope.events = eventsRes.data;
				$scope.eventname = eventsRes.data[0];
				$http.get('http://104.236.25.185/api/groups/' + $scope.groupname + '/events/' + $scope.eventname + '/thumbs').then(function(thumbsRes) {
					$scope.thumbs = thumbsRes.data;
				}, function(err) {
						console.error('ERR', err);
				});
			}, function(err) {
					console.error('ERR', err);
			});
		};

		this.getThumbs = function(eventnameIn) {
			$scope.eventname = eventnameIn;
			$http.get('http://104.236.25.185/api/groups/' + $scope.groupname + '/events/' + $scope.eventname + '/thumbs').then(function(thumbsRes) {
				$scope.thumbs = thumbsRes.data;
			}, function(err) {
					console.error('ERR', err);
			});
		};

		this.hasGroups = function() {
			return $scope.groups.length > 0;
		};

		this.hasEvents = function() {
			return $scope.events.length > 0;
		};

		this.hasThumbs = function() {
			if(initial === true) {
				initial = false;
				return true;
			}
			return $scope.thumbs.length > 0;
		};

	});

	angular.module('app').controller('ThumbController', function($scope){

		this.selectedPhotos = [];

		this.selectPhoto = function(selectPhoto) {
			var index = this.selectedPhotos.indexOf(selectPhoto)
			if(index === -1) {
				this.selectedPhotos.push(selectPhoto);
				return;
			}
			this.selectedPhotos.splice(index, 1);
		};

		this.isSelected = function(checkPhoto) {
			return -1 != this.selectedPhotos.indexOf(checkPhoto);
		};

		this.deselectAll = function() {
			this.selectedPhotos = [];
		};

		this.selectAll = function() {
			alert('selecting all');
			this.selectedPhotos = angular.copy($scope.thumbs);
		};

	});

})();
