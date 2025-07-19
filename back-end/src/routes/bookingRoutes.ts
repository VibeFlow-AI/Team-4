import { Router } from 'express';
import {
    cancelBooking,
    createBooking,
    getBooking,
    getStudentBookings,
    updateSessionStatus
} from '../controllers/bookingController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// All booking routes require authentication
router.use(authenticateToken);

/**
 * @route POST /bookings
 * @description Create a new booking
 * @access Student only
 * @body {
 *   mentorId: string,
 *   sessionDateTime: string (ISO date),
 *   paymentProofUrl: string
 * }
 */
router.post('/', createBooking);

/**
 * @route GET /bookings/:id
 * @description Get booking details
 * @access Student and Mentor (only their own bookings)
 */
router.get('/:id', getBooking);

/**
 * @route GET /students/:id/bookings
 * @description Get all bookings for a student
 * @access Student (only their own bookings)
 * @query status?: string (optional filter by status)
 */
router.get('/students/:id/bookings', getStudentBookings);

/**
 * @route PATCH /sessions/:id/status
 * @description Update session status (confirm, start, complete)
 * @access Mentor only
 * @body { status: 'confirmed' | 'in-progress' | 'completed' }
 */
router.patch('/sessions/:id/status', updateSessionStatus);

/**
 * @route DELETE /bookings/:id
 * @description Cancel a booking
 * @access Student and Mentor
 * @body { reason?: string }
 */
router.delete('/:id', cancelBooking);

export default router;
