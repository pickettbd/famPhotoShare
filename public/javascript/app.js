(function() {

	var app = angular.module('thumbDisplayer', [])

	app.controller('ThumbController', function(){
		this.thumbs = images;
	});

	app.controller('PanelController', function(){
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

	var images = [
		{ url: "/images/temp_images/1.jpg", id: "1" },
		{ url: "/images/temp_images/2.jpg", id: "2" },
		{ url: "/images/temp_images/3.jpg", id: "3" },
		{ url: "/images/temp_images/4.jpg", id: "4" },
		{ url: "/images/temp_images/5.jpg", id: "5" },
		{ url: "/images/temp_images/6.jpg", id: "6" },
		{ url: "/images/temp_images/7.jpg", id: "7" },
		{ url: "/images/temp_images/8.jpg", id: "8" },
		{ url: "/images/temp_images/9.jpg", id: "9" },
		{ url: "/images/temp_images/10.jpg", id: "10" },
		{ url: "/images/temp_images/11.jpg", id: "11" }
	];

})();
