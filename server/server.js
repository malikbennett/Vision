require('dotenv').config();

const express = require('express');
const cors = require('cors');

const pool = require('./config/postgres');
const bcrypt = require('bcrypt');

const app = express();

const incidentRoutes = require('./routes/incidents');

app.use(cors());
app.use(express.json());

app.use('/api/incidents', incidentRoutes);

app.get('/', (req, res) => {
    req.body
    res.send("Hellow world")
    res.json({
        'message': "Wello World",
        'incident': {
            'title': "Car Crash",
            'location': {},
        }
    });
});

app.get('/api/incidents', async (req, res) => { });
app.get('/api/incidents/:id', async (req, res) => { });

app.post('/api/incidents', async (req, res) => { });

app.post('/api/incidents/:id/upvote', async (req, res) => { });

app.post('/api/auth/register', async (req, res) => {
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

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
