import express from 'express';
import { registerUserToEvent, cancelRegistration } from '../controllers/registrationController.js';

const router = express.Router();

router.route('/')
      .post(registerUserToEvent)
      .delete(cancelRegistration);

export default router;