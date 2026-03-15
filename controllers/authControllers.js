require('dotenv').config()

const bcrypt = require('bcrypt')
const crypto = require('crypto')

const pool = require('../config/postgres')
const generateAccessToken = require('../util/generateAccessToken')
const generateRefreshToken = require('../util/generateRefreshToken')

const issueTokens = (res, payload) => {
    const accessToken = generateAccessToken(payload)
    const refreshToken = generateRefreshToken(payload)
    const isSecure = process.env.NODE_ENV === 'production';
    res.cookie('token', accessToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? 'None' : 'Lax',
        path: '/',
        maxAge: 31 * 24 * 60 * 60 * 1000
    })
    res.cookie('refresh', refreshToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? 'None' : 'Lax',
        path: '/',
        maxAge: 180 * 24 * 60 * 60 * 1000
    })
}
const handleRegistration = async (req, res) => {
    try {
        const { user } = req.body
        const hashedPassword = await bcrypt.hash(user.password, 10)
        const { rows } = await pool.query(
            `INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email`,
            [user.email, user.username, hashedPassword]
        )
        const payload = { id: rows[0].id, email: rows[0].email }
        issueTokens(res, payload)
        res.status(201).json({ isAuthenticated: true, message: 'User successfully created' })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('An error occured on the server: ', error)
    }
}

const handleLogin = async (req, res) => {
    try {
        const { user } = req.body
        const { rows } = await pool.query(
            `SELECT id, email, username, password FROM users WHERE email = $1`,
            [user.email]
        )
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' })
        const isMatch = await bcrypt.compare(user.password, rows[0].password)
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })
        const payload = { id: rows[0].id, email: rows[0].email }
        issueTokens(res, payload)
        res.status(200).json({ isAuthenticated: true, message: 'User successfully logged in' })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' })
        console.error('An error occured on the server: ', error)
    }
}

const handleRefreshToken = async (refresh) => {
    try {
        const hash = crypto.createHash('sha256').update(refresh).digest('hex')
        const tokenData = await pool.query(
            'SELECT * FROM tokens WHERE token = $1 AND expires_at > NOW()',
            [hash]
        )
        if (!tokenData.rows || tokenData.rows.length === 0)
            return { status: 403, message: 'Forbidden Refresh Token | Logout required' }
        const user = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET)
        const payload = { id: user.id, email: user.email }
        const newAccessToken = generateAccessToken(payload)
        return {
            access: {
                name: 'token', token: newAccessToken, attributes: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                    path: '/',
                    maxAge: 31 * 24 * 60 * 60 * 1000 // Match 31d access token
                }
            },
            status: 201,
            message: 'Token successfully refreshed'
        }
    } catch (error) {
        console.log(error)
        return { status: 500, message: 'Internal Server Error' }
    }
}

module.exports = { handleRegistration, handleLogin, handleRefreshToken }
