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

/* GET userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

module.exports = router;
