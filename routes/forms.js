var express = require('express');
var router = express.Router();

router.get('/board', function(req, res, next) {
  res.render('forms/frm_board', {layout: 'forms_layout.hbs'});
});

router.get('/addPin', function(req, res, next) {
  res.render('forms/frm_addPin', {layout: 'forms_layout.hbs'});
});

router.get('/addFromDevice', function(req, res, next) {
  res.render('forms/frm_addFromDevice', {layout: 'forms_layout.hbs'});
});

router.get('/cropPicture', function(req, res, next) {
  res.render('forms/frm_cropPicture', {layout: 'forms_layout.hbs'});
});

router.get('/viewPin', function(req, res, next) {
  res.render('forms/frm_viewPin', {layout: 'forms_layout.hbs'});
});

router.get('/addPinFromExisting', function(req, res, next) {
  res.render('forms/frm_addPinFromExisting', {layout: 'forms_layout.hbs'});
});



module.exports = router;
