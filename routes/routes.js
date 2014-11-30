var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

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

/* GET photolist page. */
router.get('/photolist', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        res.render('photolist', {
            "photolist" : docs
        });
    });
});

/*GET to check user credentials*/
router.post('/checkuser', function(req, res) {
    
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var username = req.body.username;
    var pass = req.body.password;

    // Set our collection
    var collection = db.get('users');

    collection.find({userName:username},{},function(err,items){
        //This always returns true whether it is in the database or not
        if(items != null){
            res.location("menu");
            res.redirect("menu");
        };
    });

});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var confimrpass = req.body.confirmpass;

    // Set our collection
    var collection = db.get('users');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : email,
	"password" : password
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("menu");
            // And forward to success page
            res.redirect("menu");
        }
    });
});

module.exports = router;
