const { log } = require('console');
const express = require('express');
const http = require('http');

const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = socketio(server);

app.use(express.static(__dirname + '/static'));

io.on('connection', (socket) => {
    console.log('En användare har anslutit');

    socket.on('join', (username) => {
        socket.username = username;

        socket.broadcast.emit('user joined', username);
    });

    socket.on('new message', (message) => {
        const composedMessage = socket.username + ': ' + message;

        io.emit('send message', composedMessage);
    });

    socket.on('typing', () => {
        socket.broadcast.emit('is typing', socket.username);
    });

    socket.on('stop typing', () => {
        socket.broadcast.emit('not typing');
    });

    socket.on('disconnect', () => {
        console.log('En användare har kopplats från');
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Servern är igång och lyssnar på port ${port}`);
});