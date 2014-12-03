(function() {

	var app = angular.module('thumbDisplayer', [ ]);

	app.controller('ThumbController', function(){
		this.thumbs = images;
	});

	var images = [
		"/images/temp_images/1.jpg",
		"/images/temp_images/2.jpg",
		"/images/temp_images/3.jpg",
		"/images/temp_images/4.jpg",
		"/images/temp_images/5.jpg",
		"/images/temp_images/6.jpg",
		"/images/temp_images/7.jpg",
		"/images/temp_images/8.jpg",
		"/images/temp_images/9.jpg",
		"/images/temp_images/10.jpg",
		"/images/temp_images/11.jpg",
	];

})();
