var express = require('express');
var router = express.Router();

/* auth. */
router.get('/', function(req, res) {
  res.send('this is the auth route');
});

module.exports = router;
