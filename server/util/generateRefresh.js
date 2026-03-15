require('dotenv').config
const jwt = require('jsonwebtoken')
const pool = require('../db')

const generateRefreshToken = user => {
    const token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

    pool.query('INSERT INTO tokens (user_id, token) VALUES ($1, $2)', [user.id, token]).catch(err => {
        console.error(err);
    })
    console.log('Refresh Token during creation: ', { token: token, user: user })
    return token
}

module.exports = generateRefreshToken
