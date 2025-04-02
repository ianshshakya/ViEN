// First, add this to your HTML head (before your script)
// <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

const socket = io();
const x = document.getElementById('room-id');
x.style.display = "none";

document.getElementById('join-room').addEventListener('click', () => {
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
});

x.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    document.getElementById("join-room").click();
  }
});

function generateRoomId() {
  return Math.random().toString(36).substring(2, 10);
}

document.getElementById('create-room').addEventListener('click', async () => {
  const roomId = generateRoomId();
  
  const { value: password } = await Swal.fire({
    title: 'Set Room Password',
    input: 'password',
    inputLabel: 'Password',
    inputPlaceholder: 'Enter a password for your room',
    inputAttributes: {
      'aria-label': 'Type your password here'
    },
    showCancelButton: true,
    confirmButtonColor: '#168aad',
    cancelButtonColor: '#6c757d',
    background: '#ffffff',
    backdrop: `
      rgba(0,0,0,0.4)
      url("/images/nyan-cat.gif")
      left top
      no-repeat
    `,
    confirmButtonText: 'Create Room',
    showLoaderOnConfirm: true,
    preConfirm: (password) => {
      if (!password) {
        Swal.showValidationMessage('Password is required');
      }
      return password;
    }
  });

  if (password) {
    await Swal.fire({
      title: 'Room Created!',
      html: `Your Room ID is: <strong>${roomId}</strong><br><br>Share this with friends to join`,
      icon: 'success',
      confirmButtonColor: '#168aad',
      background: '#ffffff',
      footer: 'Make sure to remember the password!'
    });
    
    socket.emit('createRoom', { roomId, password });
  }
});

document.getElementById('join-room').addEventListener('click', async () => {
  const roomId = document.getElementById('room-id').value.trim();
  
  if (roomId) {
    const { value: password } = await Swal.fire({
      title: 'Enter Room Password',
      input: 'password',
      inputLabel: 'Password',
      inputPlaceholder: 'Enter the room password',
      inputAttributes: {
        'aria-label': 'Type the room password here'
      },
      showCancelButton: true,
      confirmButtonColor: '#168aad',
      cancelButtonColor: '#6c757d',
      background: '#ffffff'
    });

    if (password) {
      socket.emit('joinRoom', { roomId, password });
    }
  } else {
    await Swal.fire({
      title: 'Room ID Required',
      text: 'Please enter a Room ID first',
      icon: 'warning',
      confirmButtonColor: '#168aad'
    });
  }
});

socket.on('joining-failed', async () => {
  await Swal.fire({
    title: 'Join Failed',
    text: 'Incorrect room ID or password',
    icon: 'error',
    confirmButtonColor: '#dc3545',
    background: '#ffffff',
    timer: 3000,
    timerProgressBar: true
  });
});

socket.on('redirect', (url) => {
  Swal.fire({
    title: 'Redirecting...',
    html: 'Taking you to the chat room!',
    timer: 1500,
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
    },
    willClose: () => {
      window.location.href = url;
    }
  });
});