'use strict';

var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');
var dbinfo = require('../Passwords/databaseinfo.json');

var con = mysql.createConnection(dbinfo);
var con = mysql.createConnection({
	connectionLimit : 20,
	host: 'localhost',
	user: 'root',
<<<<<<< HEAD
	password: 'yunaanddawn12',
	database: 'english_made_easy'
=======
	password: 'sqlroot80',
	database: 'final2'
>>>>>>> e4d900c781a84fc1c11600a5a4f1c92da5b87aca
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

	login(username,password,req){
		var str = "SELECT * FROM users WHERE username=" + con.escape(username)
		+  " AND password=" + con.escape(password) + ";";
		var self = this;
		console.log(str);
		con.query(str, function(err, rows, fields){
			if(err){
				console.log('Data Error');
				return 0;
			}else{
				if(rows.length>0){
					req.session.level = rows[0].level;
					self.emit('loggedin',1);
				}
				else{
					self.emit('loggedin',0);
				}
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


	populateQuestions(level){
		var str = 'Select * from questions where level='+ level + ';';
		console.log(str);
		var self = this;
		con.query(str, function(err, rows, fields){
			if (err){
				console.log("Error fetching questions");
				return 0;
			}else{
				self.emit('questionsTable', rows);
			}
		});
	}


	getQuestions(){
		var _query = 'Select question from questions';
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

	storeDefinition(word, definition){
		var _query = "Insert into definitions values('" + word + "', '" + definition + "')";
		console.log(_query);
		con.query(_query, function(err, rows, fields){
			if (err){
				console.log("There was an error while adding the definition");
			}else{

			}
		});
	}

	getRandomWord(){
		var _randomNumber = Math.floor(Math.random() * 47);
		var _query = "Select * from definitions";
		console.log(_randomNumber);
		console.log(_query);
		var self = this;
		con.query(_query, function(err, rows, fields){
			if (err){
				console.log("There was an error while adding the definition");
			}else{
				var word = [];
				word.push({
					"word": rows[_randomNumber].word,
					"definition": rows[_randomNumber].definition
				});
				self.emit('gotWord', word);
			}
		});
	}

	getTopFiveScores(){
		var _query = "Select * from scoreboard order by total_score desc";
		console.log(_query);
		var self = this;
		con.query(_query, function(err, rows, fields){
			if (err){
				console.log("There was an error while fetching score");
			}else{
				self.emit('gotScores', rows);
			}
		});
	}

	getUserScore(user){
		var _query = "Select total_score from scoreboard where username ='" + user + "'";
		console.log(_query);
		var self = this;
		con.query(_query, function(err, rows, fields){
			if (err){
				console.log("There was an error while getting user score");
			}else{
				self.emit('gotUserScore', rows);
			}
		})
	}

}

exports.database = Database;
