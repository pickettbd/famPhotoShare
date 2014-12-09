var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
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

//router.param('user', /^[A-Za-z0-9]\w{4,}$/);
//router.param('group', /^[A-Za-z0-9]\w{2,}$/);

// invite a new user
router.post('/invite', isAuthenticated, function(req, res)
{
	return emailTemplates(emailTemplatesDir, function(err, template) {
		if (!err) {
			return User.findOne( { _id: req.session.passport.user } ).exec( function(err, result) {
				if (!err) {
					var mailTransporter = req.mailTransporter;
					
					var locals = {
						referrername: result.name,
						email: req.body.emailaddress,
						title: "Invitation email"
					};

					return template("inviteNewUser", locals, function(err, html, text) {
						if (!err) {
							return mailTransporter.sendMail(
								{
									from: "welcome@104.236.25.185",
									to: locals.email,
									subject: "You're invited!",
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
});

// get a usernmae of logged in
router.get('/whoami', isAuthenticated, function(req, res)
{
    User.findOne( { _id: req.session.passport.user } ).exec( function(err, result) {
        if (!err) {
            res.send(result.username);			
        } else {
            res.render("error");
        }
    });
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

// delete user's group
router.delete('/:user/groups/:group', isAuthenticated, function(req, res)
{
    res.send('this is how you dissassociate a user from a group. user: ' + req.params.user + ', group: ' + req.params.group);
});

// get a list of a user's groups
router.get('/:user/groups', isAuthenticated, function(req, res)
{
	User.findOne( { username: req.params.user } ).exec( function(err, result) {
		if (!err) {
			res.json(result.groups);
		} else {
			res.render("error");
		};
	});
});

// delete user's groups
router.delete('/:user/groups', isAuthenticated, function(req, res)
{
    res.send('this is how you dissassociate a user from all groups. user: ' + req.params.user);
});

// get a list of users
router.get('/', isAuthenticated, function(req, res)
{
    User.find(function (err, result) {
        if (!err) {
            names = []
	    for (i = 0; i < result.length; i++) {
		names.push(result[i].username);
	    }
	    res.json(names);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
            res.send({ error: 'Server error' });
        }
    });
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
    successRedirect: '/welcome',
    failureRedirect: '/sign-up',
    failureFlash : true 
}));

module.exports = router;
