require('dotenv').config();

const express = require('express');
const { Server } = require('socket.io')
const cors = require('cors');
const cookieparser = require('cookie-parser')

const app = express();

const authRoutes = require('./routes/auth');
const incidentRoutes = require('./routes/incidents');

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieparser());

app.use('/api/incidents', incidentRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const authenticateAccessToken = require('./middleware/authenticateAccessToken');
const path = require('path');

// Protect specifically map.html
app.get('/map.html', authenticateAccessToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

// Serve other static assets
app.use(express.static('public'))

const server = require('http').createServer(app)

const io = new Server(server, {
    cors: {
        path: process.env.FRONTEND_URL,
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log('connected on server')
})

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${process.env.PORT} is already in use. Trying another port...`)
        process.exit(1)
    } else {
        console.error('Server error:', err)
    }
})

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`)
})
