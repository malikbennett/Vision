const express = require('express');
const router = express.Router();
const pool = require('../config/postgres');
const bcrypt = require('bcrypt');

const { handleRegistration, handleLogin } = require('../controllers/authControllers');
const authenticateAccessToken = require('../middleware/authenticateAccessToken');

router.post('/register', handleRegistration);

router.post('/login', handleLogin);

router.get('/me', authenticateAccessToken, (req, res) => {
    res.status(200).json({ isAuthenticated: true, user: req.user });
});

router.post('/logout', (req, res) => {
    res.cookie('token', '', { expires: new Date(0) });
    res.cookie('refresh', '', { expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
