var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');

var key= fs.readFileSync('../text/sqlKey.txt','utf8');

var con = mysql.createConnection({
	host: 'localhost', 
	user: 'root', //set to root of database
	password: key, 
	database: 'hw5' //database, change when database is updated
});

app.use(express.static("."));
app.listen(8080);

//Setting up bodyParser to parse json
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());