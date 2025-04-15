import express from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import pool from '../config/postgreConfig.js';

const router = express.Router();

router.get('/login/success', (req, res)=>{
    if (req.user){
        res.status(200).json({
            error: false,
            message: "Successfully loged in",
            user: req.user,
        });
    } else{
        res.status(403).json({error: true, message: "Not Authorized"});
    }
}); 

router.get('/login/failed', (req, res)=>{
    res.status(401).json({
        error: true,
        message: 'Log in failure',
    });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { successRedirect: process.env.CLIENT_URL, failureRedirect: '/login/failed'}),
);

router.get('/logout', (req, res, next) => {
    
    req.logout((err) => {
        if (err) {
            return next(err); 
        }
        res.clearCookie('connect.sid');
        res.redirect(process.env.CLIENT_URL);
    });
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.json({ error: true, message: 'Internal server error' });
        }
        if (!user) {
            return res.json({ error: true, message: 'Invalid email or password' });
        }

        req.login(user, (err) => {
            if (err) {
                return res.json({ error: true, message: 'Login failed' });
            }
            return res.json({ error: false, message: 'Login successful', user });
        });
    })(req, res, next);
});

router.post('/register', async (req, res) => {
    const { name, email, password, role = 'user' } = req.body;
    if (!name){
        return res.json({ message: 'Please enter name!' });
    }
    if (!email){
        return res.json({ message: 'Please enter email!' });
    }
    if (!password){
        return res.json({ message: 'Please enter password!' });
    }

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.json({ message: 'User already exists' });
        }

        bcrypt.hash(password, 10, async (err, hashedPassword)=>{
            if (err){
                console.error('Error registering user:', err);
                res.json({ message: 'Error registering user' });
            } else{
                const newUser = await pool.query(
                    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`,
                    [name, email, hashedPassword, role]
                );
                req.login({email, password}, (err) => {
                    if (err) {
                        console.error('Error logging in user after registration:', err);
                        return res.status(500).json({ message: 'User registered but failed to log in' });
                    }

                    res.status(201).json({ 
                        message: 'User registered and logged in successfully', 
                        user: newUser.rows[0] 
                    });
                });
            }
        });

    } catch (error) {
        console.error('Error registering user:', error);
        res.json({ message: 'Error registering user' });
    }
});

export default router;
    