
var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));

console.log('Server is running on port 3000');

var socket = require('socket.io');
var io = new socket.Server(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log('New connection: ' + socket.id);

  socket.on('mouse', mouseMsg);

  function mouseMsg(data) {
    socket.broadcast.emit('mouse', data);
    console.log(data);
  }
}
