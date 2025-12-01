const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());


const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'],
        methods: ['GET', 'POST'],
        credentials: true
    },
    transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id}`);

    socket.on('join', (data) => {
        const name = typeof data?.name === 'string' && data.name.trim() ? data.name.trim() : 'Anonymous';
        socket.data.username = name;
        console.log(`user joined: ${name} (${socket.id})`);
    });

    socket.on('sendmessage', (message) => {
        const base = typeof message === 'string'
            ? { text: message, sender: 'Anonymous' }
            : {
                text: typeof message?.text === 'string' ? message.text : '',
                sender: typeof message?.sender === 'string' && message.sender.trim() ? message.sender.trim() : socket.data.username || 'Anonymous'
            };

        const trimmedText = base.text.trim();
        if (!trimmedText) {
            return;
        }

        const payload = {
            text: trimmedText,
            sender: base.sender,
            timestamp: new Date().toISOString()
        };

        io.emit('receivemessage', payload);
    });

    socket.on('disconnect', () => {
        console.log(`user disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});