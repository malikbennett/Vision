require('dotenv').config()

const bcrypt = require('bcrypt')
const crypto = require('crypto')

const pool = require('../config/postgres')
const generateAccessToken = require('../util/generateAccessToken')
const generateRefreshToken = require('../util/generateRefreshToken')

const handleRegistration = async (req, res) => {
    try {
        let { user } = req.body
        const hashedPassword = await bcrypt.hash(user.password, 10)
        // SAVES USER
        const data = await pool.query(`INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username;`, [
            user.email, user.username, hashedPassword]);
        console.log(data.rows[0]);
        // GETS USER DATA
        const userData = await pool.query('SELECT id, email FROM users WHERE email = $1', [user.email])
        console.log(userData.rows[0]);
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

const handleLogin = async (req, res) => {
    try {
        const { user } = req.body
        const { rows } = await pool.query(`SELECT id, email, username, password FROM users WHERE email = $1`, [user.email])
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' })
        const isMatch = await bcrypt.compare(user.password, rows[0].password)
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })
        const payload = { id: rows[0].id, email: rows[0].email }
        const accessToken = await bcrypt.hash(generateAccessToken(payload), 10)
        const refreshToken = await bcrypt.hash(generateRefreshToken(payload), 10)
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
        res.status(200).json({ isAuthenticated: true, message: 'User successfully logged in' })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('An error occured on the server: ', error);
    }
}

const handleRefreshToken = async (refresh) => {
    const hash = crypto.createHash('sha256').update(refresh).digest('hex')
    const tokenData = await pool.query('SELECT * FROM tokens WHERE token = $1', [hash])
    if (!tokenData.rows || tokenData.rows.length === 0) return { status: 403, message: 'Forbinden Refresh Token | Logout required' }
    const dbToken = tokenData.rows[0]
    console.log('Refresh Token found in database', dbToken)
    try {
        const user = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET)
        const payload = { id: user.id }
        const newAccessToken = generateAccessToken(payload)
        console.log('New Access has been created using refresh')
        return {
            access: {
                name: 'token', token: newAccessToken, attributes: {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    path: '/',
                    maxAge: 15 * 60 * 1000 // 15mins
                }
            },
            status: 201,
            message: 'Token successfully refresh'
        }
    } catch (error) {
        console.log(error)
        return { status: 500, message: 'Internal Server Error' }
    }
}

module.exports = { handleRegistration, handleLogin, handleRefreshToken }
