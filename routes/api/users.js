var express = require('express');
var router = express.Router();
var passport = require('passport');

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

//router.param('user', /^[A-Za-z0-9]\w{4,}$/);
//router.param('group', /^[A-Za-z0-9]\w{2,}$/);

// get a user's details
router.post('/invite', isAuthenticated, function(req, res)
{
    res.send('this is how you invite a new user. email: ' + req.body.emailaddress);
});

// get a user's details
router.get('/:user', isAuthenticated, function(req, res)
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
router.post('/:user/groups/:group', isAuthenticated, function(req, res)
{
    res.send('this is how you associate a user with a group. user: ' + req.params.user + ', group: ' + req.params.group);
});

// delete user's group
router.delete('/:user/groups/:group', isAuthenticated, function(req, res)
{
    res.send('this is how you dissassociate a user from a group. user: ' + req.params.user + ', group: ' + req.params.group);
});

// get a list of a user's groups
router.get('/:user/groups', isAuthenticated, function(req, res)
{
//	User.findOne( { username: req.params.user } ).exec( function(err, result) {
//		if (!err) {
//			res.json(result.groups);
//		} else {
//			res.render("error");
//		};
//	});
    var db = req.db;
    var user = db.users.find( { name: req.params.user } );
    var groups = user.groups;

    res.send(groups);
});

// delete user's groups
router.delete('/:user/groups', isAuthenticated, function(req, res)
{
    res.send('this is how you dissassociate a user from all groups. user: ' + req.params.user);
});

// get a list of users
router.get('/', isAuthenticated, function(req, res)
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
