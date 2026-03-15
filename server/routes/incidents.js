const express = require('express');
const router = express.Router();
const cookieparser = require('cookie-parser')
const cors = require('cors');

router.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
router.use(express.json())
router.use(cookieparser())

const pool = require('../config/postgres');

router.get('/api/incidents', async (req, res) => {
});
router.get('/api/incidents/:id', async (req, res) => { });

router.post('/api/incidents', async (req, res) => { });

router.post('/api/incidents/:id/upvote', async (req, res) => { });

module.exports = router;
