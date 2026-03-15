const express = require('express');
const router = express.Router();
// Middlewares already applied in server.js, removing redundant calls here
const pool = require('../config/postgres');

const {
    getAllIncidents,
    getIncidentById,
    createIncident,
    upvoteIncident,
    downvoteIncident,
    deleteIncident
} = require('../controllers/incidentController');

const authenticateAccessToken = require('../middleware/authenticateAccessToken');

router.get('/', getAllIncidents);
router.get('/:id', getIncidentById);
router.post('/', authenticateAccessToken, createIncident);
router.post('/:id/upvote', authenticateAccessToken, upvoteIncident);
router.delete('/:id/upvote', authenticateAccessToken, downvoteIncident);
router.delete('/:id', authenticateAccessToken, deleteIncident);

module.exports = router;
