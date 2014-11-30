var express = require('express');
var router = express.Router();

//router.param('user', /^[A-Za-z0-9]\w{4,}$/);
//router.param('group', /^[A-Za-z0-9]\w{2,}$/);

// get a user's details
router.get('/:user', function(req, res)
{
	res.send('this is how you see a user\'s details. user: ' + req.params.user);
});

// add a user
router.post('/:user', function(req, res)
{
	res.send('this is how you add a user.  user: ' + req.params.user);
});

// add user's group
router.post('/:user/groups/:group', function(req, res)
{
	res.send('this is how you associate a user with a group. user: ' + req.params.user + ', group: ' + req.params.group);
});

// delete user's group
router.delete('/:user/groups/:group', function(req, res)
{
	res.send('this is how you dissassociate a user from a group. user: ' + req.params.user + ', group: ' + req.params.group);
});

// get a list of a user's groups
router.get('/:user/groups', function(req, res)
{
	res.send('this is how you view a list of all groups associated with a user. user: ' + req.params.user);
});

// delete user's groups
router.delete('/:user/groups', function(req, res)
{
	res.send('this is how you dissassociate a user from all groups. user: ' + req.params.user);
});

// get a list of users
router.get('/', function(req, res)
{
	res.send('this is how you see all the users.');
});

module.exports = router;