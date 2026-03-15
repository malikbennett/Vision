require('dotenv').config();

const pool = require('../config/postgres');

// ======================================================
// GET ALL ACTIVE INCIDENTS
// ======================================================
const getAllIncidents = async (req, res) => {
    try {
        const incidents = await pool.query(`
            SELECT *
            FROM incidents
            WHERE is_active = true
            ORDER BY created_at DESC
        `);

        res.status(200).json(incidents.rows);
    } catch (error) {
        console.error('Error fetching incidents:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// ======================================================
// GET ONE INCIDENT BY ID
// ======================================================
const getIncidentById = async (req, res) => {
    try {
        const { id } = req.params;

        const incident = await pool.query(`
            SELECT *
            FROM incidents
            WHERE id = $1
        `, [id]);

        if (incident.rows.length === 0) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        res.status(200).json(incident.rows[0]);
    } catch (error) {
        console.error('Error fetching incident:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// ======================================================
// CREATE NEW INCIDENT
// ======================================================
const createIncident = async (req, res) => {
    try {
        const {
            user_id,
            type,
            description,
            latitude,
            longitude,
            photo_url,
            severity,
            expires_at
        } = req.body;

        if (!user_id || !type || latitude == null || longitude == null) {
            return res.status(400).json({
                message: 'user_id, type, latitude, and longitude are required'
            });
        }

        const newIncident = await pool.query(`
            INSERT INTO incidents (
                user_id,
                type,
                description,
                latitude,
                longitude,
                photo_url,
                severity,
                upvote_count,
                is_active,
                expires_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [
            user_id,
            type,
            description || null,
            latitude,
            longitude,
            photo_url || null,
            severity || null,
            0,
            true,
            expires_at || null
        ]);

        res.status(201).json({
            message: 'Incident created successfully',
            incident: newIncident.rows[0]
        });
    } catch (error) {
        console.error('Error creating incident:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// ======================================================
// UPVOTE INCIDENT
// Inserts into upvotes table and increments incident count
// ======================================================
const upvoteIncident = async (req, res) => {
    try {
        const { id } = req.params; // incident id
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({
                message: 'user_id is required'
            });
        }

        // Check that the incident exists and is active
        const incidentCheck = await pool.query(`
            SELECT *
            FROM incidents
            WHERE id = $1 AND is_active = true
        `, [id]);

        if (incidentCheck.rows.length === 0) {
            return res.status(404).json({
                message: 'Incident not found'
            });
        }

        // Check if the user already upvoted this incident
        const existingVote = await pool.query(`
            SELECT *
            FROM upvotes
            WHERE user_id = $1 AND incident_id = $2
        `, [user_id, id]);

        if (existingVote.rows.length > 0) {
            return res.status(400).json({
                message: 'User already upvoted this incident'
            });
        }

        // Insert into upvotes table
        await pool.query(`
            INSERT INTO upvotes (user_id, incident_id)
            VALUES ($1, $2)
        `, [user_id, id]);

        // Increment incident upvote_count
        const updatedIncident = await pool.query(`
            UPDATE incidents
            SET upvote_count = COALESCE(upvote_count, 0) + 1
            WHERE id = $1
            RETURNING *
        `, [id]);

        res.status(200).json({
            message: 'Incident upvoted successfully',
            incident: updatedIncident.rows[0]
        });
    } catch (error) {
        console.error('Error upvoting incident:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// ======================================================
// SOFT DELETE INCIDENT
// ======================================================
const deleteIncident = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedIncident = await pool.query(`
            UPDATE incidents
            SET is_active = false
            WHERE id = $1
            RETURNING *
        `, [id]);

        if (deletedIncident.rows.length === 0) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        res.status(200).json({
            message: 'Incident deleted successfully',
            incident: deletedIncident.rows[0]
        });
    } catch (error) {
        console.error('Error deleting incident:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllIncidents,
    getIncidentById,
    createIncident,
    upvoteIncident,
    deleteIncident
};
