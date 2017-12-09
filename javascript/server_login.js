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


app.use(express.static("."));
app.listen(8080);

//Setting up bodyParser to parse json
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.post('/word', function (req, res){

	var word = req.body.word;


	unirest.get("https://wordsapiv1.p.mashape.com/words/" + word + "/definitions")
	.header("X-Mashape-Key", "UWUobvwifNmshNmBfjDq7YBdeg52p1nKgHqjsn5ZA2Z5MnTRl6")
	.header("X-Mashape-Host", "wordsapiv1.p.mashape.com")
	.end(function (result) {

	var definitions = result.body.definitions;
	var firstDefinition = definitions[0].definition;

	res.send(firstDefinition);
});

});



app.get('/loginrender', function (req, res){

	var toReturn = fs.readFileSync('../text/login.txt','utf8');

<<<<<<< HEAD
console.log('Rendering page');
res.send(toReturn);
=======

	console.log('Rendering page');
	res.send(toReturn);
>>>>>>> be983ed9350d2276566c5eb490b873db51215e61
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
		return res.redirect('/getUserpage');
		}
			else{
		req.session.msg = "Invalid login";
		return res.redirect('/');
		}
		});
		
	db.login(username, password);

	});

app.get('/getUserpage', function(req,res){

	str="User logged in";
	res.send(str);
	console.log("logged in");
	window.alert("user logged in");
	// what to do if logged in…
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
