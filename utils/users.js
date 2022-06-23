const users = [];

// addUser function
const addUser = ({ id, username, room }) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate the data
    if (!username || !room) {
        return {
            error: 'username and room are required!',
        };
    }

    // checking for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    if (existingUser) {
        return {
            error: 'Username already taken!',
        };
    }

    // storing user
    const user = { id, username, room };
    users.push(user);

    return { user };
};

// remove the user
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

// getUser function
const getUser = (id) => {
    return users.find((user) => user.id === id);
};

// get all users in a room
const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);
};

export { addUser, removeUser, getUser, getUsersInRoom };
