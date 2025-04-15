import express from 'express';
import { addEvent, listEvent, removeEvent, getEventById, searchEvents, getCategories, getParticipants } from '../controller/eventController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/multer.js';

const eventRouter = express.Router();

eventRouter.post('/add', authMiddleware, upload.single('image'), addEvent);
// eventRouter.post('/add', upload.single('image'), addEvent);
eventRouter.get('/list', listEvent);
eventRouter.post('/remove', removeEvent);
eventRouter.get('/search', searchEvents);
eventRouter.get('/categories', getCategories);
eventRouter.post('/participants', getParticipants);
eventRouter.get('/:id', getEventById);
// eventRouter.put('/:id', authMiddleware, updateEvent); 

export default eventRouter;