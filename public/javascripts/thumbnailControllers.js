(function() {

	angular.module('app').controller('PanelController', function(){
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

	angular.module('app').controller('ThumbController', function(){
		this.thumbs = images;
	});

	angular.module('app').controller('GroupSelecterController', function($scope, $http){
		$http.get('http://localhost/api/users/john/groups').then(function(resp) {
			$scope.groups = resp.data;
		}, function(err) {
			console.error('ERR', err);
		})

		this.selectGroup = function(selectedGroup) {
			$http.get('http://localhost/api/groups/' + selectedGroup + '/events').then(function(resp) {
				$scope.events = resp.data;
			}, function(err) {
				console.error('ERR', err);
			})
			this.events = ["1", "2"];
		};
	});

	angular.module('app').controller('EventSelecterController', function(){
	});

})();
