import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ISkill {
  subject: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface IStudent extends Document {
  _id: string;
  userId: Types.ObjectId;
  fullName: string;
  age: number;
  contactNumber: string;
  school: string;
  educationLevel: string;
  subjects: string[];
  skills: ISkill[];
  preferredLearningStyle?: string;
  accommodations?: string;
  completedSessions: number;
  totalSpent: number;
  averageRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>({
  subject: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true,
  },
}, { _id: false });

const studentSchema = new Schema<IStudent>({
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
    min: 5,
    max: 100,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  educationLevel: {
    type: String,
    required: true,
  },
  subjects: [{
    type: String,
    required: true,
  }],
  skills: [skillSchema],
  preferredLearningStyle: {
    type: String,
    default: null,
  },
  accommodations: {
    type: String,
    default: null,
  },
  completedSessions: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    min: 1,
    max: 5,
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

// Indexes for recommendations and queries
// Note: userId already has a unique index from the schema definition
studentSchema.index({ subjects: 1 });
studentSchema.index({ 'skills.subject': 1 });
studentSchema.index({ educationLevel: 1 });
studentSchema.index({ age: 1 });

export const Student = mongoose.model<IStudent>('Student', studentSchema);
