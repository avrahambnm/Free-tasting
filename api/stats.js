import { Router } from 'express';
import * as SubscribersDB from '../backend/db/subscribers.js';

const router = Router();

// GET /api/stats - Get dashboard statistics
router.get('/', async (req, res) => {
  try {
    const stats = await SubscribersDB.getStats();
    // Placeholder for GA data
    stats.liveVisitors = Math.floor(Math.random() * 10) + 1; // Replace with real GA data
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve statistics', details: err.message });
  }
});

export default router;
