var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../../schemas/user');
var Group = require('../../schemas/group');

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
    User.findOne( { username: req.params.user } ).exec( function(err, result) {
        if (!err) {
            res.json(result);			
        } else {
            res.render("error");
        };
    });
});

// add user's group
router.post('/:user/groups/:group', function(req, res)
{
    User.update( { username: req.params.user }, { $push: { groups: req.params.group } }, {}, function(err, numAffected, rawResponse) {
	if (err) {
		res.render("error");
	};
    });

    Group.update( { name: req.params.group }, { $push: { users: req.params.user } }, {}, function(err, numAffected, rawResponse) {
	if (err) {
		res.render("error");
	} else {
		res.send("sucess");
	};
    });
    
    //res.send('this is how you associate a user with a group. user: ' + req.params.user + ', group: ' + req.params.group);
});

// delete user's group
router.delete('/:user/groups/:group', function(req, res)
{
    res.send('this is how you dissassociate a user from a group. user: ' + req.params.user + ', group: ' + req.params.group);
});

// get a list of a user's groups
router.get('/:user/groups', function(req, res)
{
	User.findOne( { username: req.params.user } ).exec( function(err, result) {
		if (!err) {
			res.json(result.groups);
		} else {
			res.render("error");
		};
	});
    //var db = req.db;
    //var user = db.users.find( { name: req.params.user } );
    //var groups = user.groups;

    //res.send(groups);
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
            return res.json(users);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    });

//	res.send('this is how you see all the users.');
});

// post to add a new user
//router.post('/', function(req, res)
//{
//    var user = new User();
//    user.username = req.body.username;
//    user.email = req.body.email;
//    user.password = req.body.password;
//
//    user.save(function(err) {
//        if (err) res.send(err);
//
//        res.json({message: 'user ' + user.username + ' added!'});
//    });
//});

/* Handle User Registration POST */
router.post('/', passport.authenticate('signup', {
    successRedirect: '/menu',
    failureRedirect: '/sign-up',
    failureFlash : true 
}));

module.exports = router;
