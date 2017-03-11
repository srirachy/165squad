var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
   res.render('root', { title: 'PinPin'});
  /*res.redirect('/users/login');*/
});

module.exports = router;
