require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const socketMain = require('./socket');

const app = express();

app.use(
    cors({
        origin: process.env.URL || 'http://172.0.0.1:5173',
        credentials: true
    })
);

const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log(`server running at ${process.env.PORT || 3000}`);
});

socketMain(io);
