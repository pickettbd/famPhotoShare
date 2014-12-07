(function() {

	angular.module('app').controller('ListController', function($scope, $http) {
		var initial = true;
		var group = "";

		$http.get('http://localhost/api/users/whoami').then(function(usernameRes) {

 			var username = usernameRes.data;

			$http.get('http://localhost/api/users/' + username + '/groups').then(function(groupsRes) {

				$scope.groups = groupsRes.data;

			}, function(err) {
					console.error('ERR', err);
			});
 		}, function(err) {
				console.error('ERR', err);
		});

		this.getEvents = function() {
			var ddl = document.getElementById("groupsddl");
			group = ddl.options[ddl.selectedIndex].value;
			$http.get('http://localhost/api/groups/' + group + '/events').then(function(eventsRes) {
				$scope.events = eventsRes.data;
			}, function(err) {
					console.error('ERR', err);
			});
		};

		this.getThumbs = function() {
			var ddl = document.getElementById("eventsddl");
			eventname = ddl.options[ddl.selectedIndex].value;
			$http.get('http://localhost/api/groups/' + group + '/events/' + eventname + '/thumbs').then(function(thumbsRes) {
				$scope.thumbs = thumbsRes.data;
			}, function(err) {
					console.error('ERR', err);
			});
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
