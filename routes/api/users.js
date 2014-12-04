var express = require('express');
var router = express.Router();

var User = require('../../schemas/user');

//router.param('user', /^[A-Za-z0-9]\w{4,}$/);
//router.param('group', /^[A-Za-z0-9]\w{2,}$/);

// get a user's details
router.post('/invite', function(req, res)
{
	res.send('this is how you invite a new user. email: ' + req.body.emailaddress);
});

// get a user's details
router.get('/:user', function(req, res)
{
	res.send('this is how you see a user\'s details. user: ' + req.params.user);
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
	var db = req.db;
	var user = db.users.find( { name: req.params.user } );
	var groups = user.groups;

	res.send(groups);
	
	//res.send('this is how you view a list of all groups associated with a user. user: ' + req.params.user);

});

// delete user's groups
router.delete('/:user/groups', function(req, res)
{
	res.send('this is how you dissassociate a user from all groups. user: ' + req.params.user);
});

// get a list of users
router.get('/', function(req, res)
{
    //var db = req.db;
    //var collection = db.get('users');
    //collection.find({},{},function(e,docs){
    //    res.render('userlist', {
    //        "userlist" : docs
    //    });
    //});
    return User.find(function (err, users) {
        if (!err) {
            return res.send(users);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });

//	res.send('this is how you see all the users.');
});

// get to add a new user
router.post('/', function(req, res)
{
    var user = new User();
    user.username = req.body.username;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save(function(err) {
        if (err) res.send(err);

        res.json({message: 'user ' + user.username + ' added!'});
    });
});


module.exports = router;
