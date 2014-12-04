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
        successRedirect: '/menu',
        failureRedirect: '/',
        failureFlash : true 
    }));

    /* GET upload-landing page. */
    router.get('/upload-landing', function(req, res) {
        res.render('upload-landing', { title: 'Upload Landing' });
    });

    /* GET manage-groups page. */
    router.get('/manage-groups', function(req, res) {
        res.render('manage-groups', { title: 'Manage Groups' });
    });

    /* GET sign-up page. */
    router.get('/sign-up', function(req, res) {
        res.render('sign-up', { title: 'Sign Up' });
    });

    /* GET download page. */
    router.get('/download', function(req, res) {
        res.render('download', { title: 'Get Photos' });
    });

    /* GET upload page. */
    router.get('/upload', function(req, res) {
        res.render('upload', { title: 'Add Photos' });
    });

    /* GET menu page. */
    router.get('/menu', function(req, res) {
        res.render('menu', { title: 'Menu' });
    });

    /* GET home page. */
    router.get('/', function(req, res) {
        res.render('index', { title: 'Express' });
    });

    return router;
}
//module.exports = router;
