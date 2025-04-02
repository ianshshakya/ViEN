
const socket = io();

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



const onlineUsers = document.getElementById('online-users');
const onlineUsers2 = document.getElementById('online-users2');
const menuBtn = document.getElementById("menu-btn");

menuBtn.addEventListener("click", function () {
  onlineUsers.parentElement.classList.toggle("active");
  if (onlineUsers.parentElement.classList.contains("active")) {
    onlineUsers.parentElement.style.display = "block";
    onlineUsers.parentElement.style.height = "500px";
    onlineUsers.parentElement.style.width = "200px";
  } else {
    onlineUsers.parentElement.style.display = "none";
  }
});
//element.classList.contains("class-name");



function getRandomBoldColor() {

  const hue = Math.floor(Math.random() * 360);
  const color = `hsl(${hue}, 100%, 60%)`;
  return color;
}




const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const messagesContainer = document.getElementById('messages');



messageInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission if inside a form
    const message = messageInput.value.trim();
    if (message) {
      renderMessage(message, "skyblue", "right");
      socket.emit('chatMessage', { roomId, msg: message, color: color });
      messageInput.value = '';
    } // Simulate button click

  }
});

// Function to render messages
function renderMessage(message, colour = "#168aad", position, sender = "") {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message-bubble', 'whatsapp-style');
  
  // Create message container
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('message-container');
  
  // Add sender name (small text at top) for received messages
  if (sender && position !== "right") {
    const senderElement = document.createElement('div');
    senderElement.classList.add('whatsapp-sender');
    senderElement.textContent = sender;
    senderElement.style.color = colour;
    messageContainer.appendChild(senderElement);
  }
  
  // Main message content
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('whatsapp-content-wrapper');
  
  // Message text
  const textElement = document.createElement('div');
  textElement.classList.add('whatsapp-message-text');
  textElement.textContent = message;
  contentWrapper.appendChild(textElement);
  
  // Timestamp (small text at bottom right)
  const timeElement = document.createElement('div');
  timeElement.classList.add('whatsapp-timestamp');
  timeElement.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  contentWrapper.appendChild(timeElement);
  
  messageContainer.appendChild(contentWrapper);
  messageElement.appendChild(messageContainer);
  
  // Position styling
  if (position === "right") {
    messageElement.classList.add('whatsapp-right');
    messageElement.style.setProperty('--message-color', colour);
  } else {
    messageElement.classList.add('whatsapp-left');
  }

  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Add subtle fade-in animation
  messageElement.style.animation = 'whatsappFadeIn 0.2s ease-out';
}





function renderAnnouncement(message) {
  const announcementElement = document.createElement('div');
  announcementElement.classList.add('announcement');
  
  const contentElement = document.createElement('div');
  contentElement.classList.add('announcement-content');
  contentElement.textContent = message;
  
  const iconElement = document.createElement('i');
  iconElement.classList.add('fas', 'fa-bullhorn', 'announcement-icon');
  
  announcementElement.appendChild(iconElement);
  announcementElement.appendChild(contentElement);
  
  messagesContainer.appendChild(announcementElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Force reflow to enable animation
  void announcementElement.offsetWidth;
  
  // Add animation class that will stay after animation completes
  announcementElement.classList.add('announcement-visible');
}

const roomId = new URLSearchParams(window.location.search).get('room');


 async function getUserName() {
  const { value: naam } = await Swal.fire({
    title: 'Enter Your Name',
    input: 'text',
    inputLabel: 'Welcome to ViEN Chat!',
    inputPlaceholder: 'Type your name here...',
    inputAttributes: {
      'aria-label': 'Type your name here',
      maxlength: 20
    },
    showCancelButton: false,
    allowOutsideClick: false,
    confirmButtonColor: '#168aad',
    background: '#ffffff',
    backdrop: `
      rgba(0,0,0,0.4)
      url("/images/chat-bubble.png")
      left top
      no-repeat
    `,
    inputValidator: (value) => {
      if (!value) {
        return 'You need to enter a name to continue!';
      }
    }
  });
  
  return naam;
}

// Usage:
(async function initChat() {
  try {
    const naam = await getUserName();
    if (!naam) {
      // User cancelled or didn't enter name
      window.location.href = '/'; // Redirect them back
      return;
    }

    const color = getRandomBoldColor();
    const roomId = new URLSearchParams(window.location.search).get('room');
    
    socket.emit('new-user', { name: naam, roomId, color: color });
    renderAnnouncement("You Joined");

    // Rest of your chat initialization code...
    // All your existing socket.on handlers, event listeners, etc.

  } catch (error) {
    console.error("Chat initialization failed:", error);
    Swal.fire({
      title: 'Error',
      text: 'Failed to initialize chat',
      icon: 'error',
      confirmButtonColor: '#168aad'
    });
  }
})();






  sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
      renderMessage(message, "skyblue", "right");
      socket.emit('chatMessage', { roomId, msg: message, color: color });
      messageInput.value = '';
    }
  });


socket.on('chatMessage', ({ naam, message, color }) => {
  renderMessage(message, color, "left", naam);
});
socket.on('user-connected', (name) => {
  renderAnnouncement(`${name} joined the chat.`);
});
socket.on('online-users', (names) => {

  while (onlineUsers.firstChild) {
    onlineUsers.removeChild(onlineUsers.firstChild);
    
  }
  while (onlineUsers2.firstChild) {
    onlineUsers2.removeChild(onlineUsers2.firstChild);
    
  }
 
 

  // Get the containers
 
  const onlineCount = document.getElementById('online-count');

  // Update online count
  onlineCount.textContent = names.length;

  // Clear any placeholder content
  onlineUsers.innerHTML = '';

  // Create user elements
  for (var i = 0; i < names.length; i++) {
    const userBox = document.createElement('div');
    userBox.classList.add('user-box');

    const pic = document.createElement('div');
    pic.classList.add('user-avatar');

    const img = document.createElement('img');
    img.src = "images/pic2.jpg";
    img.alt = names[i] + " profile picture";
    img.classList.add("profilePic");

    const user = document.createElement('span');
    user.classList.add("fw-bold");
    user.textContent = names[i];

    pic.appendChild(img);
    userBox.appendChild(pic);
    userBox.appendChild(user);

    // Add hover tooltip
    userBox.title = "Message " + names[i];

    onlineUsers.appendChild(userBox);

    // If you still need the clone for another container
    if (onlineUsers2) {
      const userBoxClone = userBox.cloneNode(true);
      onlineUsers2.appendChild(userBoxClone);
    }
  }
});

socket.on('gone', (name) => {
  renderAnnouncement(`${name} left`, "red");
});

