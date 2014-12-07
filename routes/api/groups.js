var gm = require('gm'); // graphicsmagick
var fs = require('fs'); // file system
var path = require('path'); // resolve paths
var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}
var User = require('../../schemas/user');
var Group = require('../../schemas/group');

//router.param('group', /^[A-Za-z0-9]\w{2,}$/);
//router.param('event', /^[A-Za-z0-9]\w{2,}$/);
//router.param('user', /^[A-Za-z0-9]\w{4,}$/);

// view event's details
router.get('/:group/events/:event', isAuthenticated, function(req, res)
{
	Group.findOne({ name: req.params.group }, function(err, result) {
		if (!err) {
			events = result.events
			for (i = 0; i < events.length; i++) {
				if (events[i].name === req.params.event) {
					return res.json(events[i]);
				}
			}
			res.render("404");
		} else {
			res.render("error", { message: "error in routes/api/groups.js", error: err } );
		}
	});
});

// add new event
router.post('/:group/events', isAuthenticated, function(req, res)
{
    Group.update( { name: req.params.group }, { $push: { events: { name: req.body.eventname, photos: req.body.photos } } }, function(err, numAffected, rawResponse) {
        if (err) {
        	res.render("error", { message: "error in routes/api/groups.js", error: err } );
        };
    });
});

// delete event
router.delete('/:group/events/:event', isAuthenticated, function(req, res)
{
	res.send('this is how you delete an event.  group: ' + req.params.group + ', event: ' + req.params.event);
});

// get thumbs
router.get('/:group/events/:event/thumbs', isAuthenticated, function(req, res)
{
	Group.findOne({ name: req.params.group }, function(err, result) {
		if (!err) {
			events = result.events
			for (i = 0; i < events.length; i++) {
				if (events[i].name === req.params.event) {
					photos = events[i].photos;
					thumbs = [];
					for (j = 0; j < photos.length; j++) {
						thumbs.push("api/groups/" + req.params.group + "/events/" + req.params.event + "/thumbs/" + photos[j]);
					}
					return res.json(thumbs);
				}
			}
			res.render("404");
		} else {
			res.render("error", { message: "error in routes/api/groups.js", error: err } );
		}
	});
});

// get one thumb
router.get('/:group/events/:event/thumbs/:thumb', isAuthenticated, function(req, res)
{
	var fileName = "/data/photos/" + req.params.group + "/" + req.params.event + "/thumbs/" + req.params.thumb;

	var options = {
		dotfiles: "deny",
		root : path.resolve(__dirname, "../..")
	}

	res.sendFile(fileName, options, function(err) {
		if (err) {
			return res.status(err.status).end();
		}
	});
});

// upload photo(s) to an event
router.post('/:group/events/:event/photos', isAuthenticated, function(req, res)
{
	console.log("made it into the upload photos route function");

	return fs.mkdir(path.resolve(__dirname, "../../data/photos/" + req.params.group), function(err) {
		if (err && err.code != "EEXIST") {
			console.log("error making group dir");
			console.log(err);
			return res.status(err.status).end();
		}
		console.log("made group dir");
		return fs.mkdir(path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event), function(err) {
			if (err && err.code != "EEXIST") {
				console.log("error making event dir");
				console.log(err);
				return res.status(err.status).end();
			}
			console.log("made event dir");
			return fs.mkdir(path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event) + "/thumbs", function(err) {
				if (err && err.code != "EEXIST") {
					console.log("error making thumbs dir");
					console.log(err);
					return res.status(err.status).end();
				}
				console.log("made thumbs dir");

				var newPhotoNames = [ ];

				req.files.uploadphotos.forEach(function(uploadphoto) {
					
					console.log("loop through the files (at the top)");
					newPhotoNames.push(uploadphoto.name);
					
					var oldPhotoPath = path.resolve(__dirname, "../../data/photos/" + uploadphoto.name);
					var newPhotoPath = path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event + "/" + uploadphoto.name);
					var newThumbPath = path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event + "/thumbs/" + uploadphoto.name);

					//console.log(oldPhotoPath);
					//console.log(newPhotoPath);
					//console.log(newThumbPath);

					// move the file to the correct place
					fs.rename(oldPhotoPath, newPhotoPath, function(err) {
						if (!err) {
							//console.log("just renamed the photo sucessfully, about to create the thumbnail");
							//console.log(oldPhotoPath);
							//console.log(newPhotoPath);
							//console.log(newThumbPath);
							// create the thumbnail
							return gm(newPhotoPath).geometry(480,">").write(newThumbPath, function(err, stdout, stderr, command) {
								if (err) {
									console.error("error making thumb");
									console.error("stdout: " + stdout);
									console.error("stderr: " + stderr);
									return res.render("error", { message: "error in routes/api/groups.js", error: err } );
								} else {
									console.error("successfully made thumb");
								}
								//console.log(oldPhotoPath);
								//console.log(newPhotoPath);
								//console.log(newThumbPath);
							});
						} else {
							console.log("just renamed the photo UNsucessfully");
							return res.render("error", { message: "error in routes/api/groups.js", error: err } );
						}
					});
				//}
				});

				console.log("exited loop through the files");
				console.log(newPhotoNames);
				if (newPhotoNames.length > 0) {
					console.log("more than one file was uploaded, about to find group");
					// add photos to database
					return Group.findOne({ name: req.params.group }, function(err, result) {
						if (!err) {
							console.log("found group successfully");
							console.log(result);

							//var replGroup = new Group();

							//replGroup.name = result.name;
							//replGroup.users = result.users;
							//replGroup.events = result.events;

							//for (i = 0; i < replGroup.events.length; i++) {
							for (i = 0; i < result.events.length; i++) {
								console.log("looping through events");
								//console.log(replGroup.events[i]);
								console.log(result.events[i]);
								//if (replGroup.events[i].name === req.params.event) {
								if (result.events[i].name === req.params.event) {
									console.log("found event!");
									//console.log(replGroup.events[i].photos);
									console.log(result.events[i].photos);
									for (j = 0; j < newPhotoNames.length; j++) {
										console.log("adding photo to event!");
										//replGroup.events[i].photos.push(newPhotoNames[j]);
										result.events[i].photos.push(newPhotoNames[j]);
										//console.log(replGroup.events[i].photos);
										console.log(result.events[i].photos);
									}
									console.log("updating group with the new photos as part of the appropriate event");
									//console.log(replGroup);
									console.log(result);
									//console.log(replGroup.events[i].photos);
									console.log(result.events[i].photos);
									return result.save(function(err) {
										if (!err) {
											console.log("succesfully updated group with the new photos as part of the appropriate event");
											console.log("responding w/ status code 202");
											res.status(202).redirect("back");
										} else {
											console.log("UNsuccesfully updated group with the new photos as part of the appropriate event");
											console.log(err);
											return res.render("error", { message: "error in routes/api/groups.js", error: err } );
										}
									});
									//return Group.update( { _id: result._id}, replGroup, function(err, numAffected, rawResponse) {
									//	if (!err) {
									//		console.log("succesfully updated group with the new photos as part of the appropriate event");
									//	} else {
									//		console.log("UNsuccesfully updated group with the new photos as part of the appropriate event");
									//		console.log(err);
									//		return res.render("error", { message: "error in routes/api/groups.js", error: err } );
									//	}
									//});
								}
							}
							return res.render("404");
						} else {
							console.log("found group UNsuccessfully");
							return res.render("error", { message: "error in routes/api/groups.js", error: err } );
						}
					});
				} else {
					console.log("zero files were uploaded");
					return res.render("error", { message: "error in routes/api/groups.js", error: err } );
				}
				
				console.log("we shouldn't get here, we should have responded inside the nested madness 4");
				return res.render("error", { message: "error in routes/api/groups.js", error: err } );

			});
			console.log("we shouldn't get here, we should have responded inside the nested madness 3");
			return res.render("error", { message: "error in routes/api/groups.js", error: err } );
		});
		console.log("we shouldn't get here, we should have responded inside the nested madness 2");
		return res.render("error", { message: "error in routes/api/groups.js", error: err } );
	});
	console.log("we shouldn't get here, we should have responded inside the nested madness 1");
	return res.render("error", { message: "error in routes/api/groups.js", error: err } );
});

// download photo from an event
//router.get('/:group/events/:event/photos/:photo', isAuthenticated, function(req, res)
//{
//	res.send('this is how you download a photo from an event.  group: ' + req.params.group + ', event: ' + req.params.event + ', photo: ' + req.params.photo);
//});

// download all photos from an event
router.get('/:group/events/:event/photos', isAuthenticated, function(req, res)
{
	res.send('this is how you download all photos from an event.  group: ' + req.params.group + ', event: ' + req.params.event);
});

//// upload photos to an event
//router.post('/:group/events/:event/photos', isAuthenticated, function(req, res)
//{
//    var event = null;
//    event.photos = req.body.photos;
//
//    event.save(function(err) {
//         if (err) res.send(err);
//	 res.location("menu");
//	 res.redirect("menu");
//    });
//    res.send('this is how you upload photos to an event.  group: ' + req.params.group + ', event: ' + req.params.event);
//	
//});

// delete photo from an event
router.delete('/:group/events/:event/photos/:photo', isAuthenticated, function(req, res)
{
	res.send('this is how you delete a photo from an event.  group: ' + req.params.group + ', event: ' + req.params.event + ', photo: ' + req.params.photo);
});

// delete all photos from an event
router.delete('/:group/events/:event/photos', isAuthenticated, function(req, res)
{
	res.send('this is how you delete all photos from an event.  group: ' + req.params.group + ', event: ' + req.params.event);
});

// view list of all group's events
router.get('/:group/events', isAuthenticated, function(req, res)
{
	Group.findOne( { name: req.params.group } ).exec( function(err, result) {
		if (!err) {
			names = []
			for (i = 0; i < result.events.length; i++) {
				names.push(result.events[i].name);
			}
			res.json(names);
		} else {
			res.render("error", { message: "error in routes/api/groups.js", error: err } );
		};
	});
});

// add a user to the group
router.post('/:group/users/:user', isAuthenticated, function(req, res)
{
    User.update( { username: req.params.user }, { $push: { groups: req.params.group } }, function(err, numAffected, rawResponse) {
        if (err) {
        	res.render("error", { message: "error in routes/api/groups.js", error: err } );
        };
    });

    Group.update( { name: req.params.group }, { $push: { users: req.params.user } }, {}, function(err, numAffected, rawResponse) {
        if (err) {
        	res.render("error", { message: "error in routes/api/groups.js", error: err } );
        } else {
        	res.send("success");
        };
    });
});

// delete user from the group
router.delete('/:group/users/:user', isAuthenticated, function(req, res)
{
	res.send('this is how you remove a user from a group. group: ' + req.params.group + ', user: ' + req.params.user);
});

// delete all users from the group
router.delete('/:group/users', isAuthenticated, function(req, res)
{
	res.send('this is how you remove all users from a group. group: ' + req.params.group);
});

// see a list of all the group's users 
router.get('/:group/users', isAuthenticated, function(req, res)
{
	Group.findOne( { name: req.params.group } ).exec( function(err, result) {
		if (!err) {
			res.json(result.users);
		} else {
			res.render("error", { message: "error in routes/api/groups.js", error: err } );
		};
	});
});

// view group's details
router.get('/:group', isAuthenticated, function(req, res)
{
	Group.findOne( { name: req.params.group } ).exec( function(err, result) {
		if (!err) {
			res.json(result);
		} else {
			res.render("error", { message: "error in routes/api/groups.js", error: err } );
		};
	});
});

// delete group
router.delete('/:group', isAuthenticated, function(req, res)
{
	res.send('this is how you delete a group.  group: ' + req.params.group);
});

// see list of all groups
router.get('/', isAuthenticated, function(req, res)
{
	Group.find(function(err, result) {
		if (!err) {
			names = []
			for (i = 0; i < result.length; i++) {
				names.push(result[i].name);
			}
			res.json(names);
		} else {
			res.render("error", { message: "error in routes/api/groups.js", error: err } );
		};
	});
});

// create new group
router.post('/', isAuthenticated, function(req, res)
{
	var group = new Group();

	group.name = req.body.newgroupname;
	group.users = [ ];
	group.events = [ ];

	group.save(function(err) {
		if (err) {
			res.sendStatus(500);
		}
		res.status(200).redirect("/manage-groups");
	});
});

module.exports = router;
