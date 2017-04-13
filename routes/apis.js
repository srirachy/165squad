var express = require('express');
var router = express.Router();
var async = require('async');
var imageHelper = require('../helpers/imageHelper');
var path = require('path');
var fs = require('fs');
var request = require('request');
var multer = require('multer');
var upload = multer({dest: __dirname + '/../public/uploads/Pins'});

var User = require('../models/user');

var profilePicturesDir = path.join(__dirname, '../public/uploads/ProfilePictures/');
var pinsDir = path.join(__dirname, '../public/uploads/Pins/');

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

//Delete user
router.post('/users/delete', function(req, res) {
	var params = {from: 'User', where:{UserKey: req.user.UserKey}};
	async.series([function(callback){
		User.delete(params,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	}], function(err, results){
		res.redirect('/users/logout');
	});
});

//Upload Pin
router.post('/uploadPin', upload.any(), function(req, res){
	var pinKey = '';
	var params = {into: 'Pin', values: [{URL: 'localhost:3000/api/content/' + req.files[0].filename}]};
	async.series([function(callback){
		User.insert(params,function(err, result){
			if(err) throw err;
			pinKey = result;
			callback(null, result);
		});
	},function(callback){
		params = {into: 'BoardPin', values: [{PinKey: pinKey, BoardKey: req.body.boardKey, Tags: req.body.tags}]};
		User.insert(params,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	}
	], function(err, results){
		
		res.json(results[1]);
	});
	
});

router.get('/content/:file', function(req, res){
  var file = req.params.file;
  var data = fs.readFileSync(pinsDir + file);
  // var img = new Buffer(data).toString('base64');

  // res.writeHead(200, {'Content-Type': 'image/png' });
  res.end(data);
});


module.exports = router;
