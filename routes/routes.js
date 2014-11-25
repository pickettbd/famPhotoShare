var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
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

module.exports = router;
