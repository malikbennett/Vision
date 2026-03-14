const express = require('express');
const router = express.Router();


const pool = require('../config/postgres');

router.get('/api/incidents', async (req, res) => { });
router.get('/api/incidents/:id', async (req, res) => { });

router.post('/api/incidents', async (req, res) => { });

router.post('/api/incidents/:id/upvote', async (req, res) => { });

module.exports = router;
