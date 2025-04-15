import express from 'express';
import { listUserEvents, recommdation, registerEvent, removeEventRegistration, isEventRegistered } from '../controller/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/events', authMiddleware, listUserEvents);
userRouter.post('/events/register', authMiddleware, registerEvent);
userRouter.post('/events/remove', authMiddleware, removeEventRegistration);
userRouter.get('/recommdation', authMiddleware, recommdation);
userRouter.post('/isEventRegistered', authMiddleware, isEventRegistered);

export default userRouter;
