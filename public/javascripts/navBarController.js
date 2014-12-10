(function() {

	angular.module('app').controller('NavBarController', function($http, $window, $scope) {
		this.isOne = function(selectedTab) {
			return selectedTab === 1;
		};
		this.isTwo = function(selectedTab) {
			return selectedTab === 2;
		};
		this.isThree = function(selectedTab) {
			return selectedTab === 3;
		};
		
	});

})();
