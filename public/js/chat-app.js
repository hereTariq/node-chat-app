const socket = io();

const form = document.getElementById('chat-form');
const formInput = form.querySelector('input');
const formInputButton = form.querySelector('button');
// const shareLocationButton = document.getElementById('share-location');
const messages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');
// templates
// const messageTemplate = document.getElementById('message-template').innerHTML;
// const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;
// const locationTemplate = document.getElementById('location-template').innerHTML;

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const autoscroll = () => {
    messages.scrollTop = messages.scrollHeight;
};

socket.on('message', (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${moment(
        message.createdAt
    ).format('h:mm a')}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
    autoscroll();
});

socket.on('roomData', ({ room, users }) => {
    document.getElementById('room-name').innerText = room;

    userList.innerHTML = `${users
        .map((user) => `<li>${user.username}</li>`)
        .join('')}`;
});

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // disable the button
    formInputButton.disabled = true;

    const message = formInput.value;
    socket.emit('sendMessage', message, (error) => {
        if (error) {
            return alert(error);
        }
        // enable button after delievering msg
        formInputButton.disabled = false;
        formInput.value = '';
        formInput.focus();
    });
});

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
