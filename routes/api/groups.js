var gm = require('gm'); // graphicsmagick
var async = require('async');
var fs = require('fs'); // file system
var path = require('path'); // resolve paths
var express = require('express');
var router = express.Router();
var emailTemplates = require('email-templates');
var emailTemplatesDir = path.resolve(__dirname, "../..", "email_templates");

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
	return Group.findOne({ name: req.params.group }, function(err, result) {
		if (!err) {
			events = result.events;
			for (var i = 0; i < events.length; i++) {
				if (events[i].name === req.body.eventname) {
						return res.sendStatus(409);
				}
			}
			var eventname = req.body.eventname;
			var photos = req.body.photos;
			result.events.push({ "name" : eventname, "photos" : photos });
			return result.save(function(err) {
				if (err) {
					return res.render("error", { message: "error in routes/api/groups.js", error: err } );
				} else {
					return res.sendStatus(200);
				}
			});
		} else {
			return res.sendStatus(500);
		}
	});
});

// delete event
router.delete('/:group/events/:event', isAuthenticated, function(req, res)
{
	res.send('this is how you delete an event. group: ' + req.params.group + ', event: ' + req.params.event);
});

// get thumbs
router.get('/:group/events/:event/thumbs', isAuthenticated, function(req, res)
{
	return Group.findOne({ name: req.params.group }, function(err, result) {
		if (!err) {
			events = result.events
			for (var i = 0; i < events.length; i++) {
				if (events[i].name === req.params.event) {
					var thumbs = [];

					return async.each(events[i].photos, function(photoName, callback) {
						gm(path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event + "/thumbs/" + photoName)).size(function(err, size) {
							if (!err) {
								thumbs.push( { name: photoName, height: size.height } );
								callback(null);
							} else {
								console.log("gm error while getting size");
								console.log(photoName);
								console.log(err);
								callback(err);
							}
						});
					}, function(err) {
						if (!err) {
							return res.json(thumbs);
						} else {
							return res.sendStatus(500);
						}
					});

					//events[i].photos.forEach(function(photoName) {
					//	gm(path.resolve(__dirname, "../../data/photos", req.params.group, req.params.event, "/thumbs/", photoName)).size(function(err, size) {
					//		if (!err) {
					//			thumbs.push( { name: photoName, height: size.height } );
					//		} else {
					//			console.log("gm error while getting size");
					//			console.log(photoName);
					//			console.log(err);
					//			gmErr = true;
					//		}
					//	});
					//});
					//

					//if (!gmErr) {
					//	return res.json(thumbs);
					//} else {
					//	return res.sendStatus(500);
					//}
				}
			}
			return res.sendStatus(500);
		} else {
			return res.sendStatus(500);
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

				console.log("req.files");				
				console.log(req.files);

				var uploadphotos = [];

				if (req.files.uploadphotos.length) {
					uploadphotos = req.files.uploadphotos;
				} else {
					uploadphotos.push(req.files.uploadphotos);
				}
				
				console.log("uploadphotos");				
				console.log(uploadphotos);

				return async.eachSeries(uploadphotos, function(uploadphoto, callback) {
					newPhotoNames.push(uploadphoto.name);
					
					//var oldPhotoPath = path.resolve(__dirname, "../../data/photos/" + uploadphoto.name);
					var oldPhotoPath = uploadphoto.path;
					var newPhotoPath = path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event + "/" + uploadphoto.name);
					var newThumbPath = path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event + "/thumbs/" + uploadphoto.name);

					// move the file to the correct place
					fs.rename(oldPhotoPath, newPhotoPath, function(err) {
						if (!err) {
							// create the thumbnail
							gm(newPhotoPath).geometry(480,">").write(newThumbPath, function(err, stdout, stderr, command) {
								if (err) {
									console.error("error making thumb");
									console.error("stdout: " + stdout);
									console.error("stderr: " + stderr);
									callback(err);
								} else {
									callback(null);
								}
							});
						} else {
							callback(err);
						}
					});
				}, function(err) {
					if (!err) {
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
													return res.location("/upload-landing").redirect("/upload-landing");
												} else {
													return res.sendStatus(500);
												}
											});
										}
									}
									return res.sendStatus(500);
								} else {
									return res.sendStatus(500);
								}
							});
						} else {
							return res.sendStatus(500);
						}
					} else {
						return res.sendStatus(500);
					}
				});

				////req.files.uploadphotos.forEach(function(uploadphoto) {
				//uploadphotos.forEach(function(uploadphoto) {
				//	
				//	newPhotoNames.push(uploadphoto.name);
				//	
				//	//var oldPhotoPath = path.resolve(__dirname, "../../data/photos/" + uploadphoto.name);
				//	var oldPhotoPath = uploadphoto.path;
				//	var newPhotoPath = path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event + "/" + uploadphoto.name);
				//	var newThumbPath = path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event + "/thumbs/" + uploadphoto.name);

				//	// move the file to the correct place
				//	fs.rename(oldPhotoPath, newPhotoPath, function(err) {
				//		if (!err) {
				//			// create the thumbnail
				//			return gm(newPhotoPath).geometry(480,">").write(newThumbPath, function(err, stdout, stderr, command) {
				//				if (err) {
				//					console.error("error making thumb");
				//					console.error("stdout: " + stdout);
				//					console.error("stderr: " + stderr);
				//					//return res.render("error", { message: "error in routes/api/groups.js", error: err } );
				//					return res.sendStatus(500);
				//				}
				//			});
				//		} else {
				//			//return res.render("error", { message: "just renamed the photo UNsucessfully", error: err } );
				//			return res.sendStatus(500);
				//		}
				//	});
				//});

				//if (newPhotoNames.length > 0) {
				//	// add photos to database
				//	return Group.findOne({ name: req.params.group }, function(err, result) {
				//		if (!err) {
				//			for (i = 0; i < result.events.length; i++) {
				//				if (result.events[i].name === req.params.event) {
				//					for (j = 0; j < newPhotoNames.length; j++) {
				//						result.events[i].photos.push(newPhotoNames[j]);
				//					}
				//					return result.save(function(err) {
				//						if (!err) {
				//							//return res.sendStatus(202);
				//							//return res.location("back").redirect(202, "back");
				//							//return res.status(202).location("http://localhost/upload-landing").render("upload-landing", {
				//							//return res.status(202).render("upload-landing", {
				//							//res.location("upload-landing");
				//							//return res.render("upload-landing", {
				//							//	title: 'Upload Landing',
				//							//	navbar: 'true',
				//							//	navtab1: 'false',
				//							//	navtab2: 'false',
				//							//	navtab3: 'false' }
				//							//);
				//							return res.location("/upload-landing").redirect("/upload-landing");
				//						} else {
				//							//return res.render("error", { message: "UNsuccesfully updated group with the new photos as part of the appropriate event", error: err } );
				//							return res.sendStatus(500);
				//						}
				//					});
				//				}
				//			}
				//			//return res.render("404");
				//			return res.sendStatus(500);
				//		} else {
				//			//return res.render("error", { message: "found group UNsuccessfully", error: err } );
				//			return res.sendStatus(500);
				//		}
				//	});
				//} else {
				//	//return res.render("error", { message: "zero files were uploaded", error: err } );
				//	return res.sendStatus(500);
				//}
				
				//return res.render("error", { message: "we shouldn't get here, we should have responded inside the nested madness 4", error: err } );
				//return res.sendStatus(500);

			});
			//return res.render("error", { message: "we shouldn't get here, we should have responded inside the nested madness 3", error: err } );
			return res.sendStatus(500);
		});
		//return res.render("error", { message: "we shouldn't get here, we should have responded inside the nested madness 2", error: err } );
		return res.sendStatus(500);
	});
	//return res.render("error", { message: "we shouldn't get here, we should have responded inside the nested madness 1", error: err } );
	return res.sendStatus(500);
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
					if (req.query.photoList) {
						var photosToDownload = JSON.parse(req.query.photoList);
						var photoPaths = [];
						var pathToPhotos = path.resolve(__dirname, "../../data/photos/" + req.params.group + "/" + req.params.event);
						for (j = 0; j < photosToDownload.length; j++) {
								photoPaths.push(path.resolve(pathToPhotos, photosToDownload[j]));
						}
				
						// create zip file (npm install archiver)
						var archiver = require('archiver');
						
						var zipFileName = path.resolve(pathToPhotos, req.params.event + Date.now() + Math.floor((Math.random() * 1000) + 1) + ".zip");
						var output = fs.createWriteStream(zipFileName); 
						var archive = archiver('zip');
						archive.on('error', function(err) {
							console.log("error archiving file");
							throw err;
						});
						output.on('close', function () {
							console.log(archive.pointer() + ' total bytes');
							console.log('archiver has been finalized and the output file descriptor has closed.');

							// actually send the user the file
							return res.download(zipFileName, req.params.event + ".zip", function(err) {
								if (!err) {
									console.log("successful download!");

									// delete the file from the server
									return fs.unlink(zipFileName, function(err) {
										if (!err) {
											console.log("successfully deleted zip file!");
											return res.end();
										} else {
											return res.render("error", { message: "error sending the photos.zip in download photos", error: err } );
										}
									});
								} else {
									return res.render("error", { message: "error sending the photos.zip in download photos", error: err } );
								}
							});
						});

						archive.pipe(output);

						for (k = 0; k < photoPaths.length; k++) {
							// {name: filename} needed to grab individual files (without folder structure)
							archive.file(photoPaths[k], { name: photosToDownload[k] } ); 
						}

						return archive.finalize();
					} else {
						console.log("returning the list of photos as json");
						return res.json(events[i].photos);
					}
				}
			}
			console.log("finished for loop through groups events without ever returning (till now)");
			return res.render("404");
		} else {
			return res.render("error", { message: "error finding group in download photos", error: err } );
		} 
	}); 
});

// delete photo from an event
router.delete('/:group/events/:event/photos/:photo', isAuthenticated, function(req, res)
{
	res.send('this is how you delete a photo from an event. group: ' + req.params.group + ', event: ' + req.params.event + ', photo: ' + req.params.photo);
});

// delete all photos from an event
router.delete('/:group/events/:event/photos', isAuthenticated, function(req, res)
{
	res.send('this is how you delete all photos from an event. group: ' + req.params.group + ', event: ' + req.params.event);
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

// invite a user to join the group
router.post('/:group/users/:user/invite', isAuthenticated, function(req, res) {
	return emailTemplates(emailTemplatesDir, function(err, template) {
		if (!err) {
			return User.findOne( { _id: req.session.passport.user } ).exec( function(err, invitingUser) {
				if (!err) {
					return User.findOne( { username: req.params.user }).exec( function(err, invitedUser) {
						if (!err) {
							invitedUser.invites.push(req.params.group);
							return invitedUser.save(function(err) {
								if (!err) {
									var mailTransporter = req.mailTransporter;
									
									var locals = {
										invitername: invitingUser.name,
										invitedname: invitedUser.name,
										groupname: req.params.group,
										email: invitedUser.email,
										title: "Join Group Invitation email"
									};

									return template("groupInvitation", locals, function(err, html, text) {
										if (!err) {
											return mailTransporter.sendMail(
												{
													from: "groupinvite@104.236.25.185",
													to: locals.email,
													subject: "Join a group!",
													html: html,
													generateTextFromHTML: true
													//text: text
												}, function(err, responseStatus) {
													if (!err) {
														console.log(html);
														return res.sendStatus(200);
													} else {
														console.log(err);
														console.log(html);
														return res.sendStatus(500);
													}
												}
											);
										} else {
											console.log(err);
											return res.sendStatus(500);
										}
									});
								} else {
									console.log(err);
									return res.sendStatus(500);
								}
							});
						} else {
							console.log(err);
							return res.sendStatus(500);
						}
					});
				} else {
					console.log(err);
					return res.sendStatus(500);
				}
			});
		} else {
			console.log(err);
			return res.sendStatus(500);
		}
	});
});

// add a user to the group
router.post('/:group/users/:user', isAuthenticated, function(req, res)
{
	return User.findOne({ username: req.params.user }, function(err, result) {
		if (!err) {
			if (result == null) {
				return res.sendStatus(409);
			}
			groups = result.groups;
			for (var i = 0; i < groups.length; i++) {
				if (groups[i] === req.params.group) {
					return res.sendStatus(409);
				}
			}
			result.groups.push(req.params.group);
			var index = result.invites.indexOf(req.params.group);
			if (index >= 0 && index < result.invites.length) {
				result.invites.splice(index, 1);
			}
			result.save(function(err) {
				if (!err) {
					return Group.update( { name: req.params.group }, { $push: { users: req.params.user } }, {}, function(err, numAffected, rawResponse) {
							if (err) {
								return res.sendStatus(500);
							} else {
								return res.sendStatus(200);
							}
					});
				} else {
					return res.sendStatus(500);
				}
			});
		} else {
			return res.sendStatus(500);
		}
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
	res.send('this is how you delete a group. group: ' + req.params.group);
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
	return Group.findOne({ name: req.body.newgroupname }, function(err, result) {
		if (!err) {
			if (result != null) {
				return res.sendStatus(409);
			}

			var group = new Group();

			group.name = req.body.newgroupname;
			group.users = [ ];
			group.events = [ ];

			group.save(function(err) {
				if (err) {
					res.render("error", { message: "error in creating new group (creating group)", error: err } );
				} else {
					User.findByIdAndUpdate(req.session.passport.user, { $push: { groups: req.body.newgroupname} }, { select: "username" }, function(err, u) {
						if (!err) {
							Group.update( { name: req.body.newgroupname }, { $push: { users: u.username } }, {}, function(err, numAffected, rawResponse) {
								if (!err) {
									res.sendStatus(200);
								} else {
									res.render("error", { message: "error in creating new group (updating group)", error: err } );
								};
							});
						} else {
							res.render("error", { message: "error in creating new group (updating user)", error: err } );
						}
					});
				}
			});
		} else {
			return res.sendStatus(500);
		}
	});

});

module.exports = router;
