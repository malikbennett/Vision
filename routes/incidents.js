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

router.get('/', getAllIncidents);
router.get('/:id', getIncidentById);
router.post('/', createIncident);
router.post('/:id/upvote', upvoteIncident);
router.delete('/:id', deleteIncident);

module.exports = router;
