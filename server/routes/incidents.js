const express = require('express');
const router = express.Router();


const pool = require('../config/postgres');

router.get('/api/incidents', async (req, res) => {
});
router.get('/api/incidents/:id', async (req, res) => { });

router.post('/api/incidents', async (req, res) => { });

router.post('/api/incidents/:id/upvote', async (req, res) => { });


// GET
//     / api / incidents
// No
// Fetch all active incidents

// POST
//     / api / incidents
// Yes
// Submit a new incident report

// GET
//     / api / incidents /: id
// No
// Fetch a single incident's details

// POST
//     / api / incidents /: id / upvote
// Yes
// Upvote / confirm a report


module.exports = router;
