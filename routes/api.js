var express = require('express');
var router = express.Router();

var groups = require('./api/groups');
var users = require('./api/users');

router.use('/groups', groups);
router.use('/users', users);

// api instructions
router.get('/', function(req, res)
{
	res.render('api', {
		title: "famPhotoShare API",
		navbar: 'false'
	});
});

module.exports = router;
