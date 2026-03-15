const express = require('express');
const router = express.Router();


const pool = require('../config/postgres');
const bcrypt = require('bcrypt');

const { handleRegisteration, handleLogin } = require('../controllers/authControllers');

router.post('/api/auth/register', handleRegisteration);

router.post('/api/auth/login', handleLogin);

module.exports = router;
