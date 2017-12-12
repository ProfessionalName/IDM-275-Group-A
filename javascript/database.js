'use strict';

var EventEmitter = require('events').EventEmitter;
var mysql = require('mysql');
var dbinfo = require('../Passwords/databaseinfo.json');

var con = mysql.createConnection(dbinfo);
var con = mysql.createConnection({
	connectionLimit : 20,
	host: 'localhost',
	user: 'root',
	password: 'sqlroot80',
	database: 'final2'
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

		var _iq2 = "INSERT INTO scoreboard (username, total_score, level1_score, level2_socre, level3_score, level4_score, level5_score) VALUES ('" + username + "', 0, 0, 0, 0, 0, 0);"
		console.log(_iq2);
		con.query(_iq2, function(err, rows, fields){
			if (err){
				console.log("There was an error while inserting initial score (0)");
			}else{
				console.log("User added successfully to the scoreboard");
			}
		})

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

	updateScore(user, score, level){
		var levelString;
		if (level == 1){
			levelString = 'level1_score'
		} else if (level == 2){
			levelString = 'level2_socre'
		} else if (level == 3){
			levelString = 'level3_score'
		} else if (level == 4){
			levelString = 'level4_score'
		} else if (level == 5){
			levelString = 'level5_score'
		} else if (level == -1){
			levelString = 'total_score'
		}
		var _query = "Update scoreboard set " + levelString + " = " + score + " where username ='" + user + "'";
		console.log(_query);
		var self = this;
		con.query(_query, function(err, rows, fields){
			if (err){
				console.log("There was an error while updating user score");
			}else{
				self.emit('updatedUserScore');
			}
		})


	}

	updateTotalScore(user){
		var _query = "Select * from scoreboard where username ='" + user + "'";
		console.log(_query);
		var self = this;
		con.query(_query, function(err, rows, fields){
			if (err){
				console.log("There was an error while updating total score");
			}else{
				console.log(rows);
				var totalScore = rows[0].total_score; 
				var level1 = rows[0].level1_score;
				var level2 = rows[0].level2_socre;
				var level3 = rows[0].level3_score;
				var level4 = rows[0].level4_score;
				var level5 = rows[0].level5_score; 

				var newTotalScore = level1 + level2 + level3 + level4 + level5;
				if (newTotalScore > totalScore){
					_query = "Update scoreboard set total_score = " + newTotalScore + " where username ='" + user + "'";
					console.log(_query);
					con.query(_query, function(err, rows, fields){
						if (err){
							console.log("There was an error while updating total user score");
						}
					})
				}

				self.emit('updatedTotalScore');
			}
		})
	}


	advanceLevelCheck(user, score, level){
		console.log("ADVANCE LEVEL CHECK")
		var self = this;
		var levelString;
		if (level == 1){
			levelString = 'level1_score'
		} else if (level == 2){
			levelString = 'level2_socre'
		} else if (level == 3){
			levelString = 'level3_score'
		} else if (level == 4){
			levelString = 'level4_score'
		} else if (level == 5){
			levelString = 'level5_score'
		}
		
		var _query = "Select " + levelString +" from scoreboard where username ='" + user + "'";
		console.log(_query);

		var isAdvance = false;

		con.query(_query, function(err, rows, fields){
			if (err){
				console.log("There was an error while checking level advancement");
			}else{
					if (level == 1){
						if (rows[0].level1_score > 2){
							isAdvance = true;
						} 
					} else if (level == 2){
						if (rows[0].level2_socre > 5){
							isAdvance = true;
						} 
					} else if (level == 3){
						if (rows[0].level3_score > 8){
							isAdvance = true;
						} 
					} else if (level == 4){
						if (rows[0].level4_score > 11){
							isAdvance = true;
						} 
					} else if (level == 5){
						if (rows[0].level3_score > 14){
							isAdvance = true;
						} 
					}
					self.emit('advance', isAdvance);
			}
		})

	}


	advanceLevel(user, level){
			// var nextLevel = parseInt(level) + 1;
			// if (parseInt(level) == 1){
			// 	nextLevel = 1;
			// }
			var _query2 = "Update users set level = " + level + " where username ='" + user + "'";
			console.log(_query2);

			con.query(_query2, function(err, rows, fields){
			if (err){
				console.log("There was an error while advancing level");
			}
		})
	}



}

exports.database = Database;
