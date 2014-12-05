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

module.exports = function(passport){

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/welcome',
        failureRedirect: '/',
        failureFlash : true 
    }));

    /* GET logout*/
    router.get('/logout', function(req, res) {
        res.logout();
        res.redirect('/');
    });

    /* GET upload-landing page. */
    router.get('/upload-landing', isAuthenticated, function(req, res) {
        res.render('upload-landing', {
			title: 'Upload Landing',
			navbar: 'true',
			navtab1: 'false',
			navtab2: 'false',
			navtab3: 'false'
		});
    });

    /* GET manage-groups page. */
    router.get('/manage-groups', isAuthenticated, function(req, res) {
        res.render('manage-groups', {
			title: 'Manage Groups',
			navbar: 'true',
			navtab1: 'false',
			navtab2: 'false',
			navtab3: 'true'
		});
    });

    /* GET sign-up page. */
    router.get('/sign-up', function(req, res) {
        res.render('sign-up', {
			title: 'Sign Up',
			navbar: 'false'
		});
    });

    /* GET download page. */
    router.get('/download', isAuthenticated, function(req, res) {
        res.render('download', {
			title: 'Get Photos',
			navbar: 'true',
			navtab1: 'false',
			navtab2: 'true',
			navtab3: 'false'
		});
    });

    /* GET upload page. */
    router.get('/upload', isAuthenticated, function(req, res) {
        res.render('upload', {
			title: 'Add Photos',
			navbar: 'true',
			navtab1: 'true',
			navtab2: 'false',
			navtab3: 'false'
		});
    });

    /* GET welcome page. */
    router.get('/welcome', isAuthenticated, function(req, res) {
        res.render('welcome', {
			title: 'Welcome',
			navbar: 'true',
			navtab1: 'false',
			navtab2: 'false',
			navtab3: 'false'
		});
    });

    /* GET home page. */
    router.get('/', function(req, res) {
        res.render('index', {
			title: 'Family Photo Share',
			navbar: 'false'
		});
    });

    return router;
}
//module.exports = router;
