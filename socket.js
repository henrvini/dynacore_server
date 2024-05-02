const socketMain = (io) => {
    io.on('connection', (socket) => {
        let machineMacA;
        const auth = socket.handshake.auth;

        if (auth.token === process.env.NODE_AUTH_TOKEN) {
            socket.join('nodeClient');
        } else if (auth.token === process.env.REACT_AUTH_TOKEN) {
            socket.join('reactClient');
        } else {
            socket.disconnect();
            console.log('Wrong credentials, disconnecting...');
        }

        console.log(`Someone connected on worker ${process.pid}`);
        socket.emit('welcome', "Welcome, you're connected");

        socket.on('perfData', (data) => {
            console.log('Tick...');
            console.log(data);
            if (!machineMacA) {
                machineMacA = data.macA;
                io.to('reactClient').emit('connectedOrNot', { machineMacA, isAlive: true });
            }
            io.to('reactClient').emit('perfData', data);
        });

        socket.on('disconnect', (reason) => {
            io.to('reactClient').emit('connectedOrNot', { machineMacA, isAlive: false });
        });
    });
};

module.exports = socketMain;
