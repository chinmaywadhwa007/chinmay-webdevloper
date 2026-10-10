import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './config/db.js';
import contactRoutes from './routes/contactRoutes.js';
import healthRoutes from './routes/healthRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/contact', contactRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: "Chinmay Wadhwa Portfolio Backend API",
    endpoints: {
      health: "GET /api/health",
      submitContact: "POST /api/contact",
      listMessages: "GET /api/contact/messages"
    }
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(` Backend server running on http://localhost:${PORT}`);
  // Attempt DB initialization
  await initDb();
});
