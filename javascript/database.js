'use strict';

var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');
var dbinfo = require('../Passwords/databaseinfo.json');

var con = mysql.createConnection(dbinfo);

con.connect(function(err){
	if (err) {
		console.log('Error connecting to database');
	}else {
		console.log('Database successfully connected');
	}
});

class Database extends EventEmitter{

	constructor(){
		super();
	};

	login(username,password){
		var str = "SELECT type FROM users WHERE username=" + con.escape(username)
		+  "AND password=" + con.escape(password) + ")";
		var self = this;
		con.query(str, function(err, rows, fields){
			if(err){
				console.log('Error');
				return 0;
			}else{
				if(rows.length>0)
					self.emit('loggedin',1);
				else
					self.emit('loggedin',0);
			}
		});
	}

	signup(username, password) {
		var str = "INSERT INTO users VALUES ('" + con.escape(username) + "','" + con.escape(password) + "')";
		var self = this;
		con.query(_query, function(err, rows, fields){
			if (err){
				console.log("Error");
				return 0;
			}else{
				self.emit('usertable', rows);
			}
		});

	}

	getUserTable(){
		var str = 'SELECT username, type FROM users order by username';
		var self = this;
		con.query(str, function(err, rows, fields){
			if(err){
				console.log('Error');
				return 0;
			}else{
				self.emit('usertable',rows);
			}
		});
	}

	getQuestions(){
		var _query = 'Select * from questions';
		var self = this;
		con.query(_query, function(err, rows, fields){
			if (err){
				console.log("Error");
				return 0;
			}else{
				self.emit('questionsTable', rows);
			}
		});
	}

}

exports.database = Database;