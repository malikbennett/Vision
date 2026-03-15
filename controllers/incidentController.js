require('dotenv').config();

const pool = require('../config/postgres');
const supabase = require('../config/supabase');
const crypto = require('crypto');

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
        const incident = req.body;
        const user_id = req.user.id;

        if (!incident.type || !incident.latitude || !incident.longitude) {
            return res.status(400).json({
                message: 'type, latitude, and longitude are required'
            });
        }

        const newIncident = await pool.query(`
            INSERT INTO incidents (
                user_id,
                type,
                description,
                latitude,
                longitude,
                severity,
                location_name,
                expires_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW() + INTERVAL '24 hours')
            RETURNING *
        `, [
            user_id,
            incident.type,
            incident.description || null,
            incident.latitude,
            incident.longitude,
            incident.severity || null,
            incident.locationName || null
        ]);

        let imageUrl = null;
        const createdIncidentId = newIncident.rows[0].id;

        // Handle Image Upload to Supabase if file exists
        if (req.file) {
            const file = req.file;
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${createdIncidentId}-${crypto.randomBytes(8).toString('hex')}.${fileExt}`;
            const filePath = `incidents/${fileName}`;

            const { data, error } = await supabase.storage
                .from('incident-images')
                .upload(filePath, file.buffer, {
                    contentType: file.mimetype,
                    upsert: false
                });

            if (error) {
                console.error('Supabase upload error:', error);
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('incident-images')
                    .getPublicUrl(filePath);
                
                imageUrl = publicUrl;

                // Update the incident with the image URL
                await pool.query('UPDATE incidents SET image = $1 WHERE id = $2', [imageUrl, createdIncidentId]);
            }
        }

        const finalIncident = (await pool.query('SELECT * FROM incidents WHERE id = $1', [createdIncidentId])).rows[0];

        // Broadcast to all connected clients
        req.io.emit('new_incident', finalIncident);

        res.status(201).json({
            message: 'Incident created successfully',
            incident: finalIncident
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
        const user_id = req.user.id; // from JWT

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

        const incident = updatedIncident.rows[0];

        // Broadcast update to all connected clients
        req.io.emit('incident_voted', incident);

        res.status(200).json({
            message: 'Incident upvoted successfully',
            incident: incident
        });
    } catch (error) {
        console.error('Error upvoting incident:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// ======================================================
// REMOVE UPVOTE (DOWNVOTE)
// ======================================================
const downvoteIncident = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        // Check if vote exists
        const existingVote = await pool.query(`
            SELECT * FROM upvotes WHERE user_id = $1 AND incident_id = $2
        `, [user_id, id]);

        if (existingVote.rows.length === 0) {
            return res.status(400).json({ message: 'User has not upvoted this incident' });
        }

        // Delete from upvotes
        await pool.query(`
            DELETE FROM upvotes WHERE user_id = $1 AND incident_id = $2
        `, [user_id, id]);

        // Decrement incident upvote_count
        const updatedIncident = await pool.query(`
            UPDATE incidents
            SET upvote_count = GREATEST(0, COALESCE(upvote_count, 0) - 1)
            WHERE id = $1
            RETURNING *
        `, [id]);

        const incident = updatedIncident.rows[0];

        // Broadcast update
        req.io.emit('incident_voted', incident);

        res.status(200).json({
            message: 'Upvote removed successfully',
            incident: incident
        });
    } catch (error) {
        console.error('Error removing upvote:', error);
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
    downvoteIncident,
    deleteIncident
};
