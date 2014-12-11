(function() {

	angular.module('app').controller('DownloadController', function($scope, $http) {

		$scope.hasGroups = 2;
		$scope.hasEvents = 2;
		$scope.hasThumbs = 2;

		$scope.groupname = '';
		$scope.eventname = '';

		$http.get('/api/users/whoami').then(function(usernameRes) {
 			var username = usernameRes.data;
			$http.get('/api/users/' + username + '/groups').then(function(groupsRes) {
				$scope.groups = groupsRes.data;
				$scope.events = [];
				$scope.thumbs = [];
				$scope.thumbs1 = [];
				$scope.thumbs2 = [];
				$scope.thumbs3 = [];
				$scope.thumbs4 = [];
				if ($scope.groups.length > 0) {
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
			$http.get('/api/groups/' + $scope.groupname + '/events').then(function(eventsRes) {
				$scope.events = eventsRes.data;
				$scope.thumbs = [];
				$scope.thumbs0 = [];
				$scope.thumbs1 = [];
				$scope.thumbs2 = [];
				$scope.thumbs3 = [];
				if ($scope.events.length > 0) {
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
			$http.get('/api/groups/' + $scope.groupname + '/events/' + $scope.eventname + '/thumbs').then(function(thumbsRes) {
				var thumbObjects = thumbsRes.data;
				if (thumbObjects.length > 0) {
					$scope.hasThumbs = 1;
				}
				else {
					$scope.hasThumbs = 0;
					return;
				}

				$scope.thumbs = [];
				$scope.thumbs0 = [];
				$scope.thumbs1 = [];
				$scope.thumbs2 = [];
				$scope.thumbs3 = [];

				var height0 = 0;
				var height1 = 0;
				var height2 = 0;
				var height3 = 0;

				var count = 0;
				for (var i = 0; i < thumbObjects.length; i++) {
					if (height0 <= height1 && height0 <= height2 && height0 <= height3) {
						$scope.thumbs0.push(thumbObjects[i].name);
						height0 += thumbObjects[i].height;
					} else if (height1 <= height2 && height1 <= height3) {
						$scope.thumbs1.push(thumbObjects[i].name);
						height1 += thumbObjects[i].height;
					} else if (height2 <= height3) {
						$scope.thumbs2.push(thumbObjects[i].name);
						height2 += thumbObjects[i].height;
					} else {
						$scope.thumbs3.push(thumbObjects[i].name);
						height3 += thumbObjects[i].height;
					}
					$scope.thumbs.push(thumbObjects[i].name);
				}

			}, function(err) {
				console.error('ERR', err);
			});
		};

		this.selectPhoto = function(selectPhoto) {
			var index = $scope.selectedPhotos.indexOf(selectPhoto)
			if (index === -1) {
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


		this.download = function() {
			if ($scope.selectedPhotos.length == 0) {
				alert('Please select some photos');
				return;
			}
			var photoList = encodeURIComponent(JSON.stringify($scope.selectedPhotos));
			var url = "/api/groups/" + $scope.groupname + "/events/" + $scope.eventname + "/photos?photoList=" + photoList;
			window.open(url, '_self');
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

		$scope.selectedPhotos = [];

	});

})();
