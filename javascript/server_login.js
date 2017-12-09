var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var mysql = require('mysql');
// var database = require('./controllers/database');
// var db = new database();

var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var utils = require('util');
var session = require('client-sessions');


var key= fs.readFileSync('../text/sqlKey.txt','utf8');

var con = mysql.createConnection({
	host: 'localhost', 
	user: 'root', //set to root of database
	password: key, 
	database: 'hw5' //database, change when database is updated
});


//connects to mysql
con.connect(function(err){
	if(err){
		console.log('Connection to database has failed!');
		console.log(err);
	}
	else{
		console.log('Connection to database has succeeded!');
	}
});

// utils.inherits(database,EventEmitter);


app.use(express.static("."));
app.listen(8080);

//Setting up bodyParser to parse json
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.get('/loginrender', function (req, res){

	var toReturn = fs.readFileSync('../text/login.txt','utf8');

// res.write(`<html>
// <body>
// <form method=post action='/login'>
// Username:<br>
// <input type=text name=username id="u_name">
// Password:<br>
// <input type=password name=password id="u_pass">
// <input type=submit value=Login>
// </form>
// </body>
// </html>`);
console.log('Rendering page');
res.send(toReturn);
});


//sends html page for displaying login page
app.post('/login', function (req, res){
	db.once('loggedin', function(msg){
	if(msg==1){
	return res.redirect('/getUsers');
	}
	else{
	return res.redirect('/');
			}
	});
	db.login(req.body.username, req.body.password);
});

//sends
app.get('/getUsers', function(req,res){
	db.once('usertable',function(rows){
	var str = "<table><th>User</th><th>Permissions</th>";
	for(var i=0; i < rows.length; i++)
	str += "<tr><td>"+rows[i].username +
	"</td><td>"+rows[i].type+"</td></tr>";
	
	str +="</table>";
	str +=`<br>Add User
	<form method=post action='/addUser'>
	Username: <input name=username id="u_name">
	Password: <input name=pass id="u_pass">
	Type <select> name = type
	<option value=1>User</option>
	<option value=2>Admin</option>
	</select>
	<submit value='Add User'>
	</form>`;
	res.send('<html><body>' + str+'</body></html>');
	});
db.getUserTable();
});



