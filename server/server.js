require('dotenv').config();

const pool = require('./config/postgres');
const express = require('express');
const cors = require('cors');

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

app.post('/api/auth/register', async (req, res) => {
    const { user } = req.body
    console.log(user)

    await pool.query(`INSERT INTO users (email, display_name, password) VALUES ($1, $2, $3)`, [user.email, user.username, user.password]);

    res.send(`Got the data, the user is ${user.username} password is ${user.password} and email is ${user.email}`);
})

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
