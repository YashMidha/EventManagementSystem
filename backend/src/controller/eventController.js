import pool from '../config/postgreConfig.js';
import { v2 as cloudinary } from "cloudinary";
import sendEmail from '../utils/sendEmail.js';

const addEvent = async (req, res) => {
    try {
        const name = req.body.name;
        const description = req.body.description;
        const location = req.body.location;
        const date = req.body.date;
        const time = req.body.time;
        const seats = req.body.seats;
        const category = req.body.category;
        const imageFile = req.file;
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"});
        const image = imageUpload.secure_url;

        const resultEvent = await pool.query(
            `INSERT INTO events (name, description, location, date, time, available_seats, image_url) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [name, description, location, date, time, seats, image]
        );

        const eventId = resultEvent.rows[0].id;

        const resultCategory =  await pool.query(` 
            INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id`, [category]
        );

        const categoryId = resultCategory.rows.length > 0
        ? resultCategory.rows[0].id
        : (await pool.query(`SELECT id FROM categories WHERE name = $1`, [category])).rows[0].id;

        await pool.query(
            `INSERT INTO event_categories (event_id, category_id) VALUES ($1, $2)`, 
            [eventId, categoryId]
        );

        res.json({
            message: 'Event added successfully!',
            event: eventId,
            success: true,
        });

        } catch (error) {
            console.error('Error adding event: ', error.message);
            res.json({ message: 'Failed to add event!',success: false });
        }
}

const listEvent = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT e.id, e.name, e.description, e.date, e.time, e.location, 
            e.image_url, e.available_seats, e.created_at, c.name AS categories
            FROM events e
            LEFT JOIN event_categories ec ON e.id = ec.event_id
            LEFT JOIN categories c ON ec.category_id = c.id
            ORDER BY e.date, e.time`
        );

        res.json({
            success: true,
            message: "Events fetched successfully",
            events: result.rows
        });

    } catch (error) {
        console.error("Error fetching events:", error);
        res.json({
            success: false,
            message: "Failed to fetch events",
            error: error.message
        });
    }
}

const removeEvent = async (req, res) => {
    const eventId = req.body.eventId;

    try {
        const result = await pool.query(`SELECT * FROM events WHERE id = $1`, [eventId]);

        if (result.rowCount === 0) {
            return res.json({
                success: false,
                message: "Event not found",
            });
        }

        const {name, location, date, time} = result.rows[0];

        const participants = await pool.query(
            `SELECT users.email, users.name FROM registrations 
            JOIN users ON registrations.user_id = users.id WHERE registrations.event_id = $1`,
            [eventId]
        );

        const participantsList = participants.rows;

        await pool.query(`DELETE FROM events WHERE id = $1`, [eventId]);

        participantsList.forEach(async (participant) => {
            const emailContent = 
                `Hi ${participant.name},

We regret to inform you that the event "${name}" scheduled on ${new Date(date).toLocaleDateString()} at ${time}, located at ${location}, has been canceled.

We apologize for the inconvenience caused.

Thankyou,
Event Management Team`;

            await sendEmail(participant.email, `Event Cancellation: ${name}`, emailContent);
        });

        res.json({
            success: true,
            message: "Event removed successfully",
        });

    } catch (error) {
        console.error("Error removing event:", error);
        res.json({
            success: false,
            message: "Failed to remove event",
            error: error.message,
        });
    }
}

const getEventById = async (req, res) => {
    const eventId = req.params.id;

    try {
        const result = await pool.query(
            `SELECT e.id, e.name, e.description, e.date, e.time, e.location, e.image_url, e.available_seats, e.created_at, 
            c.name AS categories FROM events e LEFT JOIN event_categories ec ON e.id = ec.event_id
            LEFT JOIN categories c ON ec.category_id = c.id WHERE e.id = $1`,
            [eventId]
        );

        if (result.rowCount === 0) {
            return res.json({
                success: false,
                message: "Event not found",
            });
        }

        res.json({
            success: true,
            message: "Event fetched successfully",
            event: result.rows[0],
        });

    } catch (error) {
        console.error("Error fetching event by ID:", error);
        res.json({
            success: false,
            message: "Failed to fetch event",
            error: error.message,
        });
    }
}

const searchEvents = async (req, res) => {
    try {
        const { name, category, date, location } = req.query;

        let query = `SELECT e.id, e.name, e.description, e.date, e.time, e.location, e.image_url, e.available_seats, 
                    e.created_at, c.name AS categories FROM events e LEFT JOIN event_categories ec ON e.id = ec.event_id
                    LEFT JOIN categories c ON ec.category_id = c.id WHERE 1=1`;

        let queryParams = [];

        if (name) {
            query += ` AND e.name ILIKE $${queryParams.length + 1}`;
            queryParams.push(`%${name}%`);
        }
    
        if (location) {
            query += ` AND e.location ILIKE $${queryParams.length + 1}`;
            queryParams.push(`%${location}%`);
        }
    
        if (date) {
            query += ` AND e.date = $${queryParams.length + 1}`;
            queryParams.push(date);
        }

        if (category) {
            query += ` AND c.name ILIKE $${queryParams.length + 1}`;
            queryParams.push(`%${category}%`);
        }

        const result = await pool.query(query, queryParams);

        res.json({
            success: true,
            message: "Events fetched successfully",
            events: result.rows
        });

    } catch (error) {
        console.error("Error searching events:", error);
        res.json({
            success: false,
            message: "Failed to search events",
            error: error.message
        });
    }
}

const getCategories = async(req, res) => {
    try{
        const result = await pool.query(`select * from categories`);
        const categories = result.rows;
        res.json({
            message: "Categories fetched successfully",
            categories: categories
        })

    } catch(error){
        console.error("Error getting categories:", error);
        res.json({
            message: "Failed to get categories",
            error: error.message
        });
    }
}

const getParticipants = async (req, res) => {
    const eventId = req.body.eventId;

    try {
        const eventResult = await pool.query(
            `SELECT * FROM events WHERE id = $1`,
            [eventId]
        );

        if (eventResult.rowCount === 0) {
            return res.json({
                success: false,
                message: "Event not found",
            });
        }

        const participantsResult = await pool.query(
            `SELECT u.id AS user_id, u.name AS user_name, u.email AS user_email, r.status AS registration_status, r.registered_at
             FROM registrations r JOIN users u ON r.user_id = u.id WHERE r.event_id = $1`,
            [eventId]
        );

        if (participantsResult.rowCount === 0) {
            return res.json({
                success: true,
                message: "No participants registered for this event",
                participants: [],
            });
        }

        res.json({
            success: true,
            message: "Participants fetched successfully",
            participants: participantsResult.rows,
        });

    } catch (error) {
        console.error("Error fetching participants:", error);
        res.json({
            success: false,
            message: "Failed to fetch participants",
            error: error.message,
        });
    }
};


export {addEvent, listEvent, removeEvent, getEventById, searchEvents, getCategories, getParticipants}