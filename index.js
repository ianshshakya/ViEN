const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const users = {}; // Store users by socket ID
const rooms = []; // Store all room IDs
const roomPasswords = {}; // Map room IDs to their passwords
const colors={};


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/joinroom.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

io.on('connection', (socket) => {
  socket.on('createRoom', ({ roomId, password }) => {
    rooms.push(roomId);
    roomPasswords[roomId] = password; // Store the password
    socket.emit('redirect', `/chat?room=${roomId}`);
    console.log(`Room Created: ${roomId} with password`);
  });

  socket.on('joinRoom', ({ roomId, password }) => {
    if (rooms.includes(roomId) && roomPasswords[roomId] === password) {
      socket.join(roomId); // Join the room
      socket.emit('redirect', `/chat?room=${roomId}`);
    } else {
      socket.emit('joining-failed');
    }
  });

  socket.on('new-user', ({ name, roomId, color}) => {
    users[socket.id] = { name, roomId, color};
    const namesArray = Object.values(users).map(item => item.name);
    socket.join(roomId);
   
    socket.to(roomId).emit('user-connected', name);
    
    io.to(roomId).emit('online-users', namesArray);
    
  });
  
  socket.on('chatMessage', ({ roomId, msg , color}) => {
    const user = users[socket.id];
    if (user && user.roomId === roomId) {
      socket.to(roomId).emit('chatMessage', {
        naam: user.name,
        color: user.color,
        message: msg
      });
    }
  });
  socket.on('disconnect', () => {
    
    const user = users[socket.id];
    if (user) {
      io.to(user.roomId).emit('gone', user.name);
      delete users[socket.id];
    }
    const namesArray = Object.values(users).map(item => item.name);
    socket.emit('online-users', namesArray);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
