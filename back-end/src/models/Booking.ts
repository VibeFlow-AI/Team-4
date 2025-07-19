import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IBooking extends Document {
  _id: string;
  studentId: Types.ObjectId;
  mentorId: Types.ObjectId;
  sessionDateTime: Date;
  durationMinutes: number;
  paymentProofUrl: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  totalAmount: number;
  currency: string;
  meetingLink?: string;
  sessionNotes?: string;
  studentRating?: number;
  mentorRating?: number;
  studentReview?: string;
  mentorReview?: string;
  cancelledBy?: Types.ObjectId;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true,
  },
  sessionDateTime: {
    type: Date,
    required: true,
  },
  durationMinutes: {
    type: Number,
    required: true,
    default: 60,
    min: 30,
    max: 240,
  },
  paymentProofUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  meetingLink: {
    type: String,
  },
  sessionNotes: {
    type: String,
    maxlength: 2000,
  },
  studentRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  mentorRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  studentReview: {
    type: String,
    maxlength: 1000,
  },
  mentorReview: {
    type: String,
    maxlength: 1000,
  },
  cancelledBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  cancellationReason: {
    type: String,
    maxlength: 500,
  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for queries and analytics
bookingSchema.index({ studentId: 1 });
bookingSchema.index({ mentorId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ sessionDateTime: 1 });
bookingSchema.index({ createdAt: -1 });

// Compound indexes
bookingSchema.index({ studentId: 1, status: 1 });
bookingSchema.index({ mentorId: 1, status: 1 });
bookingSchema.index({ sessionDateTime: 1, status: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
