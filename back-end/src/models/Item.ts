import mongoose, { Document, Schema } from 'mongoose';

export interface IItem extends Document {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema = new Schema<IItem>({
  name: {
    type: String,
    required: true,
    trim: true,
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

export const Item = mongoose.model<IItem>('Item', itemSchema);
