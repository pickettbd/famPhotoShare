(function() {

	var app = angular.module('pageHelper', [])

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

	app.controller('ThumbController', function(){
		this.thumbs = images;
	});

	app.controller('GroupSelecterController', function(){
		this.groups = groups;

		this.selectGroup = function(selectedGroup) {
			
		};
	});

	app.controller('EventSelecterController', function(){
		this.events = events;
	});

	var groups = [
		{ name: "Duce-Family" },
		{ name: "Pickett-Family" },
		{ name: "Gruwell-Family" },
		{ name: "Craft-Family" }
	];

	var events = [
		{ name: "Summer-Vacation" },
		{ name: "Christmas" },
		{ name: "Birthday" },
		{ name: "Easter" }
	];

	var images = [
		{ url: "images/temp_images/1.jpg", id: "1" },
		{ url: "images/temp_images/2.jpg", id: "2" },
		{ url: "images/temp_images/3.jpg", id: "3" },
		{ url: "images/temp_images/4.jpg", id: "4" },
		{ url: "images/temp_images/5.jpg", id: "5" },
		{ url: "images/temp_images/6.jpg", id: "6" },
		{ url: "images/temp_images/7.jpg", id: "7" },
		{ url: "images/temp_images/8.jpg", id: "8" },
		{ url: "images/temp_images/9.jpg", id: "9" },
		{ url: "images/temp_images/10.jpg", id: "10" },
		{ url: "images/temp_images/11.jpg", id: "11" },
		{ url: "images/temp_images/12.jpg", id: "12" },
		{ url: "images/temp_images/13.jpg", id: "13" },
		{ url: "images/temp_images/1.jpg", id: "14" },
		{ url: "images/temp_images/2.jpg", id: "15" },
		{ url: "images/temp_images/3.jpg", id: "16" },
		{ url: "images/temp_images/4.jpg", id: "17" },
		{ url: "images/temp_images/5.jpg", id: "18" },
		{ url: "images/temp_images/6.jpg", id: "19" },
		{ url: "images/temp_images/7.jpg", id: "20" },
		{ url: "images/temp_images/8.jpg", id: "21" },
		{ url: "images/temp_images/9.jpg", id: "22" },
		{ url: "images/temp_images/10.jpg", id: "23" },
		{ url: "images/temp_images/11.jpg", id: "24" },
		{ url: "images/temp_images/12.jpg", id: "25" },
		{ url: "images/temp_images/13.jpg", id: "26" },
		{ url: "images/temp_images/1.jpg", id: "27" },
		{ url: "images/temp_images/2.jpg", id: "28" },
		{ url: "images/temp_images/3.jpg", id: "29" },
		{ url: "images/temp_images/4.jpg", id: "30" },
		{ url: "images/temp_images/5.jpg", id: "31" },
		{ url: "images/temp_images/6.jpg", id: "32" },
		{ url: "images/temp_images/7.jpg", id: "33" },
		{ url: "images/temp_images/8.jpg", id: "34" },
		{ url: "images/temp_images/9.jpg", id: "35" },
		{ url: "images/temp_images/10.jpg", id: "36" },
		{ url: "images/temp_images/11.jpg", id: "37" },
		{ url: "images/temp_images/12.jpg", id: "38" },
		{ url: "images/temp_images/13.jpg", id: "39" },
		{ url: "images/temp_images/1.jpg", id: "40" },
		{ url: "images/temp_images/2.jpg", id: "41" },
		{ url: "images/temp_images/3.jpg", id: "42" },
		{ url: "images/temp_images/4.jpg", id: "43" },
		{ url: "images/temp_images/5.jpg", id: "44" },
		{ url: "images/temp_images/6.jpg", id: "45" },
		{ url: "images/temp_images/7.jpg", id: "46" },
		{ url: "images/temp_images/8.jpg", id: "47" },
		{ url: "images/temp_images/9.jpg", id: "48" },
		{ url: "images/temp_images/10.jpg", id: "49" },
		{ url: "images/temp_images/11.jpg", id: "50" },
		{ url: "images/temp_images/12.jpg", id: "51" },
		{ url: "images/temp_images/13.jpg", id: "52" }
	];

})();
