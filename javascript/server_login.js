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

	//{username: name , password: pass};
	var toReturn = {username: req.session.userid, level: req.session.level};

res.send(toReturn);

});

app.get('/loginrender', function (req, res){

	var toReturn = fs.readFileSync('../text/login.txt','utf8');

console.log('Rendering page');
res.send(toReturn);

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
		return res.redirect('/loginrender');
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
});
