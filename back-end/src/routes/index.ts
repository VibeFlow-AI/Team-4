import { Router } from 'express';
import recommendationRoutes from './recommendationRoutes';
// import authRoutes from './authRoutes';
// import userRoutes from './userRoutes';
// import studentRoutes from './studentRoutes';
// import bookingRoutes from './bookingRoutes';

const router = Router();

// Mount recommendation routes under /mentors
router.use('/mentors', recommendationRoutes);

// Add other routes here when created
// router.use('/auth', authRoutes);
// router.use('/users', userRoutes);
// router.use('/students', studentRoutes);
// router.use('/bookings', bookingRoutes);

export default router;
