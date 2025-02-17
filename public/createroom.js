const socket=io();
function generateRoomId() {
    return Math.random().toString(36).substring(2, 10); // Generates a random 8-character string
  }
  
  document.getElementById('create-room').addEventListener('click', () => {
    const roomId = generateRoomId();
    const password = prompt('Set a password for the room:'); // Get the room password from the user
    alert(`Room ID: ${roomId}`); // Display the room ID
    socket.emit('createRoom', { roomId, password }); // Send room ID and password to the server
  });
  
  document.getElementById('join-room').addEventListener('click', () => {
    const roomId = document.getElementById('room-id').value.trim();
    const password = prompt('Enter the room password:'); // Ask for the room password
    socket.emit('joinRoom', { roomId, password }); // Send room ID and password to the server
  });
  
  socket.on('joining-failed', () => {
    alert("Incorrect room ID or password.");
  });
  
  socket.on('redirect', (url) => {
    window.location.href = url; // Redirect to chat page
  });


  
  