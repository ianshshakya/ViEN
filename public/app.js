
const socket = io();

function getRandomBoldColor() {
  
  const hue = Math.floor(Math.random() * 360);
  const color = `hsl(${hue}, 100%, 60%)`;
  return color;
}

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages');
const onlineUsers = document.getElementById('online-users');


        messageInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent form submission if inside a form
                sendButton.click(); // Simulate button click
            }
        });

// Function to render messages
function renderMessage(message,colour="white", position) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.style.color=colour;
  messageElement.style.textAlign = position;
  messageElement.style.padding = '3px'; // Padding for better visibility
  messageElement.style.margin = '3px'; // Add some margin
  messageElement.style.borderRadius = '5px'; 
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
function renderAnnouncement(message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  
  // Styling for announcement on black background
  messageElement.style.color = '#808080';
  messageElement.style.fontFamily = 'Arial, Helvetica, sans-serif'; // Clean font
  messageElement.style.fontStyle = 'italic'; // Italic text
  messageElement.style.padding = '3px'; // Padding for better visibility
  messageElement.style.margin = '3px 0'; // Add some margin
  messageElement.style.borderRadius = '5px'; // Slightly rounded corners
  messageElement.style.textAlign = 'center'; // Center the text
  messageElement.style.fontSize = '0.5em'; // Slightly larger text size
  
  messagesContainer.appendChild(messageElement);
}

const roomId = new URLSearchParams(window.location.search).get('room');
const naam = prompt("What is your name?");
const color=getRandomBoldColor();
socket.emit('new-user', { name: naam, roomId , color:color });
renderAnnouncement("You Joined");


sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    renderMessage(`You: ${message}`, color, "right");
    socket.emit('chatMessage', { roomId, msg: message , color:color});
    messageInput.value = '';
  }
});

socket.on('chatMessage', ({ naam, message , color }) => {
  renderMessage(`${naam}: ${message}`, color, "left");
});
socket.on('user-connected', (name) => {
  renderAnnouncement(`${name} joined the chat.`);
});
socket.on('online-users', (names)=>{
  onlineUsers.innerHTML="Online Users: ["+names+"]";
});

socket.on('gone', (name) => {
  renderAnnouncement(`${name} left`, "red");
});

