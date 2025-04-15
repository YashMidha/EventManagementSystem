import pool from '../config/postgreConfig.js';
import sendEmail from '../utils/sendEmail.js';

const listUserEvents = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(`
            SELECT e.id AS event_id, e.name, e.description, e.date, e.time, e.location, e.image_url, r.registered_at, 
            c.name AS category FROM events e INNER JOIN registrations r ON e.id = r.event_id
            LEFT JOIN event_categories ec ON e.id = ec.event_id
            LEFT JOIN categories c ON ec.category_id = c.id
            WHERE r.user_id = $1 AND r.status = 'registered'`,
            [userId]    
        );

        const registeredEvents = result.rows;

        res.json(registeredEvents);

    } catch (error) {
        console.error('Error fetching registered events: ', error);
        res.json({ error: 'Failed to fetch registered events' });
    }
}

const registerEvent = async (req, res) => {
    try {
        const userId = req.user.id; 
        const eventId = req.body.eventId;

        const result = await pool.query(
            `SELECT available_seats  FROM events WHERE id = $1`,
            [eventId]
        );

        if (result.rows.length === 0) {
            return res.json({ error: 'Event not found' });
        }

        const availableSeats = result.rows[0].available_seats;

        if (availableSeats <= 0) {
            return res.json({ error: 'No seats available for this event' });
        }

        const register = await pool.query(
            `INSERT INTO registrations (user_id, event_id) VALUES ($1, $2) ON CONFLICT (user_id, event_id) DO NOTHING RETURNING id`, 
            [userId, eventId]
        );

        if (register.rows.length === 0) {
            return res.json({ error: 'User is already registered for this event' });
        }

        await pool.query(
            `UPDATE events SET available_seats = available_seats - 1 WHERE id = $1`
            , [eventId]
        );

        const categoryResult = await pool.query(
            `SELECT category_id FROM event_categories WHERE event_id = $1`, 
            [eventId]
        );

        if (categoryResult.rows.length > 0){
            const categoryId = categoryResult.rows[0].category_id;
            await pool.query(
                `INSERT INTO user_preferences (user_id, category_id) VALUES ($1, $2)
                ON CONFLICT (user_id, category_id) DO NOTHING`, 
                [userId, categoryId]
            );
        }

        const emailResult = await pool.query(
            `SELECT name, date, time, location, description FROM events WHERE id = $1`,
            [eventId]
        );
        
        const { name, date, time, location, description } = emailResult.rows[0];

        const emailContent = 
            `Hi ${req.user.name},

You have successfully registered for the event "${name}". Here are the event details:

Event Name: ${name}

Date: ${new Date(date).toLocaleDateString()}
Time: ${time}
Location: ${location}

Event Description:
${description}

Thank you for registering. We look forward to seeing you at the event!

Thankyou,
Event Management Team`;

        const emailSent = await sendEmail(
            req.user.email,
            `Registration Confirmation: ${name}`,
            emailContent
        );

        if (!emailSent.success) {
            console.error('Failed to send registration email:', emailSent.error);
        }

        res.json({ message: 'Successfully registered for the event' });
        
    } catch (error) {
        console.error('Error registering for event:', error);
        res.json({ error: 'Failed to register for the event' });
    }
}

const removeEventRegistration = async (req, res) => {
    try {
        const userId = req.user.id;
        const eventId = req.body.eventId;

        const registrationResult = await pool.query(
            `SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2`, 
            [userId, eventId]
        );

        if (registrationResult.rows.length === 0) {
            return res.json({ error: 'User is not registered for this event' });
        }

        await pool.query(
            `DELETE FROM registrations WHERE user_id = $1 AND event_id = $2`, 
            [userId, eventId]
        );

        await pool.query(
            `UPDATE events SET available_seats = available_seats + 1 WHERE id = $1`, 
            [eventId]
        );

        const remainingRegistrations = await pool.query(
            `SELECT COUNT(*) AS count FROM registrations WHERE user_id = $1 AND event_id IN (
                SELECT event_id FROM event_categories WHERE category_id IN (
                    SELECT category_id FROM event_categories WHERE event_id = $2
                )
            )`, 
            [userId, eventId]
        );

        const remainingCount = parseInt(remainingRegistrations.rows[0].count);

        if (remainingCount === 0) {
            await pool.query(
                `DELETE FROM user_preferences WHERE user_id = $1 AND category_id IN (
                    SELECT category_id FROM event_categories WHERE event_id = $2
                )`, 
                [userId, eventId]
            );
        }

        const emailResult = await pool.query(`SELECT name from events where id=$1`, [eventId]);
        const {name} = emailResult.rows[0];

        const emailSent = await sendEmail(
            req.user.email,
            `Deregistered from Event: ${name}`,
            `Hi ${req.user.name},
            
You have successfully deregistered from the event "${name}".
            
Thankyou,
Event Management Team`
        );

        if (!emailSent.success) {
            console.error('Failed to send deregistration email:', emailSent.error);
        }

        res.json({ message: 'Successfully removed registration for the event' });

    } catch (error) {
        console.error('Error removing registration for event:', error);
        res.json({ error: 'Failed to remove registration for the event' });
    }
}

const recommdation = async (req, res) => {
    try {
        const userId = req.user.id;

        const userPreferences = await pool.query(
            `SELECT category_id FROM user_preferences WHERE user_id = $1`,
            [userId]
        );

        let recommendations = [];
        if (userPreferences.rows.length > 0){
            const categoryIds = userPreferences.rows.map(row => row.category_id);
            const preferredRecommendations = await pool.query(
                `SELECT e.id, e.name, e.description, e.date, e.time, e.location, 
                e.image_url, e.available_seats, e.created_at, c.name AS categories
                FROM events e
                LEFT JOIN event_categories ec ON e.id = ec.event_id
                LEFT JOIN categories c ON ec.category_id = c.id
                WHERE ec.category_id = ANY($1::int[])
                ORDER BY RANDOM()
                LIMIT 9`,
                [categoryIds]
            );
            recommendations = preferredRecommendations.rows;
        }

        if (recommendations.length === 0) {
            const randomRecommendations = await pool.query(
                `SELECT e.id, e.name, e.description, e.date, e.time, e.location, 
                e.image_url, e.available_seats, e.created_at, c.name AS categories
                FROM events e
                LEFT JOIN event_categories ec ON e.id = ec.event_id
                LEFT JOIN categories c ON ec.category_id = c.id
                ORDER BY RANDOM()
                LIMIT 9`
            );
            recommendations = randomRecommendations.rows;
        }

        res.json({ message: 'Recommended events fetched successfully', events:recommendations });

    } catch (error) {
        console.error('Error fetching recommended events:', error);
        res.json({ error: 'Failed to fetch recommended events' });
    }
}

const isEventRegistered = async (req, res) => {
    try {
        const eventId = req.body.eventId;
        const userId = req.user.id;
        
        const result = await pool.query(
            `SELECT * FROM registrations WHERE event_id = $1 AND user_id = $2`,
            [eventId, userId]
        );

        const isRegistered = result.rowCount > 0;

        res.json({
            success: true,
            message: isRegistered
                ? "User is registered for this event"
                : "User is not registered for this event",
            isRegistered: isRegistered,
        });
    } catch (error) {
        console.error("Error checking event registration:", error);
        res.json({
            success: false,
            message: "Failed to check registration status",
            error: error.message,
        });
    }
}

export { listUserEvents, registerEvent, removeEventRegistration, recommdation, isEventRegistered };