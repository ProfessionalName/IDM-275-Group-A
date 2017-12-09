'use strict';

var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');
var dbinfo = require('../Passwords/databaseinfo.json');

var con = mysql.createConnection(dbinfo);

var con = mysql.createConnection({
	connectionLimit : 20,
	host: 'localhost',
	user: 'root',
	password: 'homework5',
	database: 'english_made_easy'
});

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
		var str = "SELECT * FROM users WHERE username=" + con.escape(username)
		+  " AND password=" + con.escape(password) + ";";
		var self = this;
		console.log(str);
		con.query(str, function(err, rows, fields){
			if(err){
				console.log('Data Error');
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
		var str = "INSERT INTO users (username, password) VALUES (" + con.escape(username) + "," + con.escape(password) + ");";
		console.log(str);
		con.query(str, function(err, rows, fields){
			if (err){
				console.log("User exists");
			}else{
				console.log("User added successfully to the database");
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