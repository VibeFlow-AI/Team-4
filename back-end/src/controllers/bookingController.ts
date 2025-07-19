import { NextFunction, Request, Response } from 'express';
import { Booking } from '../models/Booking';
import { Mentor } from '../models/Mentor';
import { Student } from '../models/Student';

export class BookingController {
  /**
   * POST /bookings
   * Create a new booking
   */
  createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { mentorId, sessionDateTime, paymentProofUrl } = req.body;

      if (!req.user) {
        res.status(401).json({
          error: {
            code: 401,
            message: 'Authentication required',
            details: ['User must be authenticated to create bookings']
          }
        });
        return;
      }

      // Validate required fields
      if (!mentorId || !sessionDateTime || !paymentProofUrl) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Missing required fields',
            details: ['mentorId, sessionDateTime, and paymentProofUrl are required']
          }
        });
        return;
      }

      // Find student profile
      const student = await Student.findOne({ userId: req.user.id });
      if (!student) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Student profile not found',
            details: ['Complete your student onboarding first']
          }
        });
        return;
      }

      // Find mentor
      const mentor = await Mentor.findById(mentorId);
      if (!mentor || !mentor.isAvailable || !mentor.isVerified) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Mentor not available',
            details: ['Mentor not found or not available for booking']
          }
        });
        return;
      }

      // Validate session date/time
      const sessionDate = new Date(sessionDateTime);
      const now = new Date();
      
      if (sessionDate <= now) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Invalid session time',
            details: ['Session must be scheduled for a future date/time']
          }
        });
        return;
      }

      // Check for scheduling conflicts
      const existingBooking = await Booking.findOne({
        mentorId: mentor._id,
        sessionDateTime: {
          $gte: new Date(sessionDate.getTime() - 60 * 60 * 1000), // 1 hour before
          $lte: new Date(sessionDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours after
        },
        status: { $in: ['pending', 'confirmed', 'in-progress'] }
      });

      if (existingBooking) {
        res.status(409).json({
          error: {
            code: 409,
            message: 'Scheduling conflict',
            details: ['Mentor is not available at the selected time']
          }
        });
        return;
      }

      // Calculate total amount (fixed 2-hour session)
      const durationMinutes = 120; // Fixed 2 hours
      const totalAmount = mentor.ratePerSession;

      // Create booking
      const booking = new Booking({
        studentId: student._id,
        mentorId: mentor._id,
        sessionDateTime: sessionDate,
        durationMinutes,
        paymentProofUrl,
        status: 'pending',
        totalAmount,
        currency: mentor.currency
      });

      await booking.save();

      // Populate the booking with related data
      const populatedBooking = await Booking.findById(booking._id)
        .populate('studentId', 'fullName contactNumber')
        .populate('mentorId', 'fullName professionalRole ratePerSession')
        .populate({
          path: 'mentorId',
          populate: {
            path: 'userId',
            select: 'name email'
          }
        });

      res.status(201).json({
        id: booking._id,
        studentId: booking.studentId,
        mentorId: booking.mentorId,
        sessionDateTime: booking.sessionDateTime,
        durationMinutes: booking.durationMinutes,
        paymentProofUrl: booking.paymentProofUrl,
        status: booking.status,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        createdAt: booking.createdAt,
        mentor: populatedBooking?.mentorId,
        student: populatedBooking?.studentId
      });

    } catch (error) {
      console.error('Create booking error:', error);
      next(error);
    }
  };

  /**
   * GET /bookings/:id
   * Get booking details
   */
  getBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!req.user) {
        res.status(401).json({
          error: {
            code: 401,
            message: 'Authentication required',
            details: ['User must be authenticated']
          }
        });
        return;
      }

      const booking = await Booking.findById(id)
        .populate('studentId', 'fullName contactNumber educationLevel')
        .populate('mentorId', 'fullName professionalRole ratePerSession subjects')
        .populate({
          path: 'studentId',
          populate: {
            path: 'userId',
            select: 'name email'
          }
        })
        .populate({
          path: 'mentorId',
          populate: {
            path: 'userId',
            select: 'name email'
          }
        });

      if (!booking) {
        res.status(404).json({
          error: {
            code: 404,
            message: 'Booking not found',
            details: ['Booking with this ID does not exist']
          }
        });
        return;
      }

      // Check if user has access to this booking
      const student = await Student.findOne({ userId: req.user.id });
      const mentor = await Mentor.findOne({ userId: req.user.id });
      
      const hasAccess = 
        (student && booking.studentId._id.toString() === student._id.toString()) ||
        (mentor && booking.mentorId._id.toString() === mentor._id.toString());

      if (!hasAccess) {
        res.status(403).json({
          error: {
            code: 403,
            message: 'Access denied',
            details: ['You do not have permission to view this booking']
          }
        });
        return;
      }

      res.status(200).json({
        id: booking._id,
        studentId: booking.studentId,
        mentorId: booking.mentorId,
        sessionDateTime: booking.sessionDateTime,
        durationMinutes: booking.durationMinutes,
        paymentProofUrl: booking.paymentProofUrl,
        status: booking.status,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        meetingLink: booking.meetingLink,
        sessionNotes: booking.sessionNotes,
        studentRating: booking.studentRating,
        mentorRating: booking.mentorRating,
        studentReview: booking.studentReview,
        mentorReview: booking.mentorReview,
        cancelledBy: booking.cancelledBy,
        cancellationReason: booking.cancellationReason,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt
      });

    } catch (error) {
      console.error('Get booking error:', error);
      next(error);
    }
  };

  /**
   * GET /students/:id/bookings
   * Get bookings for a student
   */
  getStudentBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.query;

      // Build query
      const query: any = { studentId: id };
      if (status) {
        query.status = status;
      }

      const bookings = await Booking.find(query)
        .populate('mentorId', 'fullName professionalRole ratePerSession subjects averageRating')
        .populate({
          path: 'mentorId',
          populate: {
            path: 'userId',
            select: 'name email avatarUrl'
          }
        })
        .sort({ createdAt: -1 });

      res.status(200).json(bookings.map(booking => ({
        id: booking._id,
        mentorId: booking.mentorId,
        sessionDateTime: booking.sessionDateTime,
        durationMinutes: booking.durationMinutes,
        status: booking.status,
        totalAmount: booking.totalAmount,
        currency: booking.currency,
        meetingLink: booking.meetingLink,
        createdAt: booking.createdAt
      })));

    } catch (error) {
      console.error('Get student bookings error:', error);
      next(error);
    }
  };

  /**
   * PATCH /sessions/:id/status
   * Update session status
   */
  updateSessionStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['confirmed', 'in-progress', 'completed'].includes(status)) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Invalid status',
            details: ['Status must be confirmed, in-progress, or completed']
          }
        });
        return;
      }

      const booking = await Booking.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      ).populate('studentId mentorId');

      if (!booking) {
        res.status(404).json({
          error: {
            code: 404,
            message: 'Booking not found',
            details: ['Booking with this ID does not exist']
          }
        });
        return;
      }

      res.status(200).json({
        id: booking._id,
        status: booking.status,
        sessionDateTime: booking.sessionDateTime,
        updatedAt: booking.updatedAt
      });

    } catch (error) {
      console.error('Update session status error:', error);
      next(error);
    }
  };

  /**
   * DELETE /bookings/:id
   * Cancel a booking
   */
  cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!req.user) {
        res.status(401).json({
          error: {
            code: 401,
            message: 'Authentication required',
            details: ['User must be authenticated']
          }
        });
        return;
      }

      const booking = await Booking.findById(id);
      if (!booking) {
        res.status(404).json({
          error: {
            code: 404,
            message: 'Booking not found',
            details: ['Booking with this ID does not exist']
          }
        });
        return;
      }

      // Check if booking can be cancelled
      if (['completed', 'cancelled'].includes(booking.status)) {
        res.status(400).json({
          error: {
            code: 400,
            message: 'Cannot cancel booking',
            details: ['Booking is already completed or cancelled']
          }
        });
        return;
      }

      // Update booking status
      booking.status = 'cancelled';
      booking.cancelledBy = req.user.id as any;
      booking.cancellationReason = reason || 'No reason provided';
      booking.updatedAt = new Date();

      await booking.save();

      res.status(204).send();

    } catch (error) {
      console.error('Cancel booking error:', error);
      next(error);
    }
  };
}

// Create controller instance
const bookingController = new BookingController();

// Export individual methods for route binding
export const createBooking = bookingController.createBooking;
export const getBooking = bookingController.getBooking;
export const getStudentBookings = bookingController.getStudentBookings;
export const updateSessionStatus = bookingController.updateSessionStatus;
export const cancelBooking = bookingController.cancelBooking;
