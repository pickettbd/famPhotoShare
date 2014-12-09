(function() {

	angular.module('app').controller('ListController', function($scope, $http) {

		$scope.hasGroups = 2;
		$scope.hasEvents = 2;
		$scope.hasThumbs = 2;

		$scope.groupname = '';
		$scope.eventname = '';

		$http.get('http://localhost/api/users/whoami').then(function(usernameRes) {
 			var username = usernameRes.data;
			$http.get('http://localhost/api/users/' + username + '/groups').then(function(groupsRes) {
				$scope.groups = groupsRes.data;
				$scope.events = [];
				$scope.thumbs = [];
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

		this.getEvents = function(groupIn) {
			$scope.groupname = groupIn;
			$http.get('http://localhost/api/groups/' + $scope.groupname + '/events').then(function(eventsRes) {
				$scope.events = eventsRes.data;
				$scope.thumbs = [];
				if($scope.events.length > 0) {
					$scope.hasEvents = 1;
					$scope.hasThumbs = 2;
				}
				else {
					$scope.hasEvents = 0;
					$scope.hasThumbs = 2;
				}
			}, function(err) {
				console.error('ERR', err);
			});
		};

		this.getThumbs = function(eventnameIn) {
			$scope.eventname = eventnameIn;
			$http.get('http://localhost/api/groups/' + $scope.groupname + '/events/' + $scope.eventname + '/thumbs').then(function(thumbsRes) {
				$scope.thumbs = thumbsRes.data;
				if($scope.thumbs.length > 0) {
					$scope.hasThumbs = 1;
				}
				else {
					$scope.hasThumbs = 0;
				}

			}, function(err) {
				console.error('ERR', err);
			});
		};

		this.hasNoGroups = function() {
			return $scope.hasGroups === 0;
		};

		this.hasGroups = function() {
			return $scope.hasGroups === 1;
		};

		this.hasNoEvents = function() {
			return $scope.hasEvents === 0;
		};

		this.hasEvents = function() {
			return $scope.hasEvents === 1;
		};

		this.hasNoThumbs = function() {
			return $scope.hasThumbs === 0;
		};

		this.hasThumbs = function() {
			return $scope.hasThumbs === 1;
		};

		this.dontKnowIfThereAreThumbs = function() {
			return $scope.hasThumbs === 2;
		};

	});

	angular.module('app').controller('ThumbController', function($http, $scope){

		$scope.selectedPhotos = [];

		this.download = function() {
			var photoList = encodeURIComponent(JSON.stringify($scope.selectedPhotos));
			$http.get("http://localhost/api/groups/" + $scope.groupname + "/events/" + $scope.eventname + "/photos?photoList=" + photoList).then(function(photos) {
				alert("http://localhost/api/groups/" + $scope.groupname + "/events/" + $scope.eventname + "/photos?photoList=" + photoList);
			}, function(err) {
				console.error('ERR', err);
			});
		};

		this.selectPhoto = function(selectPhoto) {
			var index = $scope.selectedPhotos.indexOf(selectPhoto)
			if(index === -1) {
				$scope.selectedPhotos.push(selectPhoto);
				return;
			}
			$scope.selectedPhotos.splice(index, 1);
		};

		this.isSelected = function(checkPhoto) {
			return -1 != $scope.selectedPhotos.indexOf(checkPhoto);
		};

		this.deselectAll = function() {
			$scope.selectedPhotos = [];
		};

		this.selectAll = function() {
			$scope.selectedPhotos = angular.copy($scope.thumbs);
		};

	});

})();
