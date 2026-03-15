const express = require('express');
const router = express.Router();
const cookieparser = require('cookie-parser')
const cors = require('cors');

router.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
router.use(express.json())
router.use(cookieparser())

const pool = require('../config/postgres');

const {
    getAllIncidents,
    getIncidentById,
    createIncident,
    upvoteIncident,
    deleteIncident
} = require('../controllers/incidentController');

router.get('/incidents', getAllIncidents);
router.get('/incidents/:id', getIncidentById);
router.post('/incidents', createIncident);
router.post('/incidents/:id/upvote', upvoteIncident);
router.delete('/incidents/:id', deleteIncident);

module.exports = router;
