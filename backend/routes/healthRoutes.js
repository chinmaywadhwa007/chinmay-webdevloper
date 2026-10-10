import express from 'express';
import { getDbStatus } from '../config/db.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    database: {
      type: 'PostgreSQL (pgAdmin 14)',
      connected: getDbStatus(),
    },
    service: 'Chinmay Wadhwa Portfolio API',
  });
});

export default router;
