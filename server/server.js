require('dotenv').config();

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

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
