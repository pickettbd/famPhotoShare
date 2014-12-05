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

	angular.module('app').factory('apiFactory', ['$http', function($http) {
		return {
			getGroups: function(user) {
				return $http.get('http://localhost/api/users/john/groups').then(function(response) {
					return response.data;
				});
			},
			getEvents: function(group) {
				return $http.get('http://localhost/api/groups/' + group + '/events').then(function(response) {
					return response.data;
				});
			}
		};
	}]);

	angular.module('app').controller('GroupSelecterController', [ '$scope', 'apiFactory', function($scope, apiFactory) {
		apiFactory.getGroups('john').then(functions(groups) {
			$scope.groups = groups;
		});
		$scope.groups = ['hello'];
	}]);

})();
