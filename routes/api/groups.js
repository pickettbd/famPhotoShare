var express = require('express');
var router = express.Router();

//router.param('group', /^[A-Za-z0-9]\w{2,}$/);
//router.param('event', /^[A-Za-z0-9]\w{2,}$/);
//router.param('user', /^[A-Za-z0-9]\w{4,}$/);

// view event's details
router.get('/:group/events/:event', function(req, res)
{
	res.send('this is how you get the details of an event. group: ' + req.params.group + ', event: ' + req.params.event);
});

// add new event
router.post('/:group/events/:event', function(req, res)
{
	res.send('this is how you create a new event.  group: ' + req.params.group + ', event: ' + req.params.event);
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

// upload photo to an event
router.post('/:group/events/:event/photos/:photo', function(req, res)
{
	res.send('this is how you add a photo to an event.  group: ' + req.params.group + ', event: ' + req.params.event);
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
	res.send('this is how you add a user to the group.  group: ' + req.params.group + ', user: ' + req.params.user);
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
	res.send('this is how you see a list of all the group\'s users.  group: ' + req.params.group);
});

// view group's details
router.get('/:group', function(req, res)
{
	res.send('this is how you get the details of a group. group: ' + req.params.group);
});

// create new group
router.post('/:group', function(req, res)
{
	res.send('this is how you create a new event.  group: ' + req.params.group);
});

// delete group
router.delete('/:group', function(req, res)
{
	res.send('this is how you delete a group.  group: ' + req.params.group);
});

// see list of all groups
router.get('/', function(req, res)
{
	res.send('this is how you see a list of all groups.');
});

module.exports = router;
