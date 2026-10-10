import { pool, getDbStatus } from '../config/db.js';

// In-memory fallback if PostgreSQL is not yet started by user
const memoryMessages = [];

/**
 * Handle new contact form submissions
 * POST /api/contact
 */
export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Name is required' });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, error: 'A valid email is required' });
    }
    if (!message || message.trim().length < 10) {
      return res.status(400).json({ success: false, error: 'Message must be at least 10 characters long' });
    }

    const newEntry = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      created_at: new Date(),
    };

    // If PostgreSQL connection is active, save to SQL database
    if (getDbStatus()) {
      const result = await pool.query(
        `INSERT INTO contact_messages (name, email, message, created_at)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, email, created_at`,
        [newEntry.name, newEntry.email, newEntry.message, newEntry.created_at]
      );

      return res.status(201).json({
        success: true,
        message: 'Message saved to PostgreSQL successfully!',
        data: result.rows[0],
      });
    }

    // Fallback: in-memory store
    const fallbackId = memoryMessages.length + 1;
    const saved = { id: fallbackId, ...newEntry };
    memoryMessages.push(saved);

    return res.status(201).json({
      success: true,
      message: 'Message received and stored (in-memory fallback)!',
      data: saved,
    });
  } catch (error) {
    console.error('Error in submitContactMessage:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error processing contact message',
    });
  }
};

/**
 * Retrieve all messages (for admin inspection or pgAdmin query preview)
 * GET /api/contact/messages
 */
export const getAllMessages = async (req, res) => {
  try {
    if (getDbStatus()) {
      const result = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
      return res.json({ success: true, count: result.rowCount, data: result.rows });
    }

    return res.json({ success: true, count: memoryMessages.length, data: memoryMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ success: false, error: 'Database query failed' });
  }
};
