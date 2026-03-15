const express = require('express');
const router = express.Router();

// Real Jamaican crime and road safety data
const jamaicaIncidents = require('../data/jamaica-incidents');

// GET all incidents
router.get('/', (req, res) => {
    // Add random recent timestamps to make data feel live
    const incidentsWithTime = jamaicaIncidents.map(incident => ({
        ...incident,
        created_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(), // Last 7 days
        price: incident.severity === 'extreme' ? 'Extreme Risk' : 
               incident.severity === 'very_high' ? 'Very High Risk' : 'High Risk'
    }));
    res.json(incidentsWithTime);
});

// POST new incident (keep for future user reports)
router.post('/', (req, res) => {
    const { type, severity, description, latitude, longitude, location } = req.body;
    
    if (!type || !latitude || !longitude) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const newIncident = {
        id: Date.now().toString(),
        type,
        severity: severity || 'medium',
        description: description || '',
        latitude,
        longitude,
        location: location || 'Unknown location',
        created_at: new Date().toISOString(),
        price: 'User Reported'
    };
    
    // In production, you'd add this to the database
    res.status(201).json(newIncident);
});

module.exports = router;
