const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

const rooms = {};

io.on('connection', (socket) => {
  socket.on('create-room', () => {
    const roomId = Math.random().toString(36).substring(7);
    rooms[roomId] = { host: socket.id, guest: null };
    socket.emit('room-created', roomId);
  });

  socket.on('join-room', (roomId) => {
    if (rooms[roomId] && !rooms[roomId].guest) {
      rooms[roomId].guest = socket.id;
      socket.emit('room-joined', roomId);
      socket.to(rooms[roomId].host).emit('guest-joined');
    } else {
      socket.emit('room-error', 'Room not available');
    }
  });

  socket.on('signal', (data) => {
    socket.to(data.target).emit('signal', data.signal);
  });
});

server.listen(3000, () => {
  console.log('Signaling server running');
});
