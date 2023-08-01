const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 3000 });

const map = new Map();

wss.on('connection', (socket) => {
    socket.on('error', console.error);

    socket.on('message', (data) => {
        try {
            // Convert the message into JSON
            const socketData = JSON.parse(data);

            // Validate the data to have action
            if (socketData.action === null) {
                socket.send('Please add valid action');
                return;
            }

            // Set username
            if (socketData.action === 'SetUsername') {
                if (socketData.username === null) {
                    socket.send('Please add valid name');
                    return;
                }
                map.set(socketData.username, socket);
            }

            // Handle one-to-one communication
            if (socketData.action === 'Send') {
                if (socketData.message === null) {
                    socket.send('Please add valid message');
                    return;
                }
                if (socketData.to != null && map.has(socketData.to)) {
                    map.get(socketData.to).send(socketData.message);
                } else {
                    // Broadcast the message to all the users
                    for(let [key, value] of map) {
                        if (socketData.username !== key) {
                            value.send(socketData.message);
                        }
                    }
                }
            }
            socket.send('success');
        } catch (e) {
            console.error(e);
            socket.send('Please enter valid JSON');
        }

        console.log('received: %s', data);
    });

    socket.send('Successfully connected to whatsapp-clone server!');
});

console.log('server started on port 3000');