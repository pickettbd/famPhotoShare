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

	angular.module('app').controller('ThumbController', function() {
		this.thumbs = [];
	});

	angular.module('app').controller('GroupSelecterController', function($scope, $http) {
		$http.get('http://localhost/api/users/john/groups').then(function(resp) {
			$scope.groups = resp.data;
		}, function(err) {
				console.error('ERR', err);
		})
	});

})();
