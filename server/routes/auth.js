const express = require('express');
const router = express.Router();
const cors = require('cors');
const cookieparser = require('cookie-parser')

router.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
router.use(express.json())
router.use(cookieparser())

const pool = require('../config/postgres');
const bcrypt = require('bcrypt');

const { handleRegistration, handleLogin } = require('../controllers/authControllers');
const authenticateAccessToken = require('../middleware/authenticateAccessToken');

router.post('/api/auth/register', handleRegistration);

router.post('/api/auth/login', handleLogin);

module.exports = router;
