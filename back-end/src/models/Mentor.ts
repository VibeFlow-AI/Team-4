import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMentor extends Document {
  _id: string;
  userId: Types.ObjectId;
  fullName: string;
  age: number;
  contactNumber: string;
  bio: string;
  professionalRole: string;
  subjects: string[];
  experienceYears: number;
  preferredStudentLevels: string[];
  linkedinUrl?: string;
  portfolioUrl?: string;
  ratePerSession: number;
  currency: string;
  availableHours: string[];
  timezone: string;
  totalSessions: number;
  totalEarnings: number;
  averageRating?: number;
  totalReviews: number;
  isVerified: boolean;
  isAvailable: boolean;
  specializations: string[];
  languages: string[];
  createdAt: Date;
  updatedAt: Date;
}

const mentorSchema = new Schema<IMentor>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  professionalRole: {
    type: String,
    required: true,
  },
  subjects: [{
    type: String,
    required: true,
  }],
  experienceYears: {
    type: Number,
    required: true,
    min: 0,
  },
  preferredStudentLevels: [{
    type: String,
    required: true,
  }],
  linkedinUrl: {
    type: String,
    default: null,
  },
  portfolioUrl: {
    type: String,
    default: null,
  },
  ratePerSession: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  availableHours: [{
    type: String, // e.g., ['09:00-12:00', '14:00-17:00']
  }],
  timezone: {
    type: String,
    default: 'UTC',
  },
  totalSessions: {
    type: Number,
    default: 0,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    min: 1,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  specializations: [{
    type: String,
  }],
  languages: [{
    type: String,
    default: ['English'],
  }],
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

// Indexes for search and recommendations
// Note: userId already has a unique index from the schema definition
mentorSchema.index({ subjects: 1 });
mentorSchema.index({ averageRating: -1 });
mentorSchema.index({ ratePerSession: 1 });
mentorSchema.index({ experienceYears: -1 });
mentorSchema.index({ isAvailable: 1 });
mentorSchema.index({ isVerified: 1 });
mentorSchema.index({ specializations: 1 });
mentorSchema.index({ preferredStudentLevels: 1 });

// Compound indexes for recommendations
mentorSchema.index({ subjects: 1, averageRating: -1 });
mentorSchema.index({ isAvailable: 1, isVerified: 1, averageRating: -1 });

export const Mentor = mongoose.model<IMentor>('Mentor', mentorSchema);
