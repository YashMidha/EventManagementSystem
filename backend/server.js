import express from "express";
import cors from "cors";
import session from 'express-session';
import passport from 'passport';
import 'dotenv/config';
import pool from "./src/config/postgreConfig.js";
import connectCloudinary from "./src/config/cloudinary.js";
import passportSetup from "./passport.js";
import authRoute from "./src/routes/authRoute.js";
import eventRouter from "./src/routes/eventRoute.js";
import userRouter from "./src/routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 3000;  
connectCloudinary();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }
));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 5
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());

// initializing routes
app.use("/api/event", eventRouter);
app.use("/api/user", userRouter);
app.use('/auth', authRoute);

app.get("/", (req, res)=>{
    res.send("API working");
});

app.listen(port, ()=>{console.log(`Server started on ${port}`)});
