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
	return fs.mkdir(path.resolve(__dirname, "../../data/photos/" + req.params.group), function(err) {
		if (err && err.code != "EEXIST") {
			console.log("error making group dir");
			console.log(err);
			return res.status(err.status).end();
		}
		return fs.mkdir(path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event), function(err) {
			if (err && err.code != "EEXIST") {
				console.log("error making event dir");
				console.log(err);
				return res.status(err.status).end();
			}
			return fs.mkdir(path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event) + "/thumbs", function(err) {
				if (err && err.code != "EEXIST") {
					console.log("error making thumbs dir");
					console.log(err);
					return res.status(err.status).end();
				}
				var newPhotoNames = [ ];

				req.files.uploadphotos.forEach(function(uploadphoto) {
					
					newPhotoNames.push(uploadphoto.name);
					
					var oldPhotoPath = path.resolve(__dirname, "../../data/photos/" + uploadphoto.name);
					var newPhotoPath = path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event + "/" + uploadphoto.name);
					var newThumbPath = path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event + "/thumbs/" + uploadphoto.name);

					// move the file to the correct place
					fs.rename(oldPhotoPath, newPhotoPath, function(err) {
						if (!err) {
							// create the thumbnail
							return gm(newPhotoPath).geometry(480,">").write(newThumbPath, function(err, stdout, stderr, command) {
								if (err) {
									console.error("error making thumb");
									console.error("stdout: " + stdout);
									console.error("stderr: " + stderr);
									return res.render("error", { message: "error in routes/api/groups.js", error: err } );
								}
							});
						} else {
							return res.render("error", { message: "just renamed the photo UNsucessfully", error: err } );
						}
					});
				});

				if (newPhotoNames.length > 0) {
					// add photos to database
					return Group.findOne({ name: req.params.group }, function(err, result) {
						if (!err) {
							for (i = 0; i < result.events.length; i++) {
								if (result.events[i].name === req.params.event) {
									for (j = 0; j < newPhotoNames.length; j++) {
										result.events[i].photos.push(newPhotoNames[j]);
									}
									return result.save(function(err) {
										if (!err) {
											res.status(202).redirect("back");
										} else {
											return res.render("error", { message: "UNsuccesfully updated group with the new photos as part of the appropriate event", error: err } );
										}
									});
								}
							}
							return res.render("404");
						} else {
							return res.render("error", { message: "found group UNsuccessfully", error: err } );
						}
					});
				} else {
					return res.render("error", { message: "zero files were uploaded", error: err } );
				}
				
				return res.render("error", { message: "we shouldn't get here, we should have responded inside the nested madness 4", error: err } );

			});
			return res.render("error", { message: "we shouldn't get here, we should have responded inside the nested madness 3", error: err } );
		});
		return res.render("error", { message: "we shouldn't get here, we should have responded inside the nested madness 2", error: err } );
	});
	return res.render("error", { message: "we shouldn't get here, we should have responded inside the nested madness 1", error: err } );
});

// download photo from an event
router.get('/:group/events/:event/photos/:photo', isAuthenticated, function(req, res)
{
	return Group.findOne({ name: req.params.group }, function(err, result) {
		if (!err) {
			events = result.events
			for (var i = 0; i < events.length; i++) {
				if (events[i].name === req.params.event) {
					for (var j = 0; j < events[i].photos.length; j++) {
						if (events[i].photos[j] === req.params.photo) {
							var pathToPhoto = path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event + "/" + req.params.photo);
							return res.download(pathToPhoto, function(err) {
								if (!err) {
									return res.redirect(302, "back");
								} else {
									return res.render("error", { message: "error sending the photo in download photo", error: err } );
								}
							});
						}
					}
					return res.render("404");
				}
			}
			return res.render("404");
		} else {
			return res.render("error", { message: "error finding group in download photo", error: err } );
		}
	});
});

// download all photos from an event
router.get('/:group/events/:event/photos', isAuthenticated, function(req, res)
{
	return Group.findOne({ name: req.params.group }, function(err, result) {
		if (!err) {
			events = result.events
			for (i = 0; i < events.length; i++) {
				if (events[i].name === req.params.event) {
					var photos = events[i].photos;
					var photoPaths = [];
					var pathToPhotos = path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event);
					for (j = 0; j < photos.length; j++) {
						// TODO -- limit what get's added based on a query (uncomment below)
						//if (photos[j] is a photo we should include) {
							photoPaths.push(path.resolve(pathToPhotos, photos[j]));
						//}
					}
					
					// TODO -- ZIP each photo located at in the photoPaths array into a ".zip" file
					// For this function to work as is, make sure the .zip file is called "photos.zip"
					// and resides at "/path/to/famPhotoShare/repository/data/photos/groupname/eventname"
					// like this: "/path/to/famPhotoShare/repository/data/photos/groupname/eventname/photos.zip"
					
					var zippedPayload = path.resolve(pathToPhotos, "photos.zip");

					return res.download(zippedPayload, function(err) {
						if (!err) {
							return res.redirect(302, "back");
						} else {
							return res.render("error", { message: "error sending the photos.zip in download photos", error: err } );
						}
					});
				}
			}
			return res.render("404");
		} else {
			return res.render("error", { message: "error finding group in download photos", error: err } );
		}
	});
});

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

    User.findByIdAndUpdate(req.session.passport.user, { $push: { groups: req.body.newgroupname} }, { select: "username" }, function(err, u) {
        if (!err) {
	   	Group.update( { name: req.body.newgroupname }, { $push: { users: u.username } }, {}, function(err, numAffected, rawResponse) {
			if (err) {
				res.render("error", { message: "error in routes/api/groups.js", error: err } );
			} else {
				res.send("success");
			};
	    	});
        } else {
        	res.render("error", { message: "error in routes/api/groups.js", error: err } );
	}
    });


});

module.exports = router;
