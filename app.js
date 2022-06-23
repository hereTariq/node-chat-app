// Use It when you Need It.

import express from 'express';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { generateLocationMessage, generateMessage } from './utils/messages.js';
import { addUser, removeUser, getUser, getUsersInRoom } from './utils/users.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join('public')));

io.on('connection', (socket) => {
    // when new user joins room
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit(
            'message',
            generateMessage('Admin', `Welcome ${user.username}!`)
        );
        socket.broadcast
            .to(user.room)
            .emit(
                'message',
                generateMessage('Admin', `${user.username} has joined!`)
            );

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room),
        });
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        if (!user) {
            return callback('some error occurred!');
        }

        io.to(user.room).emit(
            'message',
            generateMessage(user.username, message)
        );
        callback();
    });

    // socket.on('shareLocation', (location, callbaack) => {
    //     io.emit(
    //         'locationMessage',
    //         generateLocationMessage(
    //             `https://google.com/maps?q=${location.latitude},${location.longitude}`
    //         )
    //     );
    //     callbaack();
    // });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit(
                'message',
                generateMessage('Admin', `${user.username} has left!`)
            );

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
        }
    });
});

server.listen(PORT);
