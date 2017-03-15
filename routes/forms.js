var express = require('express');
var router = express.Router();

router.get('/board', function(req, res, next) {
  res.render('forms/frm_board', {layout: 'forms_layout.hbs'});
});

module.exports = router;
