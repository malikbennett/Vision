require('dotenv').config()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const pool = require('../config/postgres')

const generateRefreshToken = payload => {
    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
    const hash = crypto.createHash('sha256').update(token).digest('hex')
    pool.query('INSERT INTO tokens (user_id, token) VALUES ($1, $2)', [payload.id, hash]).catch(err => {
        console.error(err);
    })
    console.log('Refresh Token during creation: ', { token: token, user: payload })
    return token
}

module.exports = generateRefreshToken
