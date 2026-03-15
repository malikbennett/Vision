require('dotenv').config()

const bcrypt = require('bcrypt')
const crypto = require('crypto')

const pool = require('../db')
const generateAccessToken = require('../util/generateAccessToken')
const generateRefreshToken = require('../util/generateRefreshToken')

const handleRegistration = async (req, res) => {
    try {
        let { user } = req.body
        const hashedPassword = await bcrypt.hash(user.password, 10)
        // SAVES USER
        await pool.query(`INSERT INTO users (email, display_name, password) VALUES ($1, $2, $3) RETURNING id, email, display_name;`, [
            user.email, user.username, hashedPassword]);
        // GETS USER DATA
        const userData = await pool.query('SELECT id, email FROM users WHERE username = $1', [username])
        //
        const payload = { id: userData.rows[0].id, email: userData.rows[0].email }
        const accessToken = generateAccessToken(payload)
        const refreshToken = generateRefreshToken(payload)
        console.log(accessToken)
        console.log(refreshToken)
        res.cookie('token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/',
            maxAge: 15 * 60 * 1000 // 15 mins
        })
        res.cookie('refresh', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        res.status(201).json({ isAuthenticated: true, message: 'User successfully created' })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('An error occured on the server: ', error);
    }
}

module.exports = handleRegistration


module.exports = {
    handleRegister
}
