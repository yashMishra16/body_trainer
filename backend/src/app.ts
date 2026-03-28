import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import agentRoutes from './routes/agents';
import userRoutes from './routes/users';
import progressRoutes from './routes/progress';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/agents', agentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);

// Error handling (must be last)
app.use(errorHandler);

export default app;
