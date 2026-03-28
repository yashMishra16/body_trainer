import { Router, Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';
import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

const progressLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(progressLimiter);

// Log progress entry
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      weightKg,
      bodyFatPercentage,
      measurements,
      notes,
      energyLevel,
      sleepHours,
    } = req.body;

    const [entry] = await db('progress')
      .insert({
        id: uuidv4(),
        user_id: userId,
        logged_date: new Date().toISOString().split('T')[0],
        weight_kg: weightKg,
        body_fat_percentage: bodyFatPercentage,
        measurements: JSON.stringify(measurements || {}),
        notes,
        energy_level: energyLevel,
        sleep_hours: sleepHours,
      })
      .returning('*');

    res.status(201).json({ entry });
  } catch (error) {
    console.error('Progress log error:', error);
    res.status(500).json({ error: 'Failed to log progress' });
  }
});

// Get progress history
router.get('/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 30, startDate, endDate } = req.query;

    let query = db('progress').where({ user_id: userId }).orderBy('logged_date', 'desc');

    if (startDate) query = query.where('logged_date', '>=', startDate as string);
    if (endDate) query = query.where('logged_date', '<=', endDate as string);

    const entries = await query.limit(parseInt(limit as string, 10));
    res.json({ entries });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Get progress summary (for charts)
router.get('/:userId/summary', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const entries = await db('progress')
      .where({ user_id: userId })
      .orderBy('logged_date', 'asc')
      .select('logged_date', 'weight_kg', 'body_fat_percentage', 'energy_level');

    const summary = {
      totalEntries: entries.length,
      weightTrend: entries.map(e => ({ date: e.logged_date, value: e.weight_kg })),
      bodyFatTrend: entries.map(e => ({ date: e.logged_date, value: e.body_fat_percentage })),
      energyTrend: entries.map(e => ({ date: e.logged_date, value: e.energy_level })),
    };

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get progress summary' });
  }
});

export default router;
