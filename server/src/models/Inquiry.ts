import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IInquiry extends Document {
  property: Types.ObjectId;
  user?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredVisitDate?: Date;
  status: 'new' | 'contacted' | 'visit_scheduled' | 'closed';
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    preferredVisitDate: { type: Date },
    status: {
      type: String,
      enum: ['new', 'contacted', 'visit_scheduled', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.model<IInquiry>('Inquiry', InquirySchema);
