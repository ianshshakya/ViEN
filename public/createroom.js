const socket=io();
   var x =document.getElementById('room-id');
   x.style.display="none";
    document.getElementById('join-room').addEventListener('click', () => {
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        x.style.display = "none";
      }
    });
    x.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
          event.preventDefault(); // Prevent form submission if inside a form
          document.getElementById("join-room").click(); // Simulate button click
      }
  });


function generateRoomId() {
    return Math.random().toString(36).substring(2, 10); // Generates a random 8-character string
  }
  
  document.getElementById('create-room').addEventListener('click', () => {
    const roomId = generateRoomId();
    const password = prompt('Set a password for the room:');
    if(password){
      alert(`Room ID: ${roomId}`); // Display the room ID
      socket.emit('createRoom', { roomId, password }); 
    }else{
      alert("Please Enter a password to continue...");
    } 
  });
  
  document.getElementById('join-room').addEventListener('click', () => {
    const roomId = document.getElementById('room-id').value.trim();
    if(roomId){
    const password = prompt('Enter the room password:'); // Ask for the room password
    
    socket.emit('joinRoom', { roomId, password }); // Send room ID and password to the server
    }
  });
  
  socket.on('joining-failed', () => {
    alert("Incorrect room ID or password.");
  });
  
  socket.on('redirect', (url) => {
    window.location.href = url; // Redirect to chat page
  });


  
  