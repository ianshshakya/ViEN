
const socket = io();

function getRandomBoldColor() {
  
  const hue = Math.floor(Math.random() * 360);
  const color = `hsl(${hue}, 100%, 60%)`;
  return color;
}
function enterFullScreen() {
  let doc = document.documentElement;
  if (doc.requestFullscreen) {
      doc.requestFullscreen();
  } else if (doc.mozRequestFullScreen) { // Firefox
      doc.mozRequestFullScreen();
  } else if (doc.webkitRequestFullscreen) { // Chrome, Safari
      doc.webkitRequestFullscreen();
  } else if (doc.msRequestFullscreen) { // IE/Edge
      doc.msRequestFullscreen();
  }
}
document.addEventListener("DOMContentLoaded", function () {
  enterFullScreen(); // Automatically enters full screen on load
});

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
  if(position=="right")
  messageElement.classList.add('message-right');
  else
  messageElement.classList.add('message-left');
  messageElement.style.color=colour;
  
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
function renderAnnouncement(message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.classList.add('announcement');
  
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
    renderMessage(`You: ${message}`, "skyblue", "right");
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
  
  while (onlineUsers.firstChild) {
      onlineUsers.removeChild(onlineUsers.firstChild);
  }
    for(var i=0; i<names.length; i++){
      const userBox = document.createElement('div');
      userBox.classList.add('user-box');
      const pic=document.createElement('span');
      const img=document.createElement('img');
      img.src="images/pic2.jpg";
      img.alt="picture";
      
      const user=document.createElement('span');
      
      user.textContent = names[i];
      pic.appendChild(img);
      userBox.appendChild(pic);
      userBox.appendChild(user);
      onlineUsers.appendChild(userBox);
      }
});

socket.on('gone', (name) => {
  renderAnnouncement(`${name} left`, "red");
});

