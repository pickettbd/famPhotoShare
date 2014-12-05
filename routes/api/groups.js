var express = require('express');
var router = express.Router();

var User = require('../../schemas/user');
var Group = require('../../schemas/group');

//router.param('group', /^[A-Za-z0-9]\w{2,}$/);
//router.param('event', /^[A-Za-z0-9]\w{2,}$/);
//router.param('user', /^[A-Za-z0-9]\w{4,}$/);

// view event's details
router.get('/:group/events/:event', function(req, res)
{
	res.send('this is how you get the details of an event. group: ' + req.params.group + ', event: ' + req.params.event);
});

// add new event
//router.post('/:group/events/:event', function(req, res)
router.post('/:group/events', function(req, res)
{
//	var db = req.db;
//    	var group = req.params.group;
//	var event = req.params.event;
//	    
//    	var collection = db.get('events');
//
//	collection.insert({
//        'name' : event, 
//	'group' : group // foreign key 
//    });

	// close db ?? 
});

// delete event
router.delete('/:group/events/:event', function(req, res)
{
	res.send('this is how you delete an event.  group: ' + req.params.group + ', event: ' + req.params.event);
});

// get thumbs
router.get('/:group/events/:event/thumbs', function(req, res)
{
	res.send('this is how you get an events thumbnails.  group: ' + req.params.group + ', event: ' + req.params.event);
});

// upload photo(s) to an event
//router.post('/:group/events/:event/photos/:photo', function(req, res)
router.post('/:group/events/:event/photos', function(req, res)
{
	res.send('this is how you add photo(s) to an event.  group: ' + req.params.group + ', event: ' + req.params.event);
//    	var db = req.db;
//	var group = req.params.group;
//	var event = req.params.event;
//	var photo = req.params.photo;
//
//	// how to organize collections ?? Need to have foreign keys? 
//    	var collection = db.get('photos');
//
//// http://stackoverflow.com/questions/11568587/store-images-in-mongodb-serve-them-with-nodejs
//	var base64Data = imagefile.replace(/^data:image\/png;base64,/,""), // ?? 
//	var dataBuffer = new Buffer(base64Data, 'base64');
//
//	collection.insert({
//		'group' : group, // foreign key
//		'event' : event, // foreign key
//		file_name : photo,
//		image : dataBuffer.toString()
//	});
//
	// close db ?? 
});

// download photo from an event
router.get('/:group/events/:event/photos/:photo', function(req, res)
{
	res.send('this is how you download a photo from an event.  group: ' + req.params.group + ', event: ' + req.params.event + ', photo: ' + req.params.photo);
});

// download all photos from an event
router.get('/:group/events/:event/photos', function(req, res)
{
	res.send('this is how you download all photos from an event.  group: ' + req.params.group + ', event: ' + req.params.event);
});

// upload photos to an event
router.post('/:group/events/:event/photos', function(req, res)
{
    var event = null;
    event.photos = req.body.photos;

    event.save(function(err) {
         if (err) res.send(err);
	 res.location("menu");
	 res.redirect("menu");
    });
    res.send('this is how you upload photos to an event.  group: ' + req.params.group + ', event: ' + req.params.event);
	
});

// delete photo from an event
router.delete('/:group/events/:event/photos/:photo', function(req, res)
{
	res.send('this is how you delete a photo from an event.  group: ' + req.params.group + ', event: ' + req.params.event + ', photo: ' + req.params.photo);
});

// delete all photos from an event
router.delete('/:group/events/:event/photos', function(req, res)
{
	res.send('this is how you delete all photos from an event.  group: ' + req.params.group + ', event: ' + req.params.event);
});

// view list of all group's events
router.get('/:group/events', function(req, res)
{
	res.send('this is how you see a list of all a group\'s events.  group: ' + req.params.group);
});

// add a user to the group
router.post('/:group/users/:user', function(req, res)
{
    User.update( { username: req.params.user }, { $push: { groups: req.params.group } }, function(err, numAffected, rawResponse) {
        if (err) {
        	res.render("error");
        };
    });

    Group.update( { name: req.params.group }, { $push: { users: req.params.user } }, {}, function(err, numAffected, rawResponse) {
        if (err) {
        	res.render("error");
        } else {
        	res.send("success");
        };
    });
});

// delete user from the group
router.delete('/:group/users/:user', function(req, res)
{
	res.send('this is how you remove a user from a group. group: ' + req.params.group + ', user: ' + req.params.user);
});

// delete all users from the group
router.delete('/:group/users', function(req, res)
{
	res.send('this is how you remove all users from a group. group: ' + req.params.group);
});

// see a list of all the group's users 
router.get('/:group/users', function(req, res)
{
	Group.findOne( { name: req.params.group } ).exec( function(err, result) {
		if (!err) {
			res.json(result.users);
		} else {
			res.render("error");
		};
	});
});

// view group's details
router.get('/:group', function(req, res)
{
	Group.findOne( { name: req.params.group } ).exec( function(err, result) {
		if (!err) {
			res.json(result);
		} else {
			res.render("error");
		};
	});
});

// delete group
router.delete('/:group', function(req, res)
{
	res.send('this is how you delete a group.  group: ' + req.params.group);
});

// see list of all groups
router.get('/', function(req, res)
{
	Group.find(function(err, result) {
		if (!err) {
			names = []
			for (group in result) {
				names.push(group.name);
			}
			res.json(names);
		} else {
			res.render("error");
		};
	});
});

// create new group
router.post('/', function(req, res)
{
	res.send('this is how you create a new group.');

//    	var db = req.db;
//    	var group = req.params.group;
//	    
//    	var collection = db.get('groups');
//
//	collection.insert({
//        'name' : group
//    	});

	// close db ?? 
});

module.exports = router;
