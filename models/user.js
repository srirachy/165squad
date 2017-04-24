var bcrypt = require('bcryptjs');
var db = require('../db.js');

exports.createUser = function(newUser, done) {
	const saltRounds = 10;
	var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(newUser.password, salt);

	// values to insert
	var values = [newUser.firstname, newUser.lastname, newUser.email, hash]
 	db.get().query('INSERT INTO User (FirstName, LastName, Email, Password) VALUES(?, ?, ?, ?)', values, function(err, result) {
		if (err) return done(err)
    	done(null, result.insertId)
	})
}

exports.getUserByUsername = function(username, done){
	db.get().query('SELECT * FROM User WHERE Email = ?', username, function (err, rows) {
    	if (err) return done(err)
    	done(null, rows[0])
  	})
}

exports.getUserById = function(id, done){
	db.get().query('SELECT * FROM User WHERE UserKey = ?', id, function (err, rows) {
    	if (err) return done(err)
    	done(null, rows[0])
  	})
}

exports.update = function(params, done){
	db.get().query('UPDATE ' + params.table + ' SET ? WHERE ?', [params.set, params.where], function (err, rows) {
    	if (err) return done(err)
    	done(null, rows)
  	})
}

exports.select = function(params, done){
	db.get().query('SELECT * FROM ' + params.from + ' WHERE ?', params.where, function (err, rows) {
    	if (err) return done(err)
    	done(null, rows)
  	})
}

exports.insert = function(params, done){
	db.get().query('INSERT INTO ' + params.into + ' SET ?', params.values, function (err, rows) {
    	if (err) return done(err)
    	done(null, rows.insertId);
  	})
}

exports.delete = function(params, done){
	db.get().query('DELETE FROM ' + params.from + ' WHERE ?', params.where, function (err, rows) {
    	if (err) return done(err)
    	done(null, rows)
  	})
}

exports.getCategories = function(params, done){
  db.get().query('SELECT * FROM ' + params.from, function (err, rows) {
      if (err) return done(err)
      done(null, rows)
    })
}

exports.getFeed = function(params, done){
  db.get().query('SELECT * FROM ' + params.from, function (err, rows) {
      if (err) return done(err)
      done(null, rows)
    })
}


exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
