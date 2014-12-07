(function() {

	angular.module('app').controller('ListController', function($scope, $http) {

		var initial = true;
		var group = '';

		$scope.eventname = '';
		$scope.events = [];

		var url = 'http://104.236.25.185/api/users/whoami';
		$http.get(url).then(function(usernameRes) {
 			var username = usernameRes.data;
			url = 'http://104.236.25.185/api/users/' + username + '/groups';
			$http.get(url).then(function(groupsRes) {
				$scope.groups = groupsRes.data;
			}, function(err) {
					console.error('ERR', err);
			});
 		}, function(err) {
				console.error('ERR', err);
		});

		this.getEvents = function(groupIn) {
			group = groupIn;
			url = 'http://104.236.25.185/api/groups/' + group + '/events';
			$http.get(url).then(function(eventsRes) {
				$scope.events = eventsRes.data;
				$scope.eventname = eventsRes.data[0];
				url = 'http://104.236.25.185/api/groups/' + group + '/events/' + $scope.eventname + '/thumbs';
				$http.get(url).then(function(thumbsRes) {
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
			url = 'http://104.236.25.185/api/groups/' + group + '/events/' + $scope.eventname + '/thumbs';
			$http.get(url).then(function(thumbsRes) {
				$scope.thumbs = thumbsRes.data;
			}, function(err) {
					console.error('ERR', err);
			});
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

	angular.module('app').controller('ThumbController', function(){
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
	});

})();
