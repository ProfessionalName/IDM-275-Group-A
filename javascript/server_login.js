var express = require('express');
var app = express();
var bodyParser = require("body-parser");

var database = require('./database');
var db = new database.database();

var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var utils = require('util');
var session = require('client-sessions');

var unirest = require('unirest');


app.use(session({
	cookieName: 'session',
	secret: 'asdfasdf23423',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
}));

app.use(express.static("."));
app.listen(8080);

//Setting up bodyParser to parse json
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// var wordsList = fs.readFileSync('../text/wordslist.txt', 'utf8').toString().split('\n');
// count = 0;
// size = wordsList.length;

// (function loop(){
// 	if (count < size){
// 		var word = wordsList[count];
// 		console.log(word);
// 		unirest.get("https://wordsapiv1.p.mashape.com/words/" + word + "/definitions")
// 			.header("X-Mashape-Key", "UWUobvwifNmshNmBfjDq7YBdeg52p1nKgHqjsn5ZA2Z5MnTRl6")
// 			.header("X-Mashape-Host", "wordsapiv1.p.mashape.com")
// 			.end(function (result){
// 				var definitions = result.body.definitions;
// 				var firstDefinition = definitions[0].definition;
// 				db.storeDefinition(word, firstDefinition);
// 				count++
// 				loop();
// 			});
// 	}
// }());


app.get('/getData', function (req, res){

	//req.session.level

	//{username: name , password: pass};
		// db.once('loggedin', function(msg){
		// 	console.log("levelCheck")
		// 	var toReturn = {username: req.session.userid, level: msg};

		// 	res.send(toReturn);
		// });

		// db.checkLevel(req.session.userid);

		var toReturn = {username: req.session.userid, level: req.session.level};

		res.send(toReturn);


});

app.get('/loginrender', function (req, res){

	var toReturn;
	if (req.session.userid) {
		toReturn = 'loggedin'
	} else {
		toReturn = fs.readFileSync('../text/login.txt','utf8');
	}
console.log('Rendering page');
res.send(toReturn);

});

app.get('/logout', function (req, res){

req.session.reset();

res.send();

});

app.get('/resetScore', function (req, res){

req.session.score = 0;

res.send();

});

app.post('/signup', function(req,res){

	var username = req.body.username;
	console.log(username);
	var password = req.body.password;
	console.log(password);

	db.signup(username, password);
});

app.post('/login', function (req, res){
	var username = req.body.username;
	console.log(username);
	var password = req.body.password;
	console.log(password);
	db.once('loggedin', function(msg){
		if(msg==1){
		req.session.userid=username;
		console.log(req.session.userid + "session");
		return res.redirect('/getUserpage');
		}
		else{
		req.session.msg = "Invalid login";
		res.send('login failed')
		}
		});

	db.login(username, password, req);

	});

app.get('/getUserpage', function(req,res){

	str="User logged in";
	res.send(str);
	console.log("logged in");

	});

app.get('/getQuestions', function(req, res){
	db.once('questionsTable', function(rows){
		var allQuestions = [];
		for (var i=0; i < rows.length; i++){
			allQuestions.push({
				"Question": rows[i].question,
				"Option1": rows[i].option1,
				"Option2": rows[i].option2,
				"Option3": rows[i].option3,
				"Option4": rows[i].option4,
				"Answer": rows[i].answer,
				"Level": rows[i].level,
			});
		};
		res.send(allQuestions);
	});
	db.getQuestions();
});

app.post('/addQuestion', function(req, res){
	var newQuestion = req.body;
	db.addQuestion(newQuestion);
});

app.post('/deleteQuestion', function(req, res){
	var question = req.body;
	db.deleteQuestion(question);
});

app.post('/updateQuestion', function(req, res){
	var question = req.body;
	db.updateQuestion(question);
});


app.get('/populateQuestions', function(req, res){
	var level = req.query.level;
	console.log(level);
	console.log("Connected");
	db.once('questionsTable', function(rows){
		var Questions = [];
		for (var i=0; i < rows.length; i++){
			Questions.push({
				Question: rows[i].question,
				option1: rows[i].option1,
				option2: rows[i].option2,
				option3: rows[i].option3,
				option4: rows[i].option4,
				option5: rows[i].answer,
			});
		};

		res.send(Questions);
		console.log(Questions);
	});
	db.populateQuestions(level);

})

app.get('/getWord', function(req, res){
	db.once('gotWord', function(msg){
		console.log(msg);
		res.send(msg);
	})
	db.getRandomWord();
});

app.get('/getScoreboard', function(req, res){
	db.once('gotScores', function(rows){
		var maxSize = 0;
		if (rows.length <= 5){
			maxSize = rows.length;
		}else{
			maxSize = 5;
		}
		var topFiveScore = [];
		for (var i = 0; i < maxSize; i++){
			topFiveScore.push({
				"Rank": i+1,
				"Username": rows[i].username,
				"Score": rows[i].total_score
			});
		}
		res.send(topFiveScore);
	});
	db.getTopFiveScores()
});

app.get('/getUserScore', function(req, res){
	var _user = req.query.user;
	db.once('gotUserScore', function(score){
		_userScore = score[0].total_score;
		res.send(_userScore.toString());
	})
	db.getUserScore(_user);
});

app.post('/updateUserScore', function(req, res){
	var _user = req.session.userid;
	var _level = req.body.level;
	console.log("Session1: " + req.session.score);
	if(typeof req.session.score !== 'undefined'){
		req.session.score = parseInt(req.session.score) + parseInt(req.body.score);
		console.log("Session2: " + req.session.score);
	}else {
		req.session.score = 0 + parseInt(req.body.score);
		console.log("Session3: " + req.session.score);
	}
	var _score = req.session.score;
	console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	console.log(_user);
	console.log(_score);
	console.log(_level);
	db.once('updatedUserScore', function(){
		db.once('updatedTotalScore', function(){
			res.send();
		})

		db.updateTotalScore(_user);
	
	})
	db.updateScore(_user, _score, _level);
});


app.post('/advance', function(req, res){
	var _user = req.session.userid;
	var _score = req.session.score;
	var _level = req.body.level;

	console.log(_user);
	console.log(_score);
	console.log(_level);


	db.once('advance', function(bol){

	if(bol){

	db.once('advance2', function(){
		res.send();
	})

	console.log("level cache updated")


	db.advanceLevel(_user, _level);



	}else {
		res.send();
	}
	
	})

	db.advanceLevelCheck(_user, _score, _level);

});


