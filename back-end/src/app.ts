import cors from 'cors';
import express from 'express';
import config from './config/config'; // Load config (which loads dotenv) first
import { connectDatabase } from './config/database';
import { errorHandler } from './middlewares/errorHandler';
import apiRoutes from './routes/index';
import itemRoutes from './routes/itemRoutes';

const app = express();

// Connect to MongoDB
connectDatabase().catch(console.error);

// Enable CORS for all routes
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', apiRoutes);

// Legacy routes (keep for backward compatibility)
app.use('/api/items', itemRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'EduVibe API',
    version: '1.0.0',
  });
});

// Global error handler (should be after routes)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      code: 404,
      message: 'Route not found',
      details: [`Route ${req.method} ${req.originalUrl} not found`],
    },
  });
});

export default app;
