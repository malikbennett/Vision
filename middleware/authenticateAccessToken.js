require('dotenv').config()
const jwt = require('jsonwebtoken')

const { handleRefreshToken } = require('../controllers/authControllers')

const authenticateAccessToken = async (req, res, next) => {
    if (!req.cookies.refresh) return res.status(401).json({ isAuthenticated: false, message: `Refresh Token not found | User not Logged In` })
    try {
        if (!req.cookies.token) {
            console.log('Attemping refresh');
            const response = await handleRefreshToken(req.cookies.refresh)
            if (!response?.access) return res.status(response?.status).json({ message: response?.message })
            res.cookie(response?.access.name, response?.access.token, response?.access.attributes)
            req.cookies.token = response?.access.token
        }
        jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
            if (err) {
                // If token is expired, try refreshing
                if (err.name === 'TokenExpiredError' || err.message === 'jwt expired') {
                    console.log('Access token expired, attempting refresh...');
                    const response = await handleRefreshToken(req.cookies.refresh);
                    if (response?.access) {
                        res.cookie(response.access.name, response.access.token, response.access.attributes);
                        req.user = jwt.verify(response.access.token, process.env.ACCESS_TOKEN_SECRET);
                        return next();
                    }
                }
                return res.status(403).json({ message: `Token failed to verify` });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: `Invalid Token` })
    }
}

module.exports = authenticateAccessToken;
