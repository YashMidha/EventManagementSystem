import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import pool from './src/config/postgreConfig.js';
import passport from 'passport';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            scope: ["profile", "email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await pool.query('SELECT * FROM users WHERE email = $1', [profile.emails[0].value]);

                // new account
                if (user.rows.length === 0) {
                    user = await pool.query(
                        `INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4) RETURNING *`,
                        [profile.displayName, profile.emails[0].value, 'user', 'google']
                    );
                }

                done(null, user.rows[0]);
            } catch (err) {
                done(err);
            }
        }
    )
);

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

                if (result.rows.length === 0) {
                    return done(null, false, { message: 'User not found' });
                }

                const user = result.rows[0];

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password' });
                }

                done(null, user);
                
            } catch (err) {
                done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});


passport.deserializeUser((user, done) => {
    done(null, user);
});

export default passport;