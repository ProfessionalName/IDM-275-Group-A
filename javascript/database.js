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

	addQuestion(question){
		var _query = "Insert into questions values('"  + question.Question + "','" + question.Option1 + "','" + question.Option2 + "','" + question.Option3 + "','"
			 + question.Option4 + "','" +  question.Answer + "'," +  question.Level +  ")";
		console.log(_query);
		con.query(_query, function(err, rows, fields){
			if (err){
				console.log("There was an error while adding new question to the database!");
			}else{
				console.log("Question added successfully to the database");
			}
		});
	}

	deleteQuestion(question){
		var _query = "Delete from questions where question='" + question.Question + "'";
		console.log(_query);
		con.query(_query, function(err, rows, fields){
			if (err){
				console.log("There was an error while deleting the question");
			}else{
				console.log("Question deleted successfully to the database");
			}
		});
	}

	updateQuestion(question){
		var _query = "Update questions set question ='" + question.Question + "', option1 ='" + question.Option1 + "', option2 ='" + question.Option2
			+ "', option3 ='" + question.Option3 + "', option4 ='" + question.Option4 + "', answer ='" + question.Answer + "', level=" + question.Level 
			+ " where question = '" + question.previousQuestion + "'";
		console.log(_query);
		con.query(_query, function(err, rows, fields){
			if (err){
				console.log("There was an error while updating the question");
			}else{
				console.log("Question updated successfully to the database");
			}
		});
	}

}

exports.database = Database;