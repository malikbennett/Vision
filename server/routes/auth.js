const express = require('express');
const router = express.Router();


const pool = require('../config/postgres');
const bcrypt = require('bcrypt');

router.post('/api/auth/register', async (req, res) => {
    try {
        const { user } = req.body;
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const { rows } = await pool.query(`
            INSERT INTO users (email, display_name, password)
            VALUES ($1, $2, $3)
            RETURNING id, email, display_name;
    `, [
            user.email,
            user.username,
            hashedPassword
        ]);
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.post('/api/auth/login', async (req, res) => {
    try {
        const { user } = req.body;
        const { rows } = await pool.query(`
            SELECT id, email, display_name, password
            FROM users
            WHERE email = $1
        `, [user.email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const hashedPassword = rows[0].password;
        const isMatch = await bcrypt.compare(user.password, hashedPassword);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({
            id: rows[0].id,
            email: rows[0].email,
            display_name: rows[0].display_name
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
