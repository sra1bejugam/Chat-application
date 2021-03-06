var express = require('express');
var app = express();
var	server = require('http').createServer(app);
var	io = require('socket.io').listen(server);
var usernames = [];//all users in an array
var validation = require("validator");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

server.listen(process.env.PORT || 3000);
console.log('Server Running at 3000');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/indexc.html');
}); 
app.get('/conta.html',function(req,res){
   res.sendFile(__dirname + '/conta.html');
});
app.get('/about.html',function(req,res){
    res.sendFile(__dirname + '/about.html');
});
// app.get('/help.html',function(req,res){
//     res.sendFile(__dirname + '/help.html');
// });
io.sockets.on('connection', function(socket){
	console.log('Socket Connected...');
	socket.on('new user', function(data, callback){
		if(usernames.indexOf(data) != -1){
			callback(false);
		} else {
			callback(true);
			socket.username = data;
			usernames.push(socket.username);
			updateUsernames();
		}
	});
	function updateUsernames(){
		io.sockets.emit('usernames', usernames);
	}
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data, user:socket.username});
	});
	socket.on('disconnect', function(data){
		if(!socket.username){
			return;
		}
		usernames.splice(usernames.indexOf(socket.username), 1);
		updateUsernames();
	});
});