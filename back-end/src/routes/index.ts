import { Router } from 'express';
import authRoutes from './authRoutes';
import bookingRoutes from './bookingRoutes';
import recommendationRoutes from './recommendationRoutes';
import userRoutes from './userRoutes';
// import studentRoutes from './studentRoutes';

const router = Router();

// Mount auth routes (no authentication required)
router.use('/auth', authRoutes);

// Mount user routes
router.use('/users', userRoutes);

// Mount recommendation routes under /mentors
router.use('/mentors', recommendationRoutes);

// Mount booking routes
router.use('/bookings', bookingRoutes);

// Add other routes here when created
// router.use('/students', studentRoutes);

export default router;
