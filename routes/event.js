import express from 'express';
import { createEvent, getEvent, getFutureEvents, getEventStats } from '../controllers/eventController.js';

const router = express.Router();

router.route('/')
      .post(createEvent)
      .get(getFutureEvents);


router.get('/:id', getEvent);
router.get('/stats/:id', getEventStats);

export default router;