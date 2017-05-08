var express = require('express');
var router = express.Router();
var async = require('async');
var imageHelper = require('../helpers/imageHelper');
var path = require('path');
var fs = require('fs');
var request = require('request');
var multer = require('multer');
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');
var bcrypt = require('bcryptjs');


// Amazon S3 Stuff
aws.config.loadFromPath('./config.json');
aws.config.update({
	signatureVersion: 'v4'
});
var s3 = new aws.S3({});
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'pinpin-uploads',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});
// END Amazon s3 stuff



var User = require('../models/user');

var profilePicturesDir = path.join(__dirname, '../public/uploads/ProfilePictures/');
var pinsDir = path.join(__dirname, '../public/uploads/Pins/');


//Helper function to get boards
function getBoards(userKey, done){
	User.select({from: 'vUserBoards', where:{UserKey: userKey}},function(err, result){
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

//Get boards other Profile
router.get('/boards/:userKey', function(req, res) {
	var userKey = req.params.userKey;
  	var promises = [new Promise(function(resolve, reject){
		getBoards(userKey,function(err, result){
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
	var f = req.files[0];
	var pinKey = '';
	var params = {into: 'Pin', values: [{URL: f.location, FileKey: f.key, OriginalFileName: f.originalname, FileType: f.mimetype}]};
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

//Get user pins
router.get('/userPins', function(req, res) {
  	var promises = [new Promise(function(resolve, reject){
		User.select({from: 'vUserPins', where:{UserKey: req.user.UserKey}},function(err, result){
			if(err) throw err;
			resolve(result);
		});
	})
	];
	Promise.all(promises).then(function(results){
		res.json(results[0]);
	});
});

//Get user pins other profile
router.get('/userPins/:userKey', function(req, res) {
	var userKey = req.params.userKey;
  	var promises = [new Promise(function(resolve, reject){
		User.select({from: 'vUserPins', where:{UserKey: userKey}},function(err, result){
			if(err) throw err;
			resolve(result);
		});
	})
	];
	Promise.all(promises).then(function(results){
		res.json(results[0]);
	});
});

//Get user feed
router.get('/feed', function(req, res) {
  	var promises = [new Promise(function(resolve, reject){
		User.getFeed({UserKey: req.user.UserKey},function(err, result){
			if(err) throw err;
			resolve(result);
		});
	})
	];
	Promise.all(promises).then(function(results){
		res.json(results[0]);
	});
});

//Get user info
router.get('/userInfo', function(req, res) {
  	var promises = [new Promise(function(resolve, reject){
		User.select({from: 'vUserInfo', where:{UserKey: req.user.UserKey}},function(err, result){
			if(err) throw err;
			resolve(result);
		});
	})
	];
	Promise.all(promises).then(function(results){
		res.json(results[0][0]);
	});
});

//Get user info other Profile
router.get('/userInfo/:userKey', function(req, res) {
	var userKey = req.params.userKey;
  	var promises = [new Promise(function(resolve, reject){
		User.select({from: 'vUserInfo', where:{UserKey: userKey}},function(err, result){
			if(err) throw err;
			resolve(result);
		});
	})
	];
	Promise.all(promises).then(function(results){
		res.json(results[0][0]);
	});
});


//Edit Account
router.post('/editAccount', upload.any(), function(req, res){
	var f = {location: ''};
	if(typeof req.files[0] != 'undefined'){
		f = req.files[0];
	}
	var u = req.body;

	var params = {table:'User', 
		set:{FirstName: u.FirstName, LastName: u.LastName, Email: u.Email}, 
		where: {UserKey: req.user.UserKey}};
	if(u.PasswordChanged != 'false'){
		const saltRounds = 10;
		var salt = bcrypt.genSaltSync(saltRounds);
		var hash = bcrypt.hashSync(u.Password, salt);
		params.set.Password = hash;
	}
	if(u.PictureChanged != 'false'){
		params.set.ProfilePicture = f.location;
	}

	async.series([function(callback){
		User.update(params,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	},function(callback){
		User.getUserById(req.user.UserKey,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	}
	], function(err, results){
		
		res.json(results[1]);
	});
	
});

//Create follower
router.post('/follow', function(req, res) {
	var body = req.body;
	var params = {into: 'UserFollower', values: [{FromUserKey: req.user.UserKey, ToUserKey: body.UserKey}]};
	async.series([function(callback){
		User.insert(params,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	},function(callback){
		User.select({from: 'vUserFollowing', where:{UserKey: req.user.UserKey}},function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	}
	], function(err, results){
		res.json(results[1]);
	});
});

//Delete follower
router.post('/unfollow', function(req, res) {
	var body = req.body;
	var params = {from: 'UserFollower', FromUserKey: req.user.UserKey, ToUserKey: body.UserKey};

	async.series([function(callback){
		User.deleteFollower(params,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	},function(callback){
		User.select({from: 'vUserFollowing', where:{UserKey: req.user.UserKey}},function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	}
	], function(err, results){
		res.json(results[1]);
	});
});


//Get board pins
router.post('/boardPins', function(req, res) {
  	var promises = [new Promise(function(resolve, reject){
		User.getBoardPins({from: 'vUserPins', BoardKey: req.body.BoardKey},function(err, result){
			if(err) throw err;
			resolve(result);
		});
	})
	];
	Promise.all(promises).then(function(results){
		res.json(results[0]);
	});
});

//Get followers
router.get('/getFollowers', function(req, res) {
  	var promises = [new Promise(function(resolve, reject){
		User.select({from: 'vUserFollowers', where:{UserKey: req.user.UserKey}},function(err, result){
			if(err) throw err;
			resolve(result);
		});
	})
	];
	Promise.all(promises).then(function(results){
		res.json(results[0]);
	});
});


//Get followers other Profile
router.get('/getFollowers/:userKey', function(req, res) {
	var userKey = req.params.userKey;
  	var promises = [new Promise(function(resolve, reject){
		User.select({from: 'vUserFollowers', where:{UserKey: userKey}},function(err, result){
			if(err) throw err;
			resolve(result);
		});
	})
	];
	Promise.all(promises).then(function(results){
		res.json(results[0]);
	});
});



//Get followers
router.get('/getFollowings', function(req, res) {
  	var promises = [new Promise(function(resolve, reject){
		User.select({from: 'vUserFollowing', where:{UserKey: req.user.UserKey}},function(err, result){
			if(err) throw err;
			resolve(result);
		});
	})
	];
	Promise.all(promises).then(function(results){
		res.json(results[0]);
	});
});

//Get followers other Profile
router.get('/getFollowings/:userKey', function(req, res) {
	var userKey = req.params.userKey;
  	var promises = [new Promise(function(resolve, reject){
		User.select({from: 'vUserFollowing', where:{UserKey: userKey}},function(err, result){
			if(err) throw err;
			resolve(result);
		});
	})
	];
	Promise.all(promises).then(function(results){
		res.json(results[0]);
	});
});


// Is my connection
router.get('/followingsCheck/:FollowingUserKey', function(req, res) {
	var FollowingUserKey = req.params.FollowingUserKey;
  	var promises = [new Promise(function(resolve, reject){
		User.followingsCheck({from: 'vUserFollowing', UserKey: req.user.UserKey, FollowingUserKey: FollowingUserKey},function(err, result){
			if(err) throw err;
			resolve(result);
		});
	})
	];
	Promise.all(promises).then(function(results){
		res.json(results[0]);
	});
});

//Upload Pin
router.post('/addExistingPin', function(req, res){
	var body = req.body;
	var params = {into: 'BoardPin', values: [{PinKey: body.PinKey, BoardKey: body.BoardKey, Tags: body.tags}]};
	async.series([function(callback){
		User.insert(params,function(err, result){
			if(err) throw err;
			pinKey = result;
			callback(null, result);
		});
	}
	], function(err, results){
		
		res.json(results[0]);
	});
	
});


//Search Pin
router.post('/search', function(req, res){
	var searchValue = req.body.searchValue;
	var tokens = searchValue.split(" ");
	var len = tokens.length;

	var where = "";

	if(len > 0){
		where = where + "Tags like '%" + tokens[0] + "%' "

		for (var i = 1; i < len; i++) {
		        where = where + "OR Tags like'%" + tokens[i] + "%' "
		}
	}else{
		where = where + "Tags like '%" + "romposshkshosih" + "%' "
	}
	

	var params = {UserKey: req.user.UserKey, condition: where};

	async.series([function(callback){
		User.search(params,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	}
	], function(err, results){
		
		res.json(results[0]);
	});
	
});


//Search Boards
router.post('/searchBoards', function(req, res){
	var searchValue = req.body.searchValue;
	var tokens = searchValue.split(" ");
	var len = tokens.length;

	var where = "";

	if(len > 0){
		where = where + "Name like '%" + tokens[0] + "%' "

		for (var i = 1; i < len; i++) {
		        where = where + "OR Name like'%" + tokens[i] + "%' "
		}
		where = where + "OR Description like '%" + tokens[0] + "%' "

		for (var i = 1; i < len; i++) {
		        where = where + "OR Description like'%" + tokens[i] + "%' "
		}
		where = where + "OR Category like '%" + tokens[0] + "%' "

		for (var i = 1; i < len; i++) {
		        where = where + "OR Category like'%" + tokens[i] + "%' "
		}
	}else{
		where = where + "Name like '%" + "romposshkshosih" + "%' "
	}
	

	var params = {UserKey: req.user.UserKey, condition: where};

	async.series([function(callback){
		User.searchBoards(params,function(err, result){
			if(err) throw err;
			callback(null, result);
		});
	}
	], function(err, results){
		
		res.json(results[0]);
	});
	
});

module.exports = router;
