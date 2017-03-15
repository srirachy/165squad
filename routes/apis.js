var express = require('express');
var router = express.Router();
var async = require('async');
var imageHelper = require('../helpers/imageHelper');
var path = require('path');
var fs = require('fs');
var request = require('request');

var User = require('../models/user');

var profilePicturesDir = path.join(__dirname, '../public/uploads/ProfilePictures/');

//Helper function to get boards
function getBoards(userKey, done){
	User.select({from: 'Board', where:{UserKey: userKey}},function(err, result){
		if(err) throw err;
		done(null, result);
	});
};
//Get boards
router.get('/boards', function(req, res) {
  	var promises = [new Promise(function(resolve, reject){
		getBoards(req.user.UserKey,function(err, result){
			if(err) throw err;
			resolve(result);
		});
	})
	];
	Promise.all(promises).then(function(results){
		res.json(results[0]);
	});
});

//Create new board
router.post('/boards', function(req, res) {
	var body = req.body;
	var params = {into: 'Board', values: [{UserKey: req.user.UserKey, Name: body.Name,
		Description: body.Description, Category: body.Category, Private: body.Private}]};
	async.series([function(callback){
		User.insert(params,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	},function(callback){
		getBoards(req.user.UserKey,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	}
	], function(err, results){
		res.json(results[1]);
	});
});

// Update board
router.put('/boards', function(req, res) {
	var body = req.body;
	var params = {table:'Board', 
		set:{Name: body.Name, Description: body.Description, Category: body.Category, Private: body.Private}, 
		where: {BoardKey: body.BoardKey}};

	async.series([function(callback){
		User.update(params,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	},function(callback){
		getBoards(req.user.UserKey,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	}
	], function(err, results){
		res.json(results[1]);
	});
});

//Delete board
router.post('/boards/delete', function(req, res) {
	var params = {from: 'Board', where:{BoardKey: req.body.BoardKey}};
	async.series([function(callback){
		User.delete(params,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	},function(callback){
		getBoards(req.user.UserKey,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	}
	], function(err, results){
		res.json(results[1]);
	});
});

//Get categories
router.get('/categories', function(req, res) {
  	var promises = [new Promise(function(resolve, reject){
		User.getCategories({from: 'BoardCategory'},function(err, result){
			if(err) throw err;
			resolve(result);
		});
	})
	];
	Promise.all(promises).then(function(results){
		res.json(results[0]);
	});
});

module.exports = router;
