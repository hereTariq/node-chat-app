const socket = io();

const form = document.getElementById('form');
const formInput = form.querySelector('input');
const formInputButton = form.querySelector('button');
// const shareLocationButton = document.getElementById('share-location');
const messages = document.getElementById('messages');

// templates
const messageTemplate = document.getElementById('message-template').innerHTML;
const sidebarTemplate = document.getElementById('sidebar-template').innerHTML;
// const locationTemplate = document.getElementById('location-template').innerHTML;

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const autoscroll = () => {
    const len = document.getElementsByClassName('chatMessages').length;
    document.getElementsByClassName('chatMessages')[len - 1].scrollIntoView();
};

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a'),
    });
    messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
    });
    document.getElementById('sidebar').innerHTML = html;
});
// socket.on('locationMessage', (location) => {
//     const mapLink = Mustache.render(locationTemplate, {
//         url: location.url,
//         createdAt: moment(location.createdAt).format('h:mm a'),
//     });
//     messages.insertAdjacentHTML('beforeend', mapLink);
// });

// focus events don't bubble, must use capture phase

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

// shareLocationButton.addEventListener('click', () => {
//     if (!navigator.geolocation) {
//         return alert('geolocation is not supported by your browser');
//     }
//     shareLocationButton.disabled = true;

//     navigator.geolocation.getCurrentPosition((position) => {
//         const { latitude, longitude } = position.coords;
//         socket.emit('shareLocation', { latitude, longitude }, () => {
//             shareLocationButton.disabled = false;
//             console.log('location shared!');
//         });
//     });
// });

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
