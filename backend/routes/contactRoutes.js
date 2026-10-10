import express from 'express';
import { submitContactMessage, getAllMessages } from '../controllers/contactController.js';

const router = express.Router();

router.post('/', submitContactMessage);
router.get('/messages', getAllMessages);

export default router;
