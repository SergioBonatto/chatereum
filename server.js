import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Serve arquivos estáticos
app.use(express.static('public'));
app.use('/node_modules', express.static(join(__dirname, 'node_modules')));

const rooms = {};

io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on('create-room', () => {
    const roomId = Math.random().toString(36).substring(7);
    rooms[roomId] = { host: socket.id, guest: null };
    console.log(`Room created: ${roomId} by ${socket.id}`);
    socket.emit('room-created', roomId);
  });

  socket.on('join-room', (roomId) => {
    console.log(`Join room request: ${roomId} by ${socket.id}`);
    if (rooms[roomId] && !rooms[roomId].guest) {
      rooms[roomId].guest = socket.id;
      console.log(`Room joined: ${roomId} by ${socket.id}`);
      socket.emit('room-joined', roomId);
      socket.to(rooms[roomId].host).emit('guest-joined');
    } else {
      console.log(`Room join error: ${roomId} by ${socket.id}`);
      socket.emit('room-error', 'Room not available');
    }
  });

  socket.on('signal', (data) => {
    console.log(`Signal received: ${JSON.stringify(data)} from ${socket.id}`);
    const room = rooms[data.roomId];
    if (room) {
      const targetId = room.host === socket.id ? room.guest : room.host;
      if (targetId) {
        console.log(`Forwarding signal to ${targetId}`);
        socket.to(targetId).emit('signal', data);
      } else {
        console.log(`Target ID is null for room ${data.roomId}`);
      }
    } else {
      console.log(`Signal error: Room ${data.roomId} not found`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`Disconnected: ${socket.id}`);
    for (const roomId in rooms) {
      if (rooms[roomId].host === socket.id || rooms[roomId].guest === socket.id) {
        console.log(`Cleaning up room: ${roomId}`);
        delete rooms[roomId];
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
